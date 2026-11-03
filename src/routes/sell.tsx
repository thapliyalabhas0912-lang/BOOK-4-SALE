import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell Books — Book For Sale" },
      { name: "description", content: "List your used books and help another student." },
      { property: "og:title", content: "Sell Books — Book For Sale" },
      { property: "og:description", content: "List your used books and help another student." },
    ],
  }),
  component: () => <ComingSoon title="Sell Books" description="List your used books and help another student." />,
});
