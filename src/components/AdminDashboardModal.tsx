import React, { useState, useEffect } from 'react';
import { CyberApiService } from '../services/api';
import { BarChart3, Users, Award, Shield, X, Search, FileText, Activity } from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'audit'>('overview');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    setLoading(true);
    const data = await CyberApiService.getAdminStats();
    setStats(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  const usersList = (stats?.users || []).filter((u: any) => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.certificateName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.batch || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl max-w-4xl w-full p-6 sm:p-7 space-y-6 my-8 text-zinc-200 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 uppercase font-semibold">
              Platform Administration
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs font-mono text-zinc-500">Security Telemetry</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Admin Management Console
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time cohort telemetry, user accreditation records, and platform security audit logs.
          </p>

          {/* Subtabs */}
          <div className="flex items-center gap-1 pt-3 text-xs font-mono">
            <button
              onClick={() => setAdminTab('overview')}
              className={`px-3 py-1.5 rounded transition-colors ${
                adminTab === 'overview' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              OVERVIEW
            </button>
            <button
              onClick={() => setAdminTab('users')}
              className={`px-3 py-1.5 rounded transition-colors ${
                adminTab === 'users' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              USER MANAGEMENT
            </button>
            <button
              onClick={() => setAdminTab('audit')}
              className={`px-3 py-1.5 rounded transition-colors ${
                adminTab === 'audit' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              AUDIT LOGS
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-zinc-500 font-mono text-xs">
            Aggregating platform metrics...
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* TAB: OVERVIEW */}
            {adminTab === 'overview' && (
              <div className="space-y-6">
                {/* 5 Information Dense KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-black border border-zinc-800 rounded-lg p-3">
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase">TOTAL USERS</span>
                    <span className="text-lg font-mono font-bold text-white mt-1 block">
                      {stats.totalUsers.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-black border border-zinc-800 rounded-lg p-3">
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase">ACTIVE THIS WEEK</span>
                    <span className="text-lg font-mono font-bold text-white mt-1 block">
                      {stats.activeUsers.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-black border border-zinc-800 rounded-lg p-3">
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase">CASES SOLVED</span>
                    <span className="text-lg font-mono font-bold text-white mt-1 block">
                      {stats.totalCasesSolved.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-black border border-zinc-800 rounded-lg p-3">
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase">AVG ACCURACY</span>
                    <span className="text-lg font-mono font-bold text-white mt-1 block">
                      {stats.averageScore}%
                    </span>
                  </div>

                  <div className="bg-black border border-zinc-800 rounded-lg p-3">
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase">CERTIFICATES</span>
                    <span className="text-lg font-mono font-bold text-white mt-1 block">
                      {stats.totalCertificatesIssued}
                    </span>
                  </div>
                </div>

                {/* Cohort Distribution */}
                <div className="bg-black border border-zinc-800 rounded-lg p-4 font-mono text-xs space-y-2">
                  <span className="text-zinc-400 font-bold uppercase block">
                    Cohort Distribution Breakdown
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-zinc-300">
                    {Object.entries(stats.batchDistribution || {}).map(([batch, count]) => (
                      <div key={batch} className="p-2 rounded bg-zinc-900 border border-zinc-800">
                        <span className="text-zinc-500 block text-[10px]">{batch}</span>
                        <span className="text-white font-bold">{count as number} Investigators</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: USERS */}
            {adminTab === 'users' && (
              <div className="space-y-4 font-mono text-xs">
                {/* Search field */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users by name, username, email, cohort..."
                    value={userSearchQuery}
                    onChange={e => setUserSearchQuery(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded pl-8 pr-3 py-1.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                {/* Users Table */}
                <div className="border border-zinc-800 rounded overflow-x-auto max-h-[320px]">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-black sticky top-0 border-b border-zinc-800 text-zinc-500">
                      <tr>
                        <th className="py-2 px-3">FULL NAME</th>
                        <th className="py-2 px-3">USERNAME</th>
                        <th className="py-2 px-3">CERTIFICATE NAME</th>
                        <th className="py-2 px-3">BATCH</th>
                        <th className="py-2 px-3">LEVEL</th>
                        <th className="py-2 px-3">XP</th>
                        <th className="py-2 px-3">CERT STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/60">
                      {usersList.map((user: any) => (
                        <tr
                          key={user.id}
                          onClick={() => setSelectedUserDetail(user)}
                          className="hover:bg-zinc-900 cursor-pointer text-zinc-300 transition-colors"
                        >
                          <td className="py-2 px-3 font-sans text-white font-medium">{user.fullName}</td>
                          <td className="py-2 px-3">{user.username}</td>
                          <td className="py-2 px-3 text-zinc-400">{user.certificateName}</td>
                          <td className="py-2 px-3 text-zinc-500">{user.batch}</td>
                          <td className="py-2 px-3 text-white font-bold">L{user.level}</td>
                          <td className="py-2 px-3 text-blue-400 font-semibold">{user.xp}</td>
                          <td className="py-2 px-3">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${user.certificateEarned ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>
                              {user.certificateEarned ? 'ISSUED' : 'IN PROGRESS'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Selected User Modal Box */}
                {selectedUserDetail && (
                  <div className="p-3.5 rounded bg-black border border-zinc-800 space-y-1.5 text-zinc-300">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                      <span className="text-white font-bold">
                        USER DETAILS: {selectedUserDetail.username} ({selectedUserDetail.id})
                      </span>
                      <button
                        onClick={() => setSelectedUserDetail(null)}
                        className="text-zinc-500 hover:text-white"
                      >
                        ✕ Close
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-zinc-400">
                      <div>
                        <span className="text-zinc-500 block">EMAIL:</span>
                        <span>{selectedUserDetail.email}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">COUNTRY:</span>
                        <span>{selectedUserDetail.country}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">CASES SOLVED:</span>
                        <span>{selectedUserDetail.casesSolved}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">CERTIFICATE ID:</span>
                        <span className="text-white">{selectedUserDetail.certificateId || 'Not Yet Issued'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: AUDIT LOGS */}
            {adminTab === 'audit' && (
              <div className="bg-black border border-zinc-800 rounded-lg p-4 font-mono text-xs space-y-3">
                <span className="text-white font-bold uppercase block">
                  Security Event Audit Record (Chronological)
                </span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {(stats.auditLogs || []).map((log: any) => (
                    <div key={log.id} className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 space-y-1">
                      <div className="flex justify-between text-zinc-500">
                        <span>{log.timestamp}</span>
                        <span className="text-white font-bold">[{log.action}]</span>
                        <span>ACTOR: {log.actor}</span>
                      </div>
                      <p className="text-zinc-400">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
