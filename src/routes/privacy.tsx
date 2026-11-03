import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Book For Sale" },
      { name: "description", content: "How we protect your data." },
      { property: "og:title", content: "Privacy Policy — Book For Sale" },
      { property: "og:description", content: "How we protect your data." },
    ],
  }),
  component: () => <ComingSoon title="Privacy Policy" description="How we protect your data." />,
});
