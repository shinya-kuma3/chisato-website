import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // 公開前は全ページを拒否。公開時は disallow を ["/console/", "/api/"] に変更する
      disallow: "/",
    },
  };
}
