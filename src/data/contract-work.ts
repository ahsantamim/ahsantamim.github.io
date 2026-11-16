import { asset } from "@/lib/asset";

export type ContractProject = {
  name: string;
  /** What the client does, in their own terms. */
  summary: string;
  kind: string;
  href: string;
  /** A 1440×900 capture of the live homepage. */
  image: string;
};

/** Live client sites from independent contract work. */
export const contractWork: ContractProject[] = [
  {
    name: "JSTEX",
    summary: "Corporate site for China Jiangsu Textiles I/E Group Datai, a textile exporter since 1973: products, clients, and meeting booking.",
    kind: "Corporate website",
    href: "https://www.js-texbd.com/",
    image: asset("/contract-work/js-tex.jpg"),
  },
  {
    name: "Zexfro International",
    summary: "Import and export platform connecting businesses with verified trade partners in Europe, with registration for importers and exporters.",
    kind: "Trade platform",
    href: "https://www.zexfrointl.com/en",
    image: asset("/contract-work/zexfro.jpg"),
  },
  {
    name: "Azure Cuisine",
    summary: "Website for a Thai, Indian, and Chinese fine-dining restaurant in Dhaka, with the menu and table reservations.",
    kind: "Restaurant website",
    href: "https://www.azurecuisine.com/",
    image: asset("/contract-work/azure-cuisine.jpg"),
  },
  {
    name: "Appliit",
    summary: "AI job application tool for Germany that matches jobs and builds an ATS-ready CV, cover letter, and Deckblatt as one PDF.",
    kind: "AI SaaS",
    href: "https://www.appliit.de/",
    image: asset("/contract-work/appliit.jpg"),
  },
  {
    name: "Charge Bazar",
    summary: "Electronics and gadgets store with category browsing, search, cart, wishlist, and seller listings.",
    kind: "E-commerce",
    href: "https://www.chargebazar.com/",
    image: asset("/contract-work/chargebazar.jpg"),
  },
  {
    name: "Better Half BD",
    summary: "Matrimony platform for Bangladesh with NID-verified profiles, explainable AI compatibility scoring, and photo privacy controls.",
    kind: "Matrimony platform",
    href: "https://betterhalfbd.com/",
    image: asset("/contract-work/betterhalf.jpg"),
  },
];
