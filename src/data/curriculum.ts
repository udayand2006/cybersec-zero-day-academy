import { LevelMetadata } from '../types/cyber';

export const CURRICULUM_PHASES = [
  {
    phaseId: 1,
    title: 'Phase 1: Networking & Infrastructure Fundamentals',
    levelsRange: '01–05',
    category: 'networking_fundamentals',
    description: 'Master network hardware, host topologies, IPv4/IPv6, CIDR subnetting, and MAC/ARP tables.',
    bossLevel: 5
  },
  {
    phaseId: 2,
    title: 'Phase 2: OSI & TCP/IP Protocol Stacks',
    levelsRange: '06–10',
    category: 'osi_tcp_protocols',
    description: 'Dissect the 7 OSI layers, TCP 3-way handshakes, UDP datagrams, flags, and port multiplexing.',
    bossLevel: 10
  },
  {
    phaseId: 3,
    title: 'Phase 3: Core Application Protocols & Perimeter Security',
    levelsRange: '11–15',
    category: 'network_services_firewalls',
    description: 'Inspect DNS hierarchies, DHCP DORA cycles, TLS handshakes, stateful firewalls, and pass the Foundation Mastery Exam.',
    bossLevel: 15,
    hasExamGate: true
  },
  {
    phaseId: 4,
    title: 'Phase 4: Identity, Authentication & Attack Vectors',
    levelsRange: '16–20',
    category: 'attack_fundamentals_auth',
    description: 'Enter Advanced Investigator Mode. Correlate MFA fatigue, Kerberos tickets, credential stuffing, and spear-phishing.',
    bossLevel: 20
  },
  {
    phaseId: 5,
    title: 'Phase 5: Malware Taxonomy & System Forensics',
    levelsRange: '21–25',
    category: 'malware_system_forensics',
    description: 'Reverse-engineer malware droppers, cryptographic hashes, volatility order, and Windows event IDs 4624/7045.',
    bossLevel: 25
  },
  {
    phaseId: 6,
    title: 'Phase 6: Digital Forensics & Super-Timeline Analysis',
    levelsRange: '26–30',
    category: 'digital_forensics_artifacts',
    description: 'Extract browser session storage, analyze DKIM/SPF email headers, construct MACB timelines, and maintain chain of custody.',
    bossLevel: 30
  },
  {
    phaseId: 7,
    title: 'Phase 7: SOC Operations, SIEM & Threat Hunting',
    levelsRange: '31–35',
    category: 'soc_threat_detection',
    description: 'Rule correlation across thousands of logs, IOC mapping via MITRE ATT&CK, baseline deviations, and APT tracking.',
    bossLevel: 35
  },
  {
    phaseId: 8,
    title: 'Phase 8: Incident Response Lifecycle & Remediation',
    levelsRange: '36–40',
    category: 'incident_response_lifecycle',
    description: 'Apply NIST SP 800-61 / PICERL phases, execute host network containment, eradicate persistence, and restore services.',
    bossLevel: 40
  },
  {
    phaseId: 9,
    title: 'Phase 9: Web, Cloud & Insider Threat Vectors',
    levelsRange: '41–45',
    category: 'advanced_vectors_cloud_web',
    description: 'Investigate OWASP Top 10 exploits, Cloud IAM role abuse, metadata SSRF 169.254.169.254, and UEBA anomaly detection.',
    bossLevel: 45
  },
  {
    phaseId: 10,
    title: 'Phase 10: Master Investigator & Metropolitan Crisis',
    levelsRange: '46–50',
    category: 'master_investigator_crisis',
    description: 'Decrypt TLS JA3 fingerprints, analyze memory dumps, and resolve the 10-piece Grand Metropolitan Cyber Crisis.',
    bossLevel: 50
  }
];

