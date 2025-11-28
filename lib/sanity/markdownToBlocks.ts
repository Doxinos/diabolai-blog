import { nanoid } from "nanoid";

/**
 * Sanity block content types
 */
interface SanityBlock {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

interface TextBlock extends SanityBlock {
  _type: "block";
  style: "normal" | "h2" | "h3" | "h4" | "blockquote";
  children: Array<{
    _type: "span";
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: string;
    _key: string;
    href?: string;
  }>;
  listItem?: "bullet" | "number";
  level?: number;
}

/**
 * Generate a unique key for Sanity blocks
 */
function genKey(): string {
  return nanoid(12);
}

/**
 * Parse inline marks (bold, italic, code, links) from text
 */
function parseInlineMarks(
  text: string
): { children: TextBlock["children"]; markDefs: TextBlock["markDefs"] } {
  const children: TextBlock["children"] = [];
  const markDefs: NonNullable<TextBlock["markDefs"]> = [];

  // Regex patterns for inline formatting
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, mark: "strong" },
    { regex: /\*(.+?)\*/g, mark: "em" },
    { regex: /`(.+?)`/g, mark: "code" },
    { regex: /\[(.+?)\]\((.+?)\)/g, mark: "link" },
  ];

  // Simple approach: process text sequentially
  let remaining = text;
  let lastIndex = 0;

  // Combined regex to find all inline elements
  const combinedRegex =
    /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g;
  let match;

  const matches: Array<{
    index: number;
    length: number;
    text: string;
    marks: string[];
    href?: string;
  }> = [];

  // Reset and find all matches
  remaining = text;

  // Find bold
  const boldRegex = /\*\*(.+?)\*\*/g;
  while ((match = boldRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      text: match[1],
      marks: ["strong"],
    });
  }

  // Find italic (but not bold)
  const italicRegex = /(?<!\*)\*([^*]+?)\*(?!\*)/g;
  while ((match = italicRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      text: match[1],
      marks: ["em"],
    });
  }

  // Find code
  const codeRegex = /`(.+?)`/g;
  while ((match = codeRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      text: match[1],
      marks: ["code"],
    });
  }

  // Find links
  const linkRegex = /\[(.+?)\]\((.+?)\)/g;
  while ((match = linkRegex.exec(text)) !== null) {
    const linkKey = genKey();
    markDefs.push({
      _type: "link",
      _key: linkKey,
      href: match[2],
    });
    matches.push({
      index: match.index,
      length: match[0].length,
      text: match[1],
      marks: [linkKey],
    });
  }

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Build children array
  let cursor = 0;
  for (const m of matches) {
    // Add text before this match
    if (m.index > cursor) {
      const beforeText = text.slice(cursor, m.index);
      if (beforeText) {
        children.push({
          _type: "span",
          _key: genKey(),
          text: beforeText,
          marks: [],
        });
      }
    }
    // Add the matched text with marks
    children.push({
      _type: "span",
      _key: genKey(),
      text: m.text,
      marks: m.marks,
    });
    cursor = m.index + m.length;
  }

  // Add remaining text
  if (cursor < text.length) {
    children.push({
      _type: "span",
      _key: genKey(),
      text: text.slice(cursor),
      marks: [],
    });
  }

  // If no matches, just return plain text
  if (children.length === 0) {
    children.push({
      _type: "span",
      _key: genKey(),
      text: text,
      marks: [],
    });
  }

  return { children, markDefs: markDefs.length > 0 ? markDefs : undefined };
}

/**
 * Create a text block
 */
function createTextBlock(
  text: string,
  style: TextBlock["style"] = "normal",
  listItem?: "bullet" | "number",
  level?: number
): TextBlock {
  const { children, markDefs } = parseInlineMarks(text);

  return {
    _type: "block",
    _key: genKey(),
    style,
    children,
    ...(markDefs && { markDefs }),
    ...(listItem && { listItem }),
    ...(level && { level }),
  };
}

/**
 * Create a code block
 */
function createCodeBlock(code: string, language?: string): SanityBlock {
  return {
    _type: "code",
    _key: genKey(),
    language: language || "text",
    code: code.trim(),
  };
}

/**
 * Convert markdown content to Sanity block content array
 */
export function markdownToBlocks(markdown: string): SanityBlock[] {
  const blocks: SanityBlock[] = [];
  const lines = markdown.split("\n");

  let i = 0;
  let inCodeBlock = false;
  let codeBlockContent = "";
  let codeBlockLanguage = "";

  while (i < lines.length) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLanguage = line.slice(3).trim();
        codeBlockContent = "";
      } else {
        inCodeBlock = false;
        blocks.push(createCodeBlock(codeBlockContent, codeBlockLanguage));
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += (codeBlockContent ? "\n" : "") + line;
      i++;
      continue;
    }

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Headers
    if (line.startsWith("#### ")) {
      blocks.push(createTextBlock(line.slice(5), "h4"));
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push(createTextBlock(line.slice(4), "h3"));
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(createTextBlock(line.slice(3), "h2"));
      i++;
      continue;
    }
    // Skip H1 as it should be the title
    if (line.startsWith("# ")) {
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      blocks.push(createTextBlock(line.slice(2), "blockquote"));
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      blocks.push(createTextBlock(line.slice(2), "normal", "bullet", 1));
      i++;
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\. /)) {
      const text = line.replace(/^\d+\. /, "");
      blocks.push(createTextBlock(text, "normal", "number", 1));
      i++;
      continue;
    }

    // Regular paragraph
    blocks.push(createTextBlock(line, "normal"));
    i++;
  }

  return blocks;
}

/**
 * Convert Sanity blocks back to markdown (for editing)
 */
export function blocksToMarkdown(blocks: SanityBlock[]): string {
  const lines: string[] = [];

  for (const block of blocks) {
    if (block._type === "block") {
      const textBlock = block as TextBlock;
      let text = "";

      // Reconstruct text from children
      for (const child of textBlock.children || []) {
        let spanText = child.text;

        // Apply marks
        if (child.marks && child.marks.length > 0) {
          for (const mark of child.marks) {
            if (mark === "strong") {
              spanText = `**${spanText}**`;
            } else if (mark === "em") {
              spanText = `*${spanText}*`;
            } else if (mark === "code") {
              spanText = `\`${spanText}\``;
            } else if (textBlock.markDefs) {
              // Check if it's a link
              const linkDef = textBlock.markDefs.find((d) => d._key === mark);
              if (linkDef && linkDef.href) {
                spanText = `[${spanText}](${linkDef.href})`;
              }
            }
          }
        }
        text += spanText;
      }

      // Apply block style
      if (textBlock.listItem === "bullet") {
        lines.push(`- ${text}`);
      } else if (textBlock.listItem === "number") {
        lines.push(`1. ${text}`);
      } else {
        switch (textBlock.style) {
          case "h2":
            lines.push(`## ${text}`);
            break;
          case "h3":
            lines.push(`### ${text}`);
            break;
          case "h4":
            lines.push(`#### ${text}`);
            break;
          case "blockquote":
            lines.push(`> ${text}`);
            break;
          default:
            lines.push(text);
        }
      }
      lines.push("");
    } else if (block._type === "code") {
      const lang = (block.language as string) || "";
      lines.push(`\`\`\`${lang}`);
      lines.push(block.code as string);
      lines.push("```");
      lines.push("");
    }
  }

  return lines.join("\n").trim();
}
