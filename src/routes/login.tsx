import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Book For Sale" },
      { name: "description", content: "Sign in to your Book For Sale account." },
      { property: "og:title", content: "Log in — Book For Sale" },
      { property: "og:description", content: "Sign in to your Book For Sale account." },
    ],
  }),
  component: () => <ComingSoon title="Log in" description="Sign in to your Book For Sale account." />,
});
