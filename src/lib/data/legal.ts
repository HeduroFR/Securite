export interface Contact {
  label: string;
  phone?: string; // à remplir ; laisser vide si à noter le jour J
  url?: string; // ressource web (ex. annuaire) au lieu d’un numéro
  note?: string;
}

/**
 * Numéros utiles — avocat·es, défense collective, observateurs.
 * Les legal teams sont LOCALES (par ville / par manif), pas un numéro national.
 * Trouve celle de ta ville via le réseau RAJCOL, et note le numéro du jour AVANT.
 */
export const legalCall: Contact[] = [
  {
    label: "Réseau RAJCOL — annuaire des défenses collectives locales",
    url: "https://rajcollective.noblogs.org",
    note: "Trouve la legal team de ta ville. À consulter AVANT la manif.",
  },
  {
    label: "Défense Collective (exemple : Rennes)",
    phone: "07 51 28 26 11",
    note: "Exemple régional. Remplace par le numéro annoncé pour TA manif, noté sur le bras.",
  },
  {
    label: "Avocat·e de permanence (barreau)",
    phone: "",
    note: "Désigne un·e avocat·e en garde à vue. Ne rien dire sans lui/elle.",
  },
  {
    label: "LDH — Ligue des droits de l'Homme (national)",
    phone: "01 56 55 51 00",
    note: "Signaler violences / interpellations. Antenne locale souvent plus utile.",
  },
];

/** Numéros à NE PAS appeler / pièges — un peu de troll, mais le fond est sérieux. */
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
    label: "Ton ex, à 3h, en garde à vue",
    note: "Tentant, mais non. Garde ton seul appel pour l’avocat·e.",
  },
];
