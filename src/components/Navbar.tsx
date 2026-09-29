import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Trophy, Wrench, Award, BarChart3, User, Flame, Search, Menu, X, ArrowRight, Cloud } from 'lucide-react';

interface NavbarProps {
  currentTab: 'learn' | 'investigate' | 'challenges' | 'leaderboard' | 'toolbox' | 'certificate' | 'admin';
  setCurrentTab: (tab: 'learn' | 'investigate' | 'challenges' | 'leaderboard' | 'toolbox' | 'certificate' | 'admin') => void;
  userProfile: any;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onOpenSearch?: () => void;
  nextUnlockedLevelId?: number;
  onSelectLevel?: (id: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userProfile,
  onOpenProfile,
  onOpenAuth,
  onOpenSearch,
  nextUnlockedLevelId = 1,
  onSelectLevel
}) => {
  const { fbUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'learn' | 'investigate' | 'challenges' | 'leaderboard' | 'toolbox' | 'certificate' | 'admin') => {
    if (tab === 'investigate') {
      if (onSelectLevel) {
        onSelectLevel(nextUnlockedLevelId);
      }
    } else {
      setCurrentTab(tab);
    }
    setMobileMenuOpen(false);
  };

  const isInvestigateActive = currentTab === 'investigate';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090b]/95 border-b border-zinc-800/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('learn')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 group-hover:border-zinc-700 transition-colors">
              <Shield className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white">
                  CyberSec
                </span>
                <span className="text-[10px] font-mono text-zinc-500">v2.6</span>
              </div>
              <span className="text-[11px] text-zinc-400 block -mt-0.5">
                Zero-Day Academy
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-zinc-400">
          <button
            onClick={() => handleNavClick('learn')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentTab === 'learn'
                ? 'text-white font-semibold bg-zinc-900'
                : 'hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            Learn
          </button>

          <button
            onClick={() => handleNavClick('investigate')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              isInvestigateActive
                ? 'text-white font-semibold bg-zinc-900'
                : 'hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            Investigate
          </button>

          <button
            onClick={() => handleNavClick('challenges')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentTab === 'challenges'
                ? 'text-white font-semibold bg-zinc-900'
                : 'hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            Challenges
          </button>

          <button
            onClick={() => handleNavClick('leaderboard')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentTab === 'leaderboard'
                ? 'text-white font-semibold bg-zinc-900'
                : 'hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            Leaderboard
          </button>

          <button
            onClick={() => handleNavClick('certificate')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentTab === 'certificate'
                ? 'text-white font-semibold bg-zinc-900'
                : 'hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            Certificate
          </button>
        </nav>

        {/* Right Side: Tools & Profile */}
        <div className="flex items-center gap-2">
          {/* Toolkit Button */}
          <button
            onClick={() => handleNavClick('toolbox')}
            title="Investigation Toolkit"
            className={`p-2 rounded-lg border text-xs transition-colors ${
              currentTab === 'toolbox'
                ? 'bg-zinc-900 border-zinc-700 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
          </button>

          {/* Admin Access Button */}
          <button
            onClick={() => handleNavClick('admin')}
            title="Platform Telemetry & Audit Logs"
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* User Account / Profile */}
          {userProfile ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors text-xs text-left cursor-pointer"
            >
              {fbUser ? (
                <div className="flex items-center gap-1 font-mono text-emerald-400" title="Firebase Cloud Database Synced">
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] hidden lg:inline">SYNCED</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 font-mono text-zinc-400">
                  <Flame className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{userProfile.streakDays || 1}d</span>
                </div>
              )}
              <span className="text-zinc-700 hidden sm:inline">·</span>
              <div className="font-mono text-zinc-300 hidden sm:block">
                <span className="text-zinc-500">LVL </span>
                <span className="font-bold text-white">{userProfile.level || 1}</span>
              </div>
              <span className="text-zinc-700 hidden sm:inline">·</span>
              <div className="font-mono text-blue-400 font-semibold">
                {userProfile.xp?.toLocaleString() || 0} XP
              </div>
              {fbUser?.photoURL ? (
                <img src={fbUser.photoURL} alt="User" className="w-5 h-5 rounded-full object-cover ml-0.5" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 ml-0.5">
                  <User className="w-3 h-3" />
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#09090b] px-4 py-3 space-y-1 text-xs">
          <button
            onClick={() => handleNavClick('learn')}
            className={`w-full text-left px-3 py-2 rounded-md ${
              currentTab === 'learn' ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-400'
            }`}
          >
            Learn & Curriculum
          </button>
          <button
            onClick={() => handleNavClick('investigate')}
            className={`w-full text-left px-3 py-2 rounded-md ${
              isInvestigateActive ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-400'
            }`}
          >
            Investigate Current Case (Level {nextUnlockedLevelId})
          </button>
          <button
            onClick={() => handleNavClick('challenges')}
            className={`w-full text-left px-3 py-2 rounded-md ${
              currentTab === 'challenges' ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-400'
            }`}
          >
            Zero-Day Challenges
          </button>
          <button
            onClick={() => handleNavClick('leaderboard')}
            className={`w-full text-left px-3 py-2 rounded-md ${
              currentTab === 'leaderboard' ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-400'
            }`}
          >
            Global Leaderboard
          </button>
          <button
            onClick={() => handleNavClick('certificate')}
            className={`w-full text-left px-3 py-2 rounded-md ${
              currentTab === 'certificate' ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-400'
            }`}
          >
            Official Certificate
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className="w-full text-left px-3 py-2 rounded-md text-zinc-400"
          >
            Platform Telemetry & Admin
          </button>
        </div>
      )}
    </header>
  );
};
