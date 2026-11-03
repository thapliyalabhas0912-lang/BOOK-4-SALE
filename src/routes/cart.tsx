import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Book For Sale" },
      { name: "description", content: "Books ready for checkout." },
      { property: "og:title", content: "Cart — Book For Sale" },
      { property: "og:description", content: "Books ready for checkout." },
    ],
  }),
  component: () => <ComingSoon title="Cart" description="Books ready for checkout." />,
});
