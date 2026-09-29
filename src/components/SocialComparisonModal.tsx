import React from 'react';
import { LeaderboardUser } from '../types/cyber';
import { Users, Trophy, Award, Flame, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface SocialComparisonModalProps {
  currentUser: any;
  targetUser: LeaderboardUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SocialComparisonModal: React.FC<SocialComparisonModalProps> = ({
  currentUser,
  targetUser,
  isOpen,
  onClose
}) => {
  if (!isOpen || !targetUser) return null;

  const xpDiff = targetUser.xp - (currentUser?.xp || 0);
  const levelDiff = targetUser.level - (currentUser?.level || 1);
  const casesDiff = targetUser.casesSolved - (currentUser?.casesSolved || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-8">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                Peer Comparison Matrix
              </span>
              <h2 className="text-lg font-bold text-white">
                Progress Comparison
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Head-to-Head Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current User */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">YOU</span>
            <h3 className="text-base font-bold text-white truncate">{currentUser?.username || 'Investigator'}</h3>
            <span className="text-xs font-mono text-slate-400 block">{currentUser?.batch || 'Batch 2027'}</span>
            <div className="pt-2">
              <span className="text-2xl font-bold font-mono text-cyan-400 block">
                LVL {currentUser?.level || 1}
              </span>
              <span className="text-xs font-mono text-emerald-400 block">
                {currentUser?.xp?.toLocaleString() || 0} XP
              </span>
            </div>
          </div>

          {/* Target User */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-1">
            <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">PEER</span>
            <h3 className="text-base font-bold text-white truncate">{targetUser.username}</h3>
            <span className="text-xs font-mono text-slate-400 block">{targetUser.batch}</span>
            <div className="pt-2">
              <span className="text-2xl font-bold font-mono text-purple-400 block">
                LVL {targetUser.level}
              </span>
              <span className="text-xs font-mono text-emerald-400 block">
                {targetUser.xp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>

        {/* Metric Comparison Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
            <span className="text-slate-400">Total XP Difference:</span>
            <span className={xpDiff > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
              {xpDiff > 0 ? `+${xpDiff.toLocaleString()} XP behind` : `${Math.abs(xpDiff).toLocaleString()} XP ahead`}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
            <span className="text-slate-400">Campaign Levels:</span>
            <span className="text-white font-bold">
              {currentUser?.completedLevels?.length || 0} vs {targetUser.level}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
            <span className="text-slate-400">Cases Solved:</span>
            <span className="text-white font-bold">
              {currentUser?.casesSolved || 0} vs {targetUser.casesSolved}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
            <span className="text-slate-400">Boss Challenges Defeated:</span>
            <span className="text-rose-400 font-bold">
              {currentUser?.bossChallengesCompleted || 0} vs {targetUser.bossChallengesCompleted}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Certificate Status:</span>
            <span className="text-amber-400 font-bold">
              {targetUser.certificateEarned ? '🏆 Verified' : 'In Progress'}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold hover:text-white"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
