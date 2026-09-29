import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LevelMap } from './components/LevelMap';
import { LevelView } from './components/LevelView';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { UserProfileModal } from './components/UserProfileModal';
import { SocialComparisonModal } from './components/SocialComparisonModal';
import { CertificateView } from './components/CertificateView';
import { CertificateVerifyModal } from './components/CertificateVerifyModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { ToolboxModal } from './components/ToolboxModal';
import { FoundationExamModal } from './components/FoundationExamModal';
import { AuthModal } from './components/AuthModal';
import { CyberApiService } from './services/api';
import { getLevelData } from './data/levelRegistry';
import { LeaderboardUser, CertificateData } from './types/cyber';
import { Award, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';

export type AppTab = 'learn' | 'investigate' | 'challenges' | 'leaderboard' | 'toolbox' | 'certificate' | 'admin';

function AppContent() {
  const { fbUser, userProfile, saveProgress, setUserProfile } = useAuth();
  const [currentTab, setCurrentTab] = useState<AppTab>('learn');
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [examPassed, setExamPassed] = useState(false);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalUserId, setProfileModalUserId] = useState<string | null>(null);
  const [compareTargetUser, setCompareTargetUser] = useState<LeaderboardUser | null>(null);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [verifyCertModalOpen, setVerifyCertModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Celebration Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync offline queue & check exam
  useEffect(() => {
    CyberApiService.syncOfflineQueue();
  }, []);

  useEffect(() => {
    if (userProfile?.completedLevels && userProfile.completedLevels.includes(15)) {
      setExamPassed(true);
    }
  }, [userProfile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Next unlocked level
  const completedList: number[] = userProfile?.completedLevels || [];
  const maxCompleted = completedList.length > 0 ? Math.max(...completedList) : 0;
  const nextUnlockedId = Math.min(50, maxCompleted + 1);

  // Level Complete Handler
  const handleLevelComplete = async (quizScore: number, investigationScore: number, hintsUsed: number) => {
    if (!activeLevelId) return;

    // 1. Persist directly to Firebase Firestore
    const res = await saveProgress(
      activeLevelId,
      quizScore,
      investigationScore,
      hintsUsed,
      activeLevelId % 5 === 0
    );

    // 2. Mirror to background API sync
    CyberApiService.submitLevelProgress({
      levelNumber: activeLevelId,
      quizScore,
      investigationScore,
      hintsUsed,
      isBoss: activeLevelId % 5 === 0
    }).catch(console.error);

    if (res.success && res.user) {
      showToast(`Level ${activeLevelId} completed. +${res.xpAwarded} XP awarded.`);

      if (activeLevelId === 15) {
        showToast('Level 15 Boss Solved. Foundation Exam Gate unlocked.');
      } else if (activeLevelId === 50) {
        showToast('Grand Cyber Crisis Resolved. Official Certificate Earned.');
      }

      // Check if certificate was earned
      if (res.user.certificateEarned) {
        setCurrentTab('certificate');
      }
    } else if (res.error) {
      showToast(`Warning: ${res.error}`);
    }
  };

  // Certificate object builder if earned
  const userCertificate: CertificateData | null = userProfile?.certificateEarned ? {
    certificateId: userProfile.certificateId || 'SG-CYBER-2026-CLOUD',
    studentName: userProfile.certificateName || userProfile.fullName || userProfile.username,
    batch: userProfile.batch || 'Batch 2027',
    completionDate: userProfile.certificateDate || new Date().toISOString().split('T')[0],
    courseTitle: 'CyberSec: Zero-Day Academy Certificate of Completion',
    totalLevels: 50,
    finalScore: Math.round(((userProfile.quizAccuracy || 90) + (userProfile.investigationScore || 92)) / 2),
    status: 'Valid',
    skillsCovered: [
      'Networking Fundamentals & CIDR Subnetting',
      'Packet Dissection & TCP/IP Protocol Analysis',
      'DNS & DHCP Security Forensics',
      'Stateful Firewall Rule Engineering',
      'MITRE ATT&CK & Enterprise Threat Hunting',
      'Digital Forensics & Super-Timeline Analysis',
      'Enterprise SIEM & SOC Alert Correlation',
      'Incident Response Lifecycle & Host Quarantine',
      'Cloud & Web Application Security',
      'Metropolitan Cyber Crisis Command & Resolution'
    ]
  } : null;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={tab => {
          if (tab === 'admin') {
            setAdminModalOpen(true);
          } else {
            setCurrentTab(tab);
            setActiveLevelId(null);
          }
        }}
        userProfile={userProfile}
        onOpenProfile={() => setProfileModalUserId(userProfile?.id || 'player-local')}
        onOpenAuth={() => setAuthModalOpen(true)}
        nextUnlockedLevelId={nextUnlockedId}
        onSelectLevel={id => {
          setActiveLevelId(id);
          setCurrentTab('investigate');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0f0f11] border border-zinc-700 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono text-zinc-200 font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Tab 1: Learn / Curriculum */}
        {(currentTab === 'learn' || currentTab === 'challenges') && (
          activeLevelId ? (
            <LevelView
              levelData={getLevelData(activeLevelId)}
              onBackToMap={() => setActiveLevelId(null)}
              onLevelComplete={handleLevelComplete}
              isCompleted={userProfile?.completedLevels?.includes(activeLevelId) || false}
            />
          ) : (
            <LevelMap
              completedLevels={userProfile?.completedLevels || []}
              currentLevel={userProfile?.level || 1}
              onSelectLevel={id => setActiveLevelId(id)}
              onOpenExamGate={() => setExamModalOpen(true)}
              examPassed={examPassed}
              userProfile={userProfile}
              filterOnlyBosses={currentTab === 'challenges'}
            />
          )
        )}

        {/* Tab: Investigate */}
        {currentTab === 'investigate' && (
          <LevelView
            levelData={getLevelData(activeLevelId || nextUnlockedId)}
            onBackToMap={() => {
              setActiveLevelId(null);
              setCurrentTab('learn');
            }}
            onLevelComplete={handleLevelComplete}
            isCompleted={userProfile?.completedLevels?.includes(activeLevelId || nextUnlockedId) || false}
          />
        )}

        {/* Tab: Global Leaderboard */}
        {currentTab === 'leaderboard' && (
          <GlobalLeaderboard
            currentUserId={userProfile?.id || 'player-local'}
            currentUserBatch={userProfile?.batch || 'Batch 2027'}
            onSelectUserForProfile={id => setProfileModalUserId(id)}
            onCompareWithUser={u => setCompareTargetUser(u)}
          />
        )}

        {/* Tab: Investigation Toolkit */}
        {currentTab === 'toolbox' && (
          <ToolboxModal unlockedTools={userProfile?.unlockedTools || ['Basic Network Toolkit']} />
        )}

        {/* Tab: Certificate */}
        {currentTab === 'certificate' && (
          <CertificateView
            userCertificate={userCertificate}
            onOpenVerifyModal={() => setVerifyCertModalOpen(true)}
            userProfile={userProfile}
            completedLevelsCount={completedList.length}
          />
        )}
      </main>

      {/* Modals */}
      {/* 1. Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={newUser => {
          if (newUser) {
            setUserProfile(newUser);
            showToast(`Welcome, ${newUser.username}!`);
          } else {
            showToast(`Signed in successfully via Google Firebase Auth!`);
          }
          setAuthModalOpen(false);
        }}
      />

      {/* 2. Foundation Exam Gate Modal */}
      <FoundationExamModal
        isOpen={examModalOpen}
        onClose={() => setExamModalOpen(false)}
        onExamPassed={() => {
          setExamPassed(true);
          showToast('Foundation Mastery Exam Passed (80%+). Level 16 Advanced Mode Unlocked.');
        }}
        isAlreadyPassed={examPassed}
      />

      {/* 3. User Profile Modal */}
      <UserProfileModal
        userId={profileModalUserId}
        isOpen={Boolean(profileModalUserId)}
        onClose={() => setProfileModalUserId(null)}
        isCurrentUser={profileModalUserId === userProfile?.id || profileModalUserId === 'player-local'}
        onProfileUpdated={() => {}}
      />

      {/* 4. Social Comparison Modal */}
      <SocialComparisonModal
        currentUser={userProfile}
        targetUser={compareTargetUser}
        isOpen={Boolean(compareTargetUser)}
        onClose={() => setCompareTargetUser(null)}
      />

      {/* 5. Public Certificate Verification Lookup Modal */}
      <CertificateVerifyModal
        isOpen={verifyCertModalOpen}
        onClose={() => setVerifyCertModalOpen(false)}
      />

      {/* 6. Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      {/* Minimal Editorial Footer */}
      <footer className="border-t border-zinc-800 bg-[#09090b] py-6 mt-12 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-zinc-400">CyberSec: Zero-Day Academy · 50-Level Defensive & Incident Response Training</span>
          <span className="text-zinc-500">Firebase Firestore Cloud Persistence & Google Auth Enabled</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
