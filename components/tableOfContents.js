"use client";

import { useEffect, useState } from "react";

// Helper to generate slug from text (matches portabletext.js)
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Extract headings from Sanity portable text body
function extractHeadings(body) {
  if (!body) return [];

  return body
    .filter(block => block._type === "block" && (block.style === "h2" || block.style === "h3"))
    .map(block => {
      const text = block.children?.map(child => child.text).join("") || "";
      return {
        text,
        level: block.style === "h2" ? 2 : 3,
        id: slugify(text)
      };
    });
}

export default function TableOfContents({ body }) {
  const [activeId, setActiveId] = useState("");
  const headings = extractHeadings(body);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="bg-white dark:bg-dark-background border border-near-black/10 dark:border-white/10 rounded-2xl p-6">
      <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-near-black/40 dark:text-white/40 mb-4">
        In This Article
      </h3>
      <ul className="space-y-2 text-sm">
        {headings.map(heading => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "pl-4" : ""}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition-colors ${
                activeId === heading.id
                  ? "text-orange font-semibold border-l-2 border-orange pl-3"
                  : heading.level === 3
                    ? "text-near-black/50 dark:text-white/50 hover:text-near-black dark:hover:text-white"
                    : "text-near-black/70 dark:text-white/70 hover:text-near-black dark:hover:text-white"
              }`}
              onClick={e => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  setActiveId(heading.id);
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
