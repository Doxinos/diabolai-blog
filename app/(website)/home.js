import Container from "@/components/container";
import PostList from "@/components/postlist";

export default function Post({ posts }) {
  return (
    <>
      <div className="px-8 xl:px-5 pt-16 pb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-near-black/40 dark:text-white/40 mb-4">
          — Diabol AI
        </p>
        <h1 className="font-display font-black text-near-black dark:text-white text-[clamp(80px,12vw,140px)] leading-[0.88] tracking-tight">
          THE<br />BLOG
        </h1>
      </div>
      {posts && (
        <Container large={true}>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            {posts.map(post => (
              <PostList
                key={post._id}
                post={post}
                aspect="square"
                preloadImage={true}
              />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
