/**
 * SEO/GEO Structuring Module
 *
 * Transforms raw content into AI-optimized blog structure based on:
 * - AIclicks guidelines by Rokas Stankevicius
 * - Featured snippet optimization
 * - Conversational search patterns (ChatGPT, Perplexity, etc.)
 */

export interface ExistingPost {
  title: string;
  url: string;
  description: string;
  categories: string[];
}

export interface RawContent {
  topic: string;
  content: string;
  sources?: string[];
  targetKeywords?: string[];
  existingPosts?: ExistingPost[];
}

export interface StructuredPost {
  title: string; // H1 as a question
  excerpt: string; // For feeds and search (max 200 chars)
  directAnswer: string; // 1-2 sentence answer (max 280 chars)
  tldr: string[]; // Key bullet points
  body: string; // Markdown formatted body
  suggestedCategories: string[];
  suggestedCta: {
    text: string;
    url: string;
  };
  imagePrompt: string; // Prompt for hero image generation
  keywords: string[]; // SEO keywords for meta tags
  sources: { title: string; url: string; domain: string }[]; // Authoritative citations
}

/**
 * System prompt for SEO/GEO structuring
 */
export const SEO_STRUCTURE_PROMPT = `You are an SEO/GEO content optimization expert. Your task is to restructure blog content for maximum visibility in both traditional search engines AND AI assistants (ChatGPT, Perplexity, Claude, etc.).

## Your Output Structure

Transform the input content into this exact JSON structure:

{
  "title": "Question-format H1 that matches how people ask AI assistants",
  "excerpt": "Compelling 150-200 char summary for blog feeds",
  "directAnswer": "1-2 sentence direct answer to the main question (max 280 chars)",
  "tldr": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"],
  "body": "Full markdown body content (see structure below)",
  "suggestedCategories": ["category1", "category2"],
  "suggestedCta": {
    "text": "Action-oriented CTA text",
    "url": "/suggested-path"
  },
  "imagePrompt": "Detailed prompt for generating a hero image",
  "keywords": ["primary keyword", "secondary keyword", "long-tail keyword phrase", "related term", "search intent keyword"],
  "sources": [
    {"title": "Source Title", "url": "https://example.com/report", "domain": "Publisher Name"}
  ]
}

## Body Structure Rules

The body markdown MUST follow this structure:

### 1. Start with H2 sections, NOT H1 (H1 is the title)

### 2. Each H2 answers a variation of the main question:
- "How does [topic] work?"
- "Why is [topic] important?"
- "What are the steps to [action]?"
- "What are the benefits of [topic]?"

### 3. Format for AI readability:
- One idea per section
- Short paragraphs (2-3 sentences max)
- Use bullet lists for multiple points
- Include data, statistics, or definitions that can be cited

### 4. Include citable content:
- Link to authoritative sources where relevant
- Use specific numbers and data points
- Provide clear definitions for key terms

### 5. Internal Linking (IMPORTANT):
- When existing blog posts are provided, link to 2-4 relevant posts naturally within the content
- Use markdown link format: [anchor text](url)
- Place links where they add value to the reader (not forced)
- Choose anchor text that describes what the linked post is about
- Prioritize posts in the same or related categories

### 6. End with practical takeaways

## Title Rules (H1 = Question Format)

- H1 MUST be a natural question people type into AI assistants
- This is critical for AI citation — AI systems match user questions to content titles
- Examples:
  - "What Is an AI Voice Agent for Small Business?"
  - "How Much Does an AI Receptionist Cost?"
  - "Why Should SMBs Invest in Voice AI?"
- Avoid keyword-stuffed titles
- Keep under 60 characters for SEO

## H2 Heading Rules (Hybrid Format)

- Use question format for high-intent sections: "How much does it cost?", "What are the benefits?"
- Use statement format for explanatory sections: "Key Features to Look For", "Implementation Timeline"
- Each H2 should cover ONE topic that could be extracted independently by AI systems

## Direct Answer Rules

- Must directly answer the title question
- 1-2 sentences only
- Should be quotable by AI assistants
- Max 280 characters

## TL;DR Rules

- 3-5 bullet points
- Each point is a complete, standalone insight
- Skimmable and quotable
- Cover the main takeaways

## Image Prompt Rules

Create a prompt that:
- Describes a conceptual/abstract visual representing the topic
- Avoids text in images
- Uses professional, modern aesthetic
- Works as a blog hero image (landscape format)
- Mentions style: "professional blog header, modern, clean design"

## Keywords Rules

Generate 5-8 relevant SEO keywords that:
- Include the primary topic and key concepts
- Mix short-tail (1-2 words) and long-tail (3-4 words) keywords
- Reflect actual search intent (how people search, not just topic words)
- Include related terms and synonyms
- Example for "AI Voice Agents for HVAC": ["AI voice agents", "HVAC automation", "AI receptionist", "automated phone system", "voice AI for service businesses"]
- Avoid keyword stuffing or repetition

## Sources Rules

Generate 3-5 authoritative citations that:
- Support claims made in the article with real, credible sources
- Include industry reports, research studies, and authoritative publications
- Each source needs: title (what the source is), url (link), domain (publisher name e.g. "Gartner", "McKinsey")
- AI systems follow citation chains — citing authoritative sources makes YOUR content more likely to be cited

Respond ONLY with the JSON object, no additional text.`;