export const ALL_50_LEVELS: LevelMetadata[] = [
  // Phase 1 (1–5)
  {
    id: 1,
    title: 'What is a Computer Network?',
    subtitle: 'LAN, WAN, MAN, Client-Server & Network Topologies',
    phaseId: 1,
    phaseTitle: 'Phase 1: Networking Fundamentals',
    category: 'networking_fundamentals',
    isBoss: false,
    xpReward: 150,
    estimatedMinutes: 8
  },
  {
    id: 2,
    title: 'Network Hardware & Architecture',
    subtitle: 'Hubs, Switches, Routers, Gateways & Proxies',
    phaseId: 1,
    phaseTitle: 'Phase 1: Networking Fundamentals',
    category: 'networking_fundamentals',
    isBoss: false,
    xpReward: 160,
    estimatedMinutes: 10
  },
  {
    id: 3,
    title: 'IP Addressing & Subnet Calculations',
    subtitle: 'IPv4, IPv6, Public vs Private, CIDR & Usable Hosts',
    phaseId: 1,
    phaseTitle: 'Phase 1: Networking Fundamentals',
    category: 'networking_fundamentals',
    isBoss: false,
    xpReward: 180,
    estimatedMinutes: 12
  },
  {
    id: 4,
    title: 'MAC Addressing & The ARP Protocol',
    subtitle: 'Physical Addressing, ARP Requests/Replies & Poisoning Risks',
    phaseId: 1,
    phaseTitle: 'Phase 1: Networking Fundamentals',
    category: 'networking_fundamentals',
    isBoss: false,
    xpReward: 180,
    estimatedMinutes: 12
  },
  {
    id: 5,
    title: 'ZERO-DAY #1: Network Investigation',
    subtitle: 'Major Incident: Subnet Infiltration & Rogue Gateway Tampering',
    phaseId: 1,
    phaseTitle: 'Phase 1: Networking Fundamentals',
    category: 'networking_fundamentals',
    isBoss: true,
    bossTitle: 'ZERO-DAY #1: Rogue Gateway Infiltration',
    xpReward: 450,
    estimatedMinutes: 20,
    unlockedToolReward: 'Packet Analysis Tool',
    badgeReward: '📡 Packet Analyst'
  },

  // Phase 2 (6–10)
  {
    id: 6,
    title: 'The 7-Layer OSI Model',
    subtitle: 'Physical, Data Link, Network, Transport, Session, Presentation, Application',
    phaseId: 2,
    phaseTitle: 'Phase 2: OSI & TCP/IP Protocols',
    category: 'osi_tcp_protocols',
    isBoss: false,
    xpReward: 170,
    estimatedMinutes: 12
  },
  {
    id: 7,
    title: 'The TCP/IP 4-Layer Model',
    subtitle: 'Network Access, Internet, Transport & Application Comparison',
    phaseId: 2,
    phaseTitle: 'Phase 2: OSI & TCP/IP Protocols',
    category: 'osi_tcp_protocols',
    isBoss: false,
    xpReward: 170,
    estimatedMinutes: 10
  },
  {
    id: 8,
    title: 'Ports, Sockets & Well-Known Services',
    subtitle: 'Standard Ports (21, 22, 25, 53, 80, 443, 3389) & Ephemeral Ranges',
    phaseId: 2,
    phaseTitle: 'Phase 2: OSI & TCP/IP Protocols',
    category: 'osi_tcp_protocols',
    isBoss: false,
    xpReward: 180,
    estimatedMinutes: 12
  },
  {
    id: 9,
    title: 'TCP Handshake & UDP Datagrams',
    subtitle: 'SYN, SYN-ACK, ACK, TCP Flags & Connectionless UDP',
    phaseId: 2,
    phaseTitle: 'Phase 2: OSI & TCP/IP Protocols',
    category: 'osi_tcp_protocols',
    isBoss: false,
    xpReward: 190,
    estimatedMinutes: 14
  },
  {
    id: 10,
    title: 'ZERO-DAY #2: Packet Stream Hijack',
    subtitle: 'Major Incident: Deep Packet Dissection & TCP Flag Anomaly',
    phaseId: 2,
    phaseTitle: 'Phase 2: OSI & TCP/IP Protocols',
    category: 'osi_tcp_protocols',
    isBoss: true,
    bossTitle: 'ZERO-DAY #2: TCP Stream Disruption',
    xpReward: 450,
    estimatedMinutes: 22,
    badgeReward: '🛡️ Blue Team Defender'
  },

  // Phase 3 (11–15)
  {
    id: 11,
    title: 'Domain Name System (DNS) Mechanics',
    subtitle: 'Resolvers, A/AAAA/MX/TXT Records, Cache Poisoning & Exfiltration',
    phaseId: 3,
    phaseTitle: 'Phase 3: Core Application Protocols',
    category: 'network_services_firewalls',
    isBoss: false,
    xpReward: 190,
    estimatedMinutes: 15
  },
  {
    id: 12,
    title: 'Dynamic Host Configuration (DHCP)',
    subtitle: 'DORA Process, Rogue DHCP Servers & Subnet Starvation',
    phaseId: 3,
    phaseTitle: 'Phase 3: Core Application Protocols',
    category: 'network_services_firewalls',
    isBoss: false,
    xpReward: 180,
    estimatedMinutes: 12
  },
  {
    id: 13,
    title: 'HTTP, HTTPS & TLS Encryption',
    subtitle: 'Plaintext Vulnerabilities, SSL/TLS Handshake & Certificate Validation',
    phaseId: 3,
    phaseTitle: 'Phase 3: Core Application Protocols',
    category: 'network_services_firewalls',
    isBoss: false,
    xpReward: 190,
    estimatedMinutes: 14
  },
  {
    id: 14,
    title: 'Firewalls & Network Segmentation',
    subtitle: 'Stateful vs Stateless Filtering, Inbound/Outbound Rules & DMZ',
    phaseId: 3,
    phaseTitle: 'Phase 3: Core Application Protocols',
    category: 'network_services_firewalls',
    isBoss: false,
    xpReward: 200,
    estimatedMinutes: 15
  },
  {
    id: 15,
    title: 'ZERO-DAY #3: Perimeter Breach & Knowledge Gate',
    subtitle: 'Boss Investigation + Mandatory Foundation Mastery Exam (80%+ to unlock Level 16)',
    phaseId: 3,
    phaseTitle: 'Phase 3: Core Application Protocols',
    category: 'network_services_firewalls',
    isBoss: true,
    isExamGate: true,
    bossTitle: 'ZERO-DAY #3: Perimeter Breach & Foundation Exam',
    xpReward: 600,
    estimatedMinutes: 30,
    unlockedToolReward: 'Advanced Investigation Lab',
    badgeReward: '🔎 Digital Investigator'
  },

  // Phase 4 (16–20) - ADVANCED MODE BEGINS
  {
    id: 16,
    title: 'Authentication & Access Control',
    subtitle: 'AAA Model, RBAC, Kerberos, Single Sign-On & Multi-Factor Security',
    phaseId: 4,
    phaseTitle: 'Phase 4: Advanced Identity & Vectors',
    category: 'attack_fundamentals_auth',
    isBoss: false,
    xpReward: 220,
    estimatedMinutes: 18
  },
  {
    id: 17,
    title: 'Password Security & Credential Attacks',
    subtitle: 'Brute Force, Credential Stuffing, Password Spraying, Hashing & Salting',
    phaseId: 4,
    phaseTitle: 'Phase 4: Advanced Identity & Vectors',
    category: 'attack_fundamentals_auth',
    isBoss: false,
    xpReward: 220,
    estimatedMinutes: 18
  },
  {
    id: 18,
    title: 'Phishing & Spear-Phishing Mechanics',
    subtitle: 'Deceptive Headers, Typosquatting, Malicious Payloads & Delivery',
    phaseId: 4,
    phaseTitle: 'Phase 4: Advanced Identity & Vectors',
    category: 'attack_fundamentals_auth',
    isBoss: false,
    xpReward: 230,
    estimatedMinutes: 20
  },
  {
    id: 19,
    title: 'Social Engineering & Human Vectors',
    subtitle: 'Pretexting, Baiting, Quid Pro Quo, Vishing & Physical Intrusion',
    phaseId: 4,
    phaseTitle: 'Phase 4: Advanced Identity & Vectors',
    category: 'attack_fundamentals_auth',
    isBoss: false,
    xpReward: 220,
    estimatedMinutes: 18
  },
  {
    id: 20,
    title: 'ZERO-DAY #4: Credential Hijacking Crisis',
    subtitle: 'Major Incident: Executive MFA Fatigue, Session Token Theft & Shadow Admin',
    phaseId: 4,
    phaseTitle: 'Phase 4: Advanced Identity & Vectors',
    category: 'attack_fundamentals_auth',
    isBoss: true,
    bossTitle: 'ZERO-DAY #4: Executive Credential Compromise',
    xpReward: 500,
    estimatedMinutes: 25,
    badgeReward: '🔑 Credential Sentinel'
  },

  // Phase 5 (21–25)
  {
    id: 21,
    title: 'Malware Taxonomy & Lifecycle',
    subtitle: 'Trojans, Worms, Ransomware, Spyware, Rootkits & Droppers',
    phaseId: 5,
    phaseTitle: 'Phase 5: Malware & System Forensics',
    category: 'malware_system_forensics',
    isBoss: false,
    xpReward: 230,
    estimatedMinutes: 20
  },
  {
    id: 22,
    title: 'Cryptographic Hashing & File Integrity',
    subtitle: 'MD5, SHA-256, Fuzzy Hashing (ssdeep) & Threat Intelligence Lookups',
    phaseId: 5,
    phaseTitle: 'Phase 5: Malware & System Forensics',
    category: 'malware_system_forensics',
    isBoss: false,
    xpReward: 230,
    estimatedMinutes: 20
  },
  {
    id: 23,
    title: 'Digital Evidence & Order of Volatility',
    subtitle: 'RFC 3227 Volatility Hierarchy, Live Memory Acquisition & Write-Blockers',
    phaseId: 5,
    phaseTitle: 'Phase 5: Malware & System Forensics',
    category: 'malware_system_forensics',
    isBoss: false,
    xpReward: 240,
    estimatedMinutes: 20
  },
  {
    id: 24,
    title: 'Security Logs & Event Correlation',
    subtitle: 'Windows Event IDs (4624, 4625, 4720, 7045), Syslog & Audit Logs',
    phaseId: 5,
    phaseTitle: 'Phase 5: Malware & System Forensics',
    category: 'malware_system_forensics',
    isBoss: false,
    xpReward: 240,
    estimatedMinutes: 22
  },
  {
    id: 25,
    title: 'ZERO-DAY #5: Ransomware Outbreak',
    subtitle: 'Major Incident: Patient Zero Dropper, Shadow Copy Deletion & Persistence',
    phaseId: 5,
    phaseTitle: 'Phase 5: Malware & System Forensics',
    category: 'malware_system_forensics',
    isBoss: true,
    bossTitle: 'ZERO-DAY #5: Enterprise Ransomware Outbreak',
    xpReward: 500,
    estimatedMinutes: 28,
    badgeReward: '🦠 Malware Hunter'
  },

  // Phase 6 (26–30)
  {
    id: 26,
    title: 'Browser Artifact Forensics',
    subtitle: 'Cache, Cookies, Session Storage, Downloads & Typed URL Timelines',
    phaseId: 6,
    phaseTitle: 'Phase 6: Digital Forensics & Artifacts',
    category: 'digital_forensics_artifacts',
    isBoss: false,
    xpReward: 240,
    estimatedMinutes: 20
  },
  {
    id: 27,
    title: 'Email Header Forensics & Authentication',
    subtitle: 'Received Hops, Originating IP, SPF, DKIM & DMARC Validation',
    phaseId: 6,
    phaseTitle: 'Phase 6: Digital Forensics & Artifacts',
    category: 'digital_forensics_artifacts',
    isBoss: false,
    xpReward: 250,
    estimatedMinutes: 22
  },
  {
    id: 28,
    title: 'Timeline Reconstruction & Super-Timelines',
    subtitle: 'MACB Timestamps, Prefetch Files, Shellbags & Cross-Source Correlation',
    phaseId: 6,
    phaseTitle: 'Phase 6: Digital Forensics & Artifacts',
    category: 'digital_forensics_artifacts',
    isBoss: false,
    xpReward: 260,
    estimatedMinutes: 24
  },
  {
    id: 29,
    title: 'Chain of Custody & Forensic Evidence Integrity',
    subtitle: 'Evidence Handling Standards, Custody Forms & Legal Admissibility',
    phaseId: 6,
    phaseTitle: 'Phase 6: Digital Forensics & Artifacts',
    category: 'digital_forensics_artifacts',
    isBoss: false,
    xpReward: 240,
    estimatedMinutes: 20
  },
  {
    id: 30,
    title: 'ZERO-DAY #6: The Insider Data Heist',
    subtitle: 'Major Incident: High-Privilege USB Exfiltration, Timestomping & Tampering',
    phaseId: 6,
    phaseTitle: 'Phase 6: Digital Forensics & Artifacts',
    category: 'digital_forensics_artifacts',
    isBoss: true,
    bossTitle: 'ZERO-DAY #6: Insider Data Exfiltration',
    xpReward: 550,
    estimatedMinutes: 30,
    badgeReward: '📁 Master of Artifacts'
  },

  // Phase 7 (31–35)
  {
    id: 31,
    title: 'SOC Fundamentals & Tiered Operations',
    subtitle: 'Tier 1 Triage, Tier 2 Incident Response, Tier 3 Threat Hunting & Playbooks',
    phaseId: 7,
    phaseTitle: 'Phase 7: SOC Operations & SIEM',
    category: 'soc_threat_detection',
    isBoss: false,
    xpReward: 250,
    estimatedMinutes: 20
  },
  {
    id: 32,
    title: 'SIEM Architecture & Correlation Rules',
    subtitle: 'Log Pipelines, Aggregation, False-Positive Tuning & Thresholds',
    phaseId: 7,
    phaseTitle: 'Phase 7: SOC Operations & SIEM',
    category: 'soc_threat_detection',
    isBoss: false,
    xpReward: 260,
    estimatedMinutes: 22
  },
  {
    id: 33,
    title: 'IOCs & Threat Intelligence Integration',
    subtitle: 'Pyramid of Pain, MITRE ATT&CK Matrix, STIX/TAXII & Diamond Model',
    phaseId: 7,
    phaseTitle: 'Phase 7: SOC Operations & SIEM',
    category: 'soc_threat_detection',
    isBoss: false,
    xpReward: 260,
    estimatedMinutes: 22
  },
  {
    id: 34,
    title: 'Proactive Threat Hunting Strategies',
    subtitle: 'Hypothesis-Driven Hunting, Baseline Deviations & Beaconing Patterns',
    phaseId: 7,
    phaseTitle: 'Phase 7: SOC Operations & SIEM',
    category: 'soc_threat_detection',
    isBoss: false,
    xpReward: 270,
    estimatedMinutes: 25
  },
  {
    id: 35,
    title: 'ZERO-DAY #7: Advanced Persistent Threat Infiltration',
    subtitle: 'Major Incident: Living-off-the-Land (LOLBins), Cobalt Beaconing & SIEM Triage',
    phaseId: 7,
    phaseTitle: 'Phase 7: SOC Operations & SIEM',
    category: 'soc_threat_detection',
    isBoss: true,
    bossTitle: 'ZERO-DAY #7: APT Infiltration & Beaconing',
    xpReward: 600,
    estimatedMinutes: 32,
    unlockedToolReward: 'Threat Hunting Suite',
    badgeReward: '🕵️ Threat Hunter'
  },

  // Phase 8 (36–40)
  {
    id: 36,
    title: 'Incident Response Frameworks (NIST & SANS)',
    subtitle: 'PICERL Lifecycle: Preparation, Identification, Containment, Eradication, Recovery',
    phaseId: 8,
    phaseTitle: 'Phase 8: Incident Response Lifecycle',
    category: 'incident_response_lifecycle',
    isBoss: false,
    xpReward: 260,
    estimatedMinutes: 22
  },
  {
    id: 37,
    title: 'Containment Strategies & Trade-Offs',
    subtitle: 'Network Isolation, Volatile RAM Preservation vs Spread Risk',
    phaseId: 8,
    phaseTitle: 'Phase 8: Incident Response Lifecycle',
    category: 'incident_response_lifecycle',
    isBoss: false,
    xpReward: 270,
    estimatedMinutes: 24
  },
  {
    id: 38,
    title: 'Eradication & Remediation Techniques',
    subtitle: 'Purging Scheduled Tasks, WMI Subscriptions, Golden Tickets & Backdoors',
    phaseId: 8,
    phaseTitle: 'Phase 8: Incident Response Lifecycle',
    category: 'incident_response_lifecycle',
    isBoss: false,
    xpReward: 270,
    estimatedMinutes: 24
  },
  {
    id: 39,
    title: 'Recovery, Hardening & Lessons Learned',
    subtitle: 'System Restoration from Clean Backups, Threat Monitoring & PIR Reports',
    phaseId: 8,
    phaseTitle: 'Phase 8: Incident Response Lifecycle',
    category: 'incident_response_lifecycle',
    isBoss: false,
    xpReward: 280,
    estimatedMinutes: 25
  },
  {
    id: 40,
    title: 'ZERO-DAY #8: Full Enterprise IR Crisis',
    subtitle: 'Major Incident: Multi-Host Compromise, Real-Time Containment Decisions',
    phaseId: 8,
    phaseTitle: 'Phase 8: Incident Response Lifecycle',
    category: 'incident_response_lifecycle',
    isBoss: true,
    bossTitle: 'ZERO-DAY #8: Enterprise Multi-Host Crisis',
    xpReward: 650,
    estimatedMinutes: 35,
    badgeReward: '⚡ Incident Commander'
  },

  // Phase 9 (41–45)
  {
    id: 41,
    title: 'Web Application Security & OWASP Top 10',
    subtitle: 'SQL Injection, Cross-Site Scripting (XSS), CSRF, SSRF & Broken Auth',
    phaseId: 9,
    phaseTitle: 'Phase 9: Web, Cloud & Insider Vectors',
    category: 'advanced_vectors_cloud_web',
    isBoss: false,
    xpReward: 280,
    estimatedMinutes: 25
  },
  {
    id: 42,
    title: 'Cloud Security & IAM Architecture',
    subtitle: 'Misconfigured Storage Buckets, IAM Role Assumption & Metadata SSRF 169.254.169.254',
    phaseId: 9,
    phaseTitle: 'Phase 9: Web, Cloud & Insider Vectors',
    category: 'advanced_vectors_cloud_web',
    isBoss: false,
    xpReward: 290,
    estimatedMinutes: 26
  },
  {
    id: 43,
    title: 'Mobile & Endpoint Device Security',
    subtitle: 'Mobile Device Management (MDM), Malicious Profiles, APK Sandboxing',
    phaseId: 9,
    phaseTitle: 'Phase 9: Web, Cloud & Insider Vectors',
    category: 'advanced_vectors_cloud_web',
    isBoss: false,
    xpReward: 280,
    estimatedMinutes: 24
  },
  {
    id: 44,
    title: 'Insider Threats & UEBA Anomaly Detection',
    subtitle: 'User Entity Behavior Analytics, Off-Hours Mass Downloads & Privilege Abuse',
    phaseId: 9,
    phaseTitle: 'Phase 9: Web, Cloud & Insider Vectors',
    category: 'advanced_vectors_cloud_web',
    isBoss: false,
    xpReward: 290,
    estimatedMinutes: 26
  },
  {
    id: 45,
    title: 'ZERO-DAY #9: Supply Chain & Multi-Vector Attack',
    subtitle: 'Major Incident: Malicious Dependency Package, AWS Key Harvest & DB Dump',
    phaseId: 9,
    phaseTitle: 'Phase 9: Web, Cloud & Insider Vectors',
    category: 'advanced_vectors_cloud_web',
    isBoss: true,
    bossTitle: 'ZERO-DAY #9: Supply Chain Multi-Vector Assault',
    xpReward: 700,
    estimatedMinutes: 38,
    badgeReward: '🔥 Zero-Day Solver'
  },

  // Phase 10 (46–50)
  {
    id: 46,
    title: 'Advanced Encrypted Network Analysis',
    subtitle: 'TLS Fingerprinting (JA3/JA4), SNI Inspection & Encrypted C2 Beaconing',
    phaseId: 10,
    phaseTitle: 'Phase 10: Master Investigator & Final Crisis',
    category: 'master_investigator_crisis',
    isBoss: false,
    xpReward: 300,
    estimatedMinutes: 28
  },
  {
    id: 47,
    title: 'Advanced Memory Forensics & Process Injection',
    subtitle: 'Volatility Framework Concepts, DLL Injection, Process Hollowing & Hollow Processes',
    phaseId: 10,
    phaseTitle: 'Phase 10: Master Investigator & Final Crisis',
    category: 'master_investigator_crisis',
    isBoss: false,
    xpReward: 320,
    estimatedMinutes: 30
  },
  {
    id: 48,
    title: 'Cross-Telemetry Threat Fusion & Attribution',
    subtitle: 'Correlating EDR, NetFlow, DNS, Identity & Cloud Audit Logs into a Unified Narrative',
    phaseId: 10,
    phaseTitle: 'Phase 10: Master Investigator & Final Crisis',
    category: 'master_investigator_crisis',
    isBoss: false,
    xpReward: 320,
    estimatedMinutes: 30
  },
  {
    id: 49,
    title: 'War-Room Incident Commander Protocol',
    subtitle: 'Final Preparation, Threat Modeling, Executive Briefing & Forensic Verification',
    phaseId: 10,
    phaseTitle: 'Phase 10: Master Investigator & Final Crisis',
    category: 'master_investigator_crisis',
    isBoss: false,
    xpReward: 350,
    estimatedMinutes: 30
  },
  {
    id: 50,
    title: 'ZERO-DAY FINAL: THE METROPOLITAN CYBER CRISIS',
    subtitle: 'Grand 10-Piece Forensic Investigation: FIR, Multi-Log Fusion, Full Attack Reconstruction & Certificate Issuance',
    phaseId: 10,
    phaseTitle: 'Phase 10: Master Investigator & Final Crisis',
    category: 'master_investigator_crisis',
    isBoss: true,
    bossTitle: 'ZERO-DAY FINAL: Grand Metropolitan Cyber Crisis',
    xpReward: 1000,
    estimatedMinutes: 60,
    unlockedToolReward: 'Forensic Memory Visualizer',
    badgeReward: '🏆 Cyber Investigator'
  }
];
