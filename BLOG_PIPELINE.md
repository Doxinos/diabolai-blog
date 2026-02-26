# Blog Publishing Pipeline

## Overview

Automated pipeline for publishing SEO/GEO-optimized blog posts to Sanity CMS with brand voice consistency.

```
┌─────────────────┐    ┌─────────────────┐    ┌──────────┐    ┌─────────────────┐    ┌──────────┐    ┌─────────────┐
│  n8n Automation │ → │   SEO/GEO AI    │ → │   YOU    │ → │   Image AI      │ → │   YOU    │ → │   Publish   │
│  or Claude      │    │   Structuring   │    │  REVIEW  │    │   (Replicate)   │    │  REVIEW  │    │  to Sanity  │
└─────────────────┘    └─────────────────┘    └──────────┘    └─────────────────┘    └──────────┘    └─────────────┘
```

## Key Documentation Files

| File | Purpose |
|------|---------|
| `BRAND_VOICE.md` | Diabol AI voice profile - tone, vocabulary, personality traits |
| `HUMAN_WRITING.md` | Anti-AI writing patterns to avoid (tricolons, hollow intensifiers, etc.) |
| `CONTENT_STYLE_GUIDE.md` | Blog post structure and formatting requirements |
| `BLOG_PIPELINE.md` | This file - technical pipeline documentation |

**IMPORTANT**: AI agents generating content MUST follow all three style guides. The n8n AI Content Generator workflow includes these guidelines in its prompt.

---

## Complete Content Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              FULL CONTENT PIPELINE                                           │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: CONTENT RESEARCH (Daily)                                                           │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐                     │
│  │  Daily Content   │     │                  │     │                  │                     │
│  │  Reports         │ ──▶ │  Claude AI       │ ──▶ │   Airtable       │                     │
│  │  (AI Video +     │     │  (Brainstorm     │     │   Content Ideas  │                     │
│  │   Voice AI)      │     │   5 ideas)       │     │   (Draft status) │                     │
│  └──────────────────┘     └──────────────────┘     └──────────────────┘                     │
│         │                                                   │                               │
│         │ Sources:                                          │                               │
│         ├─ YouTube video summaries                          │                               │
│         ├─ X/Twitter discussions                            │                               │
│         └─ Perplexity research                              │                               │
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 2: CONTENT GENERATION (On-demand)                                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐                     │
│  │  User clicks     │     │  AI Content      │     │   Airtable       │                     │
│  │  "Generate       │ ──▶ │  Generator       │ ──▶ │   Content Ideas  │                     │
│  │   Draft" button  │     │  Workflow        │     │   (Ready To      │                     │
│  │  in Airtable     │     │  (Full article)  │     │    Publish)      │                     │
│  └──────────────────┘     └──────────────────┘     └──────────────────┘                     │
│                                    │                         │                               │
│                                    │ Generates:              │ Fields populated:             │
│                                    ├─ Generated Title        ├─ Generated Title              │
│                                    ├─ Generated Direct Answer├─ Generated Direct Answer      │
│                                    ├─ Generated TL;DR        ├─ Generated TL;DR              │
│                                    ├─ Generated Body         ├─ Generated Body               │
│                                    └─ Generated Sources      └─ Generated Sources            │
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  STAGE 3: PUBLISHING (On-demand)                                                             │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌─────────────┐│
│  │  User clicks     │     │  Airtable Button │     │  /api/next-image │     │   Blog      ││
│  │  "Publish"       │ ──▶ │  Publisher       │ ──▶ │  (Auto-assigns   │ ──▶ │   Live!     ││
│  │  button in       │     │  Workflow        │     │   hero image)    │     │             ││
│  │  Airtable        │     │                  │     │                  │     │             ││
│  └──────────────────┘     └──────────────────┘     └──────────────────┘     └─────────────┘│
│                                    │                         │                               │
│                                    │ Steps:                  │ Image handling:               │
│                                    │ 1. Fetch Airtable record│ 1. Query Sanity for used imgs │
│                                    │ 2. Get next image       │ 2. Pick next available        │
│                                    │ 3. Map author slug      │ 3. Upload to Sanity CDN       │
│                                    │ 4. Parse/clean body     │ 4. Return URL to workflow     │
│                                    │ 5. Publish to Sanity    │                               │
│                                    │ 6. Update Airtable      │                               │
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

