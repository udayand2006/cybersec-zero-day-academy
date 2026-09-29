import React, { useState } from 'react';
import { CyberApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, Mail, Calendar, Globe, AlertCircle, CheckCircle2, X, ArrowRight, Cloud } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'register'
}) => {
  const { signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [certificateName, setCertificateName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2004-05-15');
  const [country, setCountry] = useState('United States');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [batch, setBatch] = useState('2027');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  // Login Form State
  const [loginQuery, setLoginQuery] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await signInWithGoogle();
      setLoading(false);
      if (res.success) {
        onSuccess(null);
        onClose();
      } else {
        setErrorMessage(res.error || 'Google Sign-in was cancelled or failed.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'Google authentication failed.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !email.trim() || !password) {
      setErrorMessage('Please complete all required account fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (!agreedTerms || !agreedPrivacy) {
      setErrorMessage('You must acknowledge the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);
    const certNameFinal = (certificateName || fullName || username).trim();

    const res = await CyberApiService.register({
      fullName: fullName.trim(),
      certificateName: certNameFinal,
      username: username.trim(),
      email: email.trim(),
      password,
      dateOfBirth,
      country,
      batch,
      agreedToTerms: true
    });

    setLoading(false);

    if (res.success && res.user) {
      onSuccess(res.user);
      onClose();
    } else {
      setErrorMessage(res.error || 'Registration failed. Please try a different username or email.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginQuery.trim()) {
      setErrorMessage('Please enter your username or email address.');
      return;
    }

    setLoading(true);
    const res = await CyberApiService.login(loginQuery, loginPassword);
    setLoading(false);

    if (res.success && res.user) {
      onSuccess(res.user);
      onClose();
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl max-w-lg w-full p-6 sm:p-7 space-y-5 my-8 text-zinc-200 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-900 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
              Zero-Day Academy
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs font-mono text-blue-400 flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              Firebase Auth & Cloud DB
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {mode === 'register' ? 'Investigator Registration' : 'Investigator Sign In'}
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sign in with Google via Firebase Authentication for real-time Firestore database persistence across sessions.
          </p>
        </div>

        {/* Primary Action: Google Sign In with Firebase */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white text-zinc-950 hover:bg-zinc-100 rounded-lg font-semibold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono font-semibold">Firebase Auth</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-zinc-800 flex-1"></div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Or manual academy account</span>
            <div className="h-px bg-zinc-800 flex-1"></div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-zinc-800 text-xs font-medium">
          <button
            onClick={() => { setMode('register'); setErrorMessage(null); }}
            className={`pb-2.5 px-3 transition-colors ${
              mode === 'register'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Create Student Account
          </button>
          <button
            onClick={() => { setMode('login'); setErrorMessage(null); }}
            className={`pb-2.5 px-3 transition-colors ${
              mode === 'login'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-zinc-900 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        {mode === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            {/* Section 1: Personal & Certificate Information */}
            <div className="space-y-3 pt-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                1. Personal & Accreditation Identity
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={e => {
                      setFullName(e.target.value);
                      if (!certificateName) setCertificateName(e.target.value);
                    }}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Country / Region</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="e.g. India, United States"
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              {/* Certificate Name Callout */}
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-200 font-semibold block">
                    Certificate Name (Exact Print Name)
                  </label>
                  <span className="text-[10px] font-mono text-blue-400">Verifiable Record</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter exact name as it should appear on certificate"
                  value={certificateName}
                  onChange={e => setCertificateName(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-zinc-400 leading-normal">
                  <strong className="text-zinc-300">Notice:</strong> Please verify this name carefully. This exact name will be permanently inscribed upon your CyberSec: Zero-Day Academy Certificate of Completion upon passing all 50 levels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={e => setDateOfBirth(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Academic Cohort / Batch</label>
                  <select
                    value={batch}
                    onChange={e => setBatch(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans"
                  >
                    <option value="2026">Batch 2026</option>
                    <option value="2027">Batch 2027</option>
                    <option value="2028">Batch 2028</option>
                    <option value="Independent">Independent Scholar</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Account Credentials */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                2. Investigator Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Username (Callsign)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NetHunter"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Privacy & Consent */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 accent-blue-600 w-4 h-4 rounded"
                />
                <span className="text-[11px] leading-relaxed">
                  I agree to the Zero-Day Academy Academic Code of Conduct and Terms of Service.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  checked={agreedPrivacy}
                  onChange={e => setAgreedPrivacy(e.target.checked)}
                  className="mt-0.5 accent-blue-600 w-4 h-4 rounded"
                />
                <span className="text-[11px] leading-relaxed">
                  I acknowledge the Privacy Policy. Simulated laboratory evidence and assessment scores are stored securely for academic accreditation.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating Student Record...' : 'Complete Enrollment & Launch Level 01'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Username or Email</label>
              <input
                type="text"
                required
                placeholder="e.g. NetHunter or student@example.com"
                value={loginQuery}
                onChange={e => setLoginQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-400 block">Password</label>
                <span className="text-[11px] text-zinc-500">Security Encrypted</span>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Investigation Workspace'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-2 text-center text-zinc-500 text-[11px]">
              <span>Need to enroll? </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-blue-400 hover:underline font-medium"
              >
                Create a student profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
