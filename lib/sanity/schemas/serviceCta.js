import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "serviceCta",
  type: "document",
  title: "Service CTA",
  icon: TagIcon,
  description: "Contextual CTAs that appear in the blog sidebar based on post category",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Internal Name",
      description: "For organization only - not displayed on site",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "headline",
      type: "string",
      title: "Headline",
      description: "Short attention-grabbing headline (e.g., 'Missing calls?')",
      validation: Rule => Rule.required().max(60)
    }),
    defineField({
      name: "body",
      type: "text",
      title: "Body Text",
      description: "Supporting text explaining the value proposition",
      rows: 3,
      validation: Rule => Rule.required().max(200)
    }),
    defineField({
      name: "buttonText",
      type: "string",
      title: "Button Text",
      description: "Call-to-action button label (e.g., 'Learn more', 'Book a call')",
      validation: Rule => Rule.required().max(30)
    }),
    defineField({
      name: "buttonUrl",
      type: "url",
      title: "Button URL",
      description: "Where the button links to",
      validation: Rule => Rule.required().uri({
        allowRelative: true,
        scheme: ['http', 'https']
      })
    }),
    defineField({
      name: "image",
      type: "image",
      title: "CTA Image",
      description: "Optional image to display in the CTA box",
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: "categories",
      type: "array",
      title: "Linked Categories",
      description: "This CTA will appear on posts in these categories",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }]
        }
      ]
    }),
    defineField({
      name: "isDefault",
      type: "boolean",
      title: "Default CTA",
      description: "Show this CTA when no category-specific CTA matches",
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: "title",
      headline: "headline",
      isDefault: "isDefault"
    },
    prepare({ title, headline, isDefault }) {
      return {
        title: title || headline,
        subtitle: isDefault ? "Default fallback" : headline
      };
    }
  }
});
