import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Book For Sale" },
      { name: "description", content: "Why we built Book For Sale." },
      { property: "og:title", content: "About Us — Book For Sale" },
      { property: "og:description", content: "Why we built Book For Sale." },
    ],
  }),
  component: () => <ComingSoon title="About Us" description="Why we built Book For Sale." />,
});
