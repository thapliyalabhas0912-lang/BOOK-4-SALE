import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/buy")({
  head: () => ({
    meta: [
      { title: "Buy Books — Book For Sale" },
      { name: "description", content: "Browse second-hand books from students across India." },
      { property: "og:title", content: "Buy Books — Book For Sale" },
      { property: "og:description", content: "Browse second-hand books from students across India." },
    ],
  }),
  component: () => <ComingSoon title="Buy Books" description="Browse second-hand books from students across India." />,
});
