import api from '@/lib/api';
import { NewsComment } from '@/types';

interface CommentResponseDto {
  id: number;
  feedId: number;
  userId: number;
  userEmail: string;
  content: string;
  likeCount: number;
  createdAt: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const generateNickname = (email: string) => email ? email.split('@')[0] : '이웃';

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
};

export const commentService = {
  getComments: async (feedId: string): Promise<NewsComment[]> => {
    const res = await api.get<ApiResponse<CommentResponseDto[]>>(`/api/comments/feed/${feedId}`);
    return res.data.data.map(c => ({
      id: String(c.id),
      postId: String(c.feedId),
      authorNickname: generateNickname(c.userEmail),
      content: c.content,
      createdAt: formatDate(c.createdAt)
    }));
  },

  createComment: async (feedId: string, content: string): Promise<NewsComment> => {
    const res = await api.post<ApiResponse<CommentResponseDto>>('/api/comments', {
      feedId: Number(feedId),
      content,
    });
    const c = res.data.data;
    return {
      id: String(c.id),
      postId: String(c.feedId),
      authorNickname: generateNickname(c.userEmail),
      content: c.content,
      createdAt: formatDate(c.createdAt)
    };
  }
};
