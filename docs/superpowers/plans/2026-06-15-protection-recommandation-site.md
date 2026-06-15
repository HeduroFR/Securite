# Site Protection Manifestation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a passcode-gated, French one-page site recommending personal-protection gear for protests, with server-side auth.

**Architecture:** SvelteKit on the Bun runtime via `svelte-adapter-bun`. A signed httpOnly session cookie (HMAC-SHA256) gates all routes through `hooks.server.ts` except `/login` and assets. Content lives in a typed local data file rendered as an accordion. No database.

**Tech Stack:** Bun, SvelteKit, TypeScript, `svelte-adapter-bun`, Vitest, node:crypto.

---

## File Structure

- `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json` — project config
- `.env.example` — documents `SITE_PASSCODE`, `SESSION_SECRET`
- `src/lib/server/session.ts` — sign/verify session token (HMAC). Server-only.
- `src/lib/server/ratelimit.ts` — in-memory per-IP login attempt limiter. Server-only.
- `src/lib/data/categories.ts` — the 9 categories + item data, typed.
- `src/lib/data/categories.test.ts` — data shape validation.
- `src/lib/server/session.test.ts` — auth unit tests.
- `src/lib/server/ratelimit.test.ts` — limiter unit tests.
- `src/hooks.server.ts` — route gate.
- `src/routes/login/+page.svelte` — passcode form.
- `src/routes/login/+page.server.ts` — login form action.
- `src/routes/+page.svelte` — the protected one-pager.
- `src/routes/+page.server.ts` — passes categories to the page.
- `src/lib/components/Accordion.svelte`, `CategorySection.svelte`, `ItemCard.svelte`, `Disclaimer.svelte` — UI units.
- `src/app.css` — jaune/noir theme + responsive rules.
- `README.md` — run/build/deploy notes.

---

## Task 1: Scaffold SvelteKit + Bun project

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/app.d.ts`

- [ ] **Step 1: Scaffold with the SvelteKit CLI**

Run (in repo root, which already has `.gitignore` and `docs/`):

```bash
bunx sv create . --template minimal --types ts --no-add-ons --no-install
```

If `sv` prompts because the directory is non-empty, choose to continue / "ignore" existing files. Expected: creates `src/`, `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`.

- [ ] **Step 2: Install the Bun adapter and test runner**

```bash
bun add -d svelte-adapter-bun vitest
bun install
```

Expected: `svelte-adapter-bun` and `vitest` appear in `package.json` devDependencies.

- [ ] **Step 3: Point svelte.config.js at the Bun adapter**

Replace the adapter import/usage in `svelte.config.js`:

```js
import adapter from 'svelte-adapter-bun';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter()
  }
};

export default config;
```

- [ ] **Step 4: Add a test script and Vitest config**

In `package.json` `scripts`, add:

```json
"test": "vitest run"
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
});
```

- [ ] **Step 5: Verify dev server boots**

Run: `bun run dev` then stop it (Ctrl-C).
Expected: Vite prints a `localhost` URL with no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold SvelteKit + Bun project"
```

---

## Task 2: Session token sign/verify (HMAC)

**Files:**
- Create: `src/lib/server/session.ts`
- Test: `src/lib/server/session.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/server/session.test.ts
import { describe, it, expect } from 'vitest';
import { signSession, verifySession } from './session';

const SECRET = 'test-secret-value';

describe('session token', () => {
  it('verifies a freshly signed token', () => {
    const token = signSession(SECRET, 1_000_000);
    expect(verifySession(SECRET, token, 1_000_000)).toBe(true);
  });

  it('rejects a token signed with a different secret', () => {
    const token = signSession('other-secret', 1_000_000);
    expect(verifySession(SECRET, token, 1_000_000)).toBe(false);
  });

  it('rejects a tampered token', () => {
    const token = signSession(SECRET, 1_000_000) + 'x';
    expect(verifySession(SECRET, token, 1_000_000)).toBe(false);
  });

  it('rejects an expired token (older than 7 days)', () => {
    const issued = 1_000_000;
    const token = signSession(SECRET, issued);
    const eightDaysLater = issued + 8 * 24 * 60 * 60 * 1000;
    expect(verifySession(SECRET, token, eightDaysLater)).toBe(false);
  });

  it('accepts a token within the 7 day window', () => {
    const issued = 1_000_000;
    const token = signSession(SECRET, issued);
    const sixDaysLater = issued + 6 * 24 * 60 * 60 * 1000;
    expect(verifySession(SECRET, token, sixDaysLater)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test`