SEPARATE WORKFLOW (LinkedIn Parasite):
┌──────────────────┐     ┌──────────────────┐
│  LinkedIn        │     │   Google         │
│  Parasite        │ ──▶ │   Sheets         │  (NOT connected to blog)
│  Workflow        │     │                  │
└──────────────────┘     └──────────────────┘
```

---

## n8n Workflows

### 1. Daily Content Reports (AI Video + Voice AI)
- **Purpose**: Scrape trending content and generate blog ideas
- **Sources**: YouTube, X/Twitter, Perplexity
- **Output**: 5 blog ideas per topic → Airtable (Draft status)
- **Schedule**: Daily (automated)

### 2. AI Content Generator + Slack Review (ID: `CgZ3SQhfKCEEtvDI`)
- **Webhook URL**: `https://diabol.app.n8n.cloud/webhook/generate-content`
- **Trigger**: "Generate Draft" button in Airtable
- **Input**: Title, Description, Hook, Storyline from Airtable
- **Output**: Full article with SEO structure following brand voice
- **Fields Populated**: Generated Title, Generated Direct Answer, Generated TL;DR, Generated Body, Generated Sources
- **Status Change**: Draft → Ready To Publish
- **Notifications**: Posts draft to #blog-drafts Slack channel for review
- **Style Guides**: Prompt includes BRAND_VOICE.md, HUMAN_WRITING.md, and CONTENT_STYLE_GUIDE.md rules

### 3. Bi-Weekly Blog Content Generator (ID: `bzoowtpz5Xe5y7P1`)
- **Webhook URL**: `https://diabol.app.n8n.cloud/webhook/biweekly-blog-test` (for manual testing)
- **Schedule**: Every other Monday at 9 AM UTC (1st and 3rd week of each month)
- **Purpose**: Auto-select and generate one blog post every two weeks from existing Draft ideas
- **Flow**:
  1. Fetch all Draft ideas from Airtable
  2. Claude selects the best topic based on relevance and timeliness
  3. Triggers AI Content Generator webhook for the selected idea
  4. Notifies Slack with selection reason
- **Status**: Inactive (manual testing mode)

### 4. Airtable Button Publisher (ID: `0RJIeqLRSG9JvzQy`)
- **Webhook URL**: `https://diabol.app.n8n.cloud/webhook/publish-from-airtable`
- **Method**: GET
- **Trigger**: "Publish" button click in Airtable
- **Steps**:
  1. Fetch Airtable record by ID
  2. Call `/api/next-image` to get and upload hero image
  3. Map author slug (`pete` → `peter-ferm`)
  4. Clean body content (unescape `\\n`, strip JSON artifacts)
  5. POST to `/api/publish` endpoint
  6. Update Airtable status to "Done" with Published URL
- **Status**: **Active**

### 4. LinkedIn Parasite (Separate)
- **Output**: Google Sheets (NOT Airtable)
- **Not connected to blog pipeline**

---

## Automatic Image Assignment

### How It Works

The `/api/next-image` endpoint automatically assigns hero images to blog posts:

1. **Queries Sanity** for all uploaded image assets (by `originalFilename`)
2. **Compares against stock list** to find unused images
3. **Fetches image** from `public/blog-images/` (served statically)
4. **Uploads to Sanity CDN** and returns the URL
5. **n8n workflow** uses the returned URL in the publish request

