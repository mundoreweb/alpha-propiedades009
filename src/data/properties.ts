import type { Property } from "@/components/PropertyCard";
import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";
import p5 from "@/assets/property-5.jpg";
import p6 from "@/assets/property-6.jpg";

export type CatalogProperty = Property & {
  priceUSD: number;
  provincia: string;
  canton: string;
  parking: number;
  areaNum: number;
};

export const provincias = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limón",
] as const;

export const cantonesPorProvincia: Record<string, string[]> = {
  "San José": ["San José Centro", "Escazú", "Santa Ana", "Curridabat", "Moravia"],
  "Alajuela": ["Alajuela Centro", "Atenas", "Grecia", "San Carlos", "Naranjo"],
  "Cartago": ["Cartago Centro", "La Unión", "Paraíso", "Turrialba"],
  "Heredia": ["Heredia Centro", "San Rafael", "Belén", "Santo Domingo"],
  "Guanacaste": ["Liberia", "Tamarindo", "Nicoya", "Santa Cruz", "Nosara"],
  "Puntarenas": ["Puntarenas Centro", "Jacó", "Monteverde", "Quepos", "Dominical"],
  "Limón": ["Limón Centro", "Puerto Viejo", "Cahuita", "Guápiles"],
};

export const properties: CatalogProperty[] = [
  {
    id: "1", title: "Villa Bahía Tamarindo", location: "Tamarindo, Guanacaste",
    price: "$1,250,000", priceUSD: 1250000, type: "Venta",
    beds: 4, baths: 4, parking: 3, area: "420 m²", areaNum: 420,
    image: p1, featured: true, provincia: "Guanacaste", canton: "Tamarindo",
  },
  {
    id: "2", title: "Penthouse Avenida Escazú", location: "Escazú, San José",
    price: "$3,800", priceUSD: 3800, period: "mes", type: "Alquiler",
    beds: 3, baths: 3, parking: 2, area: "280 m²", areaNum: 280,
    image: p2, featured: true, provincia: "San José", canton: "Escazú",
    rentalStatus: "Disponible",
  },
  {
    id: "3", title: "Casa Bosque Nuboso", location: "Monteverde, Puntarenas",
    price: "$685,000", priceUSD: 685000, type: "Venta",
    beds: 3, baths: 2, parking: 2, area: "310 m²", areaNum: 310,
    image: p3, provincia: "Puntarenas", canton: "Monteverde",
  },
  {
    id: "4", title: "Hacienda Pura Vida", location: "Atenas, Alajuela",
    price: "$890,000", priceUSD: 890000, type: "Venta",
    beds: 5, baths: 4, parking: 4, area: "560 m²", areaNum: 560,
    image: p4, provincia: "Alajuela", canton: "Atenas",
  },
  {
    id: "5", title: "Sunset Terrace Jacó", location: "Jacó, Puntarenas",
    price: "$2,400", priceUSD: 2400, period: "mes", type: "Alquiler",
    beds: 2, baths: 2, parking: 1, area: "180 m²", areaNum: 180,
    image: p5, provincia: "Puntarenas", canton: "Jacó",
    rentalStatus: "Alquilada",
  },
  {
    id: "6", title: "Cabaña Montaña Verde", location: "Cartago Centro, Cartago",
    price: "$425,000", priceUSD: 425000, type: "Venta",
    beds: 3, baths: 2, parking: 2, area: "240 m²", areaNum: 240,
    image: p6, provincia: "Cartago", canton: "Cartago Centro",
  },
  {
    id: "7", title: "Loft Moderno Santa Ana", location: "Santa Ana, San José",
    price: "$2,100", priceUSD: 2100, period: "mes", type: "Alquiler",
    beds: 1, baths: 1, parking: 1, area: "95 m²", areaNum: 95,
    image: p2, provincia: "San José", canton: "Santa Ana",
    rentalStatus: "Disponible",
  },
  {
    id: "8", title: "Casa Colonial Heredia", location: "San Rafael, Heredia",
    price: "$540,000", priceUSD: 540000, type: "Venta",
    beds: 4, baths: 3, parking: 2, area: "350 m²", areaNum: 350,
    image: p4, provincia: "Heredia", canton: "San Rafael",
  },
  {
    id: "9", title: "Beach House Puerto Viejo", location: "Puerto Viejo, Limón",
    price: "$720,000", priceUSD: 720000, type: "Venta",
    beds: 3, baths: 3, parking: 2, area: "260 m²", areaNum: 260,
    image: p1, featured: true, provincia: "Limón", canton: "Puerto Viejo",
  },
];
