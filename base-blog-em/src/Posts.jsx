import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PostDetail } from "./PostDetail";

const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  // 쿼리 클라이언트를 가져오면 prefetchQuery 메서드 사용 가능
  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      // 다음 페이지 쿼리를 미리 실행하고 캐시에 저장
      queryClient.prefetchQuery(["posts", nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  // 쿼리 키, 쿼리 함수, 옵션
  const { data, isError, error, isLoading } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000, // 2초마다 만료
      keepPreviousData: true, // 쿼리 키가 바뀔 때도 지난 데이터를 유지해서 캐시에 해당 데이터 있도록
    }
  );

  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Oops, someting went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
