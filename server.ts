import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory persistent database with seed users and scores
interface UserProfile {
  id: string;
  username: string;
  fullName?: string;
  certificateName?: string;
  email?: string;
  dateOfBirth?: string;
  country?: string;
  role?: 'USER' | 'ADMIN';
  batch: string;
  level: number;
  xp: number;
  casesSolved: number;
  bossChallengesCompleted: number;
  quizAccuracy: number;
  investigationScore: number;
  hintsUsed: number;
  certificateEarned: boolean;
  certificateId: string | null;
  certificateDate: string | null;
  publicProfileEnabled: boolean;
  createdAt: string;
  lastActive: string;
  streakDays: number;
  completedLevels: number[];
  unlockedTools: string[];
  badges: string[];
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

const auditLogs: AuditLog[] = [
  { id: 'log-001', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'SYSTEM_BOOT', actor: 'System', details: 'Zero-Day Academy secure simulation kernel initialized' },
  { id: 'log-002', timestamp: new Date(Date.now() - 2400000).toISOString(), action: 'DATABASE_LOAD', actor: 'Kernel', details: 'Loaded active student cohort and 50 investigation modules' },
  { id: 'log-003', timestamp: new Date(Date.now() - 1200000).toISOString(), action: 'REGISTRY_VERIFY', actor: 'Public Registry', details: 'Validated active certificate accreditation for SG-CYBER-2026-8F42K' }
];

// Seed global community users for realistic public leaderboard
const usersDB: Map<string, UserProfile> = new Map([
  [
    'user-001',
    {
      id: 'user-001',
      username: 'CyberWolf',
      batch: 'Batch 2027',
      level: 42,
      xp: 9850,
      casesSolved: 38,
      bossChallengesCompleted: 8,
      quizAccuracy: 91,
      investigationScore: 94,
      hintsUsed: 4,
      certificateEarned: false,
      certificateId: null,
      certificateDate: null,
      publicProfileEnabled: true,
      createdAt: '2026-01-10T08:00:00.000Z',
      lastActive: '2026-09-29T09:15:00.000Z',
      streakDays: 14,
      completedLevels: Array.from({ length: 42 }, (_, i) => i + 1),
      unlockedTools: ['Basic Network Toolkit', 'Packet Analysis Tool', 'Advanced Investigation Lab', 'Threat Hunting Suite'],
      badges: ['🌐 Network Explorer', '🛡️ Blue Team Beginner', '🔎 Digital Investigator', '📡 Packet Analyst', '🕵️ Threat Hunter', '🔥 Zero-Day Solver']
    }
  ],
  [
    'user-002',
    {
      id: 'user-002',
      username: 'UdayCyber',
      batch: 'Batch 2027',
      level: 39,
      xp: 9120,
      casesSolved: 35,
      bossChallengesCompleted: 7,
      quizAccuracy: 88,
      investigationScore: 92,
      hintsUsed: 6,
      certificateEarned: false,
      certificateId: null,
      certificateDate: null,
      publicProfileEnabled: true,
      createdAt: '2026-01-14T10:00:00.000Z',
      lastActive: '2026-09-29T10:05:00.000Z',
      streakDays: 9,
      completedLevels: Array.from({ length: 39 }, (_, i) => i + 1),
      unlockedTools: ['Basic Network Toolkit', 'Packet Analysis Tool', 'Advanced Investigation Lab'],
      badges: ['🌐 Network Explorer', '🛡️ Blue Team Beginner', '🔎 Digital Investigator', '📡 Packet Analyst', '🔥 Zero-Day Solver']
    }
  ],
  [
    'user-003',
    {
      id: 'user-003',
      username: 'ShadowSec',
      batch: 'Batch 2028',
      level: 35,
      xp: 8640,
      casesSolved: 32,
      bossChallengesCompleted: 7,
      quizAccuracy: 86,
      investigationScore: 89,
      hintsUsed: 8,
      certificateEarned: false,
      certificateId: null,
      certificateDate: null,
      publicProfileEnabled: true,
      createdAt: '2026-02-01T12:00:00.000Z',
      lastActive: '2026-09-28T22:30:00.000Z',
      streakDays: 5,
      completedLevels: Array.from({ length: 35 }, (_, i) => i + 1),
      unlockedTools: ['Basic Network Toolkit', 'Packet Analysis Tool', 'Advanced Investigation Lab'],
      badges: ['🌐 Network Explorer', '🛡️ Blue Team Beginner', '🔎 Digital Investigator', '📡 Packet Analyst']
    }
  ],
  [
    'user-004',
    {
      id: 'user-004',
      username: 'NetHunter',
      batch: 'Batch 2027',
      level: 31,
      xp: 7920,
      casesSolved: 28,
      bossChallengesCompleted: 6,
      quizAccuracy: 84,
      investigationScore: 85,
      hintsUsed: 11,
      certificateEarned: false,
      certificateId: null,
      certificateDate: null,
      publicProfileEnabled: true,
      createdAt: '2026-02-10T14:00:00.000Z',
      lastActive: '2026-09-27T18:10:00.000Z',
      streakDays: 3,
      completedLevels: Array.from({ length: 31 }, (_, i) => i + 1),
      unlockedTools: ['Basic Network Toolkit', 'Packet Analysis Tool', 'Advanced Investigation Lab'],
      badges: ['🌐 Network Explorer', '🛡️ Blue Team Beginner', '🔎 Digital Investigator']
    }
  ],
  [
    'user-005',
    {
      id: 'user-005',
      username: 'CipherValkyrie',
      batch: 'Batch 2026',
      level: 50,
      xp: 12450,
      casesSolved: 48,
      bossChallengesCompleted: 10,
      quizAccuracy: 95,
      investigationScore: 97,
      hintsUsed: 2,
      certificateEarned: true,
      certificateId: 'SG-CYBER-2026-8F42K',
      certificateDate: '2026-08-15',
      publicProfileEnabled: true,
      createdAt: '2025-11-01T09:00:00.000Z',
      lastActive: '2026-09-29T08:20:00.000Z',
      streakDays: 30,
      completedLevels: Array.from({ length: 50 }, (_, i) => i + 1),
      unlockedTools: ['Basic Network Toolkit', 'Packet Analysis Tool', 'Advanced Investigation Lab', 'Threat Hunting Suite', 'Forensic Memory Visualizer'],
      badges: ['🌐 Network Explorer', '🛡️ Blue Team Beginner', '🔎 Digital Investigator', '📡 Packet Analyst', '🕵️ Threat Hunter', '🔥 Zero-Day Solver', '🏆 Cyber Investigator']
    }
  ],
  [
    'user-006',
    {
      id: 'user-006',
      username: 'HexDefender',
      batch: 'Batch 2026',
      level: 50,
      xp: 11980,
      casesSolved: 47,
      bossChallengesCompleted: 10,
      quizAccuracy: 93,
      investigationScore: 95,
      hintsUsed: 5,
      certificateEarned: true,
      certificateId: 'SG-CYBER-2026-3M91Q',
      certificateDate: '2026-09-02',
      publicProfileEnabled: true,
      createdAt: '2025-12-05T11:00:00.000Z',
      lastActive: '2026-09-29T02:40:00.000Z',
      streakDays: 21,
      completedLevels: Array.from({ length: 50 }, (_, i) => i + 1),
      unlockedTools: ['Basic Network Toolkit', 'Packet Analysis Tool', 'Advanced Investigation Lab', 'Threat Hunting Suite', 'Forensic Memory Visualizer'],
      badges: ['🌐 Network Explorer', '🛡️ Blue Team Beginner', '🔎 Digital Investigator', '📡 Packet Analyst', '🕵️ Threat Hunter', '🔥 Zero-Day Solver', '🏆 Cyber Investigator']
    }
  ],
  [
    'user-007',
    {
      id: 'user-007',
      username: 'ByteSentry',
      batch: 'Batch 2028',
      level: 24,
      xp: 5900,
      casesSolved: 21,
      bossChallengesCompleted: 4,
      quizAccuracy: 82,
      investigationScore: 83,
      hintsUsed: 14,
      certificateEarned: false,
      certificateId: null,
      certificateDate: null,
      publicProfileEnabled: true,
      createdAt: '2026-03-01T15:00:00.000Z',
      lastActive: '2026-09-28T19:00:00.000Z',
      streakDays: 4,
      completedLevels: Array.from({ length: 24 }, (_, i) => i + 1),
      unlockedTools: ['Basic Network Toolkit', 'Packet Analysis Tool', 'Advanced Investigation Lab'],
      badges: ['🌐 Network Explorer', '🛡️ Blue Team Beginner', '🔎 Digital Investigator']
    }
  ],
  [
    'user-008',
    {
      id: 'user-008',
      username: 'PacketGhost',
      batch: 'Batch 2027',
      level: 18,
      xp: 4350,
      casesSolved: 16,
      bossChallengesCompleted: 3,
      quizAccuracy: 80,
      investigationScore: 81,
      hintsUsed: 12,
      certificateEarned: false,
      certificateId: null,
      certificateDate: null,
      publicProfileEnabled: true,
      createdAt: '2026-04-10T16:00:00.000Z',
      lastActive: '2026-09-29T06:10:00.000Z',
      streakDays: 6,
      completedLevels: Array.from({ length: 18 }, (_, i) => i + 1),
      unlockedTools: ['Basic Network Toolkit', 'Packet Analysis Tool', 'Advanced Investigation Lab'],
      badges: ['🌐 Network Explorer', '🛡️ Blue Team Beginner']
    }
  ],
  [
    'user-009',
    {
      id: 'user-009',
      username: 'ZeroTracer',
      batch: 'Batch 2028',
      level: 12,
      xp: 2900,
      casesSolved: 11,
      bossChallengesCompleted: 2,
      quizAccuracy: 78,
      investigationScore: 79,
      hintsUsed: 15,
      certificateEarned: false,
      certificateId: null,
      certificateDate: null,
      publicProfileEnabled: true,
      createdAt: '2026-05-02T13:00:00.000Z',
      lastActive: '2026-09-27T11:20:00.000Z',
      streakDays: 2,
      completedLevels: Array.from({ length: 12 }, (_, i) => i + 1),
      unlockedTools: ['Basic Network Toolkit', 'Packet Analysis Tool'],
      badges: ['🌐 Network Explorer']
    }
  ],
  [
    'user-010',
    {
      id: 'user-010',
      username: 'AegisProbe',
      batch: 'Batch 2027',
      level: 8,
      xp: 1850,
      casesSolved: 7,
      bossChallengesCompleted: 1,
      quizAccuracy: 83,
      investigationScore: 84,
      hintsUsed: 5,
      certificateEarned: false,
      certificateId: null,
      certificateDate: null,
      publicProfileEnabled: true,
      createdAt: '2026-06-15T10:00:00.000Z',
      lastActive: '2026-09-28T09:40:00.000Z',
      streakDays: 1,
      completedLevels: Array.from({ length: 8 }, (_, i) => i + 1),
      unlockedTools: ['Basic Network Toolkit'],
      badges: ['🌐 Network Explorer']
    }
  ]
]);

// Default local active user for the player session
let defaultCurrentUserId = 'player-local';
if (!usersDB.has(defaultCurrentUserId)) {
  usersDB.set(defaultCurrentUserId, {
    id: defaultCurrentUserId,
    username: 'Investigator_Zero',
    batch: 'Batch 2027',
    level: 1,
    xp: 0,
    casesSolved: 0,
    bossChallengesCompleted: 0,
    quizAccuracy: 100,
    investigationScore: 100,
    hintsUsed: 0,
    certificateEarned: false,
    certificateId: null,
    certificateDate: null,
    publicProfileEnabled: true,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    streakDays: 1,
    completedLevels: [],
    unlockedTools: ['Basic Network Toolkit'],
    badges: ['🌐 Network Explorer']
  });
}

// Certificate verification registry
interface CertificateRecord {
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

const certificateRegistry: Map<string, CertificateRecord> = new Map([
  [
    'SG-CYBER-2026-8F42K',
    {
      certificateId: 'SG-CYBER-2026-8F42K',
      studentName: 'CipherValkyrie',
      batch: 'Batch 2026',
      completionDate: '2026-08-15',
      courseTitle: 'Cyber Investigator Course Completion Certificate',
      totalLevels: 50,
      finalScore: 96,
      status: 'Valid',
      skillsCovered: [
        'Networking Fundamentals & Subnetting',
        'Packet Analysis & Protocol Inspection',
        'DNS & DHCP Security Forensics',
        'Stateful Firewall Rule Engineering',
        'MITRE ATT&CK & Threat Intelligence',
        'Digital Forensics & Super-Timeline Analysis',
        'Enterprise SIEM & SOC Alert Correlation',
        'Incident Response & Live Containment',
        'Cloud & Web Application Security',
        'Grand Crisis War-Room Resolution'
      ]
    }
  ],
  [
    'SG-CYBER-2026-3M91Q',
    {
      certificateId: 'SG-CYBER-2026-3M91Q',
      studentName: 'HexDefender',
      batch: 'Batch 2026',
      completionDate: '2026-09-02',
      courseTitle: 'Cyber Investigator Course Completion Certificate',
      totalLevels: 50,
      finalScore: 94,
      status: 'Valid',
      skillsCovered: [
        'Networking Fundamentals & Subnetting',
        'Packet Analysis & Protocol Inspection',
        'DNS & DHCP Security Forensics',
        'Stateful Firewall Rule Engineering',
        'Digital Forensics & Super-Timeline Analysis',
        'Enterprise SIEM & SOC Alert Correlation',
        'Incident Response & Live Containment',
        'Grand Crisis War-Room Resolution'
      ]
    }
  ]
]);

// --- API ROUTES ---

// POST /api/auth/register - Register new user account with Certificate Name & Batch
app.post('/api/auth/register', (req: Request, res: Response) => {
  const {
    fullName,
    certificateName,
    username,
    email,
    password,
    dateOfBirth,
    country = 'Global',
    batch = '2027',
    agreedToTerms = false
  } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password are required.' });
  }

  if (!agreedToTerms) {
    return res.status(400).json({ error: 'You must acknowledge the Terms of Service & Privacy Policy.' });
  }

  // Check if username already exists
  const existing = Array.from(usersDB.values()).find(
    u => u.username.toLowerCase() === username.trim().toLowerCase() ||
         (u.email && u.email.toLowerCase() === email.trim().toLowerCase())
  );
  if (existing) {
    return res.status(400).json({ error: 'Username or email is already registered.' });
  }

  const newId = `user-${Date.now().toString(36)}`;
  const certName = (certificateName || fullName || username).trim();

  const newUser: UserProfile = {
    id: newId,
    username: username.trim(),
    fullName: fullName ? fullName.trim() : username.trim(),
    certificateName: certName,
    email: email.trim().toLowerCase(),
    dateOfBirth: dateOfBirth || '2004-01-01',
    country: country.trim(),
    role: 'USER',
    batch: batch.startsWith('Batch') ? batch : `Batch ${batch}`,
    level: 1,
    xp: 150,
    casesSolved: 0,
    bossChallengesCompleted: 0,
    quizAccuracy: 100,
    investigationScore: 100,
    hintsUsed: 0,
    certificateEarned: false,
    certificateId: null,
    certificateDate: null,
    publicProfileEnabled: true,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    streakDays: 1,
    completedLevels: [],
    unlockedTools: ['Basic Network Toolkit'],
    badges: ['🌐 Network Explorer']
  };

  usersDB.set(newId, newUser);
  defaultCurrentUserId = newId;

  // Log audit
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'USER_REGISTRATION',
    actor: newUser.username,
    details: `New investigator registered: ${newUser.username} (${newUser.batch}) with Certificate Name: "${certName}"`
  });

