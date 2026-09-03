import rose from "@/assets/flower-rose.png";
import tulip from "@/assets/flower-tulip.png";
import sunflower from "@/assets/flower-sunflower.png";
import lily from "@/assets/flower-lily.png";
import peony from "@/assets/flower-peony.png";
import lavender from "@/assets/flower-lavender.png";

export type Flower = {
  id: string;
  name: string;
  meaning: string;
  image: string;
};

export const FLOWERS: Flower[] = [
  { id: "rose", name: "Rose", meaning: "Cinta yang tak pernah pudar", image: rose },
  { id: "tulip", name: "Tulip", meaning: "Awal yang manis", image: tulip },
  { id: "sunflower", name: "Sunflower", meaning: "Selalu menghadap terang", image: sunflower },
  { id: "lily", name: "Lily", meaning: "Ketulusan dan doa", image: lily },
  { id: "peony", name: "Peony", meaning: "Kebahagiaan yang melimpah", image: peony },
  { id: "lavender", name: "Lavender", meaning: "Ketenangan dan rindu", image: lavender },
];

export const THEMES = [
  { id: "garden", name: "Garden", note: "Hijau taman malam" },
  { id: "letter", name: "Letter", note: "Kertas surat klasik" },
  { id: "dusk", name: "Dusk", note: "Senja lembut" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const OCCASIONS = [
  "Ulang tahun",
  "Anniversary",
  "Terima kasih",
  "Semangat ya",
  "Maaf",
  "Cuma kangen",
];

export function flowerById(id: string) {
  return FLOWERS.find((f) => f.id === id);
}
