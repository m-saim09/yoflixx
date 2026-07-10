import { createFileRoute } from "@tanstack/react-router";
import { GlobalPresence } from "@/components/global-presence";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yoflix — Global eCommerce Growth Partner" },
      {
        name: "description",
        content:
          "Yoflix helps eCommerce sellers scale across global marketplaces with expert account management, optimized listings, and growth strategies.",
      },
      { property: "og:title", content: "Yoflix — Global eCommerce Growth Partner" },
      {
        property: "og:description",
        content:
          "Expand across USA, UK, EU, UAE, KSA and Australia with a partner built for global marketplace growth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalPresence />
    </main>
  );
}
