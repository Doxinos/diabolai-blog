# Diabol AI Blog - Claude Code Context

## Project Overview

This is the **Diabol AI blog** - a Next.js 16 + Sanity v5 JAMStack blog focused on AI transformation content for SMBs.

- **Live site**: https://blog.diabolai.com
- **Sanity Studio**: https://blog.diabolai.com/studio
- **n8n instance**: https://diabol.app.n8n.cloud

### Tech Stack
- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **CMS**: Sanity v5.5.0 (headless)
- **Automation**: n8n workflows
- **Content DB**: Airtable (Content Ideas table)
- **Deployment**: Vercel

---

## Active Projects

### Blog-to-Video Pipeline (In Progress)
**Goal**: Automatically generate video content from blog posts.

**Status**: Planning phase - n8n automation work starting soon.

#### Tech Stack Decisions
| Component | Choice | Notes |
|-----------|--------|-------|
| Avatar | **HeyGen** | Custom avatar already created |
| Voice | **ElevenLabs** | Peter's cloned voice |
| Hosting | YouTube + embedded on blog | SEO benefits from embedded video |
| Distribution | YouTube, LinkedIn, TikTok/Instagram | Multi-platform |

#### Video Formats
| Format | Length | Use Case |
|--------|--------|----------|
| Short-form | ~60 seconds | Social clips, hooks, TikTok/Reels |
| Explainer | Up to 20 min | Full blog-to-video, YouTube |

#### Video Style
- **Primary**: Talking head with AI avatar (HeyGen)
- **Enhancements**: Text on screen overlays
- **Nice-to-have**: B-roll (TBD - explore auto-generation options)

#### Planned Approach
1. Extend post schema with video fields (videoUrl, videoStatus, videoThumbnail, videoDuration)
2. Create script generation logic using existing post fields:
   - `directAnswer` → Video hook/intro
   - `tldr` → Key points/chapters
   - `body` → Full narration content
3. Build n8n workflow: trigger → extract content → call ElevenLabs API → call HeyGen API → store URL in Sanity

#### Content-to-Script Mapping
**Video-ready content fields already exist**:
- `directAnswer`: 1-2 sentence hook (perfect for video intros)
- `tldr`: Bullet points (natural script points)
- `body`: Structured rich text with H2/H3 sections

**Short-form (60s)**: Use `directAnswer` + 2-3 `tldr` points + CTA
**Long-form (explainer)**: Full `body` content, section by section

#### Open Questions
- B-roll auto-generation approach (Pexels API? Runway? Stock footage matching?)
- Aspect ratios: 16:9 for YouTube, 9:16 for TikTok/Reels - generate both?

#### Research: LinkedIn Post Reference (Jan 2026)
Someone automated their entire YouTube workflow with Claude Code in ~24 minutes, $25 in API fees.

**Workflow ideas we could adapt:**

1. **AI Thumbnail Generator**
   - Uses MediaPipe to analyze face direction (yaw/pitch)
   - Matches reference photos by Euclidean distance in pose space
   - Face swaps using Gemini
   - Key insight: face direction matters for avoiding uncanny results
   - Generates 3 variations per run

2. **Cross-Niche Outlier Finder** (for content ideas)
   - Scrapes YouTube for high-performing videos in related niches
   - Calculates outlier score: views ÷ channel average
   - Fetches transcripts
   - Generates title variants
   - Outputs to Google Sheet

3. **AI Video Editor**
   - Removes silence gaps (0.5s threshold)
   - Cuts mistakes via trigger words
   - Audio enhancement + color grading
   - Hardware acceleration (faster than Premiere)
   - Auto-uploads to YouTube

**Framework mentioned**: "Directive-orchestration-execution" - separates high-level instructions from Python scripts. Could apply this to our n8n workflows.

**Takeaway**: These are Python scripts, not n8n. But the patterns are useful - especially the thumbnail approach and the outlier finder for content ideas.

---

## Content Pipeline (Fully Operational)

```
Airtable (Draft) → "Generate Draft" button → n8n AI Content Generator → Airtable (Ready To Publish)
                                                    ↓
                          "Publish" button → n8n Publisher → Sanity CMS → Live blog
```

