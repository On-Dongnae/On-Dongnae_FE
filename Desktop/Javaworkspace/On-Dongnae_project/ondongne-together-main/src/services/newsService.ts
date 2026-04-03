import { feedPosts, gatheringPosts } from '@/mocks/news';
import { FeedPost, GatheringPost } from '@/types';

// TODO: 추후 백엔드 API 연결 예정
export const newsService = {
  getFeedPosts: async (sort: 'latest' | 'popular' = 'latest'): Promise<FeedPost[]> => {
    await new Promise(r => setTimeout(r, 400));
    if (sort === 'popular') return [...feedPosts].sort((a, b) => b.likes - a.likes);
    return feedPosts;
  },

  getGatheringPosts: async (sort: 'latest' | 'popular' = 'latest'): Promise<GatheringPost[]> => {
    await new Promise(r => setTimeout(r, 400));
    if (sort === 'popular') return [...gatheringPosts].sort((a, b) => b.likes - a.likes);
    return gatheringPosts;
  },

  createPost: async (_data: { type: 'feed' | 'gathering'; title?: string; content: string; image?: File; location?: string; schedule?: string }): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    return true;
  },

  toggleLike: async (_postId: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 200));
    return true;
  },
};
