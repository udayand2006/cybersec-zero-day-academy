import React, { useState } from 'react';
import { CURRICULUM_PHASES, ALL_50_LEVELS } from '../data/curriculum';
import {
  Shield,
  Lock,
  Check,
  AlertTriangle,
  Search,
  ArrowRight,
  Clock,
  Play,
  Layers,
  Terminal,
  Activity,
  ChevronRight
} from 'lucide-react';

interface LevelMapProps {
  completedLevels: number[];
  currentLevel: number;
  onSelectLevel: (levelId: number) => void;
  onOpenExamGate: () => void;
  examPassed: boolean;
  userProfile?: any;
  filterOnlyBosses?: boolean;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  completedLevels,
  currentLevel,
  onSelectLevel,
  onOpenExamGate,
  examPassed,
  userProfile,
  filterOnlyBosses = false
}) => {
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const completedCount = completedLevels.length;
  const progressPercent = Math.round((completedCount / 50) * 100);

  // Highest unlocked level logic
  const maxCompleted = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
  const nextUnlockedId = Math.min(50, maxCompleted + 1);
  const nextLevelData = ALL_50_LEVELS.find(l => l.id === nextUnlockedId) || ALL_50_LEVELS[0];

  const isLevelUnlocked = (id: number) => {
    if (id <= 1) return true;
    if (completedLevels.includes(id)) return true;
    if (id >= 16 && (!completedLevels.includes(15) || !examPassed)) {
      return false;
    }
    return id <= nextUnlockedId;
  };

  const getRankTitle = (lvl: number) => {
    if (lvl >= 46) return 'Crisis Commander';
    if (lvl >= 36) return 'Principal Threat Hunter';
    if (lvl >= 26) return 'Cyber Defense Engineer';
    if (lvl >= 16) return 'Advanced Investigator';
    if (lvl >= 6) return 'Network Defense Specialist';
    return 'Junior SOC Analyst';
  };

  const rankTitle = userProfile?.rankTitle || getRankTitle(nextUnlockedId);
  const userXp = userProfile?.xp || (completedCount * 250);
  const userAccuracy = userProfile?.investigationScore || 92;
  const displayName = userProfile?.fullName || userProfile?.username || 'Investigator';

  // Greeting by current time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Filter levels by phase and search query
  const filteredPhases = CURRICULUM_PHASES.filter(phase => {
    if (selectedPhaseFilter !== 'all' && phase.phaseId !== selectedPhaseFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (EDITORIAL, MINIMAL, STUDENT-FRIENDLY)                   */}
      {/* ========================================================================= */}
      <section className="pt-2 pb-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                CyberSec: Zero-Day Academy
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-[11px] font-mono text-zinc-500">
                50-Level Campaign
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Learn. Investigate. Defend.
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
              Start with the fundamentals. Learn how systems work. Investigate simulated cyber incidents. Build the skills of a cyber investigator.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {nextUnlockedId >= 16 && !examPassed && completedLevels.includes(15) ? (
                <button
                  onClick={onOpenExamGate}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-2 shadow-sm"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Take Foundation Exam (Unlock Level 16)</span>
                </button>
              ) : (
                <button
                  onClick={() => onSelectLevel(nextUnlockedId)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>
                    {completedCount === 0
                      ? 'Start Learning'
                      : `Continue Mission (Level ${nextUnlockedId})`}
                  </span>
                </button>
              )}

              <a
                href="#curriculum-map"
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-medium transition-colors"
              >
                Explore the Academy
              </a>
            </div>
          </div>

          {/* Right Visual Column: Minimal Investigation Board Preview */}
          <div className="lg:col-span-5">
            <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-5 font-mono text-xs space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-zinc-200 font-semibold">CASE #CY-0182</span>
                </div>
                <span className="text-[10px] text-zinc-500">SIMULATION READY</span>
              </div>

              {/* Case details rows */}
              <div className="space-y-1.5 text-[11px] text-zinc-400">
                <div className="flex justify-between">
                  <span className="text-zinc-500">TARGET NODE:</span>
                  <span className="text-zinc-200">192.168.10.45:443</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">EVIDENCE ID:</span>
                  <span className="text-zinc-200">EVD-042 [Auth Log]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">EVENT CORRELATION:</span>
                  <span className="text-zinc-300">Kerberos Pre-Auth Failure</span>
                </div>
              </div>

              {/* Minimal Timeline */}
              <div className="pt-2 border-t border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block mb-1">INCIDENT TIMELINE</span>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                  <span className="text-zinc-400">14:21 Ingress</span>
                  <span>→</span>
                  <span className="text-blue-400 font-semibold">14:31 Auth Scan</span>
                  <span>→</span>
                  <span className="text-zinc-400">14:42 Exfil</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Learning Journey Pathway */}
        <div className="pt-3 border-t border-zinc-800/60">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
            Curriculum Progression Pathway
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono text-zinc-400">
            <span className="text-white font-medium">NETWORKING</span>
            <span className="text-zinc-600">→</span>
            <span>SECURITY</span>
            <span className="text-zinc-600">→</span>
            <span>FORENSICS</span>
            <span className="text-zinc-600">→</span>
            <span>SOC</span>
            <span className="text-zinc-600">→</span>
            <span>INCIDENT RESPONSE</span>
            <span className="text-zinc-600">→</span>
            <span className="text-blue-400">ADVANCED INVESTIGATION</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DASHBOARD: CURRENT MISSION & COMPACT PROGRESS (NOT A WALL OF CARDS)   */}
      {/* ========================================================================= */}
      <section className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 sm:p-7 space-y-6">
        {/* Top Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {greeting}, {displayName}.
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Continue your investigation.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-white font-bold">{userXp.toLocaleString()}</span> XP
            </div>
            <span className="text-zinc-700">·</span>
            <div>
              <span className="text-white font-bold">{userAccuracy}%</span> Accuracy
            </div>
            <span className="text-zinc-700">·</span>
            <div>
              <span className="text-white font-bold">{completedCount}</span> Cases Solved
            </div>
          </div>
        </div>

        {/* Current Mission - Large Focused Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 rounded-lg bg-black border border-zinc-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-400">
                LEVEL {String(nextUnlockedId).padStart(2, '0')}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs font-mono text-zinc-400 uppercase">
                {rankTitle}
              </span>
              {nextLevelData.isBoss && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200">
                  Zero-Day Boss
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white">
              {nextLevelData.title}
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              {nextLevelData.subtitle}
            </p>
          </div>

          <div className="shrink-0">
            {nextUnlockedId >= 16 && !examPassed && completedLevels.includes(15) ? (
              <button
                onClick={onOpenExamGate}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-2"
              >
                <span>Foundation Exam Required →</span>
              </button>
            ) : (
              <button
                onClick={() => onSelectLevel(nextUnlockedId)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Continue Investigation →</span>
              </button>
            )}
          </div>
        </div>

        {/* Compact Progress Indicator */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">
              <strong className="text-white">{completedCount}</strong> / 50 Levels
            </span>
            <span className="text-zinc-400">
              {progressPercent}% COMPLETE
            </span>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LEVEL 15 FOUNDATION GATE CALLOUT                                      */}
      {/* ========================================================================= */}
      <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-zinc-300">
              Level 15 Knowledge Gate: Foundation Mastery Exam
            </span>
            {examPassed && (
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                <Check className="w-3 h-3 text-white" />
                <span>Passed</span>
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Minimum 80% passing score is required across fundamental networking to unlock Level 16+. From Level 16 onward, Advanced Investigator Mode activates with pre-lab gates, multi-source log correlation, and decoy traffic.
          </p>
        </div>

        <button
          onClick={onOpenExamGate}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          {examPassed ? 'Review Exam' : 'Take Foundation Exam'}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. 50-LEVEL CURRICULUM JOURNEY MAP                                       */}
      {/* ========================================================================= */}
      <div id="curriculum-map" className="space-y-6 pt-4">
        {/* Navigation Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
          {/* Phase Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedPhaseFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedPhaseFilter === 'all'
                  ? 'bg-zinc-900 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All 10 Phases
            </button>
            {CURRICULUM_PHASES.map(p => (
              <button
                key={p.phaseId}
                onClick={() => setSelectedPhaseFilter(p.phaseId)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  selectedPhaseFilter === p.phaseId
                    ? 'bg-zinc-900 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                P{p.phaseId}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts or logs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-sans"
            />
          </div>
        </div>

        {/* Phase Modules */}
        <div className="space-y-8">
          {filteredPhases.map(phase => {
            const phaseLevels = ALL_50_LEVELS.filter(l => l.phaseId === phase.phaseId).filter(l => {
              if (filterOnlyBosses && !l.isBoss) return false;
              if (!searchTerm.trim()) return true;
              const q = searchTerm.toLowerCase();
              return (
                l.title.toLowerCase().includes(q) ||
                l.subtitle.toLowerCase().includes(q) ||
                String(l.id).includes(q)
              );
            });

            if (phaseLevels.length === 0) return null;

            return (
              <div key={phase.phaseId} className="space-y-3">
                {/* Phase Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-zinc-200 font-bold">
                      PHASE {phase.phaseId}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-400">
                      {phase.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Levels {phase.levelsRange}
                  </span>
                </div>

                {/* 5 Level Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {phaseLevels.map(lvl => {
                    const unlocked = isLevelUnlocked(lvl.id);
                    const completed = completedLevels.includes(lvl.id);
                    const isNext = lvl.id === nextUnlockedId;

                    return (
                      <button
                        key={lvl.id}
                        onClick={() => {
                          if (unlocked) {
                            onSelectLevel(lvl.id);
                          } else if (lvl.id >= 16 && !examPassed) {
                            onOpenExamGate();
                          }
                        }}
                        disabled={!unlocked && (lvl.id < 16 || examPassed)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between min-h-[140px] transition-colors relative ${
                          completed
                            ? 'bg-[#0f0f11] border-zinc-800/80 hover:border-zinc-700'
                            : isNext
                            ? 'bg-black border-blue-600/80 text-white'
                            : unlocked
                            ? 'bg-[#0f0f11] border-zinc-800 hover:border-zinc-700 text-zinc-200'
                            : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 cursor-not-allowed opacity-60'
                        }`}
                      >
                        {/* Top row */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-mono text-zinc-400">
                              {String(lvl.id).padStart(2, '0')}
                            </span>

                            {completed ? (
                              <span className="text-[11px] font-mono text-zinc-300 flex items-center gap-1">
                                <Check className="w-3 h-3 text-white" />
                                <span>DONE</span>
                              </span>
                            ) : lvl.isBoss ? (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 font-semibold">
                                BOSS
                              </span>
                            ) : isNext ? (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-600 text-white font-medium">
                                NEXT
                              </span>
                            ) : !unlocked ? (
                              <Lock className="w-3 h-3 text-zinc-600" />
                            ) : null}
                          </div>

                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                            {lvl.title}
                          </h4>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-normal">
                            {lvl.subtitle}
                          </p>
                        </div>

                        {/* Bottom row */}
                        <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                          <span>~{lvl.estimatedMinutes}m</span>
                          <span>+{lvl.xpReward} XP</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
