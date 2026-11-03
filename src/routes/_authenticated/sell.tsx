import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/site/AuthCard";
import { BUCKET, CATEGORIES, CONDITIONS, IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/listings";

export const Route = createFileRoute("/_authenticated/sell")({
  head: () => ({
    meta: [
      { title: "Sell your books — Book For Sale" },
      { name: "description", content: "List your used books for other students in minutes." },
      { property: "og:title", content: "Sell your books — Book For Sale" },
      { property: "og:description", content: "List your used books for other students." },
    ],
  }),
  component: Sell,
});

const year = new Date().getFullYear();
const optYear = z.union([z.literal(""), z.coerce.number().int().min(1950).max(year)]);
const schema = z
  .object({
    title: z.string().trim().min(2, "Enter the book title").max(200),
    author: z.string().trim().min(1, "Enter the author").max(150),
    publisher: z.string().trim().max(150),
    isbn: z.string().trim().regex(/^$|^[0-9Xx-]{10,17}$/, "ISBN should be 10–13 digits"),
    category: z.enum(CATEGORIES),
    subject: z.string().trim().max(80),
    exam: z.string().trim().max(80),
    class_level: z.string().trim().max(80),
    mrp: z.coerce.number({ invalid_type_error: "Enter MRP" }).positive("Enter MRP").max(100000),
    price: z.coerce.number({ invalid_type_error: "Enter price" }).positive("Enter price"),
    purchase_year: optYear,
    condition: z.coerce.number().int().min(1, "Choose a condition").max(5),
    description: z.string().trim().max(2000),
    prep_exam: z.string().trim().max(80),
    prep_year: optYear,
    prep_background: z.string().trim().max(500),
    city: z.string().trim().min(2, "Enter your city").max(80),
    pincode: z.string().trim().regex(/^$|^[1-9][0-9]{5}$/, "6-digit PIN code"),
  })
  .refine((d) => d.price <= d.mrp, { path: ["price"], message: "Price can't exceed MRP" });

const empty = {
  title: "", author: "", publisher: "", isbn: "", category: "NCERT", subject: "", exam: "", class_level: "",
  mrp: "", price: "", purchase_year: "", condition: "0", description: "", prep_exam: "", prep_year: "",
  prep_background: "", city: "", pincode: "",
};
type F = typeof empty;

function Sell() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [f, setF] = useState<F>(empty);
  const [files, setFiles] = useState<{ file: File; url: string }[]>([]);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("profiles").select("city, prep_background").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setF((p) => ({ ...p, city: p.city || data.city || "", prep_background: p.prep_background || data.prep_background || "" }));
    });
  }, [user.id]);

  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files];
    for (const file of Array.from(list)) {
      if (!IMAGE_TYPES.includes(file.type)) { toast.error(`${file.name}: use JPG, PNG or WebP`); continue; }
      if (file.size > MAX_IMAGE_BYTES) { toast.error(`${file.name}: max 5 MB`); continue; }
      if (next.length >= 6) { toast.error("Up to 6 photos"); break; }
      next.push({ file, url: URL.createObjectURL(file) });
    }
    setFiles(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const r = schema.safeParse(f);
    const errors: Record<string, string> = r.success ? {} : Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]));
    if (!files.length) errors.images = "Add at least one photo";
    setErrs(errors);
    if (!r.success || errors.images) return toast.error("Please fix the highlighted fields");
    const d = r.data;
    setBusy(true);
    try {
      const { data: book, error: be } = await supabase
        .from("books")
        .insert({ title: d.title, author: d.author, publisher: d.publisher || null, isbn: d.isbn || null, created_by: user.id })
        .select("id").single();
      if (be) throw be;
      const { data: listing, error: le } = await supabase
        .from("listings")
        .insert({
          seller_id: user.id, book_id: book.id, category: d.category, subject: d.subject || null, exam: d.exam || null,
          class_level: d.class_level || null, mrp: d.mrp, price: d.price, condition: d.condition,
          purchase_year: d.purchase_year || null, description: d.description || null, prep_exam: d.prep_exam || null,
          prep_year: d.prep_year || null, city: d.city, pincode: d.pincode || null,
        })
        .select("id").single();
      if (le) throw le;
      const rows = [];
      for (const [i, { file }] of files.entries()) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${user.id}/${listing.id}/${i}-${crypto.randomUUID()}.${ext}`;
        const { error: ue } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
        if (ue) throw ue;
        rows.push({ listing_id: listing.id, storage_path: path, url: path, position: i });
      }
      const { error: ie } = await supabase.from("listing_images").insert(rows);
      if (ie) throw ie;
      if (d.prep_background) await supabase.from("profiles").update({ prep_background: d.prep_background }).eq("id", user.id);
      toast.success("Your book is live!");
      navigate({ to: "/books/$id", params: { id: listing.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't publish listing");
    } finally {
      setBusy(false);
    }
  };

  const text = (k: keyof F, label: string, props: React.ComponentProps<typeof Input> = {}) => (
    <div>
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} value={f[k]} onChange={set(k)} className="mt-1.5" {...props} />
      <FieldError msg={errs[k]} />
    </div>
  );

  return (
    <section className="container-page max-w-3xl py-10">
      <h1 className="font-display text-3xl text-foreground sm:text-4xl">List a book</h1>
      <p className="mt-2 text-muted-foreground">Clear photos and an honest condition rating sell faster.</p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-8">
        <Card title="Book information">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">{text("title", "Book title")}</div>
            {text("author", "Author")}
            {text("publisher", "Publisher")}
            {text("isbn", "ISBN (optional)")}
            <div>
              <Label htmlFor="category">Category</Label>
              <select id="category" value={f.category} onChange={set("category")} className="mt-1.5 h-9 w-full rounded-md border bg-background px-3 text-sm">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            {text("subject", "Subject")}
            {text("exam", "Exam preparation category")}
            {text("class_level", "Class / academic level")}
            {text("purchase_year", "Purchase year", { inputMode: "numeric" })}
            {text("mrp", "Original MRP (₹)", { inputMode: "decimal" })}
            {text("price", "Your selling price (₹)", { inputMode: "decimal" })}
          </div>
        </Card>

        <Card title="Photos">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {files.map((p, i) => (
              <div key={p.url} className="relative aspect-square overflow-hidden rounded-md border">
                <img src={p.url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                <button type="button" aria-label="Remove photo" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-full bg-background/90 p-1"><X className="h-3 w-3" /></button>
              </div>
            ))}
            {files.length < 6 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground hover:bg-secondary">
                <ImagePlus className="mb-1 h-5 w-5" /> Add
                <input type="file" accept={IMAGE_TYPES.join(",")} multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
              </label>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">JPG, PNG or WebP · up to 5 MB each · max 6 photos</p>
          <FieldError msg={errs["images"]} />
        </Card>

        <Card title="Condition">
          <div className="grid gap-2">
            {CONDITIONS.map((c) => (
              <label key={c.value} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition ${f.condition === String(c.value) ? "border-ring bg-accent" : "hover:bg-secondary"}`}>
                <input type="radio" name="condition" value={c.value} checked={f.condition === String(c.value)} onChange={set("condition")} className="mt-1" />
                <span><span className="font-medium text-foreground">{c.value} – {c.label}</span><span className="block text-sm text-muted-foreground">{c.hint}</span></span>
              </label>
            ))}
          </div>
          <FieldError msg={errs["condition"]} />
        </Card>

        <Card title="About you as a seller">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="prep_background">Preparation background</Label>
              <Textarea id="prep_background" value={f.prep_background} onChange={set("prep_background")} placeholder="e.g. Cleared JEE Main 2025, now at NIT Trichy" className="mt-1.5" />
            </div>
            {text("prep_exam", "Examination prepared for")}
            {text("prep_year", "Year of preparation", { inputMode: "numeric" })}
            <div className="sm:col-span-2">
              <Label htmlFor="description">Short description</Label>
              <Textarea id="description" value={f.description} onChange={set("description")} placeholder="Highlighting, missing pages, extras included…" className="mt-1.5" />
            </div>
            {text("city", "City")}
            {text("pincode", "PIN code", { inputMode: "numeric" })}
          </div>
        </Card>

        <Button type="submit" size="lg" disabled={busy} className="w-full sm:w-auto">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Publish listing
        </Button>
      </form>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="mb-4 font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}