  res.json({
    success: true,
    user: newUser,
    message: 'Account successfully registered and initialized.'
  });
});

// POST /api/auth/login - Log in with username or email
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Username/email and password are required.' });
  }

  const query = usernameOrEmail.trim().toLowerCase();
  const user = Array.from(usersDB.values()).find(
    u => u.username.toLowerCase() === query || (u.email && u.email.toLowerCase() === query)
  );

  if (!user) {
    // If not found in seed, permit login as local investigator or create on demand
    const fallbackUser = usersDB.get(defaultCurrentUserId);
    if (fallbackUser) {
      fallbackUser.lastActive = new Date().toISOString();
      return res.json({ success: true, user: fallbackUser });
    }
    return res.status(401).json({ error: 'Invalid investigator credentials. Please verify or register.' });
  }

  user.lastActive = new Date().toISOString();
  defaultCurrentUserId = user.id;

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'USER_LOGIN',
    actor: user.username,
    details: `Investigator ${user.username} authenticated successfully.`
  });

  res.json({
    success: true,
    user
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/current
app.get('/api/auth/current', (_req: Request, res: Response) => {
  const user = usersDB.get(defaultCurrentUserId);
  res.json({ user: user || null });
});

// GET /api/user/profile - Get current user profile
app.get('/api/user/profile', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || defaultCurrentUserId;
  const user = usersDB.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Calculate current rank
  const allUsers = Array.from(usersDB.values()).sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    if (b.investigationScore !== a.investigationScore) return b.investigationScore - a.investigationScore;
    return b.completedLevels.length - a.completedLevels.length;
  });

  const rank = allUsers.findIndex(u => u.id === user.id) + 1;
  const batchUsers = allUsers.filter(u => u.batch === user.batch);
  const batchRank = batchUsers.findIndex(u => u.id === user.id) + 1;
  const nextUser = rank > 1 ? allUsers[rank - 2] : null;
  const xpToNextRank = nextUser ? Math.max(0, nextUser.xp - user.xp + 10) : 0;

  res.json({
    user,
    rank,
    batchRank,
    xpToNextRank,
    nextUserUsername: nextUser?.username || null
  });
});

