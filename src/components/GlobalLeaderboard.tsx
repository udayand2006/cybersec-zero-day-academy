import React, { useState, useEffect } from 'react';
import { CyberApiService } from '../services/api';
import { FirebaseDbService } from '../services/firebaseDb';
import { LeaderboardUser } from '../types/cyber';
import { Trophy, Search, Check, ExternalLink, Cloud } from 'lucide-react';

interface GlobalLeaderboardProps {
  currentUserId: string;
  currentUserBatch: string;
  onSelectUserForProfile: (userId: string) => void;
  onCompareWithUser?: (user: LeaderboardUser) => void;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  currentUserId,
  currentUserBatch,
  onSelectUserForProfile
}) => {
  const [filter, setFilter] = useState<'all' | 'batch' | 'top'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);

    let firestoreUsers: LeaderboardUser[] = [];
    try {
      firestoreUsers = await FirebaseDbService.getLeaderboard();
    } catch (e) {
      console.warn('Could not retrieve Firestore leaderboard', e);
    }

    const data = await CyberApiService.getLeaderboard(
      filter === 'batch' ? 'batch' : 'all',
      filter === 'batch' ? currentUserBatch : undefined
    );

    const apiUsers: LeaderboardUser[] = data.leaderboard || [];

    // Merge Firestore live users with API cohort directory
    const existingIds = new Set(firestoreUsers.map(u => u.id));
    const merged = [
      ...firestoreUsers,
      ...apiUsers.filter(u => !existingIds.has(u.id))
    ];

    // Filter by batch if requested
    let finalUsers = merged;
    if (filter === 'batch') {
      finalUsers = merged.filter(u => u.batch === currentUserBatch);
    } else if (filter === 'top') {
      finalUsers = merged.slice(0, 10);
    }

    // Re-rank based on XP
    finalUsers.sort((a, b) => b.xp - a.xp);
    finalUsers.forEach((u, i) => {
      u.rank = i + 1;
    });

    setLeaderboardData(finalUsers);
    setLoading(false);
  };

  const filteredList = leaderboardData.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.username.toLowerCase().includes(q) || u.batch.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
            Academic Standing & Cohort Telemetry
          </span>
          <h1 className="text-2xl font-bold text-white mt-0.5">
            Global Leaderboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Server-validated investigator rankings based on case resolution accuracy and verified completion.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-zinc-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors ${
              filter === 'all' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Cohorts
          </button>
          <button
            onClick={() => setFilter('batch')}
            className={`px-3 py-1.5 rounded transition-colors ${
              filter === 'batch' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {currentUserBatch || 'My Batch'}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter investigators by callsig or batch..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#0f0f11] border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-sans"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 bg-black/40">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">INVESTIGATOR</th>
                <th className="py-3 px-4">COHORT</th>
                <th className="py-3 px-4">LEVEL</th>
                <th className="py-3 px-4">VERIFIED XP</th>
                <th className="py-3 px-4">CASES SOLVED</th>
                <th className="py-3 px-4">ACCURACY</th>
                <th className="py-3 px-4 text-right">PROFILE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    Loading standings...
                  </td>
                </tr>
              ) : filteredList.length > 0 ? (
                filteredList.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      user.isCurrent
                        ? 'bg-blue-950/20 border-l-2 border-l-blue-500 text-white'
                        : 'text-zinc-300 hover:bg-zinc-900/60'
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-bold text-zinc-400">
                      {user.rank || idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-sans">{user.username}</span>
                        {user.isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-blue-400 border border-zinc-700">
                            YOU
                          </span>
                        )}
                        {user.certificateEarned && (
                          <span title="Certificate Verified" className="text-zinc-400 text-[10px]">
                            [CERTIFIED]
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-zinc-400">{user.batch}</td>

                    <td className="py-3 px-4 font-bold text-zinc-200">
                      LVL {user.level}
                    </td>

                    <td className="py-3 px-4 text-blue-400 font-semibold">
                      {user.xp.toLocaleString()} XP
                    </td>

                    <td className="py-3 px-4 text-zinc-300">
                      {user.casesSolved}
                    </td>

                    <td className="py-3 px-4 text-zinc-300">
                      {user.quizAccuracy}%
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectUserForProfile(user.id)}
                        className="text-zinc-500 hover:text-white transition-colors"
                        title="View Dossier"
                      >
                        <ExternalLink className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-600">
                    No investigators matched your search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
