import React, { useState } from 'react';
import { InteractiveToolType } from '../types/cyber';
import {
  Network,
  Server,
  Shield,
  RotateCcw,
  ArrowRight,
  Check,
  Cpu,
  Layers,
  Terminal,
  Activity
} from 'lucide-react';

interface InteractiveSimulationsProps {
  toolType: InteractiveToolType;
  title: string;
  instructions: string;
  targetGoal: string;
  onGoalAchieved?: () => void;
}

export const InteractiveSimulations: React.FC<InteractiveSimulationsProps> = ({
  toolType,
  title,
  instructions,
  targetGoal,
  onGoalAchieved
}) => {
  // 1. Subnet Calculator State
  const [ipInput, setIpInput] = useState('192.168.10.0');
  const [cidrPrefix, setCidrPrefix] = useState(24);
  const [userGuessHosts, setUserGuessHosts] = useState('');
  const [subnetFeedback, setSubnetFeedback] = useState<{ type: 'success' | 'error'; message: string; explanation: string } | null>(null);

  // 2. OSI & TCP/IP Stack State
  const [selectedLayer, setSelectedLayer] = useState(3);
  const [activeStackModel, setActiveStackModel] = useState<'OSI' | 'TCPIP'>('OSI');

  // 3. Packet Inspector Flags & Handshake
  const [handshakeStep, setHandshakeStep] = useState<1 | 2 | 3 | 4>(1);
  const [tcpFlags, setTcpFlags] = useState<{ [key: string]: boolean }>({
    SYN: true,
    ACK: false,
    FIN: false,
    RST: false,
    PSH: false
  });

  // 4. Firewall Rule Engine State
  const initialFwRules = [
    { id: 1, action: 'ALLOW', proto: 'TCP', port: 443, desc: 'Permit HTTPS Web Traffic' },
    { id: 2, action: 'DENY', proto: 'TCP', port: 23, desc: 'Block Insecure Telnet Port' },
    { id: 3, action: 'ALLOW', proto: 'UDP', port: 53, desc: 'Permit DNS Name Resolution' },
    { id: 4, action: 'DENY', proto: 'TCP', port: 445, desc: 'Block Inbound SMB Direct Host' }
  ];
  const [firewallRules, setFirewallRules] = useState(initialFwRules);
  const [fwTestPort, setFwTestPort] = useState(443);
  const [fwTestProto, setFwTestProto] = useState('TCP');
  const [fwVerdict, setFwVerdict] = useState<{ action: string; rule: string; explanation: string } | null>(null);

  // 5. DNS Resolution Flow State
  const [dnsQueryDomain, setDnsQueryDomain] = useState('auth.corp-gateway.internal');
  const [dnsSpoofEnabled, setDnsSpoofEnabled] = useState(false);
  const [dnsStep, setDnsStep] = useState(0);
  const [dnsResult, setDnsResult] = useState<string | null>(null);

  // 6. ARP Table & Poisoning State
  const [arpCache, setArpCache] = useState([
    { ip: '192.168.1.1', mac: '00:1A:2B:3C:4D:01', device: 'Default Gateway Router', status: 'Clean' },
    { ip: '192.168.1.10', mac: '00:1A:2B:3C:4D:AA', device: 'Workstation-01 (Target)', status: 'Clean' },
    { ip: '192.168.1.50', mac: '00:1A:2B:3C:4D:50', device: 'Accounting File Server', status: 'Clean' }
  ]);
  const [arpPoisonActive, setArpPoisonActive] = useState(false);

  // 7. Hash Verifier State
  const [hashInput, setHashInput] = useState('payload_update_v2.exe');
  const [computedSha256, setComputedSha256] = useState('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [iocMatchResult, setIocMatchResult] = useState<boolean | null>(null);

  // 8. SIEM Correlation Rule State
  const [siemThreshold, setSiemThreshold] = useState(5);
  const [siemTimeWindow, setSiemTimeWindow] = useState(10);
  const [simulatedEvents, setSimulatedEvents] = useState<number>(7);
  const [siemAlertFired, setSiemAlertFired] = useState<boolean | null>(null);

  // Handlers
  const handleVerifySubnet = () => {
    const totalAddresses = Math.pow(2, 32 - cidrPrefix);
    const usableHosts = totalAddresses >= 2 ? totalAddresses - 2 : 0;
    const guess = parseInt(userGuessHosts.trim());

    if (guess === usableHosts) {
      setSubnetFeedback({
        type: 'success',
        message: `Verified: ${usableHosts} Usable Host Addresses`,
        explanation: `With a /${cidrPrefix} prefix, host bits = 32 - ${cidrPrefix} = ${32 - cidrPrefix}. Total IP space = 2^${32 - cidrPrefix} = ${totalAddresses}. Subtracting 2 (Network Address 192.168.10.0 and Broadcast Address) yields exactly ${usableHosts} assignable host endpoints.`
      });
      if (onGoalAchieved) onGoalAchieved();
    } else {
      setSubnetFeedback({
        type: 'error',
        message: `Expected ${usableHosts} usable hosts (entered: ${isNaN(guess) ? 0 : guess})`,
        explanation: `Formula: Usable Hosts = 2^(32 - CIDR) - 2. For /${cidrPrefix}, calculate 2^${32 - cidrPrefix} = ${totalAddresses}, then subtract 2 for network & broadcast.`
      });
    }
  };

  const handleResetSubnet = () => {
    setIpInput('192.168.10.0');
    setCidrPrefix(24);
    setUserGuessHosts('');
    setSubnetFeedback(null);
  };

  const handleSetHandshakeStep = (step: 1 | 2 | 3 | 4) => {
    setHandshakeStep(step);
    if (step === 1) {
      setTcpFlags({ SYN: true, ACK: false, FIN: false, RST: false, PSH: false });
    } else if (step === 2) {
      setTcpFlags({ SYN: true, ACK: true, FIN: false, RST: false, PSH: false });
    } else if (step === 3 || step === 4) {
      setTcpFlags({ SYN: false, ACK: true, FIN: false, RST: false, PSH: false });
      if (onGoalAchieved) onGoalAchieved();
    }
  };

  const handleTestFirewall = () => {
    const matched = firewallRules.find(r => r.proto === fwTestProto && r.port === fwTestPort);
    if (matched) {
      setFwVerdict({
        action: matched.action,
        rule: `Rule #${matched.id}: ${matched.desc}`,
        explanation: `Packet matched Rule #${matched.id} (${matched.proto}/${matched.port}). In stateful packet inspection, the match immediately executed action '${matched.action}'.`
      });
      if (onGoalAchieved) onGoalAchieved();
    } else {
      setFwVerdict({
        action: 'DENY',
        rule: 'Rule #99: Implicit Default Deny',
        explanation: `No explicit rule in the ACL matched ${fwTestProto} traffic on port ${fwTestPort}. Unmatched ingress packets fall through to default deny.`
      });
      if (onGoalAchieved) onGoalAchieved();
    }
  };

  const handleRunDnsSimulation = () => {
    setDnsStep(1);
    setTimeout(() => setDnsStep(2), 400);
    setTimeout(() => {
      setDnsStep(3);
      if (dnsSpoofEnabled) {
        setDnsResult('198.51.100.99 (SPOOFED / CACHE POISONED ATTACKER IP)');
      } else {
        setDnsResult('10.10.40.25 (VERIFIED AUTHORITATIVE IP)');
      }
      if (onGoalAchieved) onGoalAchieved();
    }, 800);
  };

  const handleToggleArpPoison = () => {
    if (!arpPoisonActive) {
      setArpCache(prev =>
        prev.map(item =>
          item.ip === '192.168.1.1'
            ? { ...item, mac: 'AA:BB:CC:DD:EE:99', status: 'POISONED (Attacker MAC Spoof)' }
            : item
        )
      );
      setArpPoisonActive(true);
      if (onGoalAchieved) onGoalAchieved();
    } else {
      setArpCache([
        { ip: '192.168.1.1', mac: '00:1A:2B:3C:4D:01', device: 'Default Gateway Router', status: 'Clean' },
        { ip: '192.168.1.10', mac: '00:1A:2B:3C:4D:AA', device: 'Workstation-01 (Target)', status: 'Clean' },
        { ip: '192.168.1.50', mac: '00:1A:2B:3C:4D:50', device: 'Accounting File Server', status: 'Clean' }
      ]);
      setArpPoisonActive(false);
    }
  };

  const handleCheckHash = () => {
    const maliciousIoc = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    if (computedSha256.trim().toLowerCase() === maliciousIoc.toLowerCase()) {
      setIocMatchResult(true);
      if (onGoalAchieved) onGoalAchieved();
    } else {
      setIocMatchResult(false);
    }
  };

  const handleEvaluateSiem = () => {
    const fired = simulatedEvents >= siemThreshold;
    setSiemAlertFired(fired);
    if (fired && onGoalAchieved) onGoalAchieved();
  };

  return (
    <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl p-6 space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
              Interactive Practice Tool
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-[11px] font-mono text-zinc-500">Educational Sandbox</span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">{title}</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{instructions}</p>
        </div>

        <div className="bg-black border border-zinc-800 px-3.5 py-2 rounded-lg text-xs font-mono self-start sm:self-auto shrink-0">
          <span className="text-zinc-500 block text-[10px] uppercase">PRACTICE TARGET</span>
          <span className="text-zinc-200 font-semibold">{targetGoal}</span>
        </div>
      </div>

      {/* ----------------- TOOL 1: SUBNET CALCULATOR ----------------- */}
      {toolType === 'subnet_calc' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="bg-black border border-zinc-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300 font-mono">
                  Subnet Parameter Controls
                </span>
                <button
                  onClick={handleResetSubnet}
                  className="text-xs font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Base Network IPv4 Address</label>
                <input
                  type="text"
                  value={ipInput}
                  onChange={e => setIpInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>CIDR Subnet Prefix</span>
                  <span className="font-mono text-white font-bold">/{cidrPrefix}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="30"
                  value={cidrPrefix}
                  onChange={e => setCidrPrefix(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <span>/20 (4,096 IPs)</span>
                  <span>/24 (256 IPs)</span>
                  <span>/28 (16 IPs)</span>
                  <span>/30 (4 IPs)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 text-xs font-mono space-y-1 text-zinc-400">
                <div className="flex justify-between">
                  <span>Total Address Space:</span>
                  <span className="text-white font-bold">{Math.pow(2, 32 - cidrPrefix)} addresses</span>
                </div>
                <div className="flex justify-between">
                  <span>Host Formula:</span>
                  <span className="text-zinc-300">2^(32 - {cidrPrefix}) - 2 = {Math.pow(2, 32 - cidrPrefix) - 2}</span>
                </div>
              </div>
            </div>

            {/* Subnet Practice Challenge */}
            <div className="bg-black border border-zinc-800 rounded-lg p-4 space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-300 font-mono block mb-2">
                  Calculation Exercise
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  For the network <span className="text-white font-mono font-bold">{ipInput}/{cidrPrefix}</span>, how many usable host endpoints can be configured without colliding with the network address or broadcast address?
                </p>

                <div className="mt-4 flex gap-2">
                  <input
                    type="number"
                    placeholder="Enter usable host count..."
                    value={userGuessHosts}
                    onChange={e => setUserGuessHosts(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-zinc-600"
                  />
                  <button
                    onClick={handleVerifySubnet}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </div>

              {subnetFeedback && (
                <div className="p-3 rounded border border-zinc-800 bg-zinc-900/60 text-xs font-mono space-y-1">
                  <div className="font-bold text-white">
                    {subnetFeedback.message}
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    {subnetFeedback.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TOOL 2: OSI & TCP/IP 7-LAYER STACK ----------------- */}
      {(toolType === 'osi_stack' || toolType === 'device_topology') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setActiveStackModel('OSI')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeStackModel === 'OSI'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                OSI 7-Layer
              </button>
              <button
                onClick={() => setActiveStackModel('TCPIP')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeStackModel === 'TCPIP'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                TCP/IP 4-Layer
              </button>
            </div>
            <button
              onClick={() => setSelectedLayer(3)}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {[
              { id: 7, name: 'Application', pdu: 'Data', protocols: 'HTTP, DNS, SSH', attack: 'SQLi, DNS Poison' },
              { id: 6, name: 'Presentation', pdu: 'Data', protocols: 'TLS, ASCII, JSON', attack: 'Downgrade, Decryption' },
              { id: 5, name: 'Session', pdu: 'Data', protocols: 'RPC, NetBIOS', attack: 'Session Hijacking' },
              { id: 4, name: 'Transport', pdu: 'Segment', protocols: 'TCP, UDP', attack: 'SYN Flood, Port Scan' },
              { id: 3, name: 'Network', pdu: 'Packet', protocols: 'IPv4, IPv6, ICMP', attack: 'IP Spoofing, Route Hijack' },
              { id: 2, name: 'Data Link', pdu: 'Frame', protocols: 'Ethernet, ARP', attack: 'ARP Poison, MAC Flood' },
              { id: 1, name: 'Physical', pdu: 'Bits', protocols: 'Cat6, Fiber, 802.11', attack: 'Wiretap, Jamming' }
            ].map(layer => (
              <button
                key={layer.id}
                onClick={() => {
                  setSelectedLayer(layer.id);
                  if (layer.id === 3 && onGoalAchieved) onGoalAchieved();
                }}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-colors ${
                  selectedLayer === layer.id
                    ? 'bg-zinc-900 border-zinc-600 text-white'
                    : 'bg-black border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block">
                    LAYER {layer.id}
                  </span>
                  <span className="text-xs font-bold block mt-0.5">
                    {layer.name}
                  </span>
                </div>
                <div className="mt-2 text-[10px] font-mono text-zinc-500">
                  {layer.pdu}
                </div>
              </button>
            ))}
          </div>

          {/* Layer Detail Inspector */}
          {(() => {
            const current = [
              { id: 7, name: 'Application Layer', pdu: 'Data Stream', protocols: 'HTTP/HTTPS, DNS, SSH, SMTP', attack: 'Web Application Attacks (SQLi, XSS), DNS Poisoning', defense: 'Web Application Firewalls (WAF), DNSSEC' },
              { id: 6, name: 'Presentation Layer', pdu: 'Data', protocols: 'TLS/SSL, JSON, XML', attack: 'TLS Downgrade Attacks, Insecure Serialization', defense: 'Strict Transport Security (HSTS), TLS 1.3' },
              { id: 5, name: 'Session Layer', pdu: 'Data', protocols: 'RPC, SMB, NetBIOS', attack: 'Session Fixation, Token Replay', defense: 'Cryptographic session tokens, short TTLs' },
              { id: 4, name: 'Transport Layer', pdu: 'Segments (TCP) / Datagrams (UDP)', protocols: 'TCP, UDP, QUIC', attack: 'SYN Flood DDoS, Port Scanning, UDP Amplification', defense: 'SYN Cookies, Stateful Inspection, TCP Sequence Randomization' },
              { id: 3, name: 'Network Layer', pdu: 'Packets', protocols: 'IPv4, IPv6, ICMP, IPsec', attack: 'IP Address Spoofing, ICMP Ping of Death, Route Hijack', defense: 'Reverse Path Forwarding (uRPF), Ingress ACLs' },
              { id: 2, name: 'Data Link Layer', pdu: 'Frames', protocols: 'Ethernet, ARP, VLAN', attack: 'ARP Cache Poisoning, MAC Address Flooding', defense: 'Dynamic ARP Inspection (DAI), Port Security' },
              { id: 1, name: 'Physical Layer', pdu: 'Raw Bits', protocols: 'Copper 1000BASE-T, Fiber, Radio RF', attack: 'Hardware Keyloggers, Physical Wiretaps', defense: 'Physical Security Perimeters, Conduit Locking' }
            ].find(l => l.id === selectedLayer);

            if (!current) return null;

            return (
              <div className="bg-black border border-zinc-800 rounded-lg p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-white font-bold">
                    INSPECTING: LAYER {current.id} ({current.name}) · PDU: {current.pdu}
                  </span>
                  <span className="text-zinc-500">Protocols: {current.protocols}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-zinc-300">
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold mb-1">Adversary Threat Vector:</span>
                    <span>{current.attack}</span>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold mb-1">Defensive Countermeasure:</span>
                    <span>{current.defense}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ----------------- TOOL 3: PACKET INSPECTOR & TCP 3-WAY HANDSHAKE ----------------- */}
      {toolType === 'packet_inspector' && (
        <div className="bg-black border border-zinc-800 rounded-lg p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <span className="text-xs font-mono text-zinc-400 block">Connection State:</span>
              <span className="text-sm font-bold font-mono text-white">
                {handshakeStep === 1 && 'STEP 1: SYN SENT'}
                {handshakeStep === 2 && 'STEP 2: SYN-ACK RECEIVED'}
                {handshakeStep === 3 && 'STEP 3: ACK SENT'}
                {handshakeStep === 4 && 'ESTABLISHED / CONNECTED'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => handleSetHandshakeStep(1)}
                className={`px-3 py-1 rounded transition-colors ${
                  handshakeStep === 1 ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                1. SYN
              </button>
              <button
                onClick={() => handleSetHandshakeStep(2)}
                className={`px-3 py-1 rounded transition-colors ${
                  handshakeStep === 2 ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                2. SYN-ACK
              </button>
              <button
                onClick={() => handleSetHandshakeStep(3)}
                className={`px-3 py-1 rounded transition-colors ${
                  handshakeStep === 3 || handshakeStep === 4 ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                3. ACK
              </button>
            </div>
          </div>

          {/* Exact Textbook Handshake Sequence Diagram */}
          <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-lg font-mono text-xs space-y-5">
            <div className="flex justify-between text-zinc-400 font-bold border-b border-zinc-800 pb-2">
              <span>CLIENT (192.168.10.50:54122)</span>
              <span>SERVER (10.0.0.10:443)</span>
            </div>

            <div className="space-y-4">
              {/* Step 1: SYN */}
              <div
                onClick={() => handleSetHandshakeStep(1)}
                className={`p-3 rounded cursor-pointer transition-colors border ${
                  handshakeStep >= 1 ? 'bg-black border-zinc-700 text-white' : 'border-transparent text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400">SYN (Seq = 1000)</span>
                  <span className="text-zinc-500">───────────────────────────────►</span>
                  <span className="text-zinc-400">[Synchronize request]</span>
                </div>
              </div>

              {/* Step 2: SYN-ACK */}
              <div
                onClick={() => handleSetHandshakeStep(2)}
                className={`p-3 rounded cursor-pointer transition-colors border ${
                  handshakeStep >= 2 ? 'bg-black border-zinc-700 text-white' : 'border-transparent text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">[Server ack + sync]</span>
                  <span className="text-zinc-500">◄───────────────────────────────</span>
                  <span className="font-bold text-blue-400">SYN-ACK (Seq = 5000, Ack = 1001)</span>
                </div>
              </div>

              {/* Step 3: ACK */}
              <div
                onClick={() => handleSetHandshakeStep(3)}
                className={`p-3 rounded cursor-pointer transition-colors border ${
                  handshakeStep >= 3 ? 'bg-black border-zinc-700 text-white' : 'border-transparent text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400">ACK (Ack = 5001)</span>
                  <span className="text-zinc-500">───────────────────────────────►</span>
                  <span className="text-zinc-400">[Handshake completed]</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-2 border-t border-zinc-800 text-zinc-300 font-bold">
              {handshakeStep >= 3 ? 'STATUS: CONNECTED (Full-duplex stream ready)' : 'Awaiting completion of handshake...'}
            </div>
          </div>

          <div className="p-3 bg-zinc-900 rounded border border-zinc-800 font-mono text-[11px] text-zinc-400">
            <span className="text-zinc-200">Packet Header Dissector: </span>
            <span>Flags: [{Object.entries(tcpFlags).filter(([_, v]) => v).map(([k]) => k).join(', ') || 'NONE'}] | Window Size: 65535 | Checksum: 0x8f2a [Verified]</span>
          </div>
        </div>
      )}

      {/* ----------------- TOOL 4: STATEFUL FIREWALL RULE ENGINE ----------------- */}
      {toolType === 'firewall_rules' && (
        <div className="bg-black border border-zinc-800 rounded-lg p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-white font-bold uppercase">
                Access Control List (Top-to-Bottom Ordered)
              </span>
            </div>
            <button
              onClick={() => { setFirewallRules(initialFwRules); setFwVerdict(null); }}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500">
                  <th className="py-2 px-3">Rule</th>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Protocol</th>
                  <th className="py-2 px-3">Port</th>
                  <th className="py-2 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {firewallRules.map(rule => (
                  <tr key={rule.id} className="text-zinc-300">
                    <td className="py-2 px-3 text-zinc-500">#{rule.id}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-900 border border-zinc-700 text-white">
                        {rule.action}
                      </span>
                    </td>
                    <td className="py-2 px-3">{rule.proto}</td>
                    <td className="py-2 px-3 font-bold text-white">{rule.port}</td>
                    <td className="py-2 px-3 text-zinc-400">{rule.desc}</td>
                  </tr>
                ))}
                <tr className="text-zinc-500 italic">
                  <td className="py-2 px-3">#99</td>
                  <td className="py-2 px-3 font-bold">DENY</td>
                  <td className="py-2 px-3">ANY</td>
                  <td className="py-2 px-3">ANY</td>
                  <td className="py-2 px-3">Default Deny (Drop unmatched ingress)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Test Packet Bar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded p-3 flex flex-col sm:flex-row items-center gap-3">
            <span className="text-zinc-400 whitespace-nowrap">Inject Ingress Packet:</span>
            <select
              value={fwTestProto}
              onChange={e => setFwTestProto(e.target.value)}
              className="bg-black border border-zinc-800 rounded px-2.5 py-1 text-white"
            >
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
            </select>
            <input
              type="number"
              value={fwTestPort}
              onChange={e => setFwTestPort(parseInt(e.target.value) || 0)}
              className="bg-black border border-zinc-800 rounded px-3 py-1 text-white w-24"
            />
            <button
              onClick={handleTestFirewall}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
            >
              Evaluate Match
            </button>
          </div>

          {fwVerdict && (
            <div className="p-3 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 space-y-1">
              <div className="font-bold text-white">
                Verdict: [{fwVerdict.action}] · {fwVerdict.rule}
              </div>
              <p className="text-[11px] text-zinc-400">
                {fwVerdict.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TOOL 5: DNS RESOLUTION FLOW ----------------- */}
      {(toolType === 'dns_flow' || toolType === 'dhcp_dora') && (
        <div className="bg-black border border-zinc-800 rounded-lg p-5 space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">DNS Query Target</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={dnsQueryDomain}
                  onChange={e => setDnsQueryDomain(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1 text-white font-mono w-64"
                />
                <button
                  onClick={handleRunDnsSimulation}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                >
                  Lookup
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={dnsSpoofEnabled}
                onChange={e => setDnsSpoofEnabled(e.target.checked)}
                className="accent-blue-600 w-4 h-4 rounded"
              />
              <span>Simulate DNS Cache Poisoning (Spoof)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-3 rounded border ${dnsStep >= 1 ? 'border-zinc-600 bg-zinc-900' : 'border-zinc-800 bg-black text-zinc-500'}`}>
              <span className="font-bold text-white block mb-1">1. Recursive Lookup</span>
              <p className="text-[11px] text-zinc-400">Client queries local resolver (10.0.0.2:53)</p>
            </div>
            <div className={`p-3 rounded border ${dnsStep >= 2 ? 'border-zinc-600 bg-zinc-900' : 'border-zinc-800 bg-black text-zinc-500'}`}>
              <span className="font-bold text-white block mb-1">2. Authoritative Query</span>
              <p className="text-[11px] text-zinc-400">Resolver queries corporate authoritative nameserver</p>
            </div>
            <div className={`p-3 rounded border ${dnsStep >= 3 ? 'border-zinc-600 bg-zinc-900' : 'border-zinc-800 bg-black text-zinc-500'}`}>
              <span className="font-bold text-white block mb-1">3. Resolved IP</span>
              <p className="text-[11px] text-zinc-300 font-bold">{dnsResult || 'Awaiting query...'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TOOL 6: ARP CACHE ----------------- */}
      {toolType === 'arp_table' && (
        <div className="bg-black border border-zinc-800 rounded-lg p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-white font-bold uppercase">Kernel ARP Table (Layer 2 MAC Cache)</span>
            <button
              onClick={handleToggleArpPoison}
              className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded font-medium transition-colors"
            >
              {arpPoisonActive ? 'Restore Clean Cache' : 'Simulate Gratuitous ARP Poisoning'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500">
                  <th className="py-2 px-3">IPv4 Address</th>
                  <th className="py-2 px-3">Hardware MAC Address</th>
                  <th className="py-2 px-3">Device Identity</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {arpCache.map((entry, idx) => (
                  <tr key={idx} className="text-zinc-300">
                    <td className="py-2 px-3 font-bold text-white">{entry.ip}</td>
                    <td className="py-2 px-3 font-mono">{entry.mac}</td>
                    <td className="py-2 px-3">{entry.device}</td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${entry.status.includes('POISONED') ? 'bg-zinc-900 border border-red-500/40 text-red-300' : 'text-zinc-400'}`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- TOOL 7: HASH VERIFIER ----------------- */}
      {toolType === 'hash_verifier' && (
        <div className="bg-black border border-zinc-800 rounded-lg p-5 space-y-4 font-mono text-xs">
          <div className="border-b border-zinc-800 pb-2">
            <span className="text-white font-bold uppercase">Artifact Hash Verifier</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-zinc-400 block mb-1">Target Binary Name</label>
              <input
                type="text"
                value={hashInput}
                onChange={e => setHashInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1">SHA-256 Digest</label>
              <input
                type="text"
                value={computedSha256}
                onChange={e => setComputedSha256(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-zinc-300 font-mono"
              />
            </div>
            <button
              onClick={handleCheckHash}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
            >
              Cross-Reference IOC Database
            </button>

            {iocMatchResult !== null && (
              <div className="p-3 rounded border border-zinc-800 bg-zinc-900 text-zinc-300">
                {iocMatchResult
                  ? 'CRITICAL MATCH: Hash matches known Cobalt Strike Beacon / Ransomware Dropper signature.'
                  : 'VERIFIED CLEAN: Hash does not match known threat signatures.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- TOOL 8: SIEM CORRELATION RULE TESTER ----------------- */}
      {(toolType === 'siem_correlation' || toolType === 'timeline_reconstructor' || toolType === 'email_headers') && (
        <div className="bg-black border border-zinc-800 rounded-lg p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-white font-bold uppercase">SIEM Alert Correlation Rule Tester</span>
            <span className="text-zinc-400 text-[11px]">Ingestion Pipeline Ready</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-zinc-400 block mb-1">Event Threshold (Hits)</label>
              <input
                type="number"
                value={siemThreshold}
                onChange={e => setSiemThreshold(parseInt(e.target.value) || 1)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1">Time Window (Seconds)</label>
              <input
                type="number"
                value={siemTimeWindow}
                onChange={e => setSiemTimeWindow(parseInt(e.target.value) || 1)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1">Simulated Ingested Events</label>
              <input
                type="number"
                value={simulatedEvents}
                onChange={e => setSimulatedEvents(parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-white"
              />
            </div>
          </div>

          <button
            onClick={handleEvaluateSiem}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
          >
            Evaluate Correlation Trigger
          </button>

          {siemAlertFired !== null && (
            <div className="p-3 rounded border border-zinc-800 bg-zinc-900 text-zinc-300">
              {siemAlertFired ? (
                <div>
                  <span className="font-bold text-white block">ALERT TRIGGERED: Attack Pattern Detected</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {simulatedEvents} events were recorded within {siemTimeWindow}s, exceeding threshold ({siemThreshold}).
                  </p>
                </div>
              ) : (
                <div>
                  <span className="font-bold text-zinc-400 block">Baseline Normal</span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {simulatedEvents} events recorded. Does not breach threshold ({siemThreshold}).
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