### Stock Images Location
- **Source**: `public/blog-images/` (22 pre-generated Midjourney images)
- **Served at**: `https://blog.diabolai.com/blog-images/{filename}`
- **Tracking**: Sanity asset queries (no filesystem writes - Vercel compatible)

### Available Images (22 total)
```
ai-3d-car-emerging-holographic-wireframe.jpg
ai-abstract-audio-wave-flowing.jpg
ai-abstract-digital-artwork-inspired-siren-melthea.jpg
ai-abstract-face-paint-details.jpg
ai-abstract-scene-glowing-lightbulb-dark-night.jpg
ai-animated-cinematic-poster-bear-old-man.jpg
ai-ascii-style-art-barista-coffee.jpg
ai-astronaut-woman-futuristic-suit.jpg
ai-campfire-colorful-flames-glowing.jpg
ai-close-up-black-panther.jpg
ai-dark-medallion-head-of-dragon.jpg
ai-f1-inspired-track-at-night.jpg
ai-macro-shot-mosquito-flying-mid-air.jpg
ai-minimalist-apple-mac-workspace.jpg
ai-nervous-system-black-background-artistic.jpg
ai-realistic-digital-art-black-woman-dollar-bills.jpg
ai-retro-futuristic-sci-fi-bedroom-interior.jpg
ai-santa-klaus-gifts-futuristik.jpg
ai-throne-red-poker-cards-flying.jpg
ai-turntable-needle-song.jpg
ai-woman-robot-futuristic.jpg
ai-wooden-surfboard-carved-and-painted-hawaiian.jpg
```

### Adding New Images
1. Add image files to `public/blog-images/`
2. Add filenames to `ALL_STOCK_IMAGES` array in `app/api/next-image/route.ts`
3. Commit and deploy

---

## Brand Voice & Writing Style

### Diabol AI Voice (from BRAND_VOICE.md)
- **Personality**: Battle-tested operator sharing practical frameworks
- **Tone**: Direct without being cold, data-driven but tells stories
- **Vocabulary**: Use specific numbers, "Here's what I've learned", avoid buzzwords
- **Structure**: Short paragraphs (2-4 sentences), bold for statistics, no emojis

### Anti-AI Writing Patterns (from HUMAN_WRITING.md)

**NEVER USE:**
- Tricolons: "Build. Launch. Scale."
- Asyndetic lists: "Fast, reliable, efficient"
- Hollow intensifiers: truly, incredibly, absolutely
- Buzzwords: game-changing, revolutionary, seamless, empower

**DO USE:**
- Mixed sentence lengths
- Contractions (natural speech)
- Specific numbers instead of vague claims
- Conjunctions to start sentences ("And that's the thing...")

### Content Structure (from CONTENT_STYLE_GUIDE.md)
1. Hook (personal story or provocative problem)
2. Direct Answer (1-2 sentences for AI/SEO)
3. TL;DR (3-5 bullet points)
4. Problem Diagnosis
5. Framework/Solution with clear methodology
6. Evidence (data, case studies)
7. Implementation (practical next steps)
8. FAQs
9. CTA (soft close)

---

## AI SEO/GEO Blog Structure

