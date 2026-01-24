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
    <nav className="font-sans">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
        On this page
      </h3>
      <ul className="space-y-2 text-sm">
        {headings.map(heading => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "ml-4" : ""}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                activeId === heading.id
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-600 dark:text-gray-400"
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
