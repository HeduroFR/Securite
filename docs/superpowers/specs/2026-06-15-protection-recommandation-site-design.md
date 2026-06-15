# Site recommandation protection en manifestation — Design

**Date:** 2026-06-15
**Statut:** Approuvé (design), prêt pour plan d'implémentation

## Objectif

Page web unique (one-pager), en français, à destination de la France. Double rôle :
éducation sécurité d'abord, recommandations d'achat concrètes attachées à chaque
sujet. Couvre la protection individuelle lors d'événements type manifestation.

Accès protégé par un passcode partagé, vérifié côté serveur. Hébergée plus tard sur
un VPS homelab, accessible sur le réseau local pendant le développement.

## Décisions clés

| Sujet | Décision |
|---|---|
| Rôle de la page | Éducation sécurité + recommandations d'achat (les deux) |
| Langue / région | Français / France |
| Catégories | 9, toutes incluses |
| Spécificité reco | Mix : 1 exemple nommé + la spec à chercher |
| Auth | Réelle, côté serveur (pas de bypass via view-source) |
| Stack | Bun.sh + SvelteKit |
| Hébergement | VPS homelab (déploiement ultérieur) |
| Ton visuel | Activiste / zine — layout A jaune/noir, accordéon |
| Disclaimer | Oui, bannière éducative + légale |
| Responsive | Mobile-first, **adapté desktop aussi** |

## Stack & architecture

- **SvelteKit** sur runtime **Bun**, via `svelte-adapter-bun` → un seul serveur Bun
  qui sert la page et gère l'authentification.
- Routes :
  - `/` — page protégée (le one-pager).
  - `/login` — formulaire passcode.
- Contenu en données locales : `src/lib/data/categories.ts`. Tableau de 9 catégories,
  chaque item : `{ name, spec, example, priceApprox, buyLink, note }`. Pas de base de
  données, pas de CMS. Éditer le fichier → redéployer.
- Rendu majoritairement statique (composants Svelte), JS minimal.

## Authentification (côté serveur, réelle)

- Passcode partagé unique dans `.env` (`SITE_PASSCODE`), jamais envoyé au client.
- `/login` : `form action` POST le code → le serveur compare → si correct, pose un
  **cookie signé, httpOnly** (jeton de session, HMAC avec `SESSION_SECRET`).
- `hooks.server.ts` : protège chaque requête sauf `/login` et les assets. Pas de
  cookie / cookie invalide ou falsifié → redirection vers `/login`.
- **Rate-limiting** des tentatives de login (compteur en mémoire par IP) pour ralentir
  le brute force.
- Le code n'atteint jamais le navigateur ; view-source ne révèle rien.

## Structure de la page (layout A — jaune/noir)

- **Hero** : titre énorme « SE PROTÉGER », sous-titre, **bannière disclaimer**
  (info éducative, pas un conseil médical ni juridique, vérifier la légalité — ex.
  dissimulation du visage en manifestation = contravention en France).
- **9 catégories en accordéon** : Yeux, Respirer, Tête, Peau/corps, Mains,
  Premiers soins, Audition, Légal/comms, Hydratation.
- Chaque catégorie se déplie → fiches d'items :
  `nom · exemple nommé · spec à chercher · ~prix · lien d'achat · note`.
- **Footer** : rappel disclaimer + date de dernière mise à jour.

## Visuel & responsive

- Palette : noir `#111` + jaune avertissement `#f2e600`, accent rouge minimal pour
  alertes. Typo bold/condensée, bordures épaisses.
- **Mobile-first** : accordéon pleine largeur, fiches empilées, cibles tactiles
  généreuses.
- **Desktop adapté** : largeur de contenu bornée et centrée ; au-delà d'un breakpoint,
  les fiches d'une catégorie peuvent s'afficher en grille multi-colonnes ; titres et
  espacements montés en échelle. Mise en page fluide entre les deux, pas de version
  desktop séparée.

## Déploiement

- VPS homelab (plus tard) : `bun run build` → `bun ./build/index.js`, derrière
  systemd + reverse-proxy. Host/port configurables.
- `.env` contient `SITE_PASSCODE` et `SESSION_SECRET`.
- `.gitignore` : `.env`, `.superpowers/`, `node_modules`, `build`.

## Tests

- Logique d'auth unit-testée : bon code / mauvais code / pas de cookie / cookie
  falsifié / rate-limit déclenché.
- Validation de la forme des données (`categories.ts`).
- La page rendue est bien protégée (requête sans session → redirect).

## Hors périmètre (YAGNI)

Comptes multi-utilisateurs, UI d'admin, e-commerce / panier, analytics, i18n.
