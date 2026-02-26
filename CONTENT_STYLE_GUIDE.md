# Diabol AI Blog - Content Style Guide

This guide defines the structure and formatting conventions for all blog posts. Follow this structure to ensure consistency, SEO optimization, and AI visibility.

---

## Post Structure Overview

Every blog post should follow this structure (top to bottom):

```
1. Title (H1)
2. Direct Answer (1-2 sentences, italicized)
3. TL;DR (3-5 bullet points)
4. Table of Contents (auto-generated from headings)
5. Main Content Sections (H2 headings)
6. FAQ Section (H2 with H3 question subheadings)
7. Further Reading & Essential Resources (H2)
8. Conclusion/CTA paragraph
```

---

## 1. Title (H1)

- **Format:** Question-based — matches how users query AI assistants
- **Length:** 50-60 characters ideal for SEO
- **Style:** Natural question that includes primary keyword
- **Why:** AI systems match user questions to content titles. If someone asks ChatGPT "What is an AI voice agent?" and your H1 is that exact question, you get cited.

### Examples:
| Good | Avoid |
|------|-------|
| "What Is an AI Voice Agent for Small Business?" | "The Complete Guide to AI Voice Agents" |
| "How Much Does an AI Receptionist Cost in 2026?" | "AI Receptionist Pricing Overview" |
| "Why Should SMBs Invest in Voice AI Now?" | "5 Ways Voice AI Reduces Costs" |

---

## 2. Direct Answer

The first paragraph after the title. This directly answers the main question/topic for AI systems and impatient readers.

- **Format:** 1-2 sentences, italicized
- **Purpose:** Gives AI systems a clear, quotable answer
- **Placement:** Immediately after title, before TL;DR

### Example:
> *You should prioritize AI voice because it delivers immediate ROI by capturing missed calls worth $6,000+ annually, while forcing operational clarity that prepares your business for broader AI transformation.*

---

## 3. TL;DR Section

A scannable summary of key points for readers who want the highlights.

- **Format:** Bulleted list, 3-5 points
- **Heading:** Use "TL;DR" as the heading
- **Style:** Each bullet is a complete, standalone insight
- **Length:** Each bullet 1-2 sentences max

### Example:
```markdown
## TL;DR

- Small businesses miss up to 40% of calls during peak hours, losing $6,000+ annually in revenue
- Voice AI creates a diagnostic tool that reveals every operational weakness in your business
- The competitive window is closing fast—22% of SMBs have implemented voice AI
- Start narrow with one high-volume use case, then scale after proving results
```

---

## 4. Main Content Sections

The body of your article, organized under H2 headings.

### Heading Conventions:

| Level | Use For | Style |
|-------|---------|-------|
| H2 | Main sections | **Hybrid** — questions for high-intent, statements for explanatory |
| H3 | Subsections | Can be questions or statements |
| H4 | Sub-subsections (rare) | Use sparingly |

**H2 Hybrid Approach:** Use question format for sections where users actively search for answers (pricing, "how does it work", comparisons). Use statement format for explanatory or narrative sections (features, implementation steps, background).

### Main Section Heading Examples:
```markdown
## How Much Does an AI Voice Agent Cost?          ← question (high-intent)
## The Hidden Cost of Missed Calls                ← statement (explanatory)
## How Do You Implement Voice AI Step-by-Step?    ← question (high-intent)
## Key Features to Look For                       ← statement (explanatory)
```

### Content Guidelines:
- Use short paragraphs (2-4 sentences)
- Include data, statistics, and specific examples
- Add internal links to related Diabol AI content
- Use bullet points and numbered lists for scanability
- Include images/diagrams where helpful

---

## 5. FAQ Section

Frequently asked questions that address common reader queries. These help with SEO and AI visibility.

- **Heading:** `## Frequently Asked Questions`
- **Questions:** Each as an H3, phrased as actual questions
- **Answers:** 2-4 sentences, direct and helpful
- **Count:** 3-6 questions per post

