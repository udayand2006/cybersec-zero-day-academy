import React, { useState } from 'react';
import { CertificateData } from '../types/cyber';
import { Award, Shield, CheckCircle2, Copy, Check, Printer, Search, Lock, AlertCircle } from 'lucide-react';

interface CertificateViewProps {
  userCertificate: CertificateData | null;
  onOpenVerifyModal: () => void;
  userProfile?: any;
  completedLevelsCount?: number;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  userCertificate,
  onOpenVerifyModal,
  userProfile,
  completedLevelsCount = 0
}) => {
  const [copied, setCopied] = useState(false);

  const isIssued = Boolean(userCertificate && userCertificate.status === 'Valid');
  const studentName = isIssued
    ? userCertificate!.studentName
    : (userProfile?.certificateName || userProfile?.fullName || userProfile?.username || '[Your Certificate Name]');
  const certId = isIssued ? userCertificate!.certificateId : 'SG-CYBER-2026-PREVIEW';
  const issueDate = isIssued ? userCertificate!.completionDate : 'Upon 50-Level Completion';

  const completed = completedLevelsCount || (userProfile?.completedLevels?.length || 0);
  const progressPercent = Math.min(100, Math.round((completed / 50) * 100));

  const handleCopyId = () => {
    navigator.clipboard.writeText(certId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner & Status */}
      <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Official Course Completion Accreditation
            </span>
            <span className="text-zinc-600">·</span>
            <span className={`text-xs font-mono ${isIssued ? 'text-zinc-200' : 'text-zinc-500'}`}>
              {isIssued ? 'CERTIFICATE ISSUED' : 'CERTIFICATE PREVIEW'}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mt-1">
            CyberSec: Zero-Day Academy Certificate
          </h1>

          <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Awarded upon verified server-side completion of all 50 progressive modules across networking, threat hunting, digital forensics, and incident response.
          </p>
        </div>

        <button
          onClick={onOpenVerifyModal}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 self-start sm:self-auto whitespace-nowrap"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span>Verify Certificate ID</span>
        </button>
      </div>

      {/* Progress & Checklist if Not Yet Completed */}
      {!isIssued && (
        <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold uppercase">Accreditation Progress</span>
            <span className="text-zinc-400">{completed} / 50 Levels ({progressPercent}%)</span>
          </div>

          <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <span className={completed >= 15 ? 'text-white' : 'text-zinc-600'}>
                {completed >= 15 ? '✓' : '○'}
              </span>
              <span>Phase 1–3: Networking & Services Fundamentals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={completed >= 15 ? 'text-white' : 'text-zinc-600'}>
                {completed >= 15 ? '✓' : '○'}
              </span>
              <span>Level 15: Foundation Mastery Gate Exam (80%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={completed >= 35 ? 'text-white' : 'text-zinc-600'}>
                {completed >= 35 ? '✓' : '○'}
              </span>
              <span>Phase 4–7: Advanced Forensics, Malware & SIEM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={completed >= 50 ? 'text-white' : 'text-zinc-600'}>
                {completed >= 50 ? '✓' : '○'}
              </span>
              <span>Level 50: Grand Metropolitan Cyber Crisis Resolution</span>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-400">
          {isIssued ? 'Official High-Resolution Certificate' : 'Interactive Certificate Preview'}
        </span>

        <div className="flex items-center gap-2">
          {isIssued && (
            <button
              onClick={handleCopyId}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied ID' : 'Copy ID'}</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PREMIUM CERTIFICATE CANVAS (BLACK, OFF-WHITE, IVORY, SUBTLE GOLD)         */}
      {/* ========================================================================= */}
      <div className="relative bg-[#0d0d0f] border-2 border-[#b89758]/50 rounded-2xl p-8 sm:p-14 text-center space-y-6 shadow-2xl overflow-hidden print:bg-white print:text-black print:border-black">
        {/* Subtle Watermark when Not Yet Issued */}
        {!isIssued && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="transform -rotate-12 select-none border-4 border-zinc-700/40 rounded-xl px-8 py-3 text-zinc-700/40 font-mono text-2xl sm:text-3xl font-extrabold tracking-widest uppercase">
              PREVIEW — NOT YET ISSUED
            </div>
          </div>
        )}

        {/* Four Elegant Corner Embellishments */}
        <div className="absolute top-4 left-4 w-7 h-7 border-t border-l border-[#b89758]/80 pointer-events-none" />
        <div className="absolute top-4 right-4 w-7 h-7 border-t border-r border-[#b89758]/80 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-7 h-7 border-b border-l border-[#b89758]/80 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-7 h-7 border-b border-r border-[#b89758]/80 pointer-events-none" />

        {/* Certificate Academy Emblem */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black border border-[#b89758]/70 text-[#d4af37] mb-1">
          <Shield className="w-7 h-7" />
        </div>

        {/* Institution Title */}
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#b89758] block font-semibold">
            CYBERSEC: ZERO-DAY ACADEMY
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-tight text-zinc-100 font-bold">
            CERTIFICATE OF COMPLETION
          </h2>
          <span className="text-xs text-zinc-400 font-mono block mt-1">
            This is to certify that
          </span>
        </div>

        {/* Student Name */}
        <div className="py-2.5 border-b border-[#b89758]/40 max-w-md mx-auto">
          <span className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white block">
            {studentName}
          </span>
          <span className="text-xs font-mono text-zinc-500 block mt-1">
            {userProfile?.batch || 'Batch 2027'}
          </span>
        </div>

        {/* Attestation Paragraph */}
        <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed font-sans">
          has successfully completed all 50 progressive levels of <strong className="text-white">CyberSec: Zero-Day Academy</strong> and demonstrated practical skills in networking, digital forensics, threat hunting, and incident response.
        </p>

        {/* Domain Competencies Row */}
        <div className="pt-2 text-[11px] font-mono text-zinc-400 max-w-xl mx-auto border-t border-zinc-800/80">
          <span>Networking • Cybersecurity • Forensics • Threat Hunting • Incident Response</span>
        </div>

        {/* Certificate Metadata & Signature Block */}
        <div className="pt-6 border-t border-[#b89758]/30 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto text-xs font-mono text-zinc-400">
          <div className="text-left space-y-1">
            <span className="text-zinc-500 block text-[10px]">CERTIFICATE ID:</span>
            <span className="text-zinc-200 font-bold">{certId}</span>
            <span className="text-zinc-500 block text-[10px]">DATE: {issueDate}</span>
          </div>

          {/* Seal / Emblem Badge */}
          <div className="w-16 h-16 rounded-full border border-[#b89758]/50 flex flex-col items-center justify-center text-[9px] font-mono text-[#b89758] p-1 text-center bg-black/40">
            <span className="font-bold">VERIFIED</span>
            <span className="text-[8px] text-zinc-400">OFFICIAL</span>
            <span className="text-[8px]">SEAL</span>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <div className="font-serif italic text-sm text-zinc-200 border-b border-zinc-700 pb-0.5 px-3">
              Dr. Marcus Vance
            </div>
            <span className="text-[10px] text-zinc-500 block">Authorized Signature</span>
            <span className="text-[10px] text-zinc-400 block">Platform Director</span>
          </div>
        </div>
      </div>
    </div>
  );
};
