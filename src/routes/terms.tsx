import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — Book For Sale" },
      { name: "description", content: "The rules of the marketplace." },
      { property: "og:title", content: "Terms and Conditions — Book For Sale" },
      { property: "og:description", content: "The rules of the marketplace." },
    ],
  }),
  component: () => <ComingSoon title="Terms and Conditions" description="The rules of the marketplace." />,
});