### Example:
```markdown
## Frequently Asked Questions

### What does "AI visibility" mean?
AI visibility refers to how often and prominently your brand appears in AI-generated answers from tools like ChatGPT, Perplexity, and Google AI Overviews. Unlike traditional SEO rankings, AI visibility depends on being cited as an authoritative source.

### How is AI search optimization different from regular SEO?
Traditional SEO focuses on ranking in link-based search results. AI search optimization focuses on being cited in AI-generated answers, which requires clear, authoritative content that AI systems can parse and quote.

### How long does it take to see results from voice AI?
Most businesses see measurable results within 2-4 weeks of implementation. Initial metrics include call capture rate, response accuracy, and customer satisfaction scores.
```

---

## 6. Sources & Citations (Structured)

Authoritative sources cited in the post. These are stored as structured data in the Sanity `sources` field (not just inline links) so AI systems can follow citation chains.

- **Sanity Field:** `sources` — array of `{title, url, domain}`
- **Count:** 3-5 authoritative sources per post
- **Selection:** Industry reports, research studies, authoritative publications
- **Why:** AI systems follow citation chains. Citing credible sources makes YOUR content more likely to be cited.

### How to add:
In Sanity Studio, use the "Sources & Citations" field on the post. Each entry needs:
- **Title:** What the source is (e.g., "The State of AI in Customer Service 2026")
- **URL:** Direct link to the source
- **Domain:** Publisher name (e.g., "Gartner", "McKinsey", "Search Engine Land")

These render automatically as a "Sources" section at the bottom of every post.

### You can ALSO include inline links in body content:
```markdown
According to [Gartner's 2026 report](https://gartner.com/ai-customer-service),
82% of customer interactions will involve AI by 2027.
```

---

## 7. Closing Paragraph / CTA

End with a brief call-to-action that invites engagement.

### Example:
> Ready to take action? The strategies above work for any business aiming to stay visible in the AI-driven search era. If you have questions or want to explore how Diabol AI can help with your AI transformation, [book a demo](/demo) — we're always happy to share what's working.

---

## Formatting Quick Reference

| Element | Format |
|---------|--------|
| Direct Answer | *Italicized paragraph* |
| TL;DR | Bulleted list with blue left border |
| Main headings (H2) | Hybrid: questions for high-intent, statements for explanatory |
| FAQ questions (H3) | Question format with "?" |
| External links | Open in new tab, use descriptive anchor text |
| Statistics | Bold the number: "**40%** of calls are missed" |
| Brand mentions | Link to source when possible |

---

## Sanity CMS Fields

When creating a post in Sanity, fill out these fields:

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | H1 headline |
| Slug | Yes | URL-friendly version of title |
| Author | Yes | Select from author list |
| Categories | Yes | Select relevant category |
| Main Image | Yes | Featured image (include alt text!) |
| Direct Answer | Yes | 1-2 sentence answer for AI/SEO |
| TL;DR | Yes | Array of 3-5 bullet points |
| Body | Yes | Main content (use structure above) |
| Published At | Yes | Publication date |

---

## Checklist Before Publishing

- [ ] Title (H1) is question-based and includes primary keyword
- [ ] Direct Answer field is filled (1-2 sentences)
- [ ] TL;DR has 3-5 substantive bullet points
- [ ] Main content has clear H2 sections
- [ ] FAQ section has 3-6 questions with concise answers
- [ ] Sources field has 3-5 authoritative citations (title, url, domain)
- [ ] All images have descriptive alt text
- [ ] Internal links to related Diabol AI content included
- [ ] External links open in new tab
- [ ] Post reviewed for spelling/grammar
- [ ] Category assigned
- [ ] Author selected

---

## Example Post Outline

```markdown
# Why Should SMBs Implement Voice AI Before Competitors?

*Voice AI delivers immediate ROI for SMBs by capturing missed revenue
and preparing your business for broader AI transformation.*

## TL;DR
- Point 1...
- Point 2...
- Point 3...
- Point 4...

## The Hidden Cost of Missed Calls
Content...

## Why Is Voice AI the Ideal Starting Point?
Content...

## How Do You Implement Voice AI Step-by-Step?
Content...

## Measuring Success and ROI
Content...

## Frequently Asked Questions

### How much does voice AI cost for a small business?
Answer...

### How long does implementation take?
Answer...

### Will customers know they're talking to AI?
Answer...

Ready to explore voice AI for your business? [Book a demo](/demo)
to see how Diabol AI can help you capture more leads and streamline operations.
```

**Note:** Sources are added via the Sanity "Sources & Citations" field, not inline in the body.

---

*Last updated: February 2026*
