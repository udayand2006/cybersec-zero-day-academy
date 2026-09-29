export type PhaseCategory =
  | 'networking_fundamentals'
  | 'osi_tcp_protocols'
  | 'network_services_firewalls'
  | 'attack_fundamentals_auth'
  | 'malware_system_forensics'
  | 'digital_forensics_artifacts'
  | 'soc_threat_detection'
  | 'incident_response_lifecycle'
  | 'advanced_vectors_cloud_web'
  | 'master_investigator_crisis';

export interface LevelMetadata {
  id: number;
  title: string;
  subtitle: string;
  phaseId: number;
  phaseTitle: string;
  category: PhaseCategory;
  isBoss: boolean;
  bossTitle?: string;
  isExamGate?: boolean;
  xpReward: number;
  estimatedMinutes: number;
  unlockedToolReward?: string;
  badgeReward?: string;
}

export interface TheorySection {
  concept: string;
  explainLikeImNew: string;
  architecture: string;
  technicalDetails: string[];
  securityPerspective: string;
  detectionIndicators: string[];
  defensiveMeasures: string[];
  realWorldContext: {
    incidentTitle: string;
    whatHappened: string;
    whatDefendersLearned: string;
  };
  investigationExample: {
    scenario: string;
    analystThoughtProcess: string;
    keyTakeaway: string;
  };
}

export type InteractiveToolType =
  | 'subnet_calc'
  | 'device_topology'
  | 'osi_stack'
  | 'packet_inspector'
  | 'dns_flow'
  | 'dhcp_dora'
  | 'firewall_rules'
  | 'arp_table'
  | 'hash_verifier'
  | 'email_headers'
  | 'timeline_reconstructor'
  | 'siem_correlation';

export interface InteractiveSimulationConfig {
  toolType: InteractiveToolType;
  title: string;
  instructions: string;
  initialData?: any;
  targetGoal: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  sourceIp?: string;
  destIp?: string;
  sourcePort?: number;
  destPort?: number;
  protocol?: string;
  eventType: string;
  system: string;
  user?: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info';
  isDecoy?: boolean;
  isMalicious?: boolean;
}

export interface HypothesisOption {
  id: string;
  title: string;
  description: string;
  isCorrect: boolean;
  requiredEvidenceIds: string[];
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: string;
}

export interface InvestigationChallenge {
  firComplaint: {
    reportNumber: string;
    date: string;
    organization: string;
    complainant: string;
    summary: string;
    reportedImpact: string;
  };
  evidenceSources: {
    name: string;
    type: 'network' | 'dns' | 'dhcp' | 'firewall' | 'auth' | 'email' | 'endpoint' | 'file_hashes' | 'browser';
    description: string;
    logs: LogEntry[];
  }[];
  hypotheses?: HypothesisOption[];
  consequenceDecision?: {
    prompt: string;
    options: {
      id: string;
      label: string;
      consequence: string;
      forensicImpact: number;
      containmentImpact: number;
      isRecommended: boolean;
    }[];
  };
  investigationQuestions: {
    id: string;
    question: string;
    type: 'single_choice' | 'text' | 'evidence_select' | 'multi_step';
    options?: string[];
    correctAnswer: string | number | string[];
    explanation: string;
    points: number;
  }[];
}

export interface LevelData {
  metadata: LevelMetadata;
  theory: TheorySection;
  simulation: InteractiveSimulationConfig;
  preLabAssessment?: QuizQuestion[]; // Mandatory for Level 16+
  investigation: InvestigationChallenge;
  finalQuiz: QuizQuestion[];
}

export interface UserProgressState {
  id?: string;
  currentLevel: number;
  completedLevels: number[];
  xp: number;
  level: number;
  casesSolved: number;
  bossChallengesCompleted: number;
  quizAccuracy: number;
  investigationScore: number;
  hintsUsed: number;
  unlockedTools: string[];
  badges: string[];
  certificateEarned: boolean;
  certificateId: string | null;
  certificateDate: string | null;
  streakDays: number;
  username: string;
  fullName?: string;
  certificateName?: string;
  email?: string;
  dateOfBirth?: string;
  country?: string;
  role?: 'USER' | 'ADMIN';
  batch: string;
  publicProfileEnabled: boolean;
}

export type UserProfile = UserProgressState;

export interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  batch: string;
  level: number;
  xp: number;
  casesSolved: number;
  bossChallengesCompleted: number;
  quizAccuracy: number;
  investigationScore: number;
  certificateEarned: boolean;
  certificateId: string | null;
  badgesCount: number;
  streakDays: number;
  isCurrent: boolean;
}

export interface PublicUserProfile {
  id: string;
  username: string;
  batch: string;
  level: number;
  xp: number;
  globalRank: number;
  batchRank: number;
  levelsCompleted: number;
  casesSolved: number;
  bossChallengesCompleted: number;
  quizAccuracy: number;
  investigationScore: number;
  hintsUsed: number;
  badges: string[];
  certificateEarned: boolean;
  certificateId: string | null;
  certificateDate: string | null;
  streakDays: number;
  unlockedTools: string[];
}

export interface CertificateData {
  certificateId: string;
  studentName: string;
  batch: string;
  completionDate: string;
  courseTitle: string;
  totalLevels: number;
  finalScore: number;
  status: 'Valid' | 'Revoked';
  skillsCovered: string[];
}