// POST /api/user/update-profile - Update public profile settings / username / batch / certificate name
app.post('/api/user/update-profile', (req: Request, res: Response) => {
  const { userId = defaultCurrentUserId, username, fullName, certificateName, country, email, batch, publicProfileEnabled } = req.body;
  const user = usersDB.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (username && typeof username === 'string') {
    const cleanName = username.trim().slice(0, 24);
    if (cleanName.length >= 3) {
      user.username = cleanName;
    }
  }

  if (fullName && typeof fullName === 'string') {
    user.fullName = fullName.trim().slice(0, 50);
  }

  if (certificateName && typeof certificateName === 'string') {
    user.certificateName = certificateName.trim().slice(0, 50);
  }

  if (country && typeof country === 'string') {
    user.country = country.trim().slice(0, 40);
  }

  if (email && typeof email === 'string') {
    user.email = email.trim().toLowerCase().slice(0, 60);
  }

  if (batch && typeof batch === 'string') {
    user.batch = batch.trim().slice(0, 16);
  }

  if (typeof publicProfileEnabled === 'boolean') {
    user.publicProfileEnabled = publicProfileEnabled;
  }

  user.lastActive = new Date().toISOString();
  usersDB.set(userId, user);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'PROFILE_UPDATE',
    actor: user.username,
    details: `Updated profile details: ${user.fullName || user.username} (${user.batch})`
  });

  res.json({ success: true, user });
});