### Key n8n Workflows
| Workflow | ID | Purpose |
|----------|-----|---------|
| AI Content Generator | `CgZ3SQhfKCEEtvDI` | Generates full articles from ideas |
| Airtable Button Publisher | `0RJIeqLRSG9JvzQy` | Publishes to Sanity with auto image |
| Bi-Weekly Generator | `bzoowtpz5Xe5y7P1` | Auto-selects and generates posts |

### API Endpoints
- `POST /api/publish` - Publishes posts to Sanity (accepts keywords)
- `GET /api/next-image` - Returns next available stock hero image
- `GET /api/posts-for-linking` - Returns existing posts for internal linking
- `POST /api/revalidate` - ISR cache revalidation webhook

---

## Key Files Reference

### Schemas
- [lib/sanity/schemas/post.js](lib/sanity/schemas/post.js) - Post document schema
- [lib/sanity/schemas/blockContent.js](lib/sanity/schemas/blockContent.js) - Rich text schema
- [lib/sanity/schemas/author.js](lib/sanity/schemas/author.js) - Author schema

### Content Rendering
- [lib/sanity/plugins/portabletext.js](lib/sanity/plugins/portabletext.js) - Rich text renderer (handles video embeds)
- [lib/sanity/groq.js](lib/sanity/groq.js) - GROQ queries for fetching content

### APIs
- [app/api/publish/route.ts](app/api/publish/route.ts) - Publish endpoint (accepts keywords)
- [app/api/next-image/route.ts](app/api/next-image/route.ts) - Auto image assignment
- [app/api/posts-for-linking/route.ts](app/api/posts-for-linking/route.ts) - Posts for internal linking

### SEO
- [lib/ai/seoStructure.ts](lib/ai/seoStructure.ts) - AI content structuring with keywords
- [app/(website)/post/sidebar/[slug]/page.js](app/(website)/post/sidebar/[slug]/page.js) - Full metadata + JSON-LD

### Style Guides (MUST READ for content generation)
- [BRAND_VOICE.md](BRAND_VOICE.md) - Diabol AI voice profile
- [HUMAN_WRITING.md](HUMAN_WRITING.md) - Anti-AI writing patterns
- [CONTENT_STYLE_GUIDE.md](CONTENT_STYLE_GUIDE.md) - Blog post structure
- [BLOG_PIPELINE.md](BLOG_PIPELINE.md) - Full pipeline documentation

---

## Post Schema Quick Reference

```javascript
Post {
  title,           // H1 headline
  slug,            // Auto-generated URL slug
  excerpt,         // 200 char summary for feeds
  directAnswer,    // 1-2 sentence answer (SEO/AI visibility)
  tldr[],          // Bullet point takeaways
  author,          // Reference to author doc
  mainImage,       // Hero image with alt text
  categories[],    // Category references
  keywords[],      // SEO keywords for meta tags (max 10)
  publishedAt,     // Original publish date
  updatedAt,       // Freshness signal
  body,            // blockContent (rich text)
  cta,             // Call-to-action {text, url}
  featured         // Boolean flag
}
```

---

## Airtable Structure

**Base ID**: `appnsjbSYxfSW0Lpw`
**Table**: `Content Ideas`

Key fields: Title, Description, Status (Draft/Ready To Publish/Done), Hook, Storyline, Author, Category, Generated Title/Body/TL;DR/Direct Answer/Keywords, Published URL

---

## Brand Voice Summary

- **Personality**: Battle-tested operator sharing practical frameworks
- **Tone**: Direct without being cold, data-driven but tells stories
- **Key phrases**: "Here's what I've learned", specific numbers always
- **AVOID**: Buzzwords (game-changing, revolutionary), hollow intensifiers (truly, incredibly), tricolons ("Build. Launch. Scale.")

---

## Project-Specific Config

| Item | Value |
|------|-------|
| **Sanity Project ID** | `wfhx1x7v` |
| **Sanity Dataset** | `production` |
| **Airtable Base ID** | `appnsjbSYxfSW0Lpw` |
| **Airtable Table** | `Content Ideas` |

---

## brain/ Knowledge OS Sync

Project docs for this blog live in `~/brain/projects/blog-system/README.md`.
Operational docs: `~/brain/ops/automations/`

**When to update brain/:**
- Pipeline changes (new n8n workflows, API changes) → update `~/brain/ops/automations/`
- Architectural decisions → update `~/brain/projects/blog-system/README.md`
- Infrastructure changes (new MCP, new integration) → flag for orchestrator update
- Completed milestones → add to build log in project README

**brain/ is the knowledge layer. This repo is the code layer.**

