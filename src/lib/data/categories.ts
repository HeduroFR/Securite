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
        example: "Dräger X-pect 4800 / Masque de ski/plongée",
        spec: "Monture pleine, joint anti-poussière, norme EN 166, anti-buée",
        priceApprox: "~30€",
        note: "Évite les lunettes de piscines et ajourées : laissent passer le gaz.",
        buyLink: "https://www.amazon.fr/gp/product/B0BBN3RLT9",
      },
    ],
  },
  {
    id: "breathing",
    title: "Respirer",
    items: [
      {
        name: "Demi-masque à cartouches",
        example: "Dräger X-plore 3300 + filtres A2P3/ABEK",
        spec: "Filtres type A2P3 ou ABEK contre gaz/vapeurs, ajustement étanche",
        priceApprox: "~50€",
        note: "Le masque FFP2 filtre les particules, pas les gaz lacrymo.",
        buyLink: "https://www.amazon.fr/gp/product/B004DJCU34",
      },
    ],
  },
  {
    id: "head",
    title: "Tête",
    items: [
      {
        name: "Casquette coquée",
        example: "Casquette de chantier",
        spec: "Coque rigide, jugulaire, norme EN 1078 (vélo) au minimum",
        priceApprox: "~10€",
        buyLink: "https://www.bricodepot.fr/p/5059340046402",
      },
      {
        name: "Cagoule (Balaclava)",
        example: "Balaclava en tissus fin",
        spec: "Tissu fin respirant, couvre tête/visage",
        priceApprox: "~10€",
        note: "Elle permet de protéger votre anonymat des prises de vidéos...",
        buyLink: "https://www.bricodepot.fr/p/5059340046402",
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
      {
        name: "Coquille de protection",
        example: "Coquille de boxe / sport de combat",
        spec: "Coque rigide sur ceinture ajustable, taille adaptée",
        priceApprox: "~10€",
        note: "Protège les parties intimes des tirs et des coups.",
        buyLink:
          "https://www.decathlon.fr/p/coquille-de-protection-slipee-homme-100-blanc/165811/c227m8388827",
      },
      {
        name: "Genouillères / protège-tibias",
        example: "Genouillères skate ou protège-tibias football",
        spec: "Coque dure + mousse, sangles ajustables",
        priceApprox: "~15-30€",
        note: "Protège les articulations en cas de chute ou de charge.",
      },
      {
        name: "Parapluie",
        example: "Parapluie solide à armature métal",
        spec: "Armature renforcée, ouverture rapide, grande toile",
        note: "Bouclier improvisé contre projectiles et caméras ; aussi anti-pluie.",
        buyLink:
          "https://www.decathlon.fr/p/parapluie-125-cm-anti-uv-upf50-profilter-noir/14862/c1m8654664",
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
        priceApprox: "~10-20€",
        buyLink: "https://www.amazon.fr/gp/product/B0DMWLCMN7",
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
        buyLink:
          "https://www.amazon.fr/Laboratoire-Gilbert-physiologique-Physiodose-unidoses/dp/B00IGBSTM6",
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
        priceApprox: "~5-15€",
        note: "Contre le bruit des dispositifs sonores (assourdissants).",
        buyLink:
          "https://www.amazon.fr/3M-3M-1100-3-m-Bouchons-doreille/dp/B0067NKCO8",
      },
    ],
  },
  {
    id: "legal",
    title: "Avocats & défense",
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
