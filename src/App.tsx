import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import MissionPage from "./pages/MissionPage";
import MissionVerifyPage from "./pages/MissionVerifyPage";
import NewsPage from "./pages/NewsPage";
import NewsWritePage from "./pages/NewsWritePage";
import RankingPage from "./pages/RankingPage";
import RankingMapPage from "./pages/RankingMapPage";
import MyPage from "./pages/MyPage";
import ActivityPage from "./pages/ActivityPage";
import RewardsPage from "./pages/RewardsPage";
import BadgesPage from "./pages/BadgesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/mission/verify" element={<MissionVerifyPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/write" element={<NewsWritePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/ranking/map" element={<RankingMapPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/activity" element={<ActivityPage />} />
          <Route path="/mypage/rewards" element={<RewardsPage />} />
          <Route path="/mypage/badges" element={<BadgesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
