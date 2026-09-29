import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { FirebaseDbService } from '../services/firebaseDb';
import { testConnection } from '../firebase';
import { UserProfile } from '../types/cyber';

interface AuthContextType {
  fbUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  saveProgress: (
    levelNumber: number,
    quizScore: number,
    investigationScore: number,
    hintsUsed?: number,
    isBoss?: boolean
  ) => Promise<{ success: boolean; xpAwarded: number; user?: UserProfile; error?: string }>;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'cybersec_offline_progress_v1';
const LOCAL_USER_KEY = 'cybersec_local_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Validate Firestore connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = FirebaseDbService.onAuthChange(async (user) => {
      setLoading(true);
      if (user) {
        setFbUser(user);
        try {
          const profile = await FirebaseDbService.getOrCreateUserProfile(user);
          setUserProfile(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        } catch (e) {
          console.error('Failed to retrieve user profile from Firestore:', e);
        }
      } else {
        setFbUser(null);
        // Fallback to local guest profile if not logged in
        const stored = localStorage.getItem(LOCAL_USER_KEY);
        if (stored) {
          try {
            setUserProfile(JSON.parse(stored));
          } catch {
            setUserProfile(null);
          }
        } else {
          // Default guest state
          const defaultGuest: UserProfile = {
            id: 'guest_specialist',
            username: 'Cadet_Investigator',
            fullName: 'Cadet Investigator',
            certificateName: 'Cadet Investigator',
            email: 'student@cybersec.academy',
            batch: 'Batch 2027',
            country: 'Global',
            dateOfBirth: '2000-01-01',
            currentLevel: 1,
            completedLevels: [],
            xp: 0,
            level: 1,
            casesSolved: 0,
            bossChallengesCompleted: 0,
            quizAccuracy: 100,
            investigationScore: 0,
            hintsUsed: 0,
            unlockedTools: [],
            badges: ['cadet_enrolled'],
            certificateEarned: false,
            certificateId: null,
            certificateDate: null,
            streakDays: 1,
            role: 'USER',
            publicProfileEnabled: true
          };
          setUserProfile(defaultGuest);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(defaultGuest));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In
  const signInWithGoogle = async () => {
    setLoading(true);
    const res = await FirebaseDbService.signInWithGoogle();
    setLoading(false);
    if (res.user) {
      setUserProfile(res.user);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(res.user));
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // Sign out
  const logout = async () => {
    await FirebaseDbService.logoutUser();
    setFbUser(null);
    const guest: UserProfile = {
      id: 'guest_' + Date.now().toString(36),
      username: 'Guest_Student',
      email: 'guest@cybersec.academy',
      currentLevel: 1,
      completedLevels: [],
      xp: 0,
      level: 1,
      casesSolved: 0,
      bossChallengesCompleted: 0,
      quizAccuracy: 100,
      investigationScore: 0,
      hintsUsed: 0,
      unlockedTools: [],
      badges: ['cadet_enrolled'],
      certificateEarned: false,
      certificateId: null,
      certificateDate: null,
      streakDays: 1,
      batch: 'Batch 2027',
      country: 'Global',
      publicProfileEnabled: true,
      role: 'USER'
    };
    setUserProfile(guest);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(guest));
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (fbUser) {
      const updated = await FirebaseDbService.updateUserProfile(fbUser.uid, updates);
      setUserProfile(updated);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    } else if (userProfile) {
      const updated = { ...userProfile, ...updates };
      setUserProfile(updated);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    }
  };

  // Save level progress to Firestore
  const saveProgress = async (
    levelNumber: number,
    quizScore: number,
    investigationScore: number,
    hintsUsed: number = 0,
    isBoss: boolean = false
  ) => {
    if (fbUser) {
      try {
        const { profile, xpAwarded } = await FirebaseDbService.saveLevelCompletion(
          fbUser.uid,
          levelNumber,
          quizScore,
          investigationScore,
          hintsUsed,
          isBoss
        );
        setUserProfile(profile);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        return { success: true, xpAwarded, user: profile };
      } catch (err: any) {
        console.error('Failed to persist progress to Firestore', err);
        return { success: false, xpAwarded: 0, error: err.message };
      }
    }

    // Guest / local fallback
    if (!userProfile) return { success: false, xpAwarded: 0, error: 'No active profile' };
    const already = userProfile.completedLevels.includes(levelNumber);
    const xpAwarded = already ? 25 : (levelNumber * 100) + Math.round(quizScore * 1.5) + Math.round(investigationScore * 2) + (isBoss ? 500 : 0);
    const newCompleted = already ? userProfile.completedLevels : [...userProfile.completedLevels, levelNumber].sort((a,b)=>a-b);
    const nextLevel = Math.min(50, Math.max(userProfile.currentLevel, levelNumber + 1));
    const certEarned = newCompleted.length >= 50;

    const updated: UserProfile = {
      ...userProfile,
      completedLevels: newCompleted,
      currentLevel: nextLevel,
      xp: userProfile.xp + xpAwarded,
      level: Math.min(10, Math.floor((userProfile.xp + xpAwarded) / 1000) + 1),
      casesSolved: already ? userProfile.casesSolved : userProfile.casesSolved + 1,
      bossChallengesCompleted: isBoss && !already ? userProfile.bossChallengesCompleted + 1 : userProfile.bossChallengesCompleted,
      hintsUsed: userProfile.hintsUsed + hintsUsed,
      certificateEarned: certEarned,
      certificateId: certEarned ? (userProfile.certificateId || `SG-CYBER-${Date.now().toString(36).toUpperCase()}`) : userProfile.certificateId,
      certificateDate: certEarned ? (userProfile.certificateDate || new Date().toISOString().split('T')[0]) : userProfile.certificateDate
    };

    setUserProfile(updated);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    return { success: true, xpAwarded, user: updated };
  };

  return (
    <AuthContext.Provider
      value={{
        fbUser,
        userProfile,
        loading,
        signInWithGoogle,
        logout,
        updateProfile,
        saveProgress,
        setUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
