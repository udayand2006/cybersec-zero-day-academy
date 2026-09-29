import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  limit,
  onSnapshot
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  db,
  auth,
  googleProvider,
  handleFirestoreError,
  OperationType
} from '../firebase';
import { UserProfile, LeaderboardUser, CertificateData } from '../types/cyber';

const ADMIN_EMAIL = 'udayandrekha678@gmail.com';

export class FirebaseDbService {
  /**
   * Google Sign-in with Firebase Auth
   */
  static async signInWithGoogle(): Promise<{ user: UserProfile | null; error?: string }> {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;
      const profile = await this.getOrCreateUserProfile(fbUser);
      return { user: profile };
    } catch (err: any) {
      console.error('Google Sign-in failed', err);
      return { user: null, error: err.message || 'Google sign-in failed' };
    }
  }

  /**
   * Sign out
   */
  static async logoutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error', err);
    }
  }

  /**
   * Listen to Firebase auth changes
   */
  static onAuthChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Retrieve existing user profile or initialize new student document
   */
  static async getOrCreateUserProfile(fbUser: FirebaseUser): Promise<UserProfile> {
    const path = `users/${fbUser.uid}`;
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        return data;
      }

      // Initialize fresh user profile
      const rawName = fbUser.displayName || 'Investigator';
      const cleanUsername = rawName.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20) || `Agent_${fbUser.uid.slice(0, 6)}`;
      const isAdmin = fbUser.email === ADMIN_EMAIL;

      const newProfile: UserProfile = {
        id: fbUser.uid,
        username: cleanUsername,
        email: fbUser.email || `${fbUser.uid}@cybersec.academy`,
        fullName: rawName,
        certificateName: rawName,
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
        role: isAdmin ? 'ADMIN' : 'USER',
        publicProfileEnabled: true
      };

      // Persist to private users collection
      await setDoc(userRef, newProfile);

      // Persist to public profiles collection
      await this.syncPublicProfile(newProfile);

      return newProfile;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  }

  /**
   * Sync public profile (No PII) for global leaderboard and peer discovery
   */
  static async syncPublicProfile(profile: UserProfile): Promise<void> {
    const path = `public_profiles/${profile.id}`;
    try {
      const pubRef = doc(db, 'public_profiles', profile.id!);
      await setDoc(pubRef, {
        userId: profile.id,
        username: profile.username,
        batch: profile.batch,
        level: profile.currentLevel,
        xp: profile.xp,
        casesSolved: profile.casesSolved,
        bossChallengesCompleted: profile.bossChallengesCompleted,
        quizAccuracy: profile.quizAccuracy,
        investigationScore: profile.investigationScore,
        badgesCount: (profile.badges || []).length,
        certificateEarned: profile.certificateEarned,
        certificateId: profile.certificateId || null,
        streakDays: profile.streakDays
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  /**
   * Update full user profile (e.g. name, certificate title, country, etc.)
   */
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const path = `users/${uid}`;
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, updates as any);

      const updatedSnap = await getDoc(userRef);
      const fullProfile = updatedSnap.data() as UserProfile;

      // Sync public fields if applicable
      await this.syncPublicProfile(fullProfile);

      return fullProfile;
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  /**
   * Persist completed level progress to Firestore
   */
  static async saveLevelCompletion(
    uid: string,
    levelNumber: number,
    quizScore: number,
    investigationScore: number,
    hintsUsed: number = 0,
    isBoss: boolean = false
  ): Promise<{ profile: UserProfile; xpAwarded: number }> {
    const path = `users/${uid}`;
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        throw new Error('User record does not exist in database.');
      }

      const current = snap.data() as UserProfile;
      const alreadyCompleted = current.completedLevels.includes(levelNumber);

      const baseLevelXP = levelNumber * 100;
      const quizBonus = Math.round(quizScore * 1.5);
      const investBonus = Math.round(investigationScore * 2);
      const bossBonus = isBoss ? 500 : 0;
      const xpAwarded = alreadyCompleted ? 25 : baseLevelXP + quizBonus + investBonus + bossBonus;

      const newCompleted = alreadyCompleted
        ? current.completedLevels
        : [...current.completedLevels, levelNumber].sort((a, b) => a - b);

      const nextLevel = Math.min(50, Math.max(current.currentLevel, levelNumber + 1));
      const newXP = current.xp + xpAwarded;
      const newRankTier = Math.min(10, Math.floor(newXP / 1000) + 1);
      const newCases = alreadyCompleted ? current.casesSolved : current.casesSolved + 1;
      const newBossCount = (isBoss && !alreadyCompleted)
        ? current.bossChallengesCompleted + 1
        : current.bossChallengesCompleted;

      // Badges calculation
      const badgesSet = new Set(current.badges || ['cadet_enrolled']);
      if (newCompleted.length >= 5) badgesSet.add('firewall_apprentice');
      if (newCompleted.length >= 15) badgesSet.add('foundation_certified');
      if (newCompleted.length >= 25) badgesSet.add('forensic_detective');
      if (newCompleted.length >= 40) badgesSet.add('threat_hunter');
      if (newCompleted.length >= 50) badgesSet.add('zero_day_master');
      if (newBossCount >= 5) badgesSet.add('incident_commander');

      // Certificate eligibility
      const certificateEarned = newCompleted.length >= 50;
      const certificateId = certificateEarned
        ? (current.certificateId || `SG-CYBER-${Date.now().toString(36).toUpperCase()}`)
        : current.certificateId;
      const certificateDate = certificateEarned
        ? (current.certificateDate || new Date().toISOString().split('T')[0])
        : current.certificateDate;

      const updates: Partial<UserProfile> = {
        completedLevels: newCompleted,
        currentLevel: nextLevel,
        xp: newXP,
        level: newRankTier,
        casesSolved: newCases,
        bossChallengesCompleted: newBossCount,
        hintsUsed: current.hintsUsed + hintsUsed,
        badges: Array.from(badgesSet),
        certificateEarned,
        certificateId,
        certificateDate
      };

      await updateDoc(userRef, updates as any);

      const updatedProfile: UserProfile = {
        ...current,
        ...updates
      };

      // Also if certificate earned, write to public certificates collection
      if (certificateEarned && certificateId) {
        await this.persistCertificateRecord({
          certificateId,
          userId: uid,
          studentName: updatedProfile.certificateName || updatedProfile.fullName || updatedProfile.username,
          batch: updatedProfile.batch,
          completionDate: certificateDate!,
          courseTitle: 'Zero-Day Defensive & Incident Response Engineering',
          totalLevels: 50,
          finalScore: Math.round((newXP / 65000) * 100),
          status: 'Valid',
          skillsCovered: [
            'Packet Inspection & Protocol Analysis',
            'SOC SIEM Correlation & Threat Hunting',
            'Digital Forensics & Artifact Acquisition',
            'Malware Reverse Engineering & Memory Dumps',
            'Enterprise Incident Response & Containment'
          ]
        });
      }

      await this.syncPublicProfile(updatedProfile);

      return { profile: updatedProfile, xpAwarded };
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  /**
   * Persist official certificate in public verifiable registry
   */
  static async persistCertificateRecord(cert: CertificateData & { userId: string }): Promise<void> {
    const path = `certificates/${cert.certificateId}`;
    try {
      const certRef = doc(db, 'certificates', cert.certificateId);
      await setDoc(certRef, cert, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  /**
   * Verify certificate by ID from Firestore
   */
  static async verifyCertificate(certificateId: string): Promise<CertificateData | null> {
    const cleanId = certificateId.trim();
    if (!cleanId) return null;
    const path = `certificates/${cleanId}`;
    try {
      const certRef = doc(db, 'certificates', cleanId);
      const snap = await getDoc(certRef);
      if (snap.exists()) {
        return snap.data() as CertificateData;
      }
      return null;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  }

  /**
   * Fetch live Global Leaderboard directly from Firestore public_profiles
   */
  static async getLeaderboard(): Promise<LeaderboardUser[]> {
    const path = 'public_profiles';
    try {
      const colRef = collection(db, 'public_profiles');
      const q = query(colRef, limit(100));
      const snap = await getDocs(q);

      const currentUid = auth.currentUser?.uid;
      const users: LeaderboardUser[] = [];

      snap.forEach(docSnap => {
        const d = docSnap.data();
        users.push({
          rank: 0,
          id: d.userId || docSnap.id,
          username: d.username || 'Investigator',
          batch: d.batch || 'Batch 2027',
          level: d.level || 1,
          xp: d.xp || 0,
          casesSolved: d.casesSolved || 0,
          bossChallengesCompleted: d.bossChallengesCompleted || 0,
          quizAccuracy: d.quizAccuracy || 100,
          investigationScore: d.investigationScore || 0,
          certificateEarned: !!d.certificateEarned,
          certificateId: d.certificateId || null,
          badgesCount: d.badgesCount || 1,
          streakDays: d.streakDays || 1,
          isCurrent: currentUid ? (d.userId === currentUid) : false
        });
      });

      // Sort by XP descending
      users.sort((a, b) => b.xp - a.xp);
      users.forEach((u, i) => {
        u.rank = i + 1;
      });

      return users;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  }

  /**
   * Subscribe to real-time profile updates for active user
   */
  static subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
    const path = `users/${uid}`;
    const userRef = doc(db, 'users', uid);
    return onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        callback(snap.data() as UserProfile);
      } else {
        callback(null);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    });
  }
}
