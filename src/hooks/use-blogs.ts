// import useSWRInfinite from 'swr/infinite';
// import { getPublishedBlogs } from '@/service/blog';
// import { GetPublishedBlogsResponse } from '@/types/blog';

// const PAGE_SIZE = 2;

// export function useBlogs(searchTerm = '') {
// 	const getKey = (
// 		pageIndex: number,
// 		previousData: GetPublishedBlogsResponse | undefined
// 	) => {
// 		// Don't fetch next page if previous page has no edges
// 		if (previousData && !previousData.edges.length) return null;
// 		// First page, don't need cursor
// 		if (pageIndex === 0) return { first: PAGE_SIZE, query: searchTerm };
// 		// Get cursor from previous page
// 		return {
// 			after: pageIndex > 0 ? previousData?.pageInfo.endCursor : undefined,
// 			first: PAGE_SIZE,
// 			query: searchTerm
// 		};
// 	};

// 	const { data, error, size, setSize, isValidating } = useSWRInfinite(
// 		getKey,
// 		(key) => getPublishedBlogs(key),
// 		{ revalidateFirstPage: false }
// 	);
// 	console.log(data);

// 	const blogs = data
// 		? data.flatMap((page) => page?.edges.map((edge) => edge.node))
// 		: [];
// 	const isLoading = !data && !error;
// 	const isError = !!error;
// 	const isReachingEnd =
// 		data && data.length > 0
// 			? (data[data.length - 1]?.edges.length ?? 0) < PAGE_SIZE
// 			: false;
// 	const isLoadingMore =
// 		isValidating && data && typeof data[size - 1] !== 'undefined';

// 	return {
// 		blogs,
// 		isLoading,
// 		isError,
// 		size,
// 		setSize,
// 		isReachingEnd,
// 		isLoadingMore
// 	};
// }


export function useBlogs(searchTerm = '') {
  const sampleData = [
    {
      _id: '1',
      title: 'Exploring the Art of Software Testing',
      image: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg',
      content: 'Software testing is a crucial process in the development cycle...',
      heartCount: 24,
      createdAt: '2025-02-20T12:00:00Z',
      author: {
        name: 'John Doe',
        image: '/default-avatar.jpg'
      }
    },
    {
      _id: '2',
      title: 'Understanding TCP vs UDP',
      image: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg',
      content: 'TCP and UDP are the backbone of internet protocols...',
      heartCount: 15,
      createdAt: '2025-02-18T10:30:00Z',
      author: {
        name: 'Jane Smith',
        image: '/default-avatar.jpg'
      }
    }
  ];

  return {
    blogs: sampleData,
    isLoading: false,
    isError: false,
    size: 1,
    setSize: () => {},
    isReachingEnd: true,
    isLoadingMore: false
  };
}

