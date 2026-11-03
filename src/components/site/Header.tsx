import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/buy", label: "Buy Books" },
  { to: "/sell", label: "Sell Books" },
  { to: "/categories", label: "Categories" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-display text-lg text-primary-foreground">
        B
      </span>
      <span className="font-display text-xl text-foreground">Book For Sale</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/buy" });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <form onSubmit={submit} className="ml-auto hidden max-w-sm flex-1 md:block">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, author, ISBN, exam…"
              className="h-10 w-full rounded-md border bg-secondary pl-9 pr-3 text-sm outline-none transition focus:border-ring focus:bg-background"
            />
          </label>
        </form>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link to="/wishlist" aria-label="Wishlist" className="rounded-md p-2 text-foreground hover:bg-secondary">
            <Heart className="h-5 w-5" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="rounded-md p-2 text-foreground hover:bg-secondary">
            <ShoppingBag className="h-5 w-5" />
          </Link>
          <Link to="/login" className="hidden rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary sm:inline-flex">
            Log in
          </Link>
          <Link to="/signup" className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:inline-flex">
            Sign up
          </Link>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="rounded-md p-2 lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-background lg:hidden">
          <div className="container-page flex flex-col py-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-sm text-foreground">
                {n.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="py-2 text-sm text-foreground">Log in</Link>
            <Link to="/signup" onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-primary">Sign up</Link>
          </div>
        </div>
      )}
    </header>
  );
}