// GET /api/leaderboard - Real-time leaderboard with multi-dimensional filtering
app.get('/api/leaderboard', (req: Request, res: Response) => {
  const filter = (req.query.filter as string) || 'all'; // 'all', 'batch', 'weekly', 'monthly', 'all-time'
  const targetBatch = req.query.batch as string;
  const currentUserId = (req.query.currentUserId as string) || defaultCurrentUserId;

  let list = Array.from(usersDB.values());

  // Filter out private users unless they appear as "Anonymous Investigator"
  list = list.map(u => {
    if (!u.publicProfileEnabled && u.id !== currentUserId) {
      return {
        ...u,
        username: 'Anonymous Investigator'
      };
    }
    return u;
  });

  // Filter by batch if specified or requested
  if (filter === 'batch' && targetBatch) {
    list = list.filter(u => u.batch === targetBatch);
  }

  // Sort: 1. Verified XP, 2. Investigation Score, 3. Quiz Accuracy, 4. Completed Levels
  list.sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    if (b.investigationScore !== a.investigationScore) return b.investigationScore - a.investigationScore;
    if (b.quizAccuracy !== a.quizAccuracy) return b.quizAccuracy - a.quizAccuracy;
    return b.completedLevels.length - a.completedLevels.length;
  });

  const rankedUsers = list.map((user, index) => ({
    rank: index + 1,
    id: user.id,
    username: user.username,
    batch: user.batch,
    level: user.level,
    xp: user.xp,
    casesSolved: user.casesSolved,
    bossChallengesCompleted: user.bossChallengesCompleted,
    quizAccuracy: user.quizAccuracy,
    investigationScore: user.investigationScore,
    certificateEarned: user.certificateEarned,
    certificateId: user.certificateId,
    badgesCount: user.badges.length,
    streakDays: user.streakDays,
    isCurrent: user.id === currentUserId
  }));

  const currentUserItem = rankedUsers.find(u => u.id === currentUserId);
  const userRank = currentUserItem ? currentUserItem.rank : null;
  const nextUser = userRank && userRank > 1 ? rankedUsers[userRank - 2] : null;
  const xpNeeded = nextUser && currentUserItem ? Math.max(0, nextUser.xp - currentUserItem.xp + 10) : 0;

  res.json({
    leaderboard: rankedUsers,
    currentUserRank: userRank,
    xpNeededToAdvance: xpNeeded,
    totalUsers: rankedUsers.length
  });
});

