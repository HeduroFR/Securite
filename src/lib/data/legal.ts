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
    label: 'Réseau RAJCOL — annuaire des défenses collectives locales',
    url: 'https://rajcollective.noblogs.org',
    note: 'Trouve la legal team de ta ville. À consulter AVANT la manif.'
  },
  {
    label: 'Legal team locale (exemple : Toulouse)',
    phone: '06 05 96 87 34',
    note: 'Exemple régional. Remplace par le numéro annoncé pour TA manif, noté sur le bras.'
  },
  {
    label: 'Avocat·e de permanence (barreau)',
    phone: '',
    note: 'Désigne un·e avocat·e en garde à vue. Ne rien dire sans lui/elle.'
  },
  {
    label: 'LDH — Ligue des droits de l’Homme (national)',
    phone: '01 56 55 51 00',
    note: 'Signaler violences / interpellations. Antenne locale souvent plus utile.'
  }
];

/** Numéros à NE PAS appeler / pièges. Pas de téléphone : ce sont des avertissements. */
export const legalDontCall: Contact[] = [
  {
    label: 'Police / commissariat',
    note: 'Tout est enregistré et utilisé contre toi. Ce n’est pas un conseil.'
  },
  {
    label: 'Numéro inconnu se présentant comme « ton avocat »',
    note: 'Vérifie via la legal team. Ne confirme aucune info.'
  },
  {
    label: 'Proches qui pourraient paniquer ou t’auto-incriminer',
    note: 'Préviens un contact calme et briefé, pas n’importe qui.'
  }
];
