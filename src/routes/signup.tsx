import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Book For Sale" },
      { name: "description", content: "Join the student book marketplace." },
      { property: "og:title", content: "Create account — Book For Sale" },
      { property: "og:description", content: "Join the student book marketplace." },
    ],
  }),
  component: () => <ComingSoon title="Create account" description="Join the student book marketplace." />,
});
