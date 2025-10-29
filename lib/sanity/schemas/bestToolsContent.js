export default {
  name: "bestToolsContent",
  title: "Best Tools Content",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: Rule => Rule.required()
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: Rule => Rule.required()
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      validation: Rule => Rule.min(20).max(200)
    },
    {
      name: "introContent",
      title: "Introduction",
      type: "blockContent"
    },
    {
      name: "rankingCriteriaContent",
      title: "Ranking Criteria",
      type: "blockContent"
    },
    {
      name: "conclusionContent",
      title: "Conclusion",
      type: "blockContent"
    },
    {
      name: "bestTools",
      title: "Best Tools",
      type: "array",
      of: [
        {
          type: "object",
          name: "tool",
          title: "Tool",
          fields: [
            { name: "id", title: "ID", type: "string", validation: Rule => Rule.required() },
            { name: "bestFor", title: "Best For", type: "string" },
            { name: "features", title: "Features", type: "string" },
            { name: "pricing", title: "Pricing", type: "string" },
            { name: "content", title: "Detailed Review", type: "blockContent" }
          ],
          preview: {
            select: { title: "id", subtitle: "bestFor" }
          }
        }
      ]
    }
  ]
};