// GET /api/user/public-profile/:id - Public user profile details
app.get('/api/user/public-profile/:id', (req: Request, res: Response) => {
  const user = usersDB.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  // Calculate ranks
  const allUsers = Array.from(usersDB.values()).sort((a, b) => b.xp - a.xp);
  const globalRank = allUsers.findIndex(u => u.id === user.id) + 1;
  const batchUsers = allUsers.filter(u => u.batch === user.batch);
  const batchRank = batchUsers.findIndex(u => u.id === user.id) + 1;

  // Sanitized public profile (never expose IP, email, passwords, private attempts)
  const publicData = {
    id: user.id,
    username: user.publicProfileEnabled ? user.username : 'Anonymous Investigator',
    batch: user.batch,
    level: user.level,
    xp: user.xp,
    globalRank,
    batchRank,
    levelsCompleted: user.completedLevels.length,
    casesSolved: user.casesSolved,
    bossChallengesCompleted: user.bossChallengesCompleted,
    quizAccuracy: user.quizAccuracy,
    investigationScore: user.investigationScore,
    hintsUsed: user.hintsUsed,
    badges: user.badges,
    certificateEarned: user.certificateEarned,
    certificateId: user.certificateId,
    certificateDate: user.certificateDate,
    streakDays: user.streakDays,
    unlockedTools: user.unlockedTools
  };

  res.json(publicData);
});

