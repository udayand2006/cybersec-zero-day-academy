import React, { useState } from 'react';
import { LevelData, QuizQuestion, LogEntry } from '../types/cyber';
import { InteractiveSimulations } from './InteractiveSimulations';
import {
  BookOpen,
  Terminal,
  HelpCircle,
  ShieldCheck,
  Search,
  Check,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Lock,
  Sparkles,
  FileText,
  ShieldAlert,
  Network,
  RotateCcw,
  Layers,
  Activity
} from 'lucide-react';

interface LevelViewProps {
  levelData: LevelData;
  onBackToMap: () => void;
  onLevelComplete: (quizScore: number, investigationScore: number, hintsUsed: number) => void;
  isCompleted: boolean;
}

export const LevelView: React.FC<LevelViewProps> = ({
  levelData,
  onBackToMap,
  onLevelComplete,
  isCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'simulation' | 'prelab' | 'investigation' | 'quiz'>('theory');
  const [explainLikeImNew, setExplainLikeImNew] = useState(false);
  const [theoryMarkedUnderstood, setTheoryMarkedUnderstood] = useState(false);

  // Pre-Lab State (for Level 16+)
  const hasPreLab = levelData.metadata.id > 15 && levelData.preLabAssessment && levelData.preLabAssessment.length > 0;
  const [preLabAnswers, setPreLabAnswers] = useState<{ [qId: string]: number }>({});
  const [preLabPassed, setPreLabPassed] = useState(!hasPreLab);
  const [preLabFeedback, setPreLabFeedback] = useState<string | null>(null);

  // Investigation Lab Workstation State
  const [workstationView, setWorkstationView] = useState<'case' | 'evidence' | 'timeline' | 'logs' | 'hypotheses' | 'report'>('logs');
  const [activeEvidenceTab, setActiveEvidenceTab] = useState(0);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low' | 'info'>('all');
  const [hideDecoys, setHideDecoys] = useState(false);
  const [selectedLogForInspection, setSelectedLogForInspection] = useState<LogEntry | null>(null);
  const [timelineStep, setTimelineStep] = useState<number | null>(null);

  // Hypothesis State
  const [selectedHypothesis, setSelectedHypothesis] = useState<string | null>(null);

  // Investigation Questions Answers State
  const [invAnswers, setInvAnswers] = useState<{ [qId: string]: any }>({});
  const [invSubmitted, setInvSubmitted] = useState(false);
  const [invScore, setInvScore] = useState(0);
  const [invErrors, setInvErrors] = useState<{ [qId: string]: boolean }>({});

  // Consequence Decision State
  const [selectedConsequence, setSelectedConsequence] = useState<string | null>(null);

  // Final Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Hints count
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Handlers
  const handlePreLabSubmit = () => {
    if (!levelData.preLabAssessment) return;
    let correct = 0;
    levelData.preLabAssessment.forEach(q => {
      if (preLabAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const pct = Math.round((correct / levelData.preLabAssessment.length) * 100);
    if (pct >= 80) {
      setPreLabPassed(true);
      setPreLabFeedback(`Verification Passed (${pct}%). Advanced Investigation Lab unlocked.`);
      setActiveTab('investigation');
    } else {
      setPreLabPassed(false);
      setPreLabFeedback(`Score: ${pct}%. Minimum 80% required for Advanced Mode. Please review the Theory.`);
    }
  };

  const handleInvestigationSubmit = () => {
    let totalPoints = 0;
    let earnedPoints = 0;
    const errors: { [qId: string]: boolean } = {};

    levelData.investigation.investigationQuestions.forEach(q => {
      totalPoints += q.points;
      const userAns = invAnswers[q.id];
      if (userAns === q.correctAnswer) {
        earnedPoints += q.points;
        errors[q.id] = false;
      } else {
        errors[q.id] = true;
      }
    });

    const calculatedScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;
    setInvScore(calculatedScore);
    setInvErrors(errors);
    setInvSubmitted(true);

    if (calculatedScore >= 75) {
      setActiveTab('quiz');
    }
  };

  const handleQuizSubmit = () => {
    let correct = 0;
    levelData.finalQuiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const calculatedQuizScore = levelData.finalQuiz.length > 0
      ? Math.round((correct / levelData.finalQuiz.length) * 100)
      : 100;

    setQuizScore(calculatedQuizScore);
    setQuizSubmitted(true);

    onLevelComplete(calculatedQuizScore, invScore || 100, hintsUsed);
  };

  const currentSource = levelData.investigation.evidenceSources[activeEvidenceTab] || levelData.investigation.evidenceSources[0];

  const filteredLogs = currentSource ? currentSource.logs.filter(log => {
    if (hideDecoys && log.isDecoy) return false;
    if (severityFilter !== 'all' && log.severity !== severityFilter) return false;
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        (log.sourceIp || '').toLowerCase().includes(q) ||
        (log.destIp || '').toLowerCase().includes(q) ||
        log.eventType.toLowerCase().includes(q) ||
        (log.user || '').toLowerCase().includes(q)
      );
    }
    return true;
  }) : [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. EDITORIAL HEADER & NAVIGATION                                         */}
      {/* ========================================================================= */}
      <div className="space-y-4 border-b border-zinc-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={onBackToMap}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Curriculum Map</span>
          </button>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span>Phase {levelData.metadata.phaseId}: {levelData.metadata.phaseTitle}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-blue-400 font-semibold">+{levelData.metadata.xpReward} XP</span>
            <span className="text-zinc-700">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>~{levelData.metadata.estimatedMinutes}m read</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-blue-400 font-semibold">
                LEVEL {String(levelData.metadata.id).padStart(2, '0')}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs font-mono text-zinc-400">
                {levelData.metadata.isBoss ? 'Zero-Day Boss' : 'Investigation Module'}
              </span>
              {isCompleted && (
                <span className="text-[11px] font-mono text-zinc-300 flex items-center gap-1 ml-1">
                  <Check className="w-3 h-3 text-white" />
                  <span>COMPLETED</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {levelData.metadata.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              {levelData.metadata.subtitle}
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-1 p-1 bg-black rounded-lg border border-zinc-800 self-start lg:self-auto overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'theory' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              1. Theory
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'simulation' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              2. Practice
            </button>
            {hasPreLab && (
              <button
                onClick={() => setActiveTab('prelab')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1 ${
                  activeTab === 'prelab' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>3. Pre-Lab Gate</span>
                {preLabPassed && <Check className="w-3 h-3 text-blue-400" />}
              </button>
            )}
            <button
              onClick={() => {
                if (hasPreLab && !preLabPassed) {
                  setActiveTab('prelab');
                } else {
                  setActiveTab('investigation');
                }
              }}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'investigation' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>{hasPreLab ? '4. Investigate' : '3. Investigate'}</span>
              {hasPreLab && !preLabPassed && <Lock className="w-3 h-3 text-zinc-600" />}
              {invSubmitted && <Check className="w-3 h-3 text-blue-400" />}
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'quiz' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>{hasPreLab ? '5. Quiz' : '4. Quiz'}</span>
              {quizSubmitted && <Check className="w-3 h-3 text-blue-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB 1: THEORY (FEELS LIKE A BEAUTIFULLY DESIGNED DIGITAL TEXTBOOK)    */}
      {/* ========================================================================= */}
      {activeTab === 'theory' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Top Reading Card with Explain Like I'm New Toggle */}
          <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                  Conceptual Foundation
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  What you will learn
                </h2>
              </div>

              {/* Explain Like I'm New Toggle Switch */}
              <button
                onClick={() => setExplainLikeImNew(!explainLikeImNew)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 self-start sm:self-auto border ${
                  explainLikeImNew
                    ? 'bg-zinc-800 border-zinc-700 text-white font-semibold'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>{explainLikeImNew ? "Technical Explanation" : "Explain Like I'm New"}</span>
              </button>
            </div>

            {/* Reading Content */}
            <div className="text-sm text-zinc-300 leading-relaxed font-sans space-y-4">
              {explainLikeImNew ? (
                <div className="p-4 rounded-lg bg-black border border-zinc-800 space-y-1.5">
                  <span className="text-xs font-mono text-blue-400 uppercase font-semibold block">
                    High-Level Analogy
                  </span>
                  <p className="text-zinc-200 leading-relaxed">
                    {levelData.theory.explainLikeImNew}
                  </p>
                </div>
              ) : (
                <p className="text-zinc-200 leading-relaxed text-sm sm:text-base">
                  {levelData.theory.concept}
                </p>
              )}
            </div>
          </div>

          {/* System Architecture Flow Diagram */}
          <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-white font-bold uppercase">System Architecture & Data Flow</span>
              <span className="text-zinc-500">Logical Inspection</span>
            </div>

            <p className="text-zinc-300 leading-relaxed font-sans text-xs">
              {levelData.theory.architecture}
            </p>

            {/* Clean Flow Representation */}
            <div className="p-4 bg-black border border-zinc-800 rounded-lg space-y-2">
              <div className="text-[10px] text-zinc-500 uppercase">Network Flow Sequence</div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center pt-1 text-zinc-300">
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 w-full sm:w-auto">
                  <span className="text-white font-bold block">Client Node</span>
                  <span className="text-zinc-500 text-[10px]">192.168.10.50</span>
                </div>
                <span className="text-zinc-600 font-bold">───►</span>
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 w-full sm:w-auto">
                  <span className="text-white font-bold block">Authentication / Gateway</span>
                  <span className="text-zinc-500 text-[10px]">192.168.10.1 (L2/L3)</span>
                </div>
                <span className="text-zinc-600 font-bold">───►</span>
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 w-full sm:w-auto">
                  <span className="text-white font-bold block">Inspection Point</span>
                  <span className="text-zinc-500 text-[10px]">Firewall / SIEM Ingest</span>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-zinc-400">
              <span className="text-zinc-300 font-bold block mb-1">Technical Specifications:</span>
              {levelData.theory.technicalDetails.map((td, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-zinc-600">▹</span>
                  <span>{td}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Adversary Abuse vs Defensive Perspective */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-5 space-y-2 text-xs">
              <span className="text-zinc-400 font-mono text-[11px] uppercase font-bold block">
                How Adversaries Abuse This Vector
              </span>
              <p className="text-zinc-300 leading-relaxed font-sans">
                {levelData.theory.securityPerspective}
              </p>
            </div>

            <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-5 space-y-2 text-xs">
              <span className="text-zinc-400 font-mono text-[11px] uppercase font-bold block">
                Defensive Detection Signatures
              </span>
              <div className="space-y-1 pt-0.5">
                {levelData.theory.detectionIndicators.map((ind, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-zinc-300 font-mono">
                    <span className="text-zinc-500">✓</span>
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Think Like an Investigator & Real-World Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-5 space-y-2 text-xs">
              <span className="text-zinc-400 font-mono text-[11px] uppercase font-bold block">
                Think Like an Investigator
              </span>
              <p className="text-zinc-300 font-sans leading-relaxed">
                {levelData.theory.investigationExample.scenario}
              </p>
              <div className="p-2.5 rounded bg-black border border-zinc-800 text-zinc-400 font-mono text-[11px]">
                <strong className="text-zinc-200">Analyst Reasoning: </strong>
                <span>{levelData.theory.investigationExample.analystThoughtProcess}</span>
              </div>
            </div>

            <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-5 space-y-2 text-xs">
              <span className="text-zinc-400 font-mono text-[11px] uppercase font-bold block">
                Documented Case Context
              </span>
              <h4 className="font-bold text-white text-xs">
                {levelData.theory.realWorldContext.incidentTitle}
              </h4>
              <p className="text-zinc-300 font-sans leading-relaxed">
                {levelData.theory.realWorldContext.whatHappened}
              </p>
              <div className="p-2.5 rounded bg-black border border-zinc-800 text-zinc-400 font-mono text-[11px]">
                <strong className="text-zinc-200">Defender Takeaway: </strong>
                <span>{levelData.theory.realWorldContext.whatDefendersLearned}</span>
              </div>
            </div>
          </div>

          {/* Bottom Readiness Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={theoryMarkedUnderstood}
                onChange={e => setTheoryMarkedUnderstood(e.target.checked)}
                className="accent-blue-600 w-4 h-4 rounded"
              />
              <span>I have read and understood the theory concepts</span>
            </label>

            <button
              onClick={() => setActiveTab('simulation')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shadow-sm self-stretch sm:self-auto justify-center"
            >
              <span>Next: Interactive Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB 2: INTERACTIVE PRACTICE SIMULATOR                                 */}
      {/* ========================================================================= */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <InteractiveSimulations
            toolType={levelData.simulation.toolType}
            title={levelData.simulation.title}
            instructions={levelData.simulation.instructions}
            targetGoal={levelData.simulation.targetGoal}
          />

          <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
            <button
              onClick={() => setActiveTab('theory')}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-mono hover:text-white"
            >
              ← Back to Theory
            </button>

            <button
              onClick={() => {
                if (hasPreLab) {
                  setActiveTab('prelab');
                } else {
                  setActiveTab('investigation');
                }
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>{hasPreLab ? 'Next: Pre-Lab Gate' : 'Enter Investigation Lab'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 3: PRE-LAB GATE (FOR LEVEL 16+)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'prelab' && hasPreLab && levelData.preLabAssessment && (
        <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 sm:p-7 space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-zinc-800 pb-3">
            <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
              Advanced Mode Gate
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Pre-Lab Assessment (80%+ Required to Unlock Live Investigation)
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Verify your theoretical foundation before accessing simulated multi-source telemetry.
            </p>
          </div>

          <div className="space-y-4">
            {levelData.preLabAssessment.map((q, idx) => (
              <div key={q.id} className="bg-black border border-zinc-800 rounded-lg p-4 space-y-2.5">
                <span className="text-xs font-mono text-zinc-400">Question {idx + 1}</span>
                <p className="text-xs sm:text-sm font-medium text-white">{q.question}</p>
                <div className="space-y-1.5 pt-1">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => setPreLabAnswers({ ...preLabAnswers, [q.id]: optIdx })}
                      className={`w-full text-left p-2.5 rounded border text-xs font-mono transition-colors ${
                        preLabAnswers[q.id] === optIdx
                          ? 'bg-zinc-800 border-zinc-600 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {preLabFeedback && (
            <div className="p-3.5 rounded bg-black border border-zinc-800 text-xs font-mono text-zinc-200">
              {preLabFeedback}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab('theory')}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded text-xs font-mono"
            >
              ← Review Theory
            </button>
            <button
              onClick={handlePreLabSubmit}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded text-xs transition-colors"
            >
              Submit & Verify Gate
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 4: INVESTIGATION LAB (PROFESSIONAL INVESTIGATION WORKSTATION)      */}
      {/* ========================================================================= */}
      {activeTab === 'investigation' && (
        <div className="space-y-6">
          {/* Workstation Case Header */}
          <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-5 space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">CASE {levelData.investigation.firComplaint.reportNumber}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">{levelData.investigation.firComplaint.organization}</span>
              </div>
              <span className="text-zinc-500">{levelData.investigation.firComplaint.date}</span>
            </div>

            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              <strong className="text-white font-semibold">FIR Complaint Dispatch: </strong>
              {levelData.investigation.firComplaint.summary}
            </p>

            <div className="flex items-center gap-2 text-zinc-400 text-[11px] pt-0.5">
              <span className="text-zinc-500 font-bold">Reported Impact:</span>
              <span>{levelData.investigation.firComplaint.reportedImpact}</span>
            </div>
          </div>

          {/* Workstation Section Navigation Bar */}
          <div className="flex items-center gap-1 border-b border-zinc-800 pb-2 text-xs font-mono overflow-x-auto">
            <button
              onClick={() => setWorkstationView('logs')}
              className={`px-3 py-1.5 rounded transition-colors ${
                workstationView === 'logs' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              LOG VIEWER
            </button>
            <button
              onClick={() => setWorkstationView('evidence')}
              className={`px-3 py-1.5 rounded transition-colors ${
                workstationView === 'evidence' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              EVIDENCE SOURCES
            </button>
            <button
              onClick={() => setWorkstationView('timeline')}
              className={`px-3 py-1.5 rounded transition-colors ${
                workstationView === 'timeline' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              TIMELINE
            </button>
            {levelData.investigation.hypotheses && (
              <button
                onClick={() => setWorkstationView('hypotheses')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  workstationView === 'hypotheses' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                HYPOTHESES
              </button>
            )}
            <button
              onClick={() => setWorkstationView('report')}
              className={`px-3 py-1.5 rounded transition-colors ${
                workstationView === 'report' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              FINDINGS & DECISION
            </button>
          </div>

          {/* VIEW: LOG VIEWER */}
          {workstationView === 'logs' && (
            <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-5 space-y-4 font-mono text-xs">
              {/* Evidence tabs & Filter toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {levelData.investigation.evidenceSources.map((source, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveEvidenceTab(idx);
                        setSelectedLogForInspection(null);
                      }}
                      className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                        activeEvidenceTab === idx
                          ? 'bg-zinc-800 text-white font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {source.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHideDecoys(!hideDecoys)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                      hideDecoys ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {hideDecoys ? 'Filter Active' : 'Filter Decoy Noise'}
                  </button>
                </div>
              </div>

              {/* Search & Severity Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search logs by IP, User, Event, Timestamp..."
                    value={logSearchQuery}
                    onChange={e => setLogSearchQuery(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-zinc-500 text-[11px]">Severity:</span>
                  <select
                    value={severityFilter}
                    onChange={e => setSeverityFilter(e.target.value as any)}
                    className="bg-black border border-zinc-800 rounded px-2.5 py-1 text-xs text-white"
                  >
                    <option value="all">All</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Log Table with Clear Columns & Monospace Alignment */}
              <div className="overflow-x-auto border border-zinc-800 rounded max-h-[360px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-black sticky top-0 border-b border-zinc-800 text-zinc-500 z-10">
                    <tr>
                      <th className="py-2 px-3">Timestamp</th>
                      <th className="py-2 px-3">Event Type</th>
                      <th className="py-2 px-3">Source IP</th>
                      <th className="py-2 px-3">Dest IP</th>
                      <th className="py-2 px-3">Severity</th>
                      <th className="py-2 px-3">Payload Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/60">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map(log => (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedLogForInspection(log)}
                          className={`hover:bg-zinc-900 cursor-pointer transition-colors ${
                            selectedLogForInspection?.id === log.id
                              ? 'bg-zinc-900 border-l-2 border-l-blue-500 text-white'
                              : 'text-zinc-400'
                          }`}
                        >
                          <td className="py-2 px-3 whitespace-nowrap text-zinc-400">{log.timestamp}</td>
                          <td className="py-2 px-3 whitespace-nowrap text-white font-medium">{log.eventType}</td>
                          <td className="py-2 px-3 whitespace-nowrap">{log.sourceIp || '—'}</td>
                          <td className="py-2 px-3 whitespace-nowrap">{log.destIp || '—'}</td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300">
                              {log.severity.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 px-3 max-w-sm truncate text-zinc-300">{log.details}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-zinc-600">
                          No log telemetry matches the current filter query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Selected Log Line Inspector */}
              {selectedLogForInspection && (
                <div className="p-3.5 rounded bg-black border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                    <span className="text-white font-bold">
                      INSPECTED ARTIFACT: {selectedLogForInspection.id}
                    </span>
                    <button
                      onClick={() => setSelectedLogForInspection(null)}
                      className="text-zinc-500 hover:text-white"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-zinc-400 pt-1 text-[11px]">
                    <div>
                      <span className="text-zinc-500 block">TIMESTAMP:</span>
                      <span>{selectedLogForInspection.timestamp}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">SYSTEM:</span>
                      <span>{selectedLogForInspection.system}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">USER:</span>
                      <span>{selectedLogForInspection.user || 'SYSTEM'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">SEVERITY:</span>
                      <span className="text-white font-bold">{selectedLogForInspection.severity.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="pt-1.5 text-zinc-300 text-[11px]">
                    <span className="text-zinc-500 block">RAW PAYLOAD:</span>
                    <p className="mt-0.5 text-zinc-200">{selectedLogForInspection.details}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: EVIDENCE SOURCES */}
          {workstationView === 'evidence' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {levelData.investigation.evidenceSources.map((source, idx) => (
                <div key={idx} className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-5 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-white font-bold">{source.name}</span>
                    <span className="text-zinc-500 uppercase">{source.type}</span>
                  </div>
                  <p className="text-zinc-400 font-sans text-xs">{source.description}</p>
                  <div className="pt-2 flex justify-between text-[11px] text-zinc-500">
                    <span>Artifact Count: {source.logs.length} entries</span>
                    <button
                      onClick={() => {
                        setActiveEvidenceTab(idx);
                        setWorkstationView('logs');
                      }}
                      className="text-blue-400 hover:underline"
                    >
                      Open in Log Viewer →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: TIMELINE */}
          {workstationView === 'timeline' && (
            <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-800 pb-2">
                <span className="text-white font-bold uppercase">Incident Attack Timeline Reconstruction</span>
                <p className="text-zinc-400 font-sans text-xs mt-0.5">
                  Click an event to cross-reference forensic telemetry artifacts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { step: 1, time: '14:21:00', label: 'Initial Ingress Scan', type: 'Port 443 Probe' },
                  { step: 2, time: '14:31:08', label: 'Auth Anomaly', type: 'Failed Logins' },
                  { step: 3, time: '14:42:15', label: 'Session Elevation', type: 'Success Token' },
                  { step: 4, time: '15:03:40', label: 'Data Stage / Exfil', type: 'Outbound Flow' }
                ].map(item => (
                  <button
                    key={item.step}
                    onClick={() => setTimelineStep(item.step)}
                    className={`p-3.5 rounded border text-left transition-colors ${
                      timelineStep === item.step
                        ? 'bg-black border-zinc-600 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-[10px] text-zinc-500 block mb-1">EVENT {item.step} · {item.time}</span>
                    <span className="text-xs font-bold text-white block">{item.label}</span>
                    <span className="text-[11px] text-zinc-400 block mt-1">{item.type}</span>
                  </button>
                ))}
              </div>

              {timelineStep && (
                <div className="p-3.5 rounded bg-black border border-zinc-800 space-y-1">
                  <span className="text-zinc-200 font-bold block">
                    TIMELINE STAGE {timelineStep} CORRELATION:
                  </span>
                  <p className="text-zinc-400 text-xs font-sans">
                    Forensic artifacts confirm sequence activity at stage {timelineStep}. Evidence corroborates initial ingress proceeding through authentication and staging before containment response.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VIEW: HYPOTHESES */}
          {workstationView === 'hypotheses' && levelData.investigation.hypotheses && (
            <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 space-y-4">
              <div className="border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Analyst Hypothesis Formulation
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select the hypothesis best supported by verified evidence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {levelData.investigation.hypotheses.map(hyp => (
                  <button
                    key={hyp.id}
                    onClick={() => setSelectedHypothesis(hyp.id)}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      selectedHypothesis === hyp.id
                        ? 'bg-black border-zinc-600 text-white'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <span className="text-xs font-bold font-mono text-zinc-200 block">{hyp.title}</span>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{hyp.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: REPORT & CASE INQUIRY QUESTIONS */}
          {(workstationView === 'report' || workstationView === 'logs') && (
            <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 space-y-6">
              {/* Consequence Trade-Off Decision */}
              {levelData.investigation.consequenceDecision && (
                <div className="space-y-3 pb-4 border-b border-zinc-800">
                  <span className="text-xs font-mono text-zinc-400 uppercase font-bold block">
                    Containment Trade-Off Decision
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {levelData.investigation.consequenceDecision.prompt}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {levelData.investigation.consequenceDecision.options.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedConsequence(opt.id)}
                        className={`p-3.5 rounded border text-left transition-colors ${
                          selectedConsequence === opt.id
                            ? 'bg-black border-zinc-600 text-white'
                            : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <span className="text-xs font-bold font-mono text-zinc-200 block">{opt.label}</span>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{opt.consequence}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Case Findings Questions */}
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <span className="text-xs font-mono uppercase text-zinc-400 font-bold">
                    Forensic Case Inquiries
                  </span>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Answer based on your log correlation. Minimum 75% required to unlock final verification quiz.
                  </p>
                </div>

                <div className="space-y-4">
                  {levelData.investigation.investigationQuestions.map((q, idx) => (
                    <div key={q.id} className="bg-black border border-zinc-800 rounded-lg p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                        <span>Inquiry #{idx + 1}</span>
                        <span>+{q.points} Points</span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-white">{q.question}</p>

                      {(q.type === 'single_choice' || q.type === 'evidence_select') && q.options ? (
                        <div className="space-y-1.5 pt-1">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => setInvAnswers({ ...invAnswers, [q.id]: opt })}
                              className={`w-full text-left p-2.5 rounded border text-xs font-mono transition-colors ${
                                invAnswers[q.id] === opt
                                  ? 'bg-zinc-800 border-zinc-600 text-white'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="Enter exact evidence value (IP, Port, or Artifact)..."
                          value={invAnswers[q.id] || ''}
                          onChange={e => setInvAnswers({ ...invAnswers, [q.id]: e.target.value.trim() })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-zinc-600"
                        />
                      )}

                      {invSubmitted && (
                        <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono">
                          {invErrors[q.id] === false ? (
                            <span className="text-white font-bold">✓ Finding corroborated by evidence.</span>
                          ) : (
                            <span className="text-zinc-400">✕ Incorrect: {q.explanation}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Hint & Submit Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      setShowHint(!showHint);
                      if (!showHint) setHintsUsed(h => h + 1);
                    }}
                    className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Request Lead Investigator Hint (-10 XP)'}</span>
                  </button>

                  <button
                    onClick={handleInvestigationSubmit}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                  >
                    <span>Submit Findings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {showHint && (
                  <div className="p-3.5 rounded bg-black border border-zinc-800 text-xs font-mono text-zinc-300">
                    💡 <strong className="text-white">Investigator Tip:</strong> Review timestamps in strict chronological order. Notice the rapid authentication failure followed immediately by an elevated session.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 5: INCIDENT QUIZ & LEVEL RESOLUTION                                */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 sm:p-7 space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-zinc-800 pb-3">
            <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
              Final Module Verification
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Incident Response Knowledge Check
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Verify your comprehension of the core defensive mechanisms and attack signatures covered in this level.
            </p>
          </div>

          {!quizSubmitted ? (
            <div className="space-y-4">
              {levelData.finalQuiz.map((q, idx) => (
                <div key={q.id} className="bg-black border border-zinc-800 rounded-lg p-4 space-y-2.5">
                  <span className="text-xs font-mono text-zinc-400">Question {idx + 1}</span>
                  <p className="text-xs sm:text-sm font-medium text-white">{q.question}</p>
                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                        className={`w-full text-left p-2.5 rounded border text-xs font-mono transition-colors ${
                          quizAnswers[q.id] === optIdx
                            ? 'bg-zinc-800 border-zinc-600 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-3 flex justify-end">
                <button
                  onClick={handleQuizSubmit}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-colors"
                >
                  Submit Final Knowledge Verification
                </button>
              </div>
            </div>
          ) : (
            /* Post-Completion Scorecard */
            <div className="space-y-6 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mx-auto">
                <Check className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-white">
                  Investigation Closed Successfully
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Level {levelData.metadata.id} completed. Progress validated on server.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-black border border-zinc-800 font-mono text-xs max-w-sm mx-auto space-y-2 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">KNOWLEDGE SCORE:</span>
                  <span className="text-white font-bold">{quizScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">INVESTIGATION ACCURACY:</span>
                  <span className="text-white font-bold">{invScore}%</span>
                </div>
                <div className="flex justify-between border-t border-zinc-800 pt-1 text-white">
                  <span>BASE REWARD:</span>
                  <span className="text-blue-400 font-bold">+{levelData.metadata.xpReward} XP</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onBackToMap}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Return to Curriculum Map
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
