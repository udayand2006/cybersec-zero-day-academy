import React, { useState } from 'react';
import { Wrench, Network, Search, Hash, Lock, Shield, Terminal, Cpu } from 'lucide-react';

interface ToolboxModalProps {
  unlockedTools: string[];
}

export const ToolboxModal: React.FC<ToolboxModalProps> = ({ unlockedTools }) => {
  const [activeTool, setActiveTool] = useState<string>('subnet');
  const [cidr, setCidr] = useState(24);
  const [portQuery, setPortQuery] = useState('443');

  const portDatabase: { [port: string]: string } = {
    '20': 'FTP-Data (File Transfer Protocol)',
    '21': 'FTP-Control (File Transfer Protocol)',
    '22': 'SSH (Secure Shell) / SFTP',
    '23': 'Telnet (Insecure Cleartext Terminal)',
    '25': 'SMTP (Simple Mail Transfer Protocol)',
    '53': 'DNS (Domain Name System - UDP/TCP)',
    '67': 'DHCP Server (Dynamic Host Config)',
    '68': 'DHCP Client (Dynamic Host Config)',
    '80': 'HTTP (Hypertext Transfer Protocol - Cleartext)',
    '88': 'Kerberos Authentication (Active Directory)',
    '110': 'POP3 (Post Office Protocol v3)',
    '123': 'NTP (Network Time Protocol)',
    '143': 'IMAP (Internet Message Access Protocol)',
    '389': 'LDAP (Lightweight Directory Access)',
    '443': 'HTTPS (HTTP over TLS/SSL)',
    '445': 'SMB (Server Message Block / Windows File Sharing)',
    '636': 'LDAPS (LDAP over TLS/SSL)',
    '1433': 'MS-SQL Server Database',
    '3306': 'MySQL Database Server',
    '3389': 'RDP (Windows Remote Desktop Protocol)',
    '4444': 'Metasploit Default Listener / Reverse Shell',
    '8080': 'HTTP-Proxy / Alternate Web Server',
    '8443': 'HTTPS-Alternate / Management Console'
  };

  const hasPacketTool = unlockedTools.includes('Packet Analysis Tool');
  const hasAdvancedLab = unlockedTools.includes('Advanced Investigation Lab');
  const hasThreatHunt = unlockedTools.includes('Threat Hunting Suite');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase font-semibold block">
            Investigator Utilities
          </span>
          <h1 className="text-2xl font-bold text-white mt-0.5">
            Cyber Defense & Forensic Toolkit
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Specialized tactical utilities unlocked through Boss challenge victories and campaign milestones.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-black p-1 rounded-lg border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setActiveTool('subnet')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTool === 'subnet' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            CIDR Calculator
          </button>
          <button
            onClick={() => setActiveTool('ports')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTool === 'ports' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Port Registry
          </button>
          <button
            onClick={() => setActiveTool('suite')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTool === 'suite' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Unlocked Suites
          </button>
        </div>
      </div>

      {/* Tool 1: CIDR Quick Calculator */}
      {activeTool === 'subnet' && (
        <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 space-y-4 font-mono text-xs">
          <div className="border-b border-zinc-800 pb-2">
            <span className="text-white font-bold uppercase">Rapid IPv4 Subnet Space Inspector</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-zinc-300">
              <span>Prefix Length:</span>
              <span className="font-bold text-white">/{cidr}</span>
            </div>
            <input
              type="range"
              min="16"
              max="30"
              value={cidr}
              onChange={e => setCidr(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-zinc-400 text-[11px]">
              <div className="p-2.5 rounded bg-black border border-zinc-800">
                <span className="text-zinc-500 block">TOTAL ADDRESSES:</span>
                <span className="text-white font-bold">{Math.pow(2, 32 - cidr).toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded bg-black border border-zinc-800">
                <span className="text-zinc-500 block">USABLE HOSTS:</span>
                <span className="text-white font-bold">{Math.max(0, Math.pow(2, 32 - cidr) - 2).toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded bg-black border border-zinc-800">
                <span className="text-zinc-500 block">HOST BITS:</span>
                <span className="text-white font-bold">{32 - cidr} bits</span>
              </div>
              <div className="p-2.5 rounded bg-black border border-zinc-800">
                <span className="text-zinc-500 block">NETWORK MASK:</span>
                <span className="text-white font-bold">
                  {cidr === 24 ? '255.255.255.0' : cidr === 16 ? '255.255.0.0' : `/${cidr}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tool 2: Port Registry Lookup */}
      {activeTool === 'ports' && (
        <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 space-y-4 font-mono text-xs">
          <div className="border-b border-zinc-800 pb-2">
            <span className="text-white font-bold uppercase">Standard IANA & Adversary Port Reference</span>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter port number (e.g. 443, 88, 445, 3389)..."
                value={portQuery}
                onChange={e => setPortQuery(e.target.value.trim())}
                className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="p-4 rounded bg-black border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">REGISTERED DEFINITION:</span>
              <p className="text-white text-sm font-bold mt-1">
                Port {portQuery}: {portDatabase[portQuery] || 'Custom / Unofficial or Ephemeral Application Port'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tool 3: Unlocked Suites */}
      {activeTool === 'suite' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-5 rounded-xl bg-[#0f0f11] border border-zinc-800 space-y-2">
            <span className="text-white font-bold block">1. Basic Network Toolkit</span>
            <p className="text-zinc-400 text-[11px] font-sans">
              Core CIDR calculator and TCP/IP protocol stack inspector. Available from Level 1.
            </p>
            <span className="text-[10px] text-zinc-300 block pt-1">STATUS: UNLOCKED</span>
          </div>

          <div className={`p-5 rounded-xl border space-y-2 ${hasPacketTool ? 'bg-[#0f0f11] border-zinc-800' : 'bg-black border-zinc-900 opacity-60'}`}>
            <span className="text-white font-bold block">2. Packet Analysis Tool</span>
            <p className="text-zinc-400 text-[11px] font-sans">
              Wireshark-level packet dissector and TCP flag injection.
            </p>
            <span className="text-[10px] text-zinc-400 block pt-1">
              {hasPacketTool ? 'STATUS: UNLOCKED' : 'LOCKED (Defeat Boss #1)'}
            </span>
          </div>

          <div className={`p-5 rounded-xl border space-y-2 ${hasAdvancedLab ? 'bg-[#0f0f11] border-zinc-800' : 'bg-black border-zinc-900 opacity-60'}`}>
            <span className="text-white font-bold block">3. Advanced Investigation Lab</span>
            <p className="text-zinc-400 text-[11px] font-sans">
              Multi-source correlation engine for Level 16+ investigations.
            </p>
            <span className="text-[10px] text-zinc-400 block pt-1">
              {hasAdvancedLab ? 'STATUS: UNLOCKED' : 'LOCKED (Pass Level 15 Exam)'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
