import api from '@/lib/api';
import { FeedPost, GatheringPost } from '@/types';

interface FeedResponseDto {
  id: number;
  userId: number;
  userEmail: string;
  type: 'ACTIVITY' | 'MEETING';
  title?: string;
  content: string;
  likeCount: number;
  commentCount: number;
  imageUrls: string[];
  createdAt: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// 닉네임과 동네가 백엔드 응답에 없으므로 userEmail 기반으로 임시 닉네임 생성
const generateNickname = (email: string) => email ? email.split('@')[0] : '이웃';

// 날짜 포맷 (예: "방금 전", "N분 전" 또는 YYYY.MM.DD)
const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
};

// 정규식을 사용해 content에서 장소와 일정을 파싱
const extractGatheringInfo = (content: string) => {
  const locMatch = content.match(/\[모임 장소:\s*(.*?)\]/);
  const schedMatch = content.match(/\[일정:\s*(.*?)\]/);
  const cleanContent = content.replace(/\[모임 장소:.*?\]/g, '').replace(/\[일정:.*?\]/g, '').trim();

  return {
    location: locMatch ? locMatch[1] : '장소 미정',
    schedule: schedMatch ? schedMatch[1] : '일정 미정',
    cleanContent
  };
};

export const newsService = {
  getFeedPosts: async (sort: 'latest' | 'popular' = 'latest'): Promise<FeedPost[]> => {
    const sortBy = sort === 'popular' ? 'LIKES' : 'LATEST';
    const res = await api.get<ApiResponse<FeedResponseDto[]>>(`/api/feeds?type=ACTIVITY&sortBy=${sortBy}`);
    
    return res.data.data.map(f => ({
      id: String(f.id),
      authorId: String(f.userId),
      authorNickname: generateNickname(f.userEmail),
      authorDistrict: '우리 동네', // 백엔드 부재 필드
      createdAt: formatDate(f.createdAt),
      imageUrls: f.imageUrls || [],
      content: f.content || '',
      likes: f.likeCount || 0,
      comments: f.commentCount || 0,
      liked: false // 백엔드에 정보가 없어 무조건 false 초기화
    }));
  },

  getGatheringPosts: async (sort: 'latest' | 'popular' = 'latest'): Promise<GatheringPost[]> => {
    const sortBy = sort === 'popular' ? 'LIKES' : 'LATEST';
    const res = await api.get<ApiResponse<FeedResponseDto[]>>(`/api/feeds?type=MEETING&sortBy=${sortBy}`);
    
    return res.data.data.map(f => {
      const info = extractGatheringInfo(f.content || '');
      return {
        id: String(f.id),
        authorId: String(f.userId),
        title: f.title || '제목 없음',
        authorNickname: generateNickname(f.userEmail),
        authorDistrict: '우리 동네', 
        location: info.location,
        schedule: info.schedule,
        description: info.cleanContent,
        imageUrls: f.imageUrls || [],
        likes: f.likeCount || 0,
        comments: f.commentCount || 0,
        liked: false,
        createdAt: formatDate(f.createdAt)
      };
    });
  },

  createPost: async (data: { type: 'feed' | 'gathering'; title?: string; content: string; images?: File[]; location?: string; schedule?: string }): Promise<boolean> => {
    const formData = new FormData();
    
    let submitContent = data.content;
    // gathering일 경우 포맷을 맞춰 content에 밀어넣음
    if (data.type === 'gathering') {
      const loc = data.location ? `[모임 장소: ${data.location}]\n` : '';
      const sched = data.schedule ? `[일정: ${data.schedule}]\n` : '';
      submitContent = `${loc}${sched}\n${data.content}`.trim();
    }

    const requestDto = {
      type: data.type === 'feed' ? 'ACTIVITY' : 'MEETING',
      title: data.title || '',
      content: submitContent
    };

    formData.append('request', new Blob([JSON.stringify(requestDto)], { type: 'application/json' }));
    
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    }

    await api.post('/api/feeds', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return true;
  },

  updatePost: async (feedId: string, data: { type: 'feed' | 'gathering'; title?: string; content: string; images?: File[]; location?: string; schedule?: string }): Promise<boolean> => {
    const formData = new FormData();
    
    let submitContent = data.content;
    if (data.type === 'gathering') {
      const loc = data.location ? `[모임 장소: ${data.location}]\n` : '';
      const sched = data.schedule ? `[일정: ${data.schedule}]\n` : '';
      submitContent = `${loc}${sched}\n${data.content}`.trim();
    }

    const requestDto = {
      type: data.type === 'feed' ? 'ACTIVITY' : 'MEETING',
      title: data.title || '',
      content: submitContent
    };

    formData.append('request', new Blob([JSON.stringify(requestDto)], { type: 'application/json' }));
    
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('addImages', image);
      });
    }

    await api.put(`/api/feeds/${feedId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return true;
  },

  deletePost: async (feedId: string): Promise<boolean> => {
    await api.delete(`/api/feeds/${feedId}`);
    return true;
  },

  toggleLike: async (postId: string, currentLiked: boolean): Promise<boolean> => {
    if (currentLiked) {
      await api.post(`/api/feeds/${postId}/unlike`);
    } else {
      await api.post(`/api/feeds/${postId}/like`);
    }
    return true;
  },
};
