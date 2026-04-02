import { FeedPost, GatheringPost, NewsComment } from '@/types';
import ploggingImg from '@/assets/news/plogging.jpg';
import tumblerImg from '@/assets/news/tumbler-cafe.jpg';
import stepCounterImg from '@/assets/news/step-counter.jpg';
import bloodDonationImg from '@/assets/news/blood-donation.jpg';

export const feedPosts: FeedPost[] = [
  { id: 'f1', authorNickname: '햇살이', authorDistrict: '강남구', createdAt: '2시간 전', imageUrl: ploggingImg, content: '오늘 한강공원에서 플로깅 했어요! 쓰레기 한 봉지 가득 주웠습니다 🌿', likes: 24, comments: 2, liked: false },
  { id: 'f2', authorNickname: '동네지기', authorDistrict: '마포구', createdAt: '4시간 전', imageUrl: tumblerImg, content: '텀블러 들고 다니니까 카페 사장님이 좋아하시더라구요 ☕️', likes: 18, comments: 2, liked: true },
  { id: 'f3', authorNickname: '걷기왕', authorDistrict: '성동구', createdAt: '5시간 전', imageUrl: stepCounterImg, content: '오늘도 7000보 달성! 매일 걸으니까 확실히 건강해지는 느낌 💪', likes: 32, comments: 2, liked: false },
  { id: 'f4', authorNickname: '에코맨', authorDistrict: '서대문구', createdAt: '어제', imageUrl: bloodDonationImg, content: '헌혈 다녀왔습니다! 누군가에게 도움이 되길 바라며 🩸', likes: 45, comments: 3, liked: false },
];

export const gatheringPosts: GatheringPost[] = [
  { id: 'g1', title: '망원한강공원 플로깅 모임', authorNickname: '동네지기', authorDistrict: '마포구', location: '망원한강공원 입구', schedule: '4월 5일 토요일 오전 10시', description: '함께 한강공원을 깨끗하게 만들어요! 장갑과 봉투는 준비해갑니다.', likes: 15, comments: 2, liked: false, createdAt: '1일 전' },
  { id: 'g2', title: '성수동 재활용 워크숍', authorNickname: '걷기왕', authorDistrict: '성동구', location: '성수동 커뮤니티센터', schedule: '4월 8일 화요일 오후 2시', description: '올바른 분리수거 방법을 배우고 실천해봐요!', likes: 8, comments: 1, liked: true, createdAt: '2일 전' },
  { id: 'g3', title: '종로 어르신 말벗 봉사', authorNickname: '봉사러버', authorDistrict: '종로구', location: '종로구 노인복지관', schedule: '4월 10일 목요일 오후 1시', description: '어르신들과 함께하는 따뜻한 시간. 누구나 참여 가능합니다.', likes: 22, comments: 2, liked: false, createdAt: '3일 전' },
  { id: 'g4', title: '단체 연탄 봉사 함께하실 분 모집', authorNickname: '따뜻한온기', authorDistrict: '강북구', location: '강북구 번동 연탄은행 앞 집결', schedule: '4월 12일 토요일 오전 9시', description: '겨울철 에너지 취약계층을 위한 연탄 나눔 봉사입니다. 초보자도 환영하며 장갑과 간식은 현장에서 제공됩니다. 따뜻한 마음만 가져오세요!', likes: 31, comments: 3, liked: false, createdAt: '12시간 전' },
];

export const mockComments: Record<string, NewsComment[]> = {
  f1: [
    { id: 'c1', postId: 'f1', authorNickname: '걷기왕', content: '어느 구간에서 하셨어요? 저도 주말에 참여하고 싶어요 🙌', createdAt: '1시간 전' },
    { id: 'c2', postId: 'f1', authorNickname: '동네지기', content: '봉투랑 집게는 직접 준비하신 건가요?', createdAt: '30분 전' },
  ],
  f2: [
    { id: 'c3', postId: 'f2', authorNickname: '햇살이', content: '텀블러 할인해주는 카페 어디인지 궁금해요!', createdAt: '3시간 전' },
    { id: 'c4', postId: 'f2', authorNickname: '에코맨', content: '영수증까지 챙기셨네요 멋져요 👍', createdAt: '2시간 전' },
  ],
  f3: [
    { id: 'c5', postId: 'f3', authorNickname: '햇살이', content: '만보기 앱 뭐 쓰세요? 저도 깔아볼래요', createdAt: '4시간 전' },
    { id: 'c6', postId: 'f3', authorNickname: '동네지기', content: '7000보 꾸준히 찍는 거 진짜 대단해요!', createdAt: '3시간 전' },
  ],
  f4: [
    { id: 'c7', postId: 'f4', authorNickname: '동네지기', content: '헌혈증 인증까지 깔끔하시네요 🙏', createdAt: '20시간 전' },
    { id: 'c8', postId: 'f4', authorNickname: '걷기왕', content: '개인정보 가리고 올린 점도 좋네요! 저도 다음 주 예약했어요', createdAt: '18시간 전' },
    { id: 'c9', postId: 'f4', authorNickname: '봉사러버', content: '좋은 일 하셨네요 감사합니다', createdAt: '12시간 전' },
  ],
  g1: [
    { id: 'c10', postId: 'g1', authorNickname: '햇살이', content: '참여하고 싶어요! 몇 명이나 모이나요?', createdAt: '20시간 전' },
    { id: 'c11', postId: 'g1', authorNickname: '에코맨', content: '저도 신청합니다 🌱', createdAt: '18시간 전' },
  ],
  g2: [
    { id: 'c12', postId: 'g2', authorNickname: '동네지기', content: '재활용 워크숍 너무 좋아요!', createdAt: '1일 전' },
  ],
  g3: [
    { id: 'c13', postId: 'g3', authorNickname: '햇살이', content: '좋은 봉사활동이네요', createdAt: '2일 전' },
    { id: 'c14', postId: 'g3', authorNickname: '걷기왕', content: '친구랑 같이 가도 될까요?', createdAt: '2일 전' },
  ],
  g4: [
    { id: 'c15', postId: 'g4', authorNickname: '에코맨', content: '작년에도 참여했는데 정말 보람찼어요!', createdAt: '10시간 전' },
    { id: 'c16', postId: 'g4', authorNickname: '햇살이', content: '초보자도 가능하다니 꼭 가볼게요', createdAt: '8시간 전' },
    { id: 'c17', postId: 'g4', authorNickname: '봉사러버', content: '강북구 근처라 딱 좋네요 신청합니다!', createdAt: '6시간 전' },
  ],
};
