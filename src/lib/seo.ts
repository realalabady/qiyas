/**
 * SEO utilities and metadata management.
 * Handles Open Graph, structured data, and meta tags.
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  twitterHandle?: string;
  author?: string;
  canonical?: string;
}

/** Set HTML head metadata */
export function setSEOMetadata(metadata: SEOMetadata) {
  // Title
  document.title = metadata.title;
  updateMetaTag("og:title", metadata.title);
  updateMetaTag("twitter:title", metadata.title);

  // Description
  updateMetaTag("description", metadata.description);
  updateMetaTag("og:description", metadata.description);
  updateMetaTag("twitter:description", metadata.description);

  // Keywords
  if (metadata.keywords?.length) {
    updateMetaTag("keywords", metadata.keywords.join(", "));
  }

  // Open Graph
  if (metadata.ogImage) {
    updateMetaTag("og:image", metadata.ogImage);
    updateMetaTag("twitter:image", metadata.ogImage);
  }
  if (metadata.ogUrl) {
    updateMetaTag("og:url", metadata.ogUrl);
  }

  // Twitter
  if (metadata.twitterHandle) {
    updateMetaTag("twitter:creator", metadata.twitterHandle);
  }

  // Canonical
  if (metadata.canonical) {
    updateLinkTag("canonical", metadata.canonical);
  }
}

/** Generate JSON-LD structured data */
export function getStructuredData(type: "Quiz" | "FAQPage" | "Organization") {
  const baseUrl = window.location.origin;

  if (type === "Organization") {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Al-Maarefah",
      url: baseUrl,
      logo: `${baseUrl}/al-maarefah-icon.png`,
      sameAs: [
        "https://x.com/almaarefahh",
        "https://instagram.com/almaarefahh",
      ],
    };
  }

  if (type === "Quiz") {
    return {
      "@context": "https://schema.org",
      "@type": "Quiz",
      name: "Personality Quiz",
      description: "Take a fun personality quiz",
      inLanguage: "en-US",
    };
  }

  return {};
}

/** Add structured data to head */
export function addStructuredData(data: object) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.innerHTML = JSON.stringify(data);
  document.head.appendChild(script);
}

// Helper functions
function updateMetaTag(name: string, content: string) {
  let tag =
    document.querySelector(`meta[name="${name}"]`) ||
    document.querySelector(`meta[property="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    if (name.startsWith("og:") || name.startsWith("twitter:")) {
      tag.setAttribute("property", name);
    } else {
      tag.setAttribute("name", name);
    }
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function updateLinkTag(rel: string, href: string) {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

/** Generate sitemap XML */
export function generateSitemap(
  routes: Array<{ path: string; priority: number; changefreq: string }>,
) {
  const baseUrl = window.location.origin;
  const urls = routes
    .map(
      (route) => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
  `,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