Expected: FAIL — cannot import `signSession`/`verifySession`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/server/session.ts
import { createHmac, timingSafeEqual } from 'node:crypto';

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function hmac(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/** payload is the issue timestamp (ms). Token = "<ts>.<sig>". */
export function signSession(secret: string, nowMs: number): string {
  const payload = String(nowMs);
  return `${payload}.${hmac(secret, payload)}`;
}

export function verifySession(secret: string, token: string, nowMs: number): boolean {
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = hmac(secret, payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const issued = Number(payload);
  if (!Number.isFinite(issued)) return false;
  return nowMs - issued <= MAX_AGE_MS && nowMs >= issued;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/session.ts src/lib/server/session.test.ts
git commit -m "feat: HMAC session token sign/verify"
```

---

## Task 3: In-memory login rate limiter

**Files:**
- Create: `src/lib/server/ratelimit.ts`
- Test: `src/lib/server/ratelimit.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/server/ratelimit.test.ts
import { describe, it, expect } from 'vitest';
import { createLimiter } from './ratelimit';

describe('login rate limiter', () => {
  it('allows up to the limit then blocks', () => {
    const limiter = createLimiter({ max: 3, windowMs: 60_000 });
    expect(limiter.check('1.1.1.1', 0)).toBe(true);
    expect(limiter.check('1.1.1.1', 1)).toBe(true);
    expect(limiter.check('1.1.1.1', 2)).toBe(true);
    expect(limiter.check('1.1.1.1', 3)).toBe(false);
  });

  it('tracks IPs independently', () => {
    const limiter = createLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check('1.1.1.1', 0)).toBe(true);
    expect(limiter.check('2.2.2.2', 0)).toBe(true);
    expect(limiter.check('1.1.1.1', 1)).toBe(false);
  });

  it('resets after the window passes', () => {
    const limiter = createLimiter({ max: 1, windowMs: 1_000 });
    expect(limiter.check('1.1.1.1', 0)).toBe(true);
    expect(limiter.check('1.1.1.1', 500)).toBe(false);
    expect(limiter.check('1.1.1.1', 1_001)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test`
Expected: FAIL — cannot import `createLimiter`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/server/ratelimit.ts
interface LimiterOpts { max: number; windowMs: number; }
interface Bucket { count: number; resetAt: number; }

export function createLimiter({ max, windowMs }: LimiterOpts) {
  const buckets = new Map<string, Bucket>();
  return {
    /** Returns true if the attempt is allowed, false if rate-limited. */
    check(ip: string, nowMs: number): boolean {
      const b = buckets.get(ip);
      if (!b || nowMs >= b.resetAt) {
        buckets.set(ip, { count: 1, resetAt: nowMs + windowMs });
        return true;
      }
      if (b.count >= max) return false;
      b.count += 1;
      return true;
    }
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/ratelimit.ts src/lib/server/ratelimit.test.ts
git commit -m "feat: in-memory login rate limiter"
```

---

## Task 4: Category data model + validation

**Files:**
- Create: `src/lib/data/categories.ts`
- Test: `src/lib/data/categories.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/data/categories.test.ts
import { describe, it, expect } from 'vitest';
import { categories } from './categories';

describe('categories data', () => {
  it('has the 9 expected categories in order', () => {
    expect(categories.map((c) => c.id)).toEqual([
      'yeux', 'respirer', 'tete', 'peau', 'mains',
      'secours', 'audition', 'legal', 'hydratation'
    ]);
  });

  it('every category has a title and at least one item', () => {
    for (const c of categories) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.items.length).toBeGreaterThan(0);
    }
  });

  it('every item has a name, spec, and example', () => {
    for (const c of categories) {
      for (const item of c.items) {
        expect(item.name.length).toBeGreaterThan(0);
        expect(item.spec.length).toBeGreaterThan(0);
        expect(item.example.length).toBeGreaterThan(0);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test`
Expected: FAIL — cannot import `categories`.

- [ ] **Step 3: Write minimal implementation**

Create the typed data. Fill all 9 categories with at least one real item each (mix: named example + spec to look for). Content can be refined later; the test only enforces shape and order.

```ts
// src/lib/data/categories.ts
export interface Item {
  name: string;
  example: string;      // exemple nommé
  spec: string;         // la spec à chercher
  priceApprox?: string; // ex: "~30€"
  buyLink?: string;
  note?: string;
}

export interface Category {
  id: string;
  title: string;
  items: Item[];
}

export const categories: Category[] = [
  {
    id: 'yeux',
    title: 'Yeux',
    items: [
      {
        name: 'Lunettes de protection étanches',
        example: 'Bollé Tracker / lunettes ski fermées',
        spec: 'Monture pleine, joint anti-poussière, norme EN 166, anti-buée',
        priceApprox: '~15–30€',
        note: 'Évite les lunettes ajourées : laissent passer le gaz.'
      }
    ]
  },
  {
    id: 'respirer',
    title: 'Respirer',
    items: [
      {
        name: 'Demi-masque à cartouches',
        example: '3M 6200 + filtres ABEK',
        spec: 'Filtres type A/B/E/K ou ABEK contre gaz/vapeurs, ajustement étanche',
        priceApprox: '~30€',
        note: 'Le masque FFP2 filtre les particules, pas les gaz lacrymo.'
      }
    ]
  },
  {
    id: 'tete',
    title: 'Tête',
    items: [
      {
        name: 'Casque',
        example: 'Casque vélo/skate à coque dure',
        spec: 'Coque rigide, jugulaire, norme EN 1078 (vélo) au minimum',
        priceApprox: '~25–50€'
      }
    ]
  },
  {
    id: 'peau',
    title: 'Peau / corps',
    items: [
      {
        name: 'Vêtements couvrants',
        example: 'Veste + pantalon épais, manches longues',
        spec: 'Tissu épais non synthétique fondant, couvre bras et jambes',
        note: 'Évite le nylon près d’une source de chaleur.'
      }
    ]
  },
  {
    id: 'mains',
    title: 'Mains',
    items: [
      {
        name: 'Gants résistants',
        example: 'Gants de travail cuir / anti-coupure',
        spec: 'Paume renforcée, résistance thermique et à la coupure',
        priceApprox: '~10–20€'
      }
    ]
  },
  {
    id: 'secours',
    title: 'Premiers soins',
    items: [
      {
        name: 'Rinçage oculaire',
        example: 'Sérum physiologique en dosettes',
        spec: 'Solution saline stérile, dosettes individuelles',
        priceApprox: '~3€',
        note: 'Rincer yeux/peau à l’eau claire ou sérum, ne pas frotter.'
      }
    ]
  },
  {
    id: 'audition',
    title: 'Audition',
    items: [
      {
        name: 'Bouchons d’oreille',
        example: 'Bouchons mousse ou filtrés réutilisables',
        spec: 'Atténuation (SNR) ≥ 25 dB',
        priceApprox: '~5–15€',
        note: 'Contre le bruit des dispositifs sonores (assourdissants).'
      }
    ]
  },
  {
    id: 'legal',
    title: 'Légal / comms',
    items: [
      {
        name: 'Carte des droits + contact avocat',
        example: 'Numéro de la legal team / avocat noté sur papier',
        spec: 'Contacts sur papier, téléphone avec code PIN fort, données chiffrées',
        note: 'En France, dissimuler son visage en manifestation peut être sanctionné.'
      }
    ]
  },
  {
    id: 'hydratation',
    title: 'Hydratation',
    items: [
      {
        name: 'Eau',
        example: 'Bouteille d’eau / gourde',
        spec: 'Eau claire pour boire et rincer, contenant souple refermable',
        note: 'L’eau sert aussi à rincer les yeux après exposition au gaz.'
      }
    ]
  }
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/categories.ts src/lib/data/categories.test.ts
git commit -m "feat: protection categories data model"
```

---

## Task 5: Login route + form action

**Files:**
- Create: `src/routes/login/+page.svelte`, `src/routes/login/+page.server.ts`
- Create: `.env.example`

- [ ] **Step 1: Document env vars**

Create `.env.example`:

```bash
# Shared passcode users must enter to access the site
SITE_PASSCODE=change-me
# Secret used to sign session cookies (use a long random string)
SESSION_SECRET=change-me-to-a-long-random-value
```

Also create a local `.env` (gitignored) with real values for development:

```bash
SITE_PASSCODE=manif2026
SESSION_SECRET=dev-only-secret-please-rotate
```

- [ ] **Step 2: Write the login form action**

```ts
// src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { signSession } from '$lib/server/session';
import { createLimiter } from '$lib/server/ratelimit';
import type { Actions } from './$types';

const limiter = createLimiter({ max: 5, windowMs: 5 * 60_000 });
const COOKIE = 'session';

export const actions: Actions = {
  default: async ({ request, cookies, getClientAddress }) => {
    const ip = getClientAddress();
    if (!limiter.check(ip, Date.now())) {
      return fail(429, { error: 'Trop de tentatives. Réessaie plus tard.' });
    }
    const data = await request.formData();
    const passcode = String(data.get('passcode') ?? '');
    if (passcode !== env.SITE_PASSCODE) {
      return fail(401, { error: 'Code incorrect.' });
    }
    const token = signSession(env.SESSION_SECRET, Date.now());
    cookies.set(COOKIE, token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60
    });
    throw redirect(303, '/');
  }
};
```

- [ ] **Step 3: Write the login page**

```svelte
<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<main class="login">
  <h1>SE PROTÉGER</h1>
  <p>Accès réservé. Entre le code.</p>
  <form method="POST">
    <input type="password" name="passcode" placeholder="Code d'accès" autocomplete="off" required />
    <button type="submit">Entrer</button>
    {#if form?.error}<p class="error">{form.error}</p>{/if}
  </form>
</main>
```

- [ ] **Step 4: Verify manually**

Run: `bun run dev`, open `/login`, submit a wrong code (expect "Code incorrect."), then the right code (expect redirect to `/`). Note: `/` will 500/blank until Task 7 — that's fine; confirm the cookie is set in devtools.

- [ ] **Step 5: Commit**

```bash
git add src/routes/login .env.example
git commit -m "feat: passcode login route with rate limiting"
```

---

## Task 6: Route gate in hooks.server.ts

**Files:**
- Create: `src/hooks.server.ts`
- Modify: `src/app.d.ts` (add `locals.authed`)

- [ ] **Step 1: Add the locals type**

In `src/app.d.ts`, inside `interface Locals`:

```ts
declare global {
  namespace App {
    interface Locals {
      authed: boolean;
    }
  }
}
export {};
```

- [ ] **Step 2: Write the hook**

```ts
// src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { verifySession } from '$lib/server/session';

const COOKIE = 'session';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(COOKIE);
  event.locals.authed = !!token && verifySession(env.SESSION_SECRET, token, Date.now());

  const path = event.url.pathname;
  const isPublic = path === '/login' || path.startsWith('/_app') || path.startsWith('/favicon');

  if (!event.locals.authed && !isPublic) {
    throw redirect(303, '/login');
  }
  if (event.locals.authed && path === '/login') {
    throw redirect(303, '/');
  }
  return resolve(event);
};
```

- [ ] **Step 3: Verify manually**

Run: `bun run dev`. Visit `/` with no cookie → expect redirect to `/login`. Log in → expect access to `/`. Visit `/login` while logged in → expect redirect to `/`.

- [ ] **Step 4: Commit**

```bash
git add src/hooks.server.ts src/app.d.ts
git commit -m "feat: gate all routes behind session check"
```

---

## Task 7: Page components (accordion, disclaimer, item card)

**Files:**
- Create: `src/lib/components/Disclaimer.svelte`, `ItemCard.svelte`, `CategorySection.svelte`
- Create: `src/routes/+page.server.ts`, `src/routes/+page.svelte`

- [ ] **Step 1: Load data into the page**

```ts
// src/routes/+page.server.ts
import { categories } from '$lib/data/categories';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return { categories };
};
```

- [ ] **Step 2: Disclaimer component**

```svelte
<!-- src/lib/components/Disclaimer.svelte -->
<div class="disclaimer">
  ⚠️ Information éducative, pas un conseil médical ni juridique. Vérifie la légalité
  du matériel : en France, dissimuler son visage en manifestation peut être sanctionné.
</div>
```

- [ ] **Step 3: Item card component**

```svelte
<!-- src/lib/components/ItemCard.svelte -->
<script lang="ts">
  import type { Item } from '$lib/data/categories';
  export let item: Item;
</script>

<article class="item">
  <h3>{item.name}</h3>
  <dl>
    <dt>Exemple</dt><dd>{item.example}</dd>
    <dt>À chercher</dt><dd>{item.spec}</dd>
    {#if item.priceApprox}<dt>Prix</dt><dd>{item.priceApprox}</dd>{/if}
    {#if item.note}<dt>Note</dt><dd>{item.note}</dd>{/if}
  </dl>
  {#if item.buyLink}<a class="buy" href={item.buyLink} target="_blank" rel="noopener">Lien d'achat</a>{/if}
</article>
```

- [ ] **Step 4: Category section (native accordion via details/summary)**

```svelte
<!-- src/lib/components/CategorySection.svelte -->
<script lang="ts">
  import type { Category } from '$lib/data/categories';
  import ItemCard from './ItemCard.svelte';
  export let category: Category;
</script>

<details class="category">
  <summary>▸ {category.title}</summary>
  <div class="items">
    {#each category.items as item}
      <ItemCard {item} />
    {/each}
  </div>
</details>
```

- [ ] **Step 5: Main page**

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  import Disclaimer from '$lib/components/Disclaimer.svelte';
  import CategorySection from '$lib/components/CategorySection.svelte';
  export let data: PageData;
</script>

<header class="hero">
  <h1>SE PROTÉGER</h1>
  <p class="sub">Liste de matériel de protection en manifestation.</p>
  <Disclaimer />
</header>

<main class="categories">
  {#each data.categories as category}
    <CategorySection {category} />
  {/each}
</main>

<footer class="foot">
  <Disclaimer />
  <p>Dernière mise à jour : 2026-06-15</p>
</footer>
```

- [ ] **Step 6: Verify manually**

Run: `bun run dev`, log in, confirm the 9 categories render and expand/collapse, items show all fields.

- [ ] **Step 7: Commit**

```bash
git add src/lib/components src/routes/+page.svelte src/routes/+page.server.ts
git commit -m "feat: one-pager UI with accordion categories"
```

---

## Task 8: Jaune/noir theme + responsive (mobile-first, desktop-adapted)

**Files:**
- Create/replace: `src/app.css`
- Modify: `src/routes/+layout.svelte` (import the css; create it if missing)

- [ ] **Step 1: Ensure the layout imports global CSS**

Create `src/routes/+layout.svelte` if absent:

```svelte
<script lang="ts">
  import '../app.css';
</script>

<slot />
```

- [ ] **Step 2: Write the theme + responsive rules**

```css
/* src/app.css */
:root {
  --noir: #111;
  --jaune: #f2e600;
  --rouge: #d62828;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--jaune);
  color: var(--noir);
  font-family: system-ui, "Arial Narrow", sans-serif;
  font-weight: 700;
}
/* mobile-first: full-width stacked */
.hero { background: var(--noir); color: var(--jaune); padding: 1.5rem 1rem; }
.hero h1 { font-size: clamp(2rem, 9vw, 4rem); letter-spacing: -2px; margin: 0; text-transform: uppercase; }
.sub { font-weight: 400; }
.disclaimer { background: var(--rouge); color: #fff; padding: .75rem 1rem; font-size: .85rem; font-weight: 400; }
.categories { padding: 1rem; max-width: 900px; margin: 0 auto; }
.category { border-bottom: 4px solid var(--noir); }
.category summary { cursor: pointer; font-size: 1.25rem; padding: .75rem 0; text-transform: uppercase; list-style: none; }
.category summary::-webkit-details-marker { display: none; }
.items { display: grid; grid-template-columns: 1fr; gap: 1rem; padding-bottom: 1rem; }
.item { background: var(--noir); color: var(--jaune); padding: 1rem; }
.item h3 { margin: 0 0 .5rem; }
.item dl { margin: 0; font-weight: 400; }
.item dt { font-weight: 700; text-transform: uppercase; font-size: .7rem; opacity: .7; margin-top: .5rem; }
.item dd { margin: 0; }
.item .buy { display: inline-block; margin-top: .75rem; background: var(--jaune); color: var(--noir); padding: .4rem .8rem; text-decoration: none; }
.login { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1rem; padding: 1rem; text-align: center; }
.login input, .login button { font-size: 1rem; padding: .6rem; border: 3px solid var(--noir); }
.login button { background: var(--noir); color: var(--jaune); cursor: pointer; }
.error { color: var(--rouge); }
.foot { padding: 1rem; font-weight: 400; }

/* desktop adaptation */
@media (min-width: 720px) {
  .hero { padding: 3rem 2rem; }
  .categories { padding: 2rem; }
  .items { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1080px) {
  .items { grid-template-columns: repeat(3, 1fr); }
}
```

- [ ] **Step 3: Verify responsive**

Run: `bun run dev`, log in. In devtools, check mobile width (single column, full-width accordion) and desktop width (centered content, 2–3 column item grid). Confirm contrast is readable.

- [ ] **Step 4: Commit**

```bash
git add src/app.css src/routes/+layout.svelte
git commit -m "style: jaune/noir theme, mobile-first + desktop responsive"
```

---

## Task 9: Build, run, and deploy docs

**Files:**
- Create: `README.md`

- [ ] **Step 1: Verify production build runs under Bun**

```bash
bun run build
bun ./build/index.js
```

Expected: server starts; with `.env` present, `/login` works and `/` is gated. Stop it after checking.

- [ ] **Step 2: Write README**

```markdown
# Se Protéger — site recommandation protection manifestation

One-pager FR, accès par passcode (vérifié côté serveur). SvelteKit + Bun.

## Dev
\`\`\`bash
bun install
cp .env.example .env   # puis éditer SITE_PASSCODE et SESSION_SECRET
bun run dev
\`\`\`

## Build & run (prod)
\`\`\`bash
bun run build
PORT=3000 bun ./build/index.js
\`\`\`

Variables (`.env`) : `SITE_PASSCODE`, `SESSION_SECRET` (longue valeur aléatoire).
Le port et le host sont configurables via `PORT` / `HOST` (svelte-adapter-bun).

## Déploiement VPS homelab
Derrière un reverse-proxy (TLS). Exemple systemd : lancer `bun ./build/index.js`
avec `EnvironmentFile=/chemin/.env`, `NODE_ENV=production`. Le cookie de session est
`secure` en production : servir en HTTPS.

## Contenu
Éditer `src/lib/data/categories.ts` puis rebuild.
```

- [ ] **Step 3: Run the full test suite one last time**

Run: `bun run test`
Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: run and deploy instructions"
```

---

## Self-Review Notes

- **Spec coverage:** stack (T1), server-side auth + cookie (T2,T5,T6), rate-limit (T3), 9 categories all-included + mix recommendations (T4), layout A accordion + disclaimer (T7), jaune/noir + mobile-first + desktop (T8), VPS deploy + .gitignore for .env (T5,T9; .gitignore already committed). All covered.
- **Naming consistency:** `signSession`/`verifySession`, `createLimiter().check`, cookie name `session`, `categories` export, `Item`/`Category` types — used identically across tasks.
- **Auth note:** session/ratelimit logic is unit-tested (T2,T3); route wiring is verified manually since SvelteKit endpoint integration tests would need extra harness — out of scope per YAGNI.
