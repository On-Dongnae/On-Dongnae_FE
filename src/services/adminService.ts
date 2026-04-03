// TODO: Replace mock imports with actual API calls when backend is ready
import {
  adminDashboardStats,
  adminUsers,
  adminFeeds,
  adminVerifications,
  adminMissionPolicies,
  adminPolicyHistory,
} from '@/mocks/admin';
import { districtRankings, personalRankings } from '@/mocks/rankings';

export const adminService = {
  // TODO: Replace with API call — GET /api/admin/dashboard/stats
  getDashboardStats: async () => adminDashboardStats,

  // TODO: Replace with API call — GET /api/admin/dashboard/rankings
  getDistrictRankings: async () => districtRankings.slice(0, 5),
  getPersonalRankings: async () => personalRankings.slice(0, 5),

  // TODO: Replace with API call — GET /api/admin/users
  getUsers: async () => adminUsers,

  // TODO: Replace with API call — PATCH /api/admin/users/:id/status
  updateUserStatus: async (userId: string, status: 'active' | 'suspended') => {
    console.log(`User ${userId} status changed to ${status}`);
  },

  // TODO: Replace with API call — GET /api/admin/feeds
  getFeeds: async () => adminFeeds,

  // TODO: Replace with API call — PATCH /api/admin/feeds/:id/status
  updateFeedStatus: async (feedId: string, status: 'normal' | 'hidden' | 'review') => {
    console.log(`Feed ${feedId} status changed to ${status}`);
  },

  // TODO: Replace with API call — GET /api/admin/verifications
  getVerificationRequests: async () => adminVerifications,

  // TODO: Replace with API call — PATCH /api/admin/verifications/:id
  updateVerificationStatus: async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    console.log(`Verification ${id} status changed to ${status}`);
  },

  // TODO: Replace with API call — GET /api/admin/missions
  getMissionPolicies: async () => adminMissionPolicies,

  // TODO: Replace with API call — PATCH /api/admin/missions/:id
  updateMissionPolicy: async (id: string, data: Partial<typeof adminMissionPolicies[0]>) => {
    console.log(`Mission ${id} updated`, data);
  },

  // TODO: Replace with API call — GET /api/admin/missions/history
  getPolicyHistory: async () => adminPolicyHistory,
};
