import { UserProfile, LeaderboardUser, PublicUserProfile, CertificateData } from '../types/cyber';

const LOCAL_STORAGE_KEY = 'cybersec_offline_progress_v1';

export interface SubmitProgressParams {
  userId?: string;
  levelNumber: number;
  quizScore: number;
  investigationScore: number;
  hintsUsed?: number;
  isBoss?: boolean;
}

export interface SubmitProgressResponse {
  success: boolean;
  passed: boolean;
  xpAwarded: number;
  user: any;
  error?: string;
}

export class CyberApiService {
  private static offlineQueue: SubmitProgressParams[] = [];

  // Sync offline queue if connection restored
  static async syncOfflineQueue() {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return;
    try {
      const items: SubmitProgressParams[] = JSON.parse(raw);
      if (items.length > 0) {
        for (const item of items) {
          await this.submitLevelProgress(item);
        }
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Offline sync error', e);
    }
  }

  // Auth - Register
  static async register(data: {
    fullName: string;
    certificateName: string;
    username: string;
    email: string;
    password?: string;
    dateOfBirth?: string;
    country?: string;
    batch?: string;
    agreedToTerms: boolean;
  }) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Registration failed');
      return json;
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration failed' };
    }
  }

  // Auth - Login
  static async login(usernameOrEmail: string, password?: string) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password: password || 'cybersec-default' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Login failed');
      return json;
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    }
  }

  // Get current user profile & rank info
  static async getUserProfile(userId?: string) {
    try {
      const res = await fetch(`/api/user/profile${userId ? `?userId=${userId}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch user profile');
      return await res.json();
    } catch (err) {
      // Fallback local mock state if server is offline
      const stored = localStorage.getItem('cybersec_local_user');
      if (stored) {
        return JSON.parse(stored);
      }
      return {
        user: {
          id: 'player-local',
          username: 'Investigator_Zero',
          batch: 'Batch 2027',
          level: 1,
          xp: 0,
          casesSolved: 0,
          bossChallengesCompleted: 0,
          quizAccuracy: 100,
          investigationScore: 100,
          hintsUsed: 0,
          certificateEarned: false,
          certificateId: null,
          certificateDate: null,
          publicProfileEnabled: true,
          streakDays: 1,
          completedLevels: [],
          unlockedTools: ['Basic Network Toolkit'],
          badges: ['🌐 Network Explorer']
        },
        rank: 11,
        batchRank: 5,
        xpToNextRank: 150,
        nextUserUsername: 'AegisProbe'
      };
    }
  }

  // Auth - Logout
  static async logout() {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      return await res.json();
    } catch (e) {
      return { success: true };
    }
  }

  // Update profile
  static async updateProfile(data: {
    username?: string;
    fullName?: string;
    certificateName?: string;
    country?: string;
    email?: string;
    batch?: string;
    publicProfileEnabled?: boolean;
  }) {
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return await res.json();
    } catch (err) {
      return { success: true };
    }
  }

  // Submit level progress (Server-side score calculation and anti-cheat validation)
  static async submitLevelProgress(params: SubmitProgressParams): Promise<SubmitProgressResponse> {
    try {
      const res = await fetch('/api/progress/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          passed: false,
          xpAwarded: 0,
          user: null,
          error: data.error || 'Submission failed'
        };
      }

      return data;
    } catch (err) {
      // Offline fallback: queue submission
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
      const queue: SubmitProgressParams[] = existing ? JSON.parse(existing) : [];
      queue.push(params);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(queue));

      return {
        success: true,
        passed: true,
        xpAwarded: 150,
        user: null,
        error: 'Saved offline. Will sync with server when online.'
      };
    }
  }

  // Fetch real-time global leaderboard
  static async getLeaderboard(filter: string = 'all', batch?: string) {
    try {
      let url = `/api/leaderboard?filter=${filter}`;
      if (batch) url += `&batch=${encodeURIComponent(batch)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      return await res.json();
    } catch (err) {
      return {
        leaderboard: [],
        currentUserRank: 1,
        xpNeededToAdvance: 0,
        totalUsers: 0
      };
    }
  }

  // Fetch public user profile
  static async getPublicUserProfile(userId: string): Promise<PublicUserProfile | null> {
    try {
      const res = await fetch(`/api/user/public-profile/${userId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  // Verify certificate
  static async verifyCertificate(certId: string): Promise<{ valid: boolean; certificate?: CertificateData; message?: string }> {
    try {
      const res = await fetch(`/api/certificate/verify/${encodeURIComponent(certId.trim().toUpperCase())}`);
      const data = await res.json();
      if (!res.ok) {
        return { valid: false, message: data.message || 'Certificate not found' };
      }
      return data;
    } catch (err) {
      return { valid: false, message: 'Network error checking certificate' };
    }
  }

  // Fetch admin stats
  static async getAdminStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Admin stats unavailable');
      return await res.json();
    } catch (err) {
      return null;
    }
  }
}
