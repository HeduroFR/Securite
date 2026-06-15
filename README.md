# Se Protéger — site recommandation protection manifestation

One-pager FR, accès par passcode (vérifié côté serveur). SvelteKit + Bun.

## Dev
```bash
bun install
cp .env.example .env   # puis éditer SITE_PASSCODE et SESSION_SECRET
bun run dev
```

## Build & run (prod)
```bash
bun run build
PORT=3000 bun ./build/index.js
```

Variables (`.env`) : `SITE_PASSCODE`, `SESSION_SECRET` (longue valeur aléatoire).
Le port et le host sont configurables via `PORT` / `HOST` (svelte-adapter-bun).

## Déploiement VPS homelab
Derrière un reverse-proxy (TLS). Exemple systemd : lancer `bun ./build/index.js`
avec `EnvironmentFile=/chemin/.env`, `NODE_ENV=production`. Le cookie de session est
`secure` en production : servir en HTTPS.

> ⚠️ **Important :** le flag `Secure` du cookie dépend de `NODE_ENV=production`.
> Oublier cette variable en prod = cookie de session servi sans `Secure`. Toujours
> définir `NODE_ENV=production` (et servir en HTTPS) sur le VPS.

## Contenu
Éditer `src/lib/data/categories.ts` puis rebuild. Pour un lien d'achat, remplir le
champ `buyLink` de l'item (sinon pas de bouton « Lien d'achat »).