// POST /api/progress/submit - Server-side validation of level completion, anti-cheat & XP reward
app.post('/api/progress/submit', (req: Request, res: Response) => {
  const {
    userId = defaultCurrentUserId,
    levelNumber,
    quizScore, // 0 - 100
    investigationScore, // 0 - 100
    hintsUsed = 0,
    isBoss = false
  } = req.body;

  const user = usersDB.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const levelNum = Number(levelNumber);
  if (isNaN(levelNum) || levelNum < 1 || levelNum > 50) {
    return res.status(400).json({ error: 'Invalid level number' });
  }

  // Mastery requirement check (especially Level 16+)
  const minRequiredScore = levelNum > 15 ? 80 : 70;
  const avgScore = Math.round((Number(quizScore || 100) + Number(investigationScore || 100)) / 2);

  if (avgScore < minRequiredScore) {
    return res.status(400).json({
      error: `Mastery threshold not met. Score was ${avgScore}%, minimum required is ${minRequiredScore}%. Review the theory and practice labs.`,
      passed: false
    });
  }

  // Anti-cheat: prevent duplicate completion exploiting infinite XP
  const alreadyCompleted = user.completedLevels.includes(levelNum);
  let xpAwarded = 0;

  if (!alreadyCompleted) {
    user.completedLevels.push(levelNum);
    user.completedLevels.sort((a, b) => a - b);

    // Calculate verified XP:
    // Regular levels: 150 base XP + accuracy bonus
    // Boss levels (5, 10, 15, 20, 25, 30, 35, 40, 45): 400 base XP
    // Level 50 Grand Boss: 1000 base XP
    let baseXP = 150;
    if (levelNum === 50) {
      baseXP = 1000;
    } else if (levelNum % 5 === 0) {
      baseXP = 450;
    }

    const accuracyBonus = Math.round((avgScore / 100) * 50);
    const hintPenalty = Math.min(40, hintsUsed * 10);
    xpAwarded = Math.max(50, baseXP + accuracyBonus - hintPenalty);

    user.xp += xpAwarded;
    user.level = Math.max(user.level, Math.min(50, Math.floor(user.xp / 220) + 1));
    user.casesSolved += 1;

    if (levelNum % 5 === 0 || isBoss) {
      user.bossChallengesCompleted += 1;
    }

    // Update cumulative accuracy
    user.quizAccuracy = Math.round((user.quizAccuracy * 0.7) + (Number(quizScore || 100) * 0.3));
    user.investigationScore = Math.round((user.investigationScore * 0.7) + (Number(investigationScore || 100) * 0.3));
    user.hintsUsed += hintsUsed;

    // Boss rewards & tool progression
    if (levelNum === 5 && !user.unlockedTools.includes('Packet Analysis Tool')) {
      user.unlockedTools.push('Packet Analysis Tool');
      user.badges.push('📡 Packet Analyst');
    }
    if (levelNum === 10 && !user.badges.includes('🛡️ Blue Team Defender')) {
      user.badges.push('🛡️ Blue Team Defender');
    }
    if (levelNum === 15 && !user.unlockedTools.includes('Advanced Investigation Lab')) {
      user.unlockedTools.push('Advanced Investigation Lab');
      user.badges.push('🔎 Digital Investigator');
    }
    if (levelNum === 20 && !user.badges.includes('🔑 Credential Sentinel')) {
      user.badges.push('🔑 Credential Sentinel');
    }
    if (levelNum === 25 && !user.badges.includes('🦠 Malware Hunter')) {
      user.badges.push('🦠 Malware Hunter');
    }
    if (levelNum === 35 && !user.unlockedTools.includes('Threat Hunting Suite')) {
      user.unlockedTools.push('Threat Hunting Suite');
      user.badges.push('🕵️ Threat Hunter');
    }
    if (levelNum === 45 && !user.badges.includes('🔥 Zero-Day Solver')) {
      user.badges.push('🔥 Zero-Day Solver');
    }

    // Level 50 Completion -> Issue Verifiable Certificate!
    if (levelNum === 50 && user.completedLevels.length >= 50) {
      user.certificateEarned = true;
      const certId = `SG-CYBER-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      user.certificateId = certId;
      user.certificateDate = new Date().toISOString().split('T')[0];
      if (!user.badges.includes('🏆 Cyber Investigator')) {
        user.badges.push('🏆 Cyber Investigator');
      }

      // Register in public registry
      certificateRegistry.set(certId, {
        certificateId: certId,
        studentName: user.certificateName || user.fullName || user.username,
        batch: user.batch,
        completionDate: user.certificateDate,
        courseTitle: 'Cyber Investigator Course Completion Certificate',
        totalLevels: 50,
        finalScore: Math.round((user.quizAccuracy + user.investigationScore) / 2),
        status: 'Valid',
        skillsCovered: [
          'Networking Fundamentals & Subnetting',
          'Packet Analysis & Protocol Inspection',
          'DNS & DHCP Security Forensics',
          'Stateful Firewall Rule Engineering',
          'MITRE ATT&CK & Threat Intelligence',
          'Digital Forensics & Super-Timeline Analysis',
          'Enterprise SIEM & SOC Alert Correlation',
          'Incident Response & Live Containment',
          'Cloud & Web Application Security',
          'Grand Crisis War-Room Resolution'
        ]
      });

      auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'CERTIFICATE_ISSUED',
        actor: 'Certification Authority',
        details: `Issued Official Certificate ${certId} to ${user.certificateName || user.username} (${user.batch})`
      });
    }
  } else {
    // Replay bonus (minimal XP to prevent grinding)
    xpAwarded = 20;
    user.xp += xpAwarded;
  }

  user.lastActive = new Date().toISOString();
  usersDB.set(userId, user);

  res.json({
    success: true,
    passed: true,
    xpAwarded,
    user
  });
});

// GET /api/certificate/verify/:id - Public certificate verification
app.get('/api/certificate/verify/:id', (req: Request, res: Response) => {
  const certId = req.params.id.trim().toUpperCase();
  const cert = certificateRegistry.get(certId);

  if (!cert) {
    return res.status(404).json({
      valid: false,
      message: `No certificate found with ID ${certId}. Verify the certificate ID and try again.`
    });
  }

  res.json({
    valid: true,
    certificate: cert
  });
});

// GET /api/admin/stats - Admin telemetry & aggregate platform metrics
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const users = Array.from(usersDB.values());
  const totalUsers = users.length;
  const activeUsers = users.filter(u => {
    const last = new Date(u.lastActive).getTime();
    return Date.now() - last < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const totalLevelsCompleted = users.reduce((sum, u) => sum + u.completedLevels.length, 0);
  const totalCasesSolved = users.reduce((sum, u) => sum + u.casesSolved, 0);
  const totalCertificatesIssued = users.filter(u => u.certificateEarned).length;
  const avgScore = Math.round(users.reduce((sum, u) => sum + ((u.quizAccuracy + u.investigationScore) / 2), 0) / totalUsers);

  // Batch breakdown
  const batchCounts: Record<string, number> = {};
  users.forEach(u => {
    batchCounts[u.batch] = (batchCounts[u.batch] || 0) + 1;
  });

  // Top performers
  const topUsers = [...users]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 5)
    .map(u => ({
      username: u.username,
      batch: u.batch,
      level: u.level,
      xp: u.xp,
      certificateEarned: u.certificateEarned
    }));

  res.json({
    totalUsers,
    activeUsers,
    totalLevelsCompleted,
    totalCasesSolved,
    totalCertificatesIssued,
    averageScore: avgScore,
    batchDistribution: batchCounts,
    topUsers,
    auditLogs: auditLogs.slice(0, 20),
    users: users.map(u => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName || u.username,
      certificateName: u.certificateName || u.username,
      email: u.email || `${u.username.toLowerCase()}@cybersec.academy`,
      batch: u.batch,
      country: u.country || 'Global',
      level: u.level,
      xp: u.xp,
      quizAccuracy: u.quizAccuracy,
      investigationScore: u.investigationScore,
      casesSolved: u.casesSolved,
      certificateEarned: u.certificateEarned,
      certificateId: u.certificateId,
      lastActive: u.lastActive,
      status: 'Active'
    }))
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`CyberSec Zero-Day Academy server running on port ${PORT}`);
  });
}

startServer();
