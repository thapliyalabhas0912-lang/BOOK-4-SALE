import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Book For Sale" },
      { name: "description", content: "Get in touch with the Book For Sale team." },
      { property: "og:title", content: "Contact — Book For Sale" },
      { property: "og:description", content: "Get in touch with the Book For Sale team." },
    ],
  }),
  component: () => <ComingSoon title="Contact" description="Get in touch with the Book For Sale team." />,
});
