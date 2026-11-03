import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GraduationCap, Landmark, Library, MessageCircle, Search, Stethoscope, Atom, Briefcase, ShieldCheck, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingCard } from "@/components/site/ListingCard";
import { LISTING_SELECT, withImageUrls, discountPct, type ListingRow } from "@/lib/listings";
import hero from "@/assets/hero-books.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Book For Sale — Find Your Next Book at a Better Price" },
      { name: "description", content: "A student-to-student marketplace for used NCERT, JEE, NEET, UPSC, SSC, Banking and college books." },
      { property: "og:title", content: "Book For Sale — Your Books. Someone's Next Beginning." },
      { property: "og:description", content: "Buy and sell second-hand academic and competitive exam books from fellow students." },
    ],
  }),
  component: Index,
});

const categories = [
  { name: "NCERT", sub: "Class 6–12", icon: BookOpen },
  { name: "JEE", sub: "Engineering", icon: Atom },
  { name: "NEET", sub: "Medical", icon: Stethoscope },
  { name: "UPSC", sub: "Civil services", icon: Landmark },
  { name: "SSC", sub: "Government jobs", icon: ShieldCheck },
  { name: "Banking", sub: "IBPS, SBI", icon: Briefcase },
  { name: "College Books", sub: "University", icon: GraduationCap },
];

function Index() {
  return (
    <>
      <section className="container-page grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-accent-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Your Books. Someone's Next Beginning.
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            Find Your Next Book at a Better Price.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Buy used textbooks and exam prep books directly from students who've finished with them —
            and pass yours on when you're done.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex max-w-lg overflow-hidden rounded-lg border bg-card shadow-soft">
            <label className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Try “HC Verma” or “NCERT Class 12 Physics”" className="h-12 w-full bg-transparent text-sm outline-none" />
            </label>
            <Link to="/buy" className="m-1.5 inline-flex items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Search
            </Link>
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/buy" className="inline-flex items-center gap-2 rounded-md bg-teal px-5 py-3 text-sm font-medium text-teal-foreground transition hover:opacity-90">
              Explore Books <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/sell" className="inline-flex items-center rounded-md border bg-card px-5 py-3 text-sm font-medium text-foreground transition hover:bg-secondary">
              Sell Your Books
            </Link>
          </div>
        </div>
        <div className="relative">
          <img src={hero} alt="A stack of used academic textbooks on a desk" width={1280} height={1024} className="aspect-[5/4] w-full rounded-xl object-cover shadow-soft" />
          <div className="absolute -bottom-5 left-5 hidden rounded-lg border bg-card p-4 shadow-soft sm:block">
            <p className="text-xs text-muted-foreground">Students save up to</p>
            <p className="font-display text-2xl text-foreground">60% off MRP</p>
          </div>
        </div>
      </section>

      <Section title="Popular Categories" action={{ to: "/categories", label: "All categories" }}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map(({ name, sub, icon: Icon }) => (
            <Link key={name} to="/buy" className="group rounded-lg border bg-card p-5 transition hover:-translate-y-0.5 hover:border-ring hover:shadow-soft">
              <Icon className="h-6 w-6 text-teal" />
              <p className="mt-4 font-medium text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </Link>
          ))}
        </div>
      </Section>

      <ListingsSection title="Recently Listed Books" />
      <ListingsSection title="Best Deals" deals />

      <Section title="How It Works">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Search, t: "Find a Book", d: "Search by title, author, ISBN or exam and filter by condition, price and city." },
            { icon: MessageCircle, t: "Connect with a Student Seller", d: "See the seller's prep background and ratings, then reach out with questions." },
            { icon: Wallet, t: "Purchase at an Affordable Price", d: "Pay a fraction of MRP and get the exact copy you were shown." },
          ].map(({ icon: Icon, t, d }, i) => (
            <div key={t} className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-teal" />
                <span className="font-display text-3xl text-border">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-semibold text-foreground">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="container-page mt-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-primary p-10 text-primary-foreground md:flex-row md:items-center">
          <div>
            <Library className="h-7 w-7 opacity-80" />
            <h2 className="mt-4 font-display text-3xl">Finished your prep? Pass it on.</h2>
            <p className="mt-2 max-w-lg opacity-80">List your used books in minutes and help the next student start strong.</p>
          </div>
          <Link to="/sell" className="inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary">
            Sell Your Books <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function Section({ title, action, children }: { title: string; action?: { to: "/buy" | "/categories"; label: string }; children: React.ReactNode }) {
  return (
    <section className="container-page mt-16">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="font-display text-2xl text-foreground sm:text-3xl">{title}</h2>
        {action && (
          <Link to={action.to} className="text-sm font-medium text-teal hover:underline">{action.label}</Link>
        )}
      </div>
      {children}
    </section>
  );
}

function ListingsSection({ title, deals }: { title: string; deals?: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ["home-listings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select(LISTING_SELECT).eq("status", "active").order("created_at", { ascending: false }).limit(40);
      if (error) throw error;
      return withImageUrls(data as unknown as Omit<ListingRow, "imageUrls">[]);
    },
  });
  const rows = deals
    ? [...(data ?? [])].filter((l) => discountPct(l.mrp, l.price) >= 30).sort((a, b) => discountPct(b.mrp, b.price) - discountPct(a.mrp, a.price)).slice(0, 4)
    : (data ?? []).slice(0, 8);
  return (
    <Section title={title} action={{ to: "/buy", label: "View all" }}>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{rows.map((l) => <ListingCard key={l.id} l={l} />)}</div>
      ) : (
        <EmptyListings />
      )}
    </Section>
  );
}

function EmptyListings() {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed bg-card px-6 py-10 text-center">
      <BookOpen className="h-6 w-6 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium text-foreground">No books listed yet</p>
      <p className="mt-1 text-sm text-muted-foreground">Be the first student to list a book here.</p>
      <Link to="/sell" className="mt-4 text-sm font-medium text-teal hover:underline">List a book</Link>
    </div>
  );
}
