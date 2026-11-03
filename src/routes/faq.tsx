import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — Book For Sale" },
      { name: "description", content: "Answers to common questions." },
      { property: "og:title", content: "FAQs — Book For Sale" },
      { property: "og:description", content: "Answers to common questions." },
    ],
  }),
  component: () => <ComingSoon title="FAQs" description="Answers to common questions." />,
});
