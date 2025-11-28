# Blog Publishing Pipeline

## Overview

Automated pipeline for publishing SEO/GEO-optimized blog posts to Sanity CMS.

```
┌─────────────────┐    ┌─────────────────┐    ┌──────────┐    ┌─────────────────┐    ┌──────────┐    ┌─────────────┐
│  n8n Automation │ → │   SEO/GEO AI    │ → │   YOU    │ → │   Image AI      │ → │   YOU    │ → │   Publish   │
│  or Claude      │    │   Structuring   │    │  REVIEW  │    │   (Replicate)   │    │  REVIEW  │    │  to Sanity  │
└─────────────────┘    └─────────────────┘    └──────────┘    └─────────────────┘    └──────────┘    └─────────────┘
```

---

## AI SEO/GEO Blog Structure

Based on guidelines from [AIclicks](https://aiclicks.io/guide) by Rokas Stankevicius.

### Required Structure (Top to Bottom)

#### 1. H1: Main Question
- Focus on natural questions people type into ChatGPT/AI assistants
- Don't chase keywords - focus on conversational queries
- Example: "What is the best AI visibility platform?"

#### 2. Author Credibility & Freshness
- **Reviewed by**: Author name/credentials
- **Last updated**: Date (critical for AI models)
- AI models prefer up-to-date information, reviews, and expert signals

#### 3. Direct Answer (1-2 sentences)
- Immediate solution to the main question
- Start every page/section with this
- Helps win featured snippets, Perplexity pulls, and ChatGPT responses

#### 4. TL;DR Summary
- Recap key points in clear, skimmable format
- Use short sentences or simple bullets
- Gives AI engines and readers a concise version of the page

#### 5. Visuals + Citable Content
- **Visuals**: Diagrams, step-by-step visuals, basic charts
- AI models read alt text and use visuals to interpret structure
- **Citable content**: Link to reliable sources
- LLMs use citations to validate information and expand answers
- Include: Data, definitions, clear explanations

#### 6. AI-Friendly Formatted Body
- One idea per section
- Clean H2/H3 headings
- Keep structure simple
- Think like a user asking variations:
  - How does this work?
  - Why is it important?
  - What steps should I follow?

#### 7. Call to Action
- Invite users to take the next step
- Examples: Try a tool, read a related guide, leave feedback
- Helps define the intent of your page

---

## Sanity Schema Fields

The post schema includes these SEO/GEO optimized fields:

| Field | Type | Purpose |
|-------|------|---------|
| `title` | string | H1 - Main question |
| `excerpt` | text (max 200) | Blog feeds & search results |
| `directAnswer` | text (max 280) | Featured snippet answer |
| `tldr` | array of strings | Bullet point takeaways |
| `author` | reference | Credibility signal |
| `publishedAt` | datetime | Original publish date |
| `updatedAt` | datetime | Freshness signal |
| `mainImage` | image + alt | Hero image with SEO alt text |
| `categories` | array of refs | Topic categorization |
| `body` | blockContent | Main content (H2/H3, lists, tables, code, embeds) |
| `cta` | object | Call to action (text + URL) |
| `featured` | boolean | Featured post flag |

---

## Image Generation

Using **Replicate** with **Flux** model for hero images.

### Setup
1. Train a LoRA on Replicate with 10-20 brand style images (~$2, <2 min)
2. Use trigger word in prompts (e.g., "diabolai-style")
3. Generate via API

### Training Requirements
- 10-20 high-quality images representing brand style
- Minimum 1024x1024px resolution
- Various angles, lighting, contexts
- No compression artifacts

---

## n8n Integration

Content automation workflow in n8n pulls trending content from:
- YouTube
- Reddit
- Twitter

And generates draft posts that feed into this pipeline.

### n8n MCP Server
Configured for Claude Code access:
- Instance: `https://diabol.app.n8n.cloud`
- MCP Server: `@leonardsellem/n8n-mcp-server`

---

## Environment Variables Required

Add these to `.env.local`:

```bash
# Sanity - for publishing posts
SANITY_WRITE_TOKEN=your_sanity_write_token

# API Security - for n8n webhook authentication
PUBLISH_API_SECRET=your_random_secret_string

# Replicate - for image generation
REPLICATE_API_TOKEN=your_replicate_token
```

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `SANITY_WRITE_TOKEN` | Publish posts | [sanity.io/manage](https://sanity.io/manage) → Project → API → Tokens |
| `PUBLISH_API_SECRET` | Secure the publish API | Generate a random string (e.g., `openssl rand -hex 32`) |
| `REPLICATE_API_TOKEN` | Image generation | [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens) |

---

## File Structure

```
lib/
├── sanity/
│   ├── client.ts           # Sanity read client
│   ├── writeClient.ts      # Sanity write client (NEW)
│   ├── publishPost.ts      # Post creation functions (NEW)
│   ├── markdownToBlocks.ts # Markdown → Sanity converter (NEW)
│   ├── config.ts           # Sanity configuration
│   ├── groq.js             # GROQ queries
│   └── schemas/
│       ├── post.js         # Post schema (SEO/GEO fields added)
│       ├── author.js       # Author schema
│       ├── category.js     # Category schema
│       └── blockContent.js # Rich text schema
└── ai/
    └── seoStructure.ts     # SEO/GEO structuring prompts (NEW)

app/api/
└── publish/
    └── route.ts            # Publish API endpoint (NEW)
```

---

## API Usage

### Publish Endpoint

**POST** `/api/publish`

Headers:
```
Authorization: Bearer YOUR_PUBLISH_API_SECRET
Content-Type: application/json
```

Body:
```json
{
  "title": "What is the best way to automate blog posts?",
  "excerpt": "Learn how to automate your blog publishing workflow with AI.",
  "directAnswer": "The best way to automate blog posts is using an AI pipeline that handles content structuring, image generation, and CMS publishing.",
  "tldr": [
    "Use AI to structure content for SEO/GEO",
    "Generate hero images automatically",
    "Publish directly to your CMS via API"
  ],
  "body": "## How Does Blog Automation Work?\n\nBlog automation combines...",
  "authorSlug": "pete",
  "categorySlug": ["ai", "automation"],
  "imageUrl": "https://example.com/generated-image.jpg",
  "imageAlt": "Blog automation workflow diagram",
  "cta": {
    "text": "Try our automation tool",
    "url": "/contact"
  },
  "featured": false
}
```

Response:
```json
{
  "success": true,
  "postId": "abc123",
  "slug": "what-is-the-best-way-to-automate-blog-posts",
  "url": "/post/what-is-the-best-way-to-automate-blog-posts"
}
```

### n8n Integration

In your n8n workflow, add an **HTTP Request** node:
- Method: POST
- URL: `https://your-domain.com/api/publish`
- Authentication: Header Auth
  - Name: `Authorization`
  - Value: `Bearer YOUR_PUBLISH_API_SECRET`
- Body: JSON with the fields above

---

## Next Steps

1. [ ] Get Sanity write token and add to `.env.local`
2. [ ] Generate PUBLISH_API_SECRET and add to `.env.local`
3. [ ] Get Replicate API token
4. [ ] Train Flux LoRA with brand images on Replicate
5. [x] Build Sanity write client
6. [x] Build markdown → Sanity block converter
7. [x] Build SEO/GEO structuring module
8. [x] Create API endpoint for n8n integration
9. [ ] Connect n8n workflow to publish endpoint
10. [ ] Test full pipeline