/**
 * Validate the structured post output
 */
export function validateStructuredPost(post: unknown): post is StructuredPost {
  if (!post || typeof post !== "object") return false;

  const p = post as Record<string, unknown>;

  return (
    typeof p.title === "string" &&
    p.title.length > 0 &&
    p.title.length <= 100 &&
    typeof p.excerpt === "string" &&
    p.excerpt.length > 0 &&
    p.excerpt.length <= 200 &&
    typeof p.directAnswer === "string" &&
    p.directAnswer.length > 0 &&
    p.directAnswer.length <= 280 &&
    Array.isArray(p.tldr) &&
    p.tldr.length >= 3 &&
    p.tldr.every((item) => typeof item === "string") &&
    typeof p.body === "string" &&
    p.body.length > 0 &&
    Array.isArray(p.suggestedCategories) &&
    typeof p.suggestedCta === "object" &&
    p.suggestedCta !== null &&
    typeof (p.suggestedCta as Record<string, unknown>).text === "string" &&
    typeof p.imagePrompt === "string" &&
    Array.isArray(p.keywords) &&
    p.keywords.length >= 3 &&
    p.keywords.every((item) => typeof item === "string") &&
    Array.isArray(p.sources) &&
    p.sources.every(
      (s) =>
        typeof s === "object" &&
        s !== null &&
        typeof (s as Record<string, unknown>).title === "string" &&
        typeof (s as Record<string, unknown>).url === "string"
    )
  );
}

/**
 * Parse the AI response into a structured post
 */
export function parseStructuredPost(response: string): StructuredPost {
  // Try to extract JSON from the response
  let jsonStr = response.trim();

  // Handle markdown code blocks
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3);
  }

  jsonStr = jsonStr.trim();

  const parsed = JSON.parse(jsonStr);

  if (!validateStructuredPost(parsed)) {
    throw new Error("Invalid structured post format");
  }

  return parsed;
}

/**
 * Build the user prompt for structuring content
 */
export function buildStructuringPrompt(input: RawContent): string {
  let prompt = `## Topic\n${input.topic}\n\n## Content\n${input.content}`;

  if (input.sources && input.sources.length > 0) {
    prompt += `\n\n## Sources to Reference\n${input.sources.map((s) => `- ${s}`).join("\n")}`;
  }

  if (input.targetKeywords && input.targetKeywords.length > 0) {
    prompt += `\n\n## Target Keywords (incorporate naturally)\n${input.targetKeywords.join(", ")}`;
  }

  if (input.existingPosts && input.existingPosts.length > 0) {
    prompt += `\n\n## Existing Blog Posts (link to 2-4 relevant ones)\n`;
    prompt += input.existingPosts
      .map((p) => `- "${p.title}" (${p.url}) - ${p.description.slice(0, 100)}...`)
      .join("\n");
  }

  return prompt;
}
