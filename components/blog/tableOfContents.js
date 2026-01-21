"use client";

import { useState, useEffect, useRef } from "react";

// Helper to generate slug from text
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Extract headings from PortableText body
export function extractHeadings(body) {
  if (!body) return [];

  const headings = [];

  body.forEach((block) => {
    if (block._type === "block" && block.style?.match(/^h[2-3]$/)) {
      const text = block.children
        ?.map((child) => child.text)
        .join("") || "";

      if (text.trim()) {
        headings.push({
          _key: block._key,
          text: text.trim(),
          level: parseInt(block.style.replace("h", "")),
          id: slugify(text.trim()),
        });
      }
    }
  });

  return headings;
}

export default function TableOfContents({ body, tldr, title }) {
  const [activeId, setActiveId] = useState("");
  const headings = extractHeadings(body);
  const navRef = useRef(null);

  // Scroll active TOC item into view within the nav
  useEffect(() => {
    if (activeId && navRef.current) {
      const activeLink = navRef.current.querySelector(`a[href="#${activeId}"]`);
      if (activeLink) {
        activeLink.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    // Observe all heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Also observe TL;DR if present
    const tldrElement = document.getElementById("tldr");
    if (tldrElement) {
      observer.observe(tldrElement);
    }

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav ref={navRef} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {/* TL;DR link if present */}
          {tldr && tldr.length > 0 && (
            <a
              href="#tldr"
              onClick={(e) => handleClick(e, "tldr")}
              className={`block py-2 text-sm transition-colors ${
                activeId === "tldr"
                  ? "font-semibold text-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {title ? `${title} TL;DR` : "TL;DR"}
            </a>
          )}

          {/* Headings */}
          {headings.map((heading, index) => (
            <a
              key={heading._key || index}
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block py-2 text-sm transition-colors ${
                heading.level === 3 ? "pl-4" : ""
              } ${
                activeId === heading.id
                  ? "font-semibold text-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {heading.text}
            </a>
          ))}
    </nav>
  );
}
