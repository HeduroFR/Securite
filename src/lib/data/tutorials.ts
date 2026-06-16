export interface Tutorial {
  id: string;
  title: string;
  intro?: string;
  materials: string[]; // matériel / "ingrédients"
  slides: string[]; // chemins images
  videoUrl?: string; // URL publique du mp4 (Cloudflare R2)
}

export const tutorials: Tutorial[] = [
  {
    id: "draktander",
    title: "Draktänder - Dents de dragons",
    intro:
      "Barricade en triangles à monter à plusieurs, avec du matériel courant.",
    materials: [
      "Palettes en bois",
      "Barrières / grilles de chantier",
      "Pneus",
      "Poubelles",
      "Rislan ou fil de fer",
      "Gants résistants",
      "Pince coupante",
    ],
    slides: [
      "/tutorials/draktander/draktander-1.jpg",
      "/tutorials/draktander/draktander-2.jpg",
      "/tutorials/draktander/draktander-3.jpg",
      "/tutorials/draktander/draktander-4.jpg",
      "/tutorials/draktander/draktander-5.jpg",
      "/tutorials/draktander/draktander-6.jpg",
    ],
    videoUrl: "https://cdn.fuckripost.eu/tutorials/draktander.mp4",
  },
];
