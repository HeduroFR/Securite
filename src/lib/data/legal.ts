export interface Contact {
  label: string;
  phone?: string; // à remplir ; laisser vide si à noter le jour J
  note?: string;
}

/** Numéros utiles — avocat·es, défense collective, observateurs. */
export const legalCall: Contact[] = [
  {
    label: 'Legal team / défense collective de la manif',
    phone: '',
    note: 'Numéro annoncé pour l’événement. À noter AVANT et sur le bras.'
  },
  {
    label: 'Avocat·e de permanence',
    phone: '',
    note: 'Donne instructions en cas de garde à vue. Ne rien dire sans lui/elle.'
  },
  {
    label: 'Observateurs droits humains (ex. LDH locale)',
    phone: '',
    note: 'Signaler violences / interpellations.'
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