## Orchestrator Reference

**For cross-project decisions, workflow optimization, or tool selection:**
→ Read `~/.claude/CLAUDE.md` (Global Orchestrator)

The orchestrator knows:
- All available MCPs and when to use them
- When to use CLI vs MCP vs Cowork
- How projects connect (this blog ↔ Airtable ↔ n8n)
- Skill loading patterns for content tasks

**Ask the orchestrator when:**
- Unsure which tool is best for a task
- Need to coordinate across projects
- Want to optimize a workflow

---

## Common Tasks

### Add a new stock hero image
1. Add file to `public/blog-images/`
2. Add filename to `ALL_STOCK_IMAGES` array in `app/api/next-image/route.ts`

### Add a new author
1. Create in Sanity Studio
2. Add slug mapping in n8n "Prepare Content" code node (e.g., `pete` → `peter-ferm`)

### Debug publishing issues
1. Check Sanity Studio for the post
2. Verify n8n workflow execution logs
3. Check Vercel deployment logs

---

## Blog Post Layouts

The blog has **3 post layout options**. We use the **sidebar layout** as the primary layout.

| Layout | URL Pattern | Description | Status |
|--------|-------------|-------------|--------|
| **Sidebar** | `/post/sidebar/[slug]` | Three-column: TOC left, article center, CTAs right | **Active - primary layout** |
| Lifestyle | `/post/lifestyle/[slug]` | Full-width hero, single column | Not used |
| Minimal | `/post/minimal/[slug]` | No hero, single column, clean | Not used |

### Sidebar Layout Features
- **Table of Contents** (left): Auto-generated from H2/H3 headings, sticky scroll, highlights active section
- **Article content** (center): Main post body with TL;DR, direct answer, author card
- **Right sidebar**: Search, related posts, categories, and **CTAs**

---

## Sidebar CTAs

Two types of CTAs appear in the right sidebar on all sidebar-layout posts:

### 1. Service CTA (Category-based)
Stored as documents in Sanity (`serviceCta` type). Shows based on post categories.

**Schema location**: [lib/sanity/schemas/serviceCta.js](lib/sanity/schemas/serviceCta.js)

Fields:
- `title` - Internal name
- `headline` - Attention-grabbing headline
- `body` - Supporting text
- `buttonText` / `buttonUrl` - CTA button
- `image` - Optional image displayed at top of card
- `categories[]` - Which categories trigger this CTA
- `isDefault` - Fallback if no category matches

**Example**: AI Voice CTA shows on posts in ai-voice, voice-ai categories.

### 2. Generic CTA (Always shown)
Stored in Site Settings (`settings` document). Shows on all posts below the Service CTA.

**Fields in settings schema**:
- `genericCtaHeadline`
- `genericCtaBody`
- `genericCtaButtonText`
- `genericCtaButtonUrl`
- `genericCtaImage`

### CTA Components
- [components/sidebarCta.js](components/sidebarCta.js) - Reusable CTA card component
- [components/sidebar.js](components/sidebar.js) - Sidebar container that renders CTAs
- [components/tableOfContents.js](components/tableOfContents.js) - TOC component

### GROQ Queries
```javascript
// Service CTA - matches by category or falls back to default
servicectaquery // in lib/sanity/groq.js

// Generic CTA - from site settings
genericctaquery // in lib/sanity/groq.js
```

---

## SEO Features

### Keywords Pipeline
- AI Content Generator creates 5-8 SEO keywords per post
- Keywords saved to Airtable `Generated Keywords` field (comma-separated)
- Publisher workflow passes keywords to `/api/publish`
- Keywords stored in Sanity and rendered in `<meta name="keywords">` tag

### Internal Linking
- `/api/posts-for-linking` returns existing posts with title, URL, description
- AI Content Generator includes 2-4 internal links in body content
- Links use correct `/post/sidebar/{slug}` URL format

### Per-Post Metadata (Sidebar Layout)
- Full OpenGraph tags (title, description, image, article type)
- Twitter card metadata (summary_large_image)
- JSON-LD structured data (Article schema with author, publisher, dates)
- Per-post keywords in meta tags

---

## Notes

- Stock images: 22 pre-generated Midjourney images in `public/blog-images/`
- Video embeds already supported via `get-video-id` library (YouTube, Vimeo)
- Posts support tables, code blocks, and iframe embeds in body content
