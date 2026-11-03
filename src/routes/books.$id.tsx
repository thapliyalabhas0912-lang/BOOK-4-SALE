import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CONDITIONS, LISTING_SELECT, discountPct, inr, withImageUrls, type ListingRow } from "@/lib/listings";

export const Route = createFileRoute("/books/$id")({
  head: () => ({
    meta: [
      { title: "Book details — Book For Sale" },
      { name: "description", content: "Used book listed by a student on Book For Sale." },
      { property: "og:title", content: "Book details — Book For Sale" },
      { property: "og:description", content: "Used book listed by a student on Book For Sale." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const [active, setActive] = useState(0);
  const { data: l, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data } = await supabase.from("listings").select(LISTING_SELECT).eq("id", id).maybeSingle();
      return data ? (await withImageUrls([data as unknown as Omit<ListingRow, "imageUrls">]))[0] : null;
    },
  });

  if (isLoading) return <p className="container-page py-16 text-sm text-muted-foreground">Loading…</p>;
  if (!l) return <p className="container-page py-16 text-center text-muted-foreground">This listing isn't available. <Link to="/buy" className="text-teal">Browse books</Link></p>;
  const cond = CONDITIONS[l.condition - 1];

  return (
    <section className="container-page grid gap-10 py-10 lg:grid-cols-2">
      <div>
        <div className="aspect-[4/5] overflow-hidden rounded-xl border bg-secondary">
          {l.imageUrls[active] ? <img src={l.imageUrls[active]} alt={l.books.title} className="h-full w-full object-contain" /> : <div className="flex h-full items-center justify-center"><BookOpen className="h-10 w-10 text-muted-foreground" /></div>}
        </div>
        {l.imageUrls.length > 1 && (
          <div className="mt-3 flex gap-2">
            {l.imageUrls.map((u, i) => (
              <button key={u} onClick={() => setActive(i)} className={`h-20 w-16 overflow-hidden rounded border-2 ${i === active ? "border-ring" : "border-transparent"}`}>
                <img src={u} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-teal">{l.category}{l.exam ? ` · ${l.exam}` : ""}{l.subject ? ` · ${l.subject}` : ""}</p>
        <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">{l.books.title}</h1>
        <p className="mt-2 text-muted-foreground">{l.books.author}{l.books.publisher ? ` · ${l.books.publisher}` : ""}{l.books.isbn ? ` · ISBN ${l.books.isbn}` : ""}</p>
        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-foreground">{inr(l.price)}</span>
          <span className="text-muted-foreground line-through">{inr(l.mrp)}</span>
          <span className="rounded bg-accent px-2 py-0.5 text-sm font-medium text-accent-foreground">Save {inr(l.mrp - l.price)} ({discountPct(l.mrp, l.price)}%)</span>
        </div>
        {l.status === "sold" && <p className="mt-4 rounded-md bg-secondary p-3 text-sm font-medium text-foreground">This copy has been sold.</p>}
        <div className="mt-6 rounded-lg border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Book condition</p>
          <p className="mt-1 font-medium text-foreground">{l.condition}/5 · {cond?.label}</p>
          <p className="text-sm text-muted-foreground">{cond?.hint}</p>
        </div>
        {l.description && <p className="mt-6 whitespace-pre-line text-foreground">{l.description}</p>}
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          {l.class_level && <><dt className="text-muted-foreground">Level</dt><dd>{l.class_level}</dd></>}
          {l.purchase_year && <><dt className="text-muted-foreground">Purchased</dt><dd>{l.purchase_year}</dd></>}
          <dt className="text-muted-foreground">Location</dt><dd>{l.city}</dd>
        </dl>
        <div className="mt-8 rounded-lg border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Seller</p>
          <p className="mt-1 font-medium text-foreground">{l.profiles?.full_name || "Student seller"}</p>
          <p className="text-sm text-muted-foreground">
            {l.profiles?.prep_background || (l.prep_exam ? `Prepared for ${l.prep_exam}${l.prep_year ? ` (${l.prep_year})` : ""}` : "No preparation background added")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Member since {new Date(l.profiles?.created_at ?? l.created_at).getFullYear()} · No seller reviews yet</p>
        </div>
      </div>
    </section>
  );
}
