import React, { useState } from 'react';
import { CyberApiService } from '../services/api';
import { FirebaseDbService } from '../services/firebaseDb';
import { CertificateData } from '../types/cyber';
import { Search, Check, X, Shield, Cloud } from 'lucide-react';

interface CertificateVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateVerifyModal: React.FC<CertificateVerifyModalProps> = ({
  isOpen,
  onClose
}) => {
  const [certInput, setCertInput] = useState('SG-CYBER-2026-8F42K');
  const [result, setResult] = useState<{
    searched: boolean;
    valid: boolean;
    certificate?: CertificateData;
    message?: string;
    source?: 'firestore' | 'server';
  } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!certInput.trim()) return;
    setLoading(true);

    try {
      // 1. Check Firestore certificates collection
      const firestoreCert = await FirebaseDbService.verifyCertificate(certInput);
      if (firestoreCert) {
        setResult({
          searched: true,
          valid: true,
          certificate: firestoreCert,
          message: 'Certificate successfully verified against Firestore blockchain-backed registry.',
          source: 'firestore'
        });
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Firestore verification check error, falling back to server API', e);
    }

    // 2. Fall back to CyberApiService
    const res = await CyberApiService.verifyCertificate(certInput);
    setResult({
      searched: true,
      valid: res.valid,
      certificate: res.certificate,
      message: res.message,
      source: 'server'
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl max-w-xl w-full p-6 sm:p-7 space-y-5 my-8 text-zinc-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="border-b border-zinc-800 pb-3">
          <span className="text-xs font-mono text-zinc-400 uppercase font-semibold block">
            Public Accreditation Registry
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Verify Certificate ID
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Validate course completion, student identity, and graduation standing on the official registry.
          </p>
        </div>

        {/* Search Field */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. SG-CYBER-2026-8F42K"
            value={certInput}
            onChange={e => setCertInput(e.target.value.toUpperCase())}
            className="flex-1 bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {/* Verification Result */}
        {result?.searched && (
          <div className="p-4 rounded bg-black border border-zinc-800 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-bold text-white">
                {result.valid ? '✓ ACCREDITATION RECORD VALID' : '✕ NO MATCH FOUND'}
              </span>
              <span className="text-zinc-500 text-[10px]">{certInput}</span>
            </div>

            {result.valid && result.certificate ? (
              <div className="space-y-2 text-[11px] text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">STUDENT NAME:</span>
                  <span className="text-white font-bold">{result.certificate.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">ACADEMIC BATCH:</span>
                  <span>{result.certificate.batch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">DATE ISSUED:</span>
                  <span>{result.certificate.completionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">VERIFIED SCORE:</span>
                  <span className="text-white font-bold">{result.certificate.finalScore}% (50/50 Modules)</span>
                </div>
                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-zinc-500 block mb-1">VERIFIED SKILLS COVERED:</span>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {result.certificate.skillsCovered.map((s, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-zinc-400 text-xs font-sans">
                {result.message || 'No certificate record corresponds to this ID. Check for typos.'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
