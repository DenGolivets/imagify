import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/studio", "/generate", "/advisor", "/pricing"],
        disallow: ["/admin/", "/api/", "/profile/", "/wardrobe/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://imagify.app"}/sitemap.xml`,
  };
}
