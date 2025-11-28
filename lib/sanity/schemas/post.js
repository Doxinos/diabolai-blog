export default {
  name: "post",
  title: "Post",
  type: "document",
  initialValue: () => ({
    publishedAt: new Date().toISOString()
  }),
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      }
    },
    {
      name: "excerpt",
      title: "Excerpt",
      description:
        "The excerpt is used in blog feeds, and also for search results",
      type: "text",
      rows: 3,
      validation: Rule => Rule.max(200)
    },
    {
      name: "directAnswer",
      title: "Direct Answer",
      description:
        "1-2 sentence answer to the main question. Used for featured snippets and AI responses.",
      type: "text",
      rows: 2,
      validation: Rule => Rule.max(280)
    },
    {
      name: "tldr",
      title: "TL;DR",
      description: "Key takeaways in bullet form for quick scanning by readers and AI",
      type: "array",
      of: [{ type: "string" }]
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" }
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      fields: [
        // {
        //   name: "caption",
        //   type: "string",
        //   title: "Image caption",
        //   description: "Appears below image.",

        // },
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity."
        }
      ],
      options: {
        hotspot: true
      }
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }]
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime"
    },
    {
      name: "updatedAt",
      title: "Last Updated",
      description: "Shows freshness signals to AI models. Update this when content is revised.",
      type: "datetime"
    },
    {
      name: "featured",
      title: "Mark as Featured",
      type: "boolean"
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent"
    },
    {
      name: "cta",
      title: "Call to Action",
      description: "Invite readers to take the next step",
      type: "object",
      fields: [
        {
          name: "text",
          type: "string",
          title: "CTA Text",
          description: "e.g., 'Try our free tool' or 'Read the full guide'"
        },
        {
          name: "url",
          type: "url",
          title: "CTA Link"
        }
      ]
    }
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage"
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      });
    }
  }
};
