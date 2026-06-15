export interface Contact {
  label: string;
  phone?: string; // à remplir ; laisser vide si à noter le jour J
  url?: string; // ressource web (ex. annuaire) au lieu d’un numéro
  note?: string;
}

/**
 * Numéros utiles - avocat·es, défense collective, observateurs.
 * Les legal teams sont LOCALES (par ville / par manif), pas un numéro national.
 * Note le numéro du jour AVANT, et garde ceux des avocat·es ci-dessous sur toi.
 */
export const legalCall: Contact[] = [
  {
    label: "Maître Delphine Caro",
    phone: "06 50 44 52 33",
    note: "À contacter en cas de garde à vue. Ne rien dire sans avocat·e.",
  },
  {
    label: "Maître Nicolas Prigent",
    phone: "06 79 48 32 92",
    note: "À contacter en cas de garde à vue. Ne rien dire sans avocat·e.",
  },
  {
    label: "Maître Olivier Pacheu",
    phone: "06 73 07 12 83",
    note: "À contacter en cas de garde à vue. Ne rien dire sans avocat·e.",
  },
  {
    label: "LDH - Ligue des droits de l'Homme",
    phone: "01 56 55 51 00",
    note: "Signaler violences / interpellations. Antenne locale souvent plus utile.",
  },
];

/** Numéros à NE PAS appeler / pièges - un peu de troll, mais le fond est sérieux. */
export const legalDontCall: Contact[] = [
  {
    label: "Police « pour expliquer ta version »",
    phone: "17",
    note: "Spoiler : ils ne prennent pas ta défense. Tout est enregistré et retenu contre toi.",
  },
  {
    label: "« Ton avocat » qui t’appelle d’un numéro inconnu",
    note: "Personne ne t’appelle comme ça. Vérifie via la legal team, ne confirme rien.",
  },
  {
    label: "Le proche qui va paniquer et tout raconter",
    note: "Tata qui rappelle le commissariat « pour arranger les choses »… non. Un contact calme et briefé.",
  },
  {
    label: "Le pote qui « connaît un truc » et veut négocier",
    note: "Pas d’arrangement à l’amiable avec la police. Tu parles à ton avocat·e, point.",
  },
];