Based on guidelines from [AIclicks](https://aiclicks.io/guide) by Rokas Stankevicius.

### Required Structure (Top to Bottom)

#### 1. H1: Main Question
- Focus on natural questions people type into ChatGPT/AI assistants
- Example: "What is the best AI visibility platform?"

#### 2. Author Credibility & Freshness
- **Reviewed by**: Author name/credentials
- **Last updated**: Date (critical for AI models)

#### 3. Direct Answer (1-2 sentences)
- Immediate solution to the main question
- Helps win featured snippets, Perplexity pulls, and ChatGPT responses

#### 4. TL;DR Summary
- Recap key points in clear, skimmable format
- Use short sentences or simple bullets

#### 5. Visuals + Citable Content
- AI models read alt text and use visuals to interpret structure
- Include: Data, definitions, clear explanations

#### 6. AI-Friendly Formatted Body
- One idea per section
- Clean H2/H3 headings
- Keep structure simple

#### 7. Call to Action
- Invite users to take the next step

---

## Sanity Schema Fields

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
| `keywords` | array of strings | SEO keywords for meta tags |
| `sources` | array of objects | Authoritative citations ({title, url, domain}) |

---

## Airtable Content Ideas Table

**Base ID**: `appnsjbSYxfSW0Lpw`
**Table**: `Content Ideas`

| Field | Type | Purpose |
|-------|------|---------|
| Title | Single line text | Initial idea title |
| Description | Long text | Brief description |
| Status | Single select | Draft / Ready To Publish / Done |
| Why | Long text | Reason/hook for the article |
| Hook | Long text | Opening hook |
| Storyline | Long text | Article outline |
| Author | Single line text | Author slug (e.g., `pete`) |
| Category | Single line text | Category slug (e.g., `ai`) |
| Generated Title | Long text | AI-generated SEO title |
| Generated Direct Answer | Long text | AI-generated direct answer |
| Generated TL;DR | Long text | AI-generated bullet points |
| Generated Body | Long text | AI-generated full article (markdown) |
| Generated Sources | Long text | AI-generated citations (JSON array) |
| Published URL | URL | Auto-filled after publish |
| Generate Draft | Button | Triggers AI content generation |
| Open URL | Button | Triggers publish workflow |

### Button Formulas

**Generate Draft**:
```
"https://diabol.app.n8n.cloud/webhook/generate-content?id=" & RECORD_ID()
```

**Publish (Open URL)**:
```
"https://diabol.app.n8n.cloud/webhook/publish-from-airtable?id=" & RECORD_ID()
```

---

## API Endpoints

### POST `/api/publish`

Publishes a blog post to Sanity CMS.

**Headers**:
```
Authorization: Bearer YOUR_PUBLISH_API_SECRET
Content-Type: application/json
```

**Body**:
```json
{
  "title": "How to Build an AI-Powered Blog Pipeline",
  "excerpt": "Learn how to automate your blog publishing workflow.",
  "directAnswer": "Build an automated pipeline using n8n, Airtable, and Sanity CMS.",
  "tldr": ["Point 1", "Point 2", "Point 3"],
  "body": "## Introduction\n\nMarkdown content here...",
  "authorSlug": "peter-ferm",
  "categorySlug": ["ai", "automation"],
  "imageUrl": "https://cdn.sanity.io/images/.../image.jpg",
  "imageAlt": "AI automation workflow",
  "keywords": ["AI blog automation", "n8n workflow", "Sanity CMS"],
  "sources": [
    {"title": "Gartner: AI in Customer Service 2026", "url": "https://gartner.com/...", "domain": "Gartner"},
    {"title": "McKinsey: State of AI", "url": "https://mckinsey.com/...", "domain": "McKinsey"}
  ],
  "featured": false
}
```

**Response**:
```json
{
  "success": true,
  "postId": "abc123",
  "slug": "how-to-build-an-ai-powered-blog-pipeline",
  "url": "https://blog.diabolai.com/how-to-build-an-ai-powered-blog-pipeline"
}
```

### GET `/api/posts-for-linking`

Returns existing blog posts for internal linking during content generation.

**Query Params**:
- `limit`: Max posts to return (default: 20)
- `category`: Filter by category slug (optional)

**Response**:
```json
{
  "posts": [
    {
      "title": "How AI Voice Agents Transform Customer Service",
      "url": "/post/sidebar/how-ai-voice-agents-transform-customer-service",
      "description": "AI voice agents can handle 80% of routine calls...",
      "categories": ["ai", "voice-ai"]
    }
  ],
  "count": 6
}
```

**Usage in n8n**: Call this endpoint before content generation and pass the posts to the AI prompt. The AI will naturally link to 2-4 relevant posts in the body content.

---

### GET `/api/next-image`

Returns and uploads the next available stock image.

**Headers**:
```
Authorization: Bearer YOUR_PUBLISH_API_SECRET
```

**Query Params**:
- `peek=true`: Just return info without uploading

**Response**:
```json
{
  "success": true,
  "image": {
    "filename": "ai-abstract-audio-wave-flowing.jpg",
    "sanityRef": "image-abc123",
    "url": "https://cdn.sanity.io/images/.../image.jpg"
  },
  "remaining": 19
}
```

---

## Environment Variables

### Local Development (`.env.local`)
```bash
SANITY_WRITE_TOKEN=your_sanity_write_token
PUBLISH_API_SECRET=your_random_secret_string
REPLICATE_API_TOKEN=your_replicate_token  # Optional, for Flux image generation
```

### Vercel Production
| Variable | Status |
|----------|--------|
| `SANITY_WRITE_TOKEN` | ✅ Configured |
| `PUBLISH_API_SECRET` | ✅ Configured |

### n8n Workflow
- Credentials hardcoded in workflow (n8n Cloud limitation)
- Blog URL: `https://blog.diabolai.com/api/publish`
- Next Image URL: `https://blog.diabolai.com/api/next-image`

---

## File Structure

```
app/api/
├── publish/
│   └── route.ts            # Publish API endpoint
└── next-image/
    └── route.ts            # Auto image assignment API

lib/
├── sanity/
│   ├── client.ts           # Sanity read client
│   ├── writeClient.ts      # Sanity write client
│   ├── publishPost.ts      # Post creation functions
│   ├── markdownToBlocks.ts # Markdown → Sanity converter
│   └── schemas/
│       ├── post.js         # Post schema (SEO/GEO fields)
│       ├── author.js       # Author schema
│       └── category.js     # Category schema
└── ai/
    └── generateImage.ts    # Flux image generation (optional)

public/blog-images/         # Stock hero images (22 images)

components/blog/
├── tableOfContents.js      # Sticky TOC sidebar
├── authorCard.js           # Author bio card
└── relatedPosts.js         # Related posts section
```

---

## Known Issues & Fixes

### Fixed Issues (Jan 2026)

| Issue | Cause | Solution |
|-------|-------|----------|
| **Unknown author on posts** | Airtable `Author: "pete"` but Sanity slug is `peter-ferm` | Added mapping in n8n: `pete` → `peter-ferm` |
| **Body showing as 2 blocks only** | Escaped newlines (`\\n`) and JSON artifacts in body | Added cleanup: `body.replace(/\\n/g, '\n')` + strip JSON |
| **No hero image on posts** | No image URL provided | Created `/api/next-image` for auto-assignment |
| **Image API failed on Vercel** | Filesystem is read-only | Changed to query Sanity for used images instead of JSON file |
| **Images not accessible** | Images in `assets/` not served | Moved to `public/blog-images/` |

### TOC Sidebar Sticky Behavior (Improved Jan 17, 2026)

**Issue**: Table of contents sidebar stops being sticky partway through long articles.

**Cause**: Flexbox doesn't naturally stretch columns to full row height, causing sticky to stop when the aside ends.

**Fix**: Changed from flexbox to CSS Grid layout:
```jsx
// In app/(website)/[slug]/default.js line 143
<div className="relative lg:grid lg:grid-cols-[1fr_256px] lg:gap-16">
```

Grid forces both columns to span the full row height. Note: For extremely long articles, the TOC may still stop sticking near the very end - this is acceptable behavior.

### Content Validation (Fixed Jan 17, 2026)

**Issue**: Empty posts were created when publish button was clicked before content was ready, wasting stock images.

**Cause**: Image assignment happened BEFORE content validation in the n8n workflow.

**Fix**: Added "Validate Content" node that runs BEFORE "Get Next Image" in Airtable Button Publisher workflow. Validation checks:
- Title exists and is not "Untitled"
- Body content exists and is at least 500 characters
- Status is not already "Done"

### Content Brainstorm Empty Records (Discovered Jan 23, 2026)

**Issue**: Daily Content Report workflow creates Airtable records with empty Title/Description and "..." placeholder text in Why/Hook/Storyline fields.

**Cause**: The "Create a record" node in n8n workflow `1VtwM7H3meLXzrgT` has hardcoded "..." values instead of referencing LLM output fields.

**Affected Records**: Created Jan 22, 2026 onwards (records: `recuWKlRnbzjHdyxc`, `recLiNWg3kkszaDtI`, `rec6rpw6AZLdSjrkZ`, `reccOPa2hTaMGODHK`)

**Fix**: Update "Create a record" node field mappings in n8n:
1. Open workflow `1VtwM7H3meLXzrgT` in n8n
2. Edit "Create a record" node
3. Update field mappings:
   - Why: Change from `=...` to `={{ $json.why_this_matters }}` (or actual field name from LLM output)
   - Hook: Change from `=...` to `={{ $json.hook }}` (or actual field name)
   - Storyline: Change from `=...` to `={{ $json.storyline }}` (or actual field name)
4. Test with manual execution before re-enabling schedule

**Status**: Pending fix in n8n

---

## Author Mapping

| Airtable Value | Sanity Slug | Name |
|----------------|-------------|------|
| `pete` | `peter-ferm` | Peter Ferm |

If adding new authors:
1. Create author in Sanity Studio
2. Add mapping in n8n "Prepare Content" code node

---

## Troubleshooting

### Post published but no image
1. Check `/api/next-image` endpoint is responding
2. Verify `SANITY_WRITE_TOKEN` is set in Vercel
3. Check remaining image count (may be out of stock images)

### Author shows as "Unknown"
1. Verify author exists in Sanity with correct slug
2. Check author slug mapping in n8n workflow
3. Ensure Airtable `Author` field matches expected values

### Body content truncated or malformed
1. Check for `\\n` in Generated Body (should be `\n`)
2. Look for JSON artifacts at end of body content
3. Verify markdown is valid

### Workflow shows success but post not visible
1. Check Sanity Studio for the post
2. Verify Sanity CDN cache has updated
3. Check for build/deploy errors on Vercel

---

## MCP Servers Configured

### Global (`~/.claude/settings.json`)
- **Airtable**: `@jordanhuffman/airtable-mcp-server`
- **Gmail**: Gmail MCP server

### Project-level (`.claude.json`)
- **n8n**: `@leonardsellem/n8n-mcp-server`
  - Instance: `https://diabol.app.n8n.cloud`

---

## Current Status (Updated Jan 23, 2026)

### ✅ Completed
1. Full content pipeline: Research → Generate → Publish
2. Automatic image assignment via `/api/next-image`
3. Author slug mapping (pete → peter-ferm)
4. Body content cleanup (newlines, JSON artifacts)
5. Vercel-compatible image tracking (Sanity queries, no filesystem)
6. Stock images served from `public/blog-images/`
7. Brand voice integration (BRAND_VOICE.md, HUMAN_WRITING.md)
8. Content validation before image assignment (prevents empty posts)
9. TOC sidebar sticky behavior fix
10. Bi-Weekly Blog Content Generator workflow (select + generate from existing ideas)
11. Slack notifications for content generation
12. Sidebar CTAs (Service CTA + Generic CTA) with image support

### 🔄 In Progress
1. Manual testing of Bi-Weekly Blog Content Generator before activation

### 🐛 Known Issues
1. **Content Brainstorm empty records** - Daily Content Report workflow creating empty Airtable records (see "Known Issues & Fixes" section for details and fix instructions)

### 📋 Future Improvements
1. SEO optimization node (internal links, keyword density)
2. Slug deduplication check
3. Intelligent image matching (topic-based selection)
4. Analytics feedback loop
5. Image recycling for deleted/failed posts
