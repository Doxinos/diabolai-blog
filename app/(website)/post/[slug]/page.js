import Container from "@/components/container";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import {
  getAllBestToolsSlugs,
  getBestToolsBySlug
} from "@/lib/sanity/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generateStaticParams() {
  return await getAllBestToolsSlugs();
}

export async function generateMetadata({ params }) {
  const doc = await getBestToolsBySlug(params.slug);
  return { title: doc?.title || "Best Tools", description: doc?.metaDescription };
}

export default async function BestToolsEntry({ params }) {
  const doc = await getBestToolsBySlug(params.slug);

  return (
    <Container>
      <header id="top" className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {doc?.title || "Best Tools"}
        </h1>
        {doc?.metaDescription && (
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {doc.metaDescription}
          </p>
        )}
      </header>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8">
          <div className="prose dark:prose-invert">
            {Array.isArray(doc?.bestTools) && doc.bestTools.length > 0 && (
              <Card className="mb-8 lg:hidden">
                <CardHeader>
                  <CardTitle className="m-0">Quick look: The {doc.bestTools.length} best tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2">
                    {doc?.rankingCriteriaContent && (
                      <li>
                        <a className="no-underline hover:underline" href="#ranking-criteria">
                          Ranking criteria
                        </a>
                      </li>
                    )}
                    {doc.bestTools.map((tool, idx) => {
                      const id = slugify(tool.bestFor || `tool-${idx}`);
                      return (
                        <li key={tool.id || idx}>
                          <a className="no-underline hover:underline" href={`#${id}`}>
                            {tool.bestFor || `Tool ${idx + 1}`}
                          </a>
                        </li>
                      );
                    })}
                    {doc?.conclusionContent && (
                      <li>
                        <a className="no-underline hover:underline" href="#conclusion">
                          Conclusion
                        </a>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}

            {doc?.introContent && (
              <div className="text-lg leading-relaxed mb-8">
                <PortableText value={doc.introContent} />
              </div>
            )}

            {doc?.rankingCriteriaContent && (
              <div id="ranking-criteria" className="bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8 scroll-mt-24">
                <h2 className="m-0 mb-3 text-xl font-semibold">Ranking Criteria</h2>
                <div className="prose-ul:list-disc prose-ul:pl-5 prose-li:my-1">
                  <PortableText value={doc.rankingCriteriaContent} />
                </div>
              </div>
            )}

            {Array.isArray(doc?.bestTools) && doc.bestTools.length > 0 && (
              <>
                {doc.bestTools.map((tool, idx) => {
                  const sectionId = slugify(tool.bestFor || `tool-${idx}`);
                  return (
                    <section key={tool.id || idx} id={sectionId} className="mt-10 mb-10 scroll-mt-24">
                      <Card>
                        {tool.bestFor && (
                          <CardHeader>
                            <CardTitle className="m-0 flex items-center gap-3">
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 text-sm font-medium">
                                {idx + 1}
                              </span>
                              {tool.bestFor}
                            </CardTitle>
                          </CardHeader>
                        )}
                        {tool.content && (
                          <CardContent>
                            <div className="prose prose-lg dark:prose-invert prose-p:my-3 prose-ul:list-disc prose-ul:pl-6 prose-li:my-1">
                              <PortableText value={tool.content} />
                            </div>
                            <div className="mt-4">
                              <a href="#top" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Back to top</a>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    </section>
                  );
                })}
              </>
            )}

            {doc?.conclusionContent && (
              <section id="conclusion" className="scroll-mt-24">
                <h2>Conclusion</h2>
                <PortableText value={doc.conclusionContent} />
              </section>
            )}
          </div>
        </main>

        {Array.isArray(doc?.bestTools) && doc.bestTools.length > 0 && (
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="m-0">On this page</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {doc?.rankingCriteriaContent && (
                      <li>
                        <a className="no-underline hover:underline" href="#ranking-criteria">
                          Ranking criteria
                        </a>
                      </li>
                    )}
                    {doc.bestTools.map((tool, idx) => {
                      const id = slugify(tool.bestFor || `tool-${idx}`);
                      return (
                        <li key={tool.id || idx}>
                          <a className="no-underline hover:underline" href={`#${id}`}>
                            {tool.bestFor || `Tool ${idx + 1}`}
                          </a>
                        </li>
                      );
                    })}
                    {doc?.conclusionContent && (
                      <li>
                        <a className="no-underline hover:underline" href="#conclusion">
                          Conclusion
                        </a>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </aside>
        )}
      </div>
    </Container>
  );
}

export const revalidate = 60;
