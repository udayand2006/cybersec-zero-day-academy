import React, { useState, useEffect } from 'react';
import { CyberApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PublicUserProfile } from '../types/cyber';
import { User, Shield, Check, X, Award, Flame, ExternalLink, Cloud, CloudCheck } from 'lucide-react';

interface UserProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  isCurrentUser: boolean;
  onProfileUpdated?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userId,
  isOpen,
  onClose,
  isCurrentUser,
  onProfileUpdated
}) => {
  const { fbUser, userProfile: authProfile, updateProfile: updateAuthProfile, logout: authLogout, signInWithGoogle } = useAuth();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit settings state (for current user)
  const [editUsername, setEditUsername] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [editCertificateName, setEditCertificateName] = useState('');
  const [editCountry, setEditCountry] = useState('Global');
  const [editEmail, setEditEmail] = useState('');
  const [editBatch, setEditBatch] = useState('Batch 2027');
  const [publicLeaderboardEnabled, setPublicLeaderboardEnabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadProfile(userId);
    }
  }, [isOpen, userId, authProfile]);

  const loadProfile = async (id: string) => {
    setLoading(true);
    const data = await CyberApiService.getPublicUserProfile(id);
    if (data) {
      setProfile(data);
      setEditUsername(data.username);
      setEditBatch(data.batch);
    }
    // Also fetch private profile details if current user
    if (isCurrentUser) {
      if (authProfile) {
        setEditFullName(authProfile.fullName || '');
        setEditCertificateName(authProfile.certificateName || authProfile.fullName || '');
        setEditCountry(authProfile.country || 'Global');
        setEditEmail(authProfile.email || '');
      } else {
        const myProfile = await CyberApiService.getUserProfile();
        if (myProfile?.user) {
          setEditFullName(myProfile.user.fullName || '');
          setEditCertificateName(myProfile.user.certificateName || myProfile.user.fullName || '');
          setEditCountry(myProfile.user.country || 'Global');
          setEditEmail(myProfile.user.email || '');
        }
      }
    }
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    await updateAuthProfile({
      username: editUsername,
      fullName: editFullName,
      certificateName: editCertificateName,
      country: editCountry,
      email: editEmail,
      batch: editBatch,
      publicProfileEnabled: publicLeaderboardEnabled
    });

    await CyberApiService.updateProfile({
      username: editUsername,
      fullName: editFullName,
      certificateName: editCertificateName,
      country: editCountry,
      email: editEmail,
      batch: editBatch,
      publicProfileEnabled: publicLeaderboardEnabled
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    if (onProfileUpdated) onProfileUpdated();
  };

  const handleLogout = async () => {
    await authLogout();
    await CyberApiService.logout();
    if (onProfileUpdated) onProfileUpdated();
    onClose();
  };

  const handleConnectGoogle = async () => {
    await signInWithGoogle();
    if (onProfileUpdated) onProfileUpdated();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl max-w-xl w-full p-6 sm:p-7 space-y-6 my-8 text-zinc-200 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Investigator Header */}
        <div className="flex items-start gap-4 border-b border-zinc-800 pb-5">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
            {fbUser?.photoURL ? (
              <img src={fbUser.photoURL} alt="Avatar" className="w-full h-full rounded-xl object-cover" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {profile ? profile.username : (authProfile?.username || 'Investigator Profile')}
              </h2>
              {isCurrentUser && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-blue-400">
                  YOUR PROFILE
                </span>
              )}
            </div>

            <div className="text-xs font-mono text-zinc-400 flex items-center gap-2 mt-0.5">
              <span>{profile?.batch || authProfile?.batch || 'Batch 2027'}</span>
              <span className="text-zinc-600">·</span>
              <span>Level {profile?.level || authProfile?.level || 1} Investigator</span>
            </div>

            {/* Cloud Persistence Badge */}
            {isCurrentUser && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono">
                {fbUser ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                    <Cloud className="w-3 h-3 text-emerald-400" />
                    Firestore Cloud Synced: {fbUser.email}
                  </span>
                ) : (
                  <button
                    onClick={handleConnectGoogle}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs transition-colors cursor-pointer"
                  >
                    <Cloud className="w-3 h-3" />
                    Sign in with Google (Sync to Firestore)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-500 font-mono text-xs">
            Retrieving dossier...
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-black border border-zinc-800 rounded-lg p-3">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">TOTAL XP</span>
                <span className="text-base font-mono font-bold text-white mt-1 block">
                  {profile.xp.toLocaleString()}
                </span>
              </div>

              <div className="bg-black border border-zinc-800 rounded-lg p-3">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">ACCURACY</span>
                <span className="text-base font-mono font-bold text-white mt-1 block">
                  {profile.quizAccuracy}%
                </span>
              </div>

              <div className="bg-black border border-zinc-800 rounded-lg p-3">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">CASES SOLVED</span>
                <span className="text-base font-mono font-bold text-white mt-1 block">
                  {profile.casesSolved}
                </span>
              </div>

              <div className="bg-black border border-zinc-800 rounded-lg p-3">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">GLOBAL RANK</span>
                <span className="text-base font-mono font-bold text-white mt-1 block">
                  #{profile.globalRank}
                </span>
              </div>
            </div>

            {/* Achievements & Badges */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 uppercase font-semibold block">
                Investigator Badges ({profile.badges.length})
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {profile.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-black border border-zinc-800 text-zinc-300"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Certificate Status */}
            <div className="p-3.5 rounded-lg bg-black border border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px]">CERTIFICATE ACCREDITATION:</span>
                <span className="text-white font-bold">
                  {profile.certificateEarned ? `ISSUED (${profile.certificateId})` : `${profile.levelsCompleted}/50 Levels Completed`}
                </span>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] ${profile.certificateEarned ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>
                {profile.certificateEarned ? 'VERIFIED' : 'IN PROGRESS'}
              </span>
            </div>

            {/* Current User Edit Profile Settings */}
            {isCurrentUser && (
              <div className="space-y-4 pt-3 border-t border-zinc-800 text-xs">
                <span className="text-xs font-mono text-zinc-400 uppercase font-semibold block">
                  Profile Settings
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1">Callsign / Username</label>
                    <input
                      type="text"
                      value={editUsername}
                      onChange={e => setEditUsername(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded px-3 py-1.5 text-white font-mono focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Official Name (on Certificate)</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={editCertificateName}
                      onChange={e => setEditCertificateName(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Country / Region</label>
                    <input
                      type="text"
                      placeholder="e.g. United States, Germany, India"
                      value={editCountry}
                      onChange={e => setEditCountry(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Cohort Batch</label>
                    <select
                      value={editBatch}
                      onChange={e => setEditBatch(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-zinc-700"
                    >
                      <option value="Batch 2026">Batch 2026</option>
                      <option value="Batch 2027">Batch 2027</option>
                      <option value="Batch 2028">Batch 2028</option>
                      <option value="Independent">Independent Scholar</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={publicLeaderboardEnabled}
                      onChange={e => setPublicLeaderboardEnabled(e.target.checked)}
                      className="accent-blue-600 w-4 h-4 rounded"
                    />
                    <span>Appear on public leaderboard</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                {saveSuccess && (
                  <div className="text-zinc-300 text-[11px] font-mono">
                    ✓ Profile settings updated successfully.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
