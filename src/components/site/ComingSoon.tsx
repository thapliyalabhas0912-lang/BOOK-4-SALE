import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <section className="container-page py-24">
      <div className="mx-auto max-w-xl rounded-xl border bg-card p-10 text-center shadow-soft">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary">
          <BookOpen className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl text-foreground">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <p className="mt-6 text-sm text-muted-foreground">
          This section is being built in the next phase of Book For Sale.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Back to home
        </Link>
      </div>
    </section>
  );
}
