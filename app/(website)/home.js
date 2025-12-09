import Container from "@/components/container";
import PostList from "@/components/postlist";

export default function Post({ posts }) {
  return (
    <>
      <div className="-mt-32 bg-gray-100 dark:bg-gray-900 [clip-path:polygon(0%_0%,_100%_0%,_100%_25%,_55%_100%,_0%_100%)]">
        <Container large={true}>
          <div className="pt-40 pb-48 text-left px-8 xl:px-5">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
              Diabol AI Blog
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Get inspiration on productivity, design, and technology.
            </p>
          </div>
        </Container>
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
