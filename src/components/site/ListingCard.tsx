import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { CONDITIONS, discountPct, inr, type ListingRow } from "@/lib/listings";

export function ListingCard({ l }: { l: ListingRow }) {
  const off = discountPct(l.mrp, l.price);
  return (
    <Link to="/books/$id" params={{ id: l.id }} className="group flex flex-col overflow-hidden rounded-lg border bg-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative aspect-[4/5] bg-secondary">
        {l.imageUrls[0] ? (
          <img src={l.imageUrls[0]} alt={l.books.title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground"><BookOpen className="h-8 w-8" /></div>
        )}
        {off > 0 && <span className="absolute left-2 top-2 rounded bg-teal px-2 py-0.5 text-xs font-semibold text-teal-foreground">{off}% off</span>}
        {l.status === "sold" && <span className="absolute right-2 top-2 rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">Sold</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 font-medium text-foreground">{l.books.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{l.books.author}{l.books.publisher ? ` · ${l.books.publisher}` : ""}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-foreground">{inr(l.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{inr(l.mrp)}</span>
        </div>
        <p className="mt-auto pt-3 text-xs text-muted-foreground">
          Condition {l.condition}/5 · {CONDITIONS[l.condition - 1]?.label} · {l.city}
        </p>
      </div>
    </Link>
  );
}
