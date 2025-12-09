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
1. Get API token from [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Add to `.env.local`:
   ```
   REPLICATE_API_TOKEN=r8_xxxxx
   ```
3. Add same token to Vercel environment variables

### Usage

In your `draft-post.json`, use `imagePrompt` instead of `imageUrl`:

```json
{
  "imagePrompt": "Abstract visualization of AI automation, flowing data streams, blue gradient, minimalist",
  "imageAlt": "AI automation workflow"
}
```

The publish script will:
1. Generate image using Flux Schnell (~$0.003/image)
2. Upload to Sanity
3. Attach to blog post

### Available Models

| Model | Cost | Speed | Quality |
|-------|------|-------|---------|
| `schnell` | ~$0.003 | Fast | Good (default) |
| `dev` | ~$0.025 | Medium | Better |
| `pro` | ~$0.055 | Slower | Best |

### Custom LoRA (Optional - for brand consistency)
1. Train a LoRA on Replicate with 10-20 brand style images (~$2, <2 min)
2. Use trigger word in prompts (e.g., "diabolai-style")
3. Update `lib/ai/generateImage.ts` with your LoRA model ID

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

## Current Status (Updated Nov 28, 2025)

### ✅ COMPLETED

1. **Sanity Write Client** - `lib/sanity/writeClient.ts`
2. **Markdown to Blocks Converter** - `lib/sanity/markdownToBlocks.ts`
3. **Publish Post Functions** - `lib/sanity/publishPost.ts`
4. **API Endpoint** - `app/api/publish/route.ts`
5. **n8n Workflow - Direct Publish** (ID: `TYWunxlu3jC0Uev1`)
   - Webhook URL: `https://diabol.app.n8n.cloud/webhook/publish-blog`
   - Status: **Active**
6. **Vercel Deployment** - Environment variables configured
   - `SANITY_WRITE_TOKEN` ✓
   - `PUBLISH_API_SECRET` ✓
7. **End-to-end Test** - Successfully published test post via n8n webhook
8. **Airtable Integration** - Human-in-the-loop review system
   - Base: Content Ideas (`appnsjbSYxfSW0Lpw`)
   - Table: Content Ideas (`tbl8ZoVcbSoNt80WS`)
   - Fields: Title, Description, Status, Why, Hook, Storyline, Author, Category, Published URL, Publish button
9. **n8n Workflow - Airtable Button Publisher** (ID: `0RJIeqLRSG9JvzQy`)
   - Webhook URL: `https://diabol.app.n8n.cloud/webhook/publish-from-airtable`
   - Method: GET (for Airtable button URLs)
   - Status: **Active**
10. **Full Pipeline Test** - Successfully published from Airtable button click

---

## MCP Servers Configured

### Global (all projects) - `~/.claude/settings.json`
- **Airtable**: `@jordanhuffman/airtable-mcp-server` - for database operations

### Project-level - in `.claude.json` under this project
- **n8n**: `@leonardsellem/n8n-mcp-server` - for workflow automation

---

## Airtable Content Ideas Table

| Field | Type | Maps To |
|-------|------|---------|
| Title | Single line text | `title` |
| Description | Long text | `excerpt`, `directAnswer` |
| Why | Long text | `tldr` |
| Hook | Long text | Body intro |
| Storyline | Long text | Body content |
| Author | Single line text | `authorSlug` |
| Category | Single line text | `categorySlug` |
| Status | Single select | Draft / Ready To Publish / Done |
| Published URL | URL | Auto-filled after publish |
| Publish | Button | Triggers n8n webhook |

### Airtable Button Formula
```
"https://diabol.app.n8n.cloud/webhook/publish-from-airtable?id=" & RECORD_ID()
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           BLOG PUBLISHING PIPELINE                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    n8n       │     │   Airtable   │     │    n8n       │     │    Blog      │
│   Daily      │ ──▶ │   Content    │ ──▶ │   Button     │ ──▶ │   Sanity     │
│   Content    │     │   Ideas      │     │   Publisher  │     │   CMS        │
│   Report     │     │   (Review)   │     │   Workflow   │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                            │                    │
                     Human reviews         GET webhook
                     Clicks "Publish"      fetches record,
                     button               publishes, updates status

Button Webhook: https://diabol.app.n8n.cloud/webhook/publish-from-airtable
Blog API:       https://blog.diabolai.com/api/publish
```

---

## Environment Variables

### Vercel (Production) - Already Configured ✓
| Variable | Status |
|----------|--------|
| `SANITY_WRITE_TOKEN` | ✓ Set |
| `PUBLISH_API_SECRET` | ✓ Set |

### n8n Workflow - Hardcoded (n8n Cloud doesn't support env vars on non-Enterprise)
- Blog URL: `https://blog.diabolai.com/api/publish`
- API Secret: Hardcoded in workflow
- Airtable PAT: Hardcoded in workflow

---

## CLI Publishing (for Cursor/Claude Code)

For generating blog posts with AI co-pilot in Cursor or Claude Code:

### Usage

1. Create your draft in `scripts/draft-post.json` (see `draft-post.example.json` for structure)
2. Run `pnpm publish` to publish to Sanity

### Draft Structure

```json
{
  "title": "What is the best way to automate blog posts?",
  "excerpt": "Learn how to automate your blog publishing workflow with AI.",
  "directAnswer": "The best way is using an AI pipeline...",
  "tldr": ["Point 1", "Point 2", "Point 3"],
  "body": "## How Does It Work?\n\nMarkdown content here...",
  "authorSlug": "pete",
  "categorySlug": ["ai", "automation"],
  "imageUrl": "https://example.com/image.jpg",
  "imageAlt": "Description of image",
  "cta": { "text": "Get Started", "url": "/contact" },
  "featured": false
}
```

### SEO/GEO Prompt

Use the prompt from `lib/ai/seoStructure.ts` when generating content:
- Title: Question format (how people ask AI assistants)
- Direct answer: 1-2 sentences, max 280 chars
- TL;DR: 3-5 bullet points
- Body: H2/H3 sections, one idea per section

---

## Troubleshooting & Known Issues (Updated Dec 9, 2025)

### Issues Fixed in Code (Permanent)

These issues have been resolved with code changes and won't recur:

| Issue | Solution | Files Changed |
|-------|----------|---------------|
| **Posts without authors crash build** | Added null checks and conditional rendering | `featured.js`, `default.js`, `lifestyle.js`, `minimal.js`, `sidebar.js` |
| **TL;DR not displaying** | Added TL;DR rendering to all 4 post templates | `default.js`, `lifestyle.js`, `minimal.js`, `sidebar.js` |
| **Direct Answer not displaying** | Added Direct Answer rendering to all templates | Same as above |
| **TL;DR misaligned with content** | Added `mx-auto` and proper prose classes | Same as above |
| **TL;DR needs visual distinction** | Added blue left border (`border-l-4 border-blue-500`) | Same as above |
| **Homepage post cards have gaps** | Changed `gap-10` to `gap-0` in grid | `home.js` |
| **Author name cluttering homepage** | Removed author from PostList component | `postlist.js` |

### Things to Remember

1. **CTA URL must be full URL** - Use `https://calendly.com/peter-diabol/30min` not `/contact`
2. **Author is optional** - Posts will display without author info if not assigned
3. **`updatedAt` is manual** - Update this field in Sanity Studio for SEO freshness signals
4. **Schema deployment** - If you add new fields to schemas, run `npx sanity deploy` from the project root
5. **Categories available** - AI, Automation, Voice AI, Strategy (slugs: `ai`, `automation`, `voice-ai`, `strategy`)
6. **Image alt text** - Always include `imageAlt` in draft JSON. If missing, the title is used as fallback. Check Sanity Studio to verify alt text was saved.

### Post Templates

The blog has 4 post templates, all now support TL;DR and Direct Answer:

| Route | Template | Description |
|-------|----------|-------------|
| `/{slug}` | `default.js` | Main template (most posts use this) |
| `/post/sidebar/{slug}` | `sidebar.js` | With sidebar navigation |
| `/post/lifestyle/{slug}` | `lifestyle.js` | Full-width hero image |
| `/post/minimal/{slug}` | `minimal.js` | Clean, minimal design |

### Sanity Studio Settings

Configure these in Sanity Studio under **Content → Settings**:

- **URL**: `https://blog.diabolai.com`
- **Copyright Name**: `Diabol AI`
- **Logo Alt Text**: `Diabol AI logo`
- **Meta Description**: Your site description for SEO

---

## Next Steps

1. [x] ~~Set up Airtable integration~~
2. [x] ~~Test full pipeline: Airtable → n8n → Sanity → Blog~~
3. [x] ~~CLI publish script for Cursor/Claude Code~~
4. [x] ~~Add Flux image generation to publish script~~
5. [ ] Add Replicate API token to `.env.local`
6. [ ] (Optional) Train Flux LoRA with brand images on Replicate
