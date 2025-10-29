import Container from "@/components/container";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { bestToolsQuery } from "@/lib/sanity/groq";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn } from "@/lib/sanity/config";

const client = createClient({ projectId, dataset, apiVersion, useCdn });

export default async function BestToolsPage() {
  const data = await client.fetch(bestToolsQuery);

  return (
    <Container>
      <div className="prose mx-auto dark:prose-invert">
        <h1>{data?.title || "Best AI Tools"}</h1>
        {data?.introContent && <PortableText value={data.introContent} />}

        {data?.rankingCriteriaContent && (
          <>
            <h2>Ranking Criteria</h2>
            <PortableText value={data.rankingCriteriaContent} />
          </>
        )}

        {Array.isArray(data?.bestTools) && data.bestTools.length > 0 && (
          <>
            <h2>Top Tools</h2>
            <ol>
              {data.bestTools.map((tool: any) => (
                <li key={tool.id}>
                  <h3>{tool.id}</h3>
                  {tool.bestFor && <p><strong>Best for:</strong> {tool.bestFor}</p>}
                  {tool.features && <p><strong>Features:</strong> {tool.features}</p>}
                  {tool.pricing && <p><strong>Pricing:</strong> {tool.pricing}</p>}
                  {tool.content && <PortableText value={tool.content} />}
                </li>
              ))}
            </ol>
          </>
        )}

        {data?.conclusionContent && (
          <>
            <h2>Conclusion</h2>
            <PortableText value={data.conclusionContent} />
          </>
        )}
      </div>
    </Container>
  );
}

export const revalidate = 60;


