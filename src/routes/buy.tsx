import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { ListingCard } from "@/components/site/ListingCard";
import { CATEGORIES, LISTING_SELECT, withImageUrls, type ListingRow } from "@/lib/listings";

const searchSchema = z.object({ q: z.string().optional(), category: z.string().optional(), sort: z.string().optional() });

export const Route = createFileRoute("/buy")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Buy used books — Book For Sale" },
      { name: "description", content: "Browse second-hand NCERT, JEE, NEET, UPSC and college books listed by students." },
      { property: "og:title", content: "Buy used books — Book For Sale" },
      { property: "og:description", content: "Browse second-hand books listed by students." },
    ],
  }),
  component: Buy,
});

function Buy() {
  const s = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(s.q ?? "");
  const sort = s.sort ?? "recent";

  const { data, isLoading, error } = useQuery({
    queryKey: ["listings", s],
    queryFn: async () => {
      let query = supabase.from("listings").select(LISTING_SELECT).eq("status", "active");
      if (s.category) query = query.eq("category", s.category);
      const term = s.q?.trim().replace(/[%,()]/g, " ");
      if (term) query = query.or(`title.ilike.%${term}%,author.ilike.%${term}%,publisher.ilike.%${term}%,isbn.ilike.%${term}%`, { referencedTable: "books" });
      if (sort === "price_asc") query = query.order("price", { ascending: true });
      else if (sort === "price_desc") query = query.order("price", { ascending: false });
      else query = query.order("created_at", { ascending: false });
      const { data, error } = await query.limit(60);
      if (error) throw error;
      return withImageUrls(data as unknown as Omit<ListingRow, "imageUrls">[]);
    },
  });

  return (
    <section className="container-page py-10">
      <h1 className="font-display text-3xl text-foreground sm:text-4xl">Buy books</h1>
      <form onSubmit={(e) => { e.preventDefault(); navigate({ search: { ...s, q: q || undefined } }); }} className="mt-6 flex max-w-xl gap-2">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, author, publisher or ISBN" className="h-10 w-full rounded-md border bg-card pl-9 pr-3 text-sm outline-none focus:border-ring" />
        </label>
        <button className="rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Search</button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[undefined, ...CATEGORIES].map((c) => (
          <button key={c ?? "all"} onClick={() => navigate({ search: { ...s, category: c } })} className={`rounded-full border px-3 py-1 text-sm ${s.category === c ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-secondary"}`}>
            {c ?? "All"}
          </button>
        ))}
        <select value={sort} onChange={(e) => navigate({ search: { ...s, sort: e.target.value } })} className="ml-auto h-9 rounded-md border bg-card px-3 text-sm">
          <option value="recent">Recently listed</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      <div className="mt-8">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading books…</p>
        ) : error ? (
          <p className="text-sm text-destructive">Couldn't load books. Please try again.</p>
        ) : !data?.length ? (
          <p className="rounded-lg border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">No books match yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{data.map((l) => <ListingCard key={l.id} l={l} />)}</div>
        )}
      </div>
    </section>
  );
}
