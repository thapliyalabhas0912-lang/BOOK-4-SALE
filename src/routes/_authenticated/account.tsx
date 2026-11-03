import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LISTING_SELECT, inr, withImageUrls, type ListingRow } from "@/lib/listings";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My account — Book For Sale" },
      { name: "description", content: "Manage your profile and book listings." },
      { property: "og:title", content: "My account — Book For Sale" },
      { property: "og:description", content: "Manage your profile and book listings." },
    ],
  }),
  component: Account,
});

function Account() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const profile = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user.id).single()).data,
  });
  const listings = useQuery({
    queryKey: ["my-listings", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select(LISTING_SELECT).eq("seller_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return withImageUrls(data as unknown as Omit<ListingRow, "imageUrls">[]);
    },
  });

  const setStatus = async (id: string, status: ListingRow["status"]) => {
    const { error } = await supabase.from("listings").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["my-listings"] });
  };
  const remove = async (l: ListingRow) => {
    if (!confirm(`Delete “${l.books.title}”?`)) return;
    const paths = l.listing_images.map((i) => i.storage_path);
    const { error } = await supabase.from("listings").delete().eq("id", l.id);
    if (error) { toast.error(error.message); return; }
    if (paths.length) await supabase.storage.from("listing-images").remove(paths);
    toast.success("Listing deleted");
    qc.invalidateQueries({ queryKey: ["my-listings"] });
  };

  return (
    <section className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Hi, {profile.data?.full_name || "there"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}{profile.data?.city ? ` · ${profile.data.city}` : ""}</p>
        </div>
        <Button asChild><Link to="/sell">List a book</Link></Button>
      </div>

      <h2 className="mt-10 font-display text-2xl text-foreground">My listings</h2>
      {listings.isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      ) : listings.error ? (
        <p className="mt-4 text-sm text-destructive">Couldn't load your listings.</p>
      ) : !listings.data?.length ? (
        <p className="mt-4 rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">You haven't listed any books yet.</p>
      ) : (
        <div className="mt-4 divide-y rounded-lg border bg-card">
          {listings.data.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="h-16 w-12 shrink-0 overflow-hidden rounded bg-secondary">
                {l.imageUrls[0] && <img src={l.imageUrls[0]} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link to="/books/$id" params={{ id: l.id }} className="font-medium text-foreground hover:underline">{l.books.title}</Link>
                <p className="text-xs text-muted-foreground">{inr(l.price)} · <span className="capitalize">{l.status}</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                {l.status === "active" && <Button size="sm" variant="outline" onClick={() => setStatus(l.id, "paused")}>Pause</Button>}
                {l.status === "paused" && <Button size="sm" variant="outline" onClick={() => setStatus(l.id, "active")}>Resume</Button>}
                {l.status !== "sold" && <Button size="sm" variant="outline" onClick={() => setStatus(l.id, "sold")}>Mark sold</Button>}
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(l)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
