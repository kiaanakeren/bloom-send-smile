import bqRose from "@/assets/bouquet-rose.png";
import bqTulip from "@/assets/bouquet-tulip.png";
import bqSunflower from "@/assets/bouquet-sunflower.png";
import bqLily from "@/assets/bouquet-lily.png";
import bqPeony from "@/assets/bouquet-peony.png";
import bqLavender from "@/assets/bouquet-lavender.png";

export type Bouquet = {
  id: string;
  name: string;
  blooms: string;
  meaning: string;
  image: string;
};

export const BOUQUETS: Bouquet[] = [
  {
    id: "rose",
    name: "Buket Rosé Éternel",
    blooms: "Rose merah & blush, eucalyptus",
    meaning: "Cinta yang tak pernah pudar",
    image: bqRose,
  },
  {
    id: "peony",
    name: "Buket Blush Peony",
    blooms: "Peony, ranunculus, silk ribbon",
    meaning: "Kebahagiaan yang melimpah",
    image: bqPeony,
  },
  {
    id: "tulip",
    name: "Buket Tulip Pastel",
    blooms: "Tulip pink, putih, kuning",
    meaning: "Awal yang manis",
    image: bqTulip,
  },
  {
    id: "sunflower",
    name: "Buket Sunny Field",
    blooms: "Sunflower, daisy, gandum",
    meaning: "Selalu menghadap terang",
    image: bqSunflower,
  },
  {
    id: "lily",
    name: "Buket Ivory Lily",
    blooms: "Lily putih, baby's breath",
    meaning: "Ketulusan dan doa",
    image: bqLily,
  },
  {
    id: "lavender",
    name: "Buket Lavender Linen",
    blooms: "Lavender kering, wildflower",
    meaning: "Ketenangan dan rindu",
    image: bqLavender,
  },
];

export const THEMES = [
  { id: "garden", name: "Garden", note: "Hijau taman malam" },
  { id: "letter", name: "Letter", note: "Kertas surat klasik" },
  { id: "dusk", name: "Dusk", note: "Senja plum lembut" },
  { id: "night", name: "Night", note: "Langit malam berkilau" },
  { id: "blush", name: "Blush", note: "Pink manis" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const OPENERS = [
  {
    id: "envelope",
    name: "Surat",
    note: "Amplop terbuka perlahan",
  },
  {
    id: "giftbox",
    name: "Kotak kado",
    note: "Tutup kotak terangkat",
  },
  {
    id: "curtain",
    name: "Hujan kelopak",
    note: "Kelopak menyingkap kartu",
  },
] as const;

export type OpenerId = (typeof OPENERS)[number]["id"];

export const OCCASIONS = [
  "Ulang tahun",
  "Anniversary",
  "Terima kasih",
  "Semangat ya",
  "Maaf",
  "Cuma kangen",
  "Selamat wisuda",
  "Get well soon",
];

export function bouquetById(id: string | null | undefined) {
  return BOUQUETS.find((b) => b.id === id) ?? BOUQUETS[0]!;
}

export function themeClass(theme: string | null | undefined) {
  const found = THEMES.find((t) => t.id === theme);
  return `gift-theme gift-theme-${found?.id ?? "garden"}`;
}

/** Ubah link Spotify / YouTube jadi URL embed yang bisa diputar penerima. */
export function toEmbedUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const url = raw.trim();
  try {
    const u = new URL(url);
    if (u.hostname.includes("spotify")) {
      const parts = u.pathname.split("/").filter(Boolean);
      const kind = parts[0];
      const id = parts[1];
      if (!kind || !id) return null;
      return `https://open.spotify.com/embed/${kind}/${id}`;
    }
    if (u.hostname.includes("youtu")) {
      const id = u.hostname === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v");
      if (!id) return null;
      return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}
