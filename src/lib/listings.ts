import { supabase } from "@/integrations/supabase/client";

export const CATEGORIES = ["NCERT", "JEE", "NEET", "UPSC", "SSC", "Banking", "College", "Other"] as const;

export const CONDITIONS = [
  { value: 1, label: "Poor", hint: "Noticeable damage, stains or significant wear." },
  { value: 2, label: "Fair", hint: "Usable with visible wear and markings." },
  { value: 3, label: "Good", hint: "Normal used condition with minor wear." },
  { value: 4, label: "Almost New", hint: "Minimal usage and very little visible wear." },
  { value: 5, label: "Like New", hint: "Excellent condition with almost no signs of use." },
] as const;

export const BUCKET = "listing-images";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const LISTING_SELECT =
  "id, seller_id, category, subject, exam, class_level, mrp, price, condition, purchase_year, description, prep_exam, prep_year, city, pincode, status, created_at, books!inner(id, title, author, publisher, isbn), listing_images(storage_path, position), profiles(id, full_name, city, created_at, prep_background)";

export type ListingRow = {
  id: string;
  seller_id: string;
  category: string;
  subject: string | null;
  exam: string | null;
  class_level: string | null;
  mrp: number;
  price: number;
  condition: number;
  purchase_year: number | null;
  description: string | null;
  prep_exam: string | null;
  prep_year: number | null;
  city: string;
  pincode: string | null;
  status: "active" | "paused" | "sold";
  created_at: string;
  books: { id: string; title: string; author: string; publisher: string | null; isbn: string | null };
  listing_images: { storage_path: string; position: number }[];
  profiles: { id: string; full_name: string; city: string | null; created_at: string; prep_background: string | null } | null;
  imageUrls: string[];
};

/** Private bucket: turn stored paths into short-lived signed URLs. */
export async function withImageUrls(rows: Omit<ListingRow, "imageUrls">[]): Promise<ListingRow[]> {
  const paths = rows.flatMap((r) => r.listing_images.map((i) => i.storage_path));
  const map = new Map<string, string>();
  if (paths.length) {
    const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 3600);
    data?.forEach((d) => d.path && d.signedUrl && map.set(d.path, d.signedUrl));
  }
  return rows.map((r) => ({
    ...r,
    imageUrls: [...r.listing_images]
      .sort((a, b) => a.position - b.position)
      .map((i) => map.get(i.storage_path))
      .filter((u): u is string => !!u),
  }));
}

export function discountPct(mrp: number, price: number) {
  return Math.max(0, Math.round(((mrp - price) / mrp) * 100));
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
