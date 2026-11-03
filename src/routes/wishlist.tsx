import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Book For Sale" },
      { name: "description", content: "Books you've saved for later." },
      { property: "og:title", content: "Wishlist — Book For Sale" },
      { property: "og:description", content: "Books you've saved for later." },
    ],
  }),
  component: () => <ComingSoon title="Wishlist" description="Books you've saved for later." />,
});
