import Container from "@/components/container";
import PostList from "@/components/postlist";

export default function Post({ posts }) {
  return (
    <>
      <Container large={true}>
        <div className="pt-16 pb-12 px-8 xl:px-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-near-black/40 dark:text-white/40 mb-4">
            — Diabol AI
          </p>
          <h1 className="font-display font-black text-[clamp(80px,12vw,140px)] leading-[0.88] tracking-tight">
            <span className="text-near-black dark:text-white">The</span>
            <br />
            <span className="text-orange">blog.</span>
          </h1>
        </div>
      </Container>
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
