import type { ProductInput } from "./validators/product.validator";

// Invented demo products so a new store can see the catalog working right away.
export const SAMPLE_PRODUCTS: ProductInput[] = [
  {
    name: "Remera oversize negra",
    description: "Algodón peinado 24/1, corte oversize unisex.",
    price: 15000,
    category: "Remeras",
    sizes: ["S", "M", "L", "XL"],
    image: "",
    active: true,
  },
  {
    name: "Jean mom celeste",
    description: "Tiro alto, tela rígida, lavado claro.",
    price: 32000,
    category: "Pantalones",
    sizes: ["38", "40", "42", "44"],
    image: "",
    active: true,
  },
  {
    name: "Campera de jean clásica",
    description: "Denim azul medio con botones metálicos.",
    price: 55000,
    category: "Camperas",
    sizes: ["S", "M", "L"],
    image: "",
    active: true,
  },
  {
    name: "Vestido floral midi",
    description: "Viscosa liviana con estampado floral y tajo lateral.",
    price: 28000,
    category: "Vestidos",
    sizes: ["S", "M", "L"],
    image: "",
    active: true,
  },
  {
    name: "Buzo hoodie gris",
    description: "Frisa invisible, capucha con cordón y bolsillo canguro.",
    price: 26000,
    category: "Buzos",
    sizes: ["S", "M", "L", "XL"],
    image: "",
    active: true,
  },
  {
    name: "Zapatillas urbanas blancas",
    description: "Cuero ecológico, suela de goma liviana.",
    price: 48000,
    category: "Calzado",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"],
    image: "",
    active: true,
  },
];
