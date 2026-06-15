export interface Item {
  name: string;
  example: string; // exemple nommé
  spec: string; // la spec à chercher
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
    id: "eyes",
    title: "Yeux",
    items: [
      {
        name: "Lunettes de protection étanches",
        example: "Bollé Tracker / lunettes ski fermées",
        spec: "Monture pleine, joint anti-poussière, norme EN 166, anti-buée",
        priceApprox: "~15–30€",
        note: "Évite les lunettes ajourées : laissent passer le gaz.",
        buyLink: "",
      },
    ],
  },
  {
    id: "breathing",
    title: "Respirer",
    items: [
      {
        name: "Demi-masque à cartouches",
        example: "3M 6200 + filtres ABEK",
        spec: "Filtres type A/B/E/K ou ABEK contre gaz/vapeurs, ajustement étanche",
        priceApprox: "~30€",
        note: "Le masque FFP2 filtre les particules, pas les gaz lacrymo.",
      },
    ],
  },
  {
    id: "head",
    title: "Tête",
    items: [
      {
        name: "Casque",
        example: "Casque vélo/skate à coque dure",
        spec: "Coque rigide, jugulaire, norme EN 1078 (vélo) au minimum",
        priceApprox: "~25–50€",
      },
    ],
  },
  {
    id: "skin",
    title: "Peau / corps",
    items: [
      {
        name: "Vêtements couvrants",
        example: "Veste + pantalon épais, manches longues",
        spec: "Tissu épais non synthétique fondant, couvre bras et jambes",
        note: "Évite le nylon près d'une source de chaleur.",
      },
    ],
  },
  {
    id: "hands",
    title: "Mains",
    items: [
      {
        name: "Gants résistants",
        example: "Gants de travail cuir / anti-coupure",
        spec: "Paume renforcée, résistance thermique et à la coupure",
        priceApprox: "~10–20€",
      },
    ],
  },
  {
    id: "firstaid",
    title: "Premiers soins",
    items: [
      {
        name: "Rinçage oculaire",
        example: "Sérum physiologique en dosettes",
        spec: "Solution saline stérile, dosettes individuelles",
        priceApprox: "~3€",
        note: "Rincer yeux/peau à l'eau claire ou sérum, ne pas frotter.",
      },
    ],
  },
  {
    id: "hearing",
    title: "Audition",
    items: [
      {
        name: "Bouchons d'oreille",
        example: "Bouchons mousse ou filtrés réutilisables",
        spec: "Atténuation (SNR) ≥ 25 dB",
        priceApprox: "~5–15€",
        note: "Contre le bruit des dispositifs sonores (assourdissants).",
      },
    ],
  },
  {
    id: "legal",
    title: "Légal / comms",
    items: [
      {
        name: "Carte des droits + contact avocat",
        example: "Numéro de la legal team / avocat noté sur papier",
        spec: "Contacts sur papier, téléphone avec code PIN fort, données chiffrées",
        note: "En France, dissimuler son visage en manifestation peut être sanctionné.",
      },
    ],
  },
  {
    id: "hydration",
    title: "Hydratation",
    items: [
      {
        name: "Eau",
        example: "Bouteille d'eau / gourde",
        spec: "Eau claire pour boire et rincer, contenant souple refermable",
        note: "L'eau sert aussi à rincer les yeux après exposition au gaz.",
      },
    ],
  },
];
