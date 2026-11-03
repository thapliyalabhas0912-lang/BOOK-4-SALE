import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Book For Sale" },
      { name: "description", content: "Explore books by exam and class." },
      { property: "og:title", content: "Categories — Book For Sale" },
      { property: "og:description", content: "Explore books by exam and class." },
    ],
  }),
  component: () => <ComingSoon title="Categories" description="Explore books by exam and class." />,
});
