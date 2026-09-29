import { LevelData } from '../types/cyber';

export const LEVELS_46_TO_50: Record<number, LevelData> = {
  46: {
    metadata: {
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
    theory: {
      concept: 'Modern adversaries encrypt nearly 100% of command-and-control traffic over TLS. Defenders must analyze encrypted traffic WITHOUT decryption using metadata: JA3/JA4 TLS client fingerprints, Server Name Indication (SNI) anomalies, packet sizing, and inter-arrival timing.',
      explainLikeImNew: 'Even if you speak a language no one understands, the way you pause, the speed at which you speak, and the shape of the envelope you mail can still give away who you are. JA3 fingerprinting hashes the list of supported ciphers and TLS extensions that a specific program offers when initiating a handshake.',
      architecture: 'JA3 Fingerprint Formulation: MD5(TLSVersion, Ciphers, Extensions, EllipticCurves, EllipticCurvePointFormats). For example, standard Google Chrome generates a known fingerprint, while Python Requests, Golang, or Cobalt Strike beacons produce radically different fingerprints.',
      technicalDetails: [
        'JA3: Client-side fingerprint. JA3S: Server response fingerprint.',
        'SNI Mismatch: The TLS SNI extension requests "microsoft.com", but the DNS resolution points to an untrusted bulletproof hosting IP.',
        'Encrypted C2 Detection: Combining JA3 hashes with frequency analysis and byte-size distribution.'
      ],
      securityPerspective: 'Malware authors frequently fail to customize default TLS client parameters inside their payloads, allowing defenders to track campaigns globally even as attackers change IP addresses and domains.',
      detectionIndicators: [
        'Anomalous JA3 fingerprint never before observed in enterprise baseline traffic.',
        'Process connecting to a high-reputation domain whose TLS certificate issuer does not match official root authorities.'
      ],
      defensiveMeasures: [
        'Implement JA3/JA4 hash-based egress filtering on Next-Generation Firewalls.',
        'Enforce TLS Inspection (SSL Decryption) for high-risk outbound traffic categories.'
      ],
      realWorldContext: {
        incidentTitle: 'Trickbot & Emotet Tracking via JA3',
        whatHappened: 'Security researchers mapped out thousands of active banking trojan C2 servers by scanning the global internet for specific JA3 and JA3S hash pairs unique to the malware TLS library.',
        whatDefendersLearned: 'Cryptographic fingerprinting allows defenders to detect malicious tools regardless of domain rotation.'
      },
      investigationExample: {
        scenario: 'A workstation initiates an encrypted HTTPS session to 198.51.100.40. The TLS handshake produces JA3 hash "a0e9f5d64349fb13191bc781f81f42e1".',
        analystThoughtProcess: 'Looking up this JA3 hash in threat intel databases reveals it is associated with Cobalt Strike default HTTPS malleable C2 profiles.',
        keyTakeaway: 'TLS fingerprints identify the client application software rather than the destination IP.'
      }
    },
    preLabAssessment: [
      {
        id: 'pre-46-1',
        question: 'What information does a JA3 fingerprint hash together from the TLS ClientHello packet?',
        options: [
          'TLS Version, Ciphers, Extensions, Elliptic Curves, and Point Formats',
          'The cleartext password and username',
          'The physical MAC address of the switch',
          'The HTML body tags of the webpage'
        ],
        correctIndex: 0,
        explanation: 'JA3 gathers the 5 core parameters from the TLS ClientHello packet and generates an MD5 hash representing the client TLS stack.'
      }
    ],
    simulation: {
      toolType: 'packet_inspector',
      title: 'TLS Fingerprint & JA3 Analyzer',
      instructions: 'Inspect the ClientHello packets in the capture file. Extract the JA3 hash and match it against the threat intelligence database.',
      targetGoal: 'Identify the Cobalt Strike JA3 fingerprint.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-ENC-046',
        date: '2026-09-29',
        organization: 'Metropolitan Power Grid',
        complainant: 'Threat Hunting Analyst',
        summary: 'Encrypted outbound sessions flagged on substations SCADA communication router.',
        reportedImpact: 'Risk of unauthorized remote electrical breaker switching.'
      },
      evidenceSources: [
        {
          name: 'Encrypted Traffic Flow Telemetry',
          type: 'network',
          description: 'Network sensor logs with JA3/JA4 metadata extraction.',
          logs: [
            {
              id: 'enc-4601',
              timestamp: '19:10:02',
              sourceIp: '10.50.10.12',
              destIp: '198.51.100.80',
              sourcePort: 51200,
              destPort: 443,
              eventType: 'TLS Handshake Captured',
              system: 'Substation-Router-01',
              details: 'SNI: ms-telemetry-update.com | JA3 Hash: a0e9f5d64349fb13191bc781f81f42e1 | Intel Match: Cobalt Strike Default HTTPS Beacon',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-46-q1',
          question: 'What threat software family is identified by the JA3 hash "a0e9f5d64349fb13191bc781f81f42e1" in log enc-4601?',
          type: 'single_choice',
          options: [
            'Cobalt Strike Default HTTPS Beacon',
            'Benign Microsoft Windows Update Agent',
            'Google Chrome 128 Browser',
            'Mozilla Firefox TLS stack'
          ],
          correctAnswer: 'Cobalt Strike Default HTTPS Beacon',
          explanation: 'The JA3 hash matches the known default profile of Cobalt Strike C2 agent beaconing.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q46-1',
        question: 'Why is JA3/JA4 fingerprinting effective against adversaries who constantly change domain names and IP addresses?',
        options: [
          'Because the fingerprint reflects the cryptographic implementation of the client software itself, which remains constant regardless of destination IP',
          'Because it decrypts all passwords automatically',
          'Because it speeds up router bandwidth',
          'Because it changes the physical MAC address'
        ],
        correctIndex: 0,
        explanation: 'JA3 fingerprints the TLS client library and configuration, allowing defenders to track the malware software regardless of what IP or domain it connects to.'
      }
    ]
  },

  50: {
    metadata: {
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
    },
    theory: {
      concept: 'The Ultimate Master Investigation: The Grand Metropolitan Cyber Crisis. You receive an unguided, multi-source digital dossier comprising 10 distinct evidentiary streams from a metropolitan emergency infrastructure incident. You must independently reconstruct the full attack chain, identify Patient Zero, correlate timestamps, analyze decoys, execute containment, and publish the final executive post-mortem to earn your official Cyber Investigator Course Completion Certificate.',
      explainLikeImNew: 'This is the final examination of everything you have learned across all 50 levels: Networking, IP Addressing, Subnetting, OSI, TCP/IP, Protocols, DNS, DHCP, Firewalls, Authentication, Phishing, Malware, Digital Forensics, SIEM, Incident Response, and Threat Hunting. You are on your own as Lead Cyber Investigator. Review the evidence, solve each phase, and bring resolution to the crisis.',
      architecture: 'Enterprise Hybrid Multi-Vector Intrusion: Spear-Phishing Email -> Macro-Enabled Execution -> In-Memory Cobalt Beacon -> DNS Tunneling Fallback -> Active Directory Compromise via Overpass-the-Hash -> SCADA Gateway Lateral Movement -> S3 Database Exfiltration -> Coordinated Ransomware Deployment.',
      technicalDetails: [
        'Dossier Source 1: Formal First Information Report (FIR) & Incident Complaint.',
        'Dossier Source 2: Employee Incident Interviews & Timestamps.',
        'Dossier Source 3: Network Flow & Packet Capture Logs (500+ records).',
        'Dossier Source 4: Corporate DNS Query & Resolver Logs.',
        'Dossier Source 5: Core DHCP Lease & MAC Binding Logs.',
        'Dossier Source 6: Perimeter Firewall Inbound/Outbound Logs.',
        'Dossier Source 7: Domain Controller Active Directory Authentication Logs (4624/4625/4720).',
        'Dossier Source 8: Spoofed Phishing Email & Header Evidence.',
        'Dossier Source 9: Endpoint Workstation Artifacts & Process Execution Logs.',
        'Dossier Source 10: Cryptographic File Hashes & Malicious C2 Artifacts.'
      ],
      securityPerspective: 'Enterprise incidents require full cross-telemetry correlation. Focusing on a single system or log source leaves blind spots that adversaries exploit to maintain persistence.',
      detectionIndicators: [
        'Correlated sequence: Phishing email arrival -> User click -> DNS lookup to lookalike domain -> EDR process spawn -> External C2 beacon -> Internal Kerberos anomaly.',
        'Decoy noise: Normal user logins, routine backups, administrative software updates, and benign network pings designed to distract investigators.'
      ],
      defensiveMeasures: [
        'Execute multi-phased incident containment: host isolation, credential revocation, firewall egress blocks, and forensic RAM imaging.',
        'Formulate comprehensive post-incident recovery plan with root cause remediation and least privilege hardening.'
      ],
      realWorldContext: {
        incidentTitle: 'Metropolitan Infrastructure & Smart City Cyber Attacks (Modern Vectors)',
        whatHappened: 'Adversaries coordinated attacks across municipal water treatment, electric sub-stations, and city transit networks simultaneously by compromising a shared central administrative Active Directory forest.',
        whatDefendersLearned: 'Cross-functional incident command, strict zone separation, and rapid forensic timeline reconstruction are crucial during multi-sector infrastructure attacks.'
      },
      investigationExample: {
        scenario: 'Correlating 10 independent logs to isolate the exact moment Patient Zero executed the malicious payload.',
        analystThoughtProcess: 'Start with the FIR timeline. Match the email delivery timestamp (08:14 UTC) to the browser URL click (08:16 UTC), followed by the DNS query (08:16:05 UTC), the Word process spawning powershell (08:16:22 UTC), and the firewall beacon (08:17:00 UTC). The entire chain snaps into place.',
        keyTakeaway: 'Evidence across multiple sources aligns into a single chronological timeline.'
      }
    },
    preLabAssessment: [
      {
        id: 'pre-50-1',
        question: 'When investigating an enterprise breach involving multiple systems, what is the primary purpose of constructing a Super-Timeline?',
        options: [
          'To correlate disparate forensic artifacts (file timestamps, event logs, network flows, browser history) into a unified chronological sequence of adversary actions',
          'To accelerate the speed of the web browser',
          'To format the primary backup tapes',
          'To generate random IP addresses'
        ],
        correctIndex: 0,
        explanation: 'A Super-Timeline synthesizes events across all systems and evidence sources into a single coherent chronological narrative.'
      }
    ],
    simulation: {
      toolType: 'siem_correlation',
      title: 'Grand Incident War Room: Metropolitan Cyber Command',
      instructions: 'Navigate between the 10 evidentiary dossiers. Filter through hundreds of logs, eliminate decoy noise, identify malicious indicators, and reconstruct the complete attack narrative.',
      targetGoal: 'Reconstruct all 10 phases of the Metropolitan Cyber Incident.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-METRO-050',
        date: '2026-09-29',
        organization: 'Metropolitan Emergency Infrastructure Authority (MEIA)',
        complainant: 'Commissioner of Public Safety & CISO',
        summary: 'MAJOR CRISIS: 911 dispatch lines down, city water pressure valves fluctuating, and city treasury databases encrypted. Coordinated adversary assault across metropolitan networks.',
        reportedImpact: 'Emergency services disrupted; potential catastrophic loss of life and public infrastructure.'
      },
      evidenceSources: [
        {
          name: '1. First Information Report (FIR) Dossier',
          type: 'endpoint',
          description: 'Official emergency complaint and system outage timestamps.',
          logs: [
            {
              id: 'dossier-fir-1',
              timestamp: '08:00:00',
              eventType: 'Incident Declared',
              system: 'MEIA-Command',
              details: 'Emergency dispatchers report terminals locking with ransom screens demanding $10M in Monero.',
              severity: 'critical'
            }
          ]
        },
        {
          name: '2. Employee Interview & Incident Reports',
          type: 'email',
          description: 'Statements from city personnel on shift.',
          logs: [
            {
              id: 'dossier-rep-1',
              timestamp: '08:14:00',
              eventType: 'Employee Report',
              system: 'Workstation-Desk',
              user: 'clerk_r_soto',
              details: 'Reported receiving an email marked "URGENT: Metropolitan Pension Benefit Re-calculation" with attachment "pension_update_2026.docm". Opened document and enabled macros.',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'dossier-rep-2',
              timestamp: '08:15:00',
              eventType: 'Routine Shift Handover',
              system: 'Workstation-Desk',
              user: 'clerk_m_davis',
              details: 'Routine shift change completed. Logged into terminal WS-ADMIN-02. Checked email.',
              severity: 'low',
              isDecoy: true
            }
          ]
        },
        {
          name: '3. Core Network Flow (NetFlow) Telemetry',
          type: 'network',
          description: 'Captured flow sessions across metropolitan subnets.',
          logs: [
            {
              id: 'dossier-net-1',
              timestamp: '08:16:30',
              sourceIp: '10.20.1.45',
              destIp: '198.51.100.77',
              sourcePort: 49201,
              destPort: 443,
              protocol: 'TCP',
              eventType: 'C2 HTTPS Beacon Established',
              system: 'Core-Router-01',
              details: 'Patient Zero (10.20.1.45) opened outbound TLS session to external C2 host 198.51.100.77 (threat-c2-central.org)',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'dossier-net-2',
              timestamp: '08:18:00',
              sourceIp: '10.20.1.10',
              destIp: '10.20.1.1',
              sourcePort: 123,
              destPort: 123,
              protocol: 'UDP',
              eventType: 'NTP Time Sync',
              system: 'Core-Router-01',
              details: 'Routine network time synchronization packet.',
              severity: 'info',
              isDecoy: true
            }
          ]
        },
        {
          name: '4. Corporate DNS Query Logs',
          type: 'dns',
          description: 'Internal DNS resolver queries during the breach.',
          logs: [
            {
              id: 'dossier-dns-1',
              timestamp: '08:16:05',
              sourceIp: '10.20.1.45',
              eventType: 'DNS Query (A Record)',
              system: 'Metro-DNS-01',
              details: 'Query: updates-portal.pension-citymetro-support.com | Response: 198.51.100.77 (Typosquatted domain)',
              severity: 'critical',
              isMalicious: true
            }
          ]
        },
        {
          name: '5. DHCP Lease & IP Binding Logs',
          type: 'dhcp',
          description: 'DHCP bindings on Subnet 10.20.1.0/24.',
          logs: [
            {
              id: 'dossier-dhcp-1',
              timestamp: '07:30:00',
              sourceIp: '10.20.1.45',
              eventType: 'DHCP Lease Committed',
              system: 'Metro-DHCP-01',
              details: 'MAC: 00:1c:42:aa:bb:99 assigned IP: 10.20.1.45 | Hostname: WS-DISPATCH-09 | User: clerk_r_soto',
              severity: 'info'
            }
          ]
        },
        {
          name: '6. Perimeter Firewall Inspection Logs',
          type: 'firewall',
          description: 'Perimeter firewall stateful inspection logs.',
          logs: [
            {
              id: 'dossier-fw-1',
              timestamp: '08:22:15',
              sourceIp: '10.20.1.45',
              destIp: '10.50.100.1',
              sourcePort: 49300,
              destPort: 445,
              protocol: 'TCP',
              eventType: 'Internal Lateral Movement via SMB',
              system: 'Edge-FW-01',
              details: 'Lateral SMB session from WS-DISPATCH-09 to Primary Domain Controller DC-METRO-01 (10.50.100.1)',
              severity: 'critical',
              isMalicious: true
            }
          ]
        },
        {
          name: '7. Active Directory Authentication Logs',
          type: 'auth',
          description: 'Security event logs on DC-METRO-01.',
          logs: [
            {
              id: 'dossier-auth-1',
              timestamp: '08:24:00',
              eventType: 'Event 4624: Successful Logon (Type 3)',
              system: 'DC-METRO-01',
              user: 'clerk_r_soto',
              details: 'Privilege Escalation detected: Token elevated to Domain Admin via CVE-2024-AD-KerberosExploit',
              severity: 'critical',
              isMalicious: true
            }
          ]
        },
        {
          name: '8. Email Evidence & Phishing Headers',
          type: 'email',
          description: 'Raw email RFC 822 headers for suspicious message.',
          logs: [
            {
              id: 'dossier-mail-1',
              timestamp: '08:13:45',
              eventType: 'Inbound Email Delivered',
              system: 'Metro-Mail-Gateway',
              details: 'From: HR Payroll <payroll@pension-citymetro-support.com> | Subject: "URGENT: Metropolitan Pension Benefit Re-calculation" | SPF: Softfail | DKIM: None | Attachment: pension_update_2026.docm',
              severity: 'critical',
              isMalicious: true
            }
          ]
        },
        {
          name: '9. Endpoint Workstation Artifacts',
          type: 'endpoint',
          description: 'Process execution tree on WS-DISPATCH-09.',
          logs: [
            {
              id: 'dossier-end-1',
              timestamp: '08:16:22',
              eventType: 'Process Creation (Event 4688)',
              system: 'WS-DISPATCH-09',
              details: 'Parent: winword.exe | Child: powershell.exe -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAA... (Cobalt Strike In-Memory Injector)',
              severity: 'critical',
              isMalicious: true
            }
          ]
        },
        {
          name: '10. Cryptographic File Hashes & IOCs',
          type: 'file_hashes',
          description: 'Calculated SHA-256 hashes of recovered malware files.',
          logs: [
            {
              id: 'dossier-hash-1',
              timestamp: '08:30:00',
              eventType: 'Hash Analysis',
              system: 'Forensic-Lab-01',
              details: 'Attachment: pension_update_2026.docm | SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069 | Threat Family: Emotet/Cobalt Dropper',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      consequenceDecision: {
        prompt: 'The adversary has compromised DC-METRO-01 and is initiating automated ransomware encryption across 911 dispatch terminals. What is your primary Incident Commander directive?',
        options: [
          {
            id: 'grand-opt-1',
            label: 'Execute emergency network isolation on Subnet 10.20.1.0/24 and DC-METRO-01, block external C2 IP 198.51.100.77 at the boundary firewall, preserve memory images, and initiate failover to the air-gapped backup dispatch center.',
            consequence: 'Active encryption halted across emergency services. C2 severed. Vital memory artifacts secured for prosecution. Air-gapped dispatch center operational in 12 minutes. Exceptional leadership!',
            forensicImpact: 0,
            containmentImpact: 100,
            isRecommended: true
          },
          {
            id: 'grand-opt-2',
            label: 'Pay the $10M Monero ransom demand immediately and pray the attacker provides working decryption keys.',
            consequence: 'The adversary took the $10M payment and vanished without supplying functional decryption keys. City infrastructure remained permanently corrupted. Total failure.',
            forensicImpact: -100,
            containmentImpact: -100,
            isRecommended: false
          }
        ]
      },
      investigationQuestions: [
        {
          id: 'zd-final-q1',
          question: 'What was the Initial Access Vector that allowed the adversary to penetrate the Metropolitan Emergency Infrastructure Authority?',
          type: 'single_choice',
          options: [
            'Spear-phishing email with malicious macro-enabled attachment "pension_update_2026.docm" sent to clerk_r_soto',
            'Physical burglary of the data center',
            'Zero-day hardware vulnerability in fiber optic cable',
            'Brute force attack on public SSH port 22'
          ],
          correctAnswer: 'Spear-phishing email with malicious macro-enabled attachment "pension_update_2026.docm" sent to clerk_r_soto',
          explanation: 'Dossier sources 2, 8, and 10 prove the attack originated with a spear-phishing email containing pension_update_2026.docm opened by clerk_r_soto.',
          points: 100
        },
        {
          id: 'zd-final-q2',
          question: 'Which device was Patient Zero, and what was its assigned IP address and hostname?',
          type: 'single_choice',
          options: [
            'WS-DISPATCH-09 at IP 10.20.1.45',
            'DC-METRO-01 at IP 10.50.100.1',
            'WS-ADMIN-02 at IP 10.20.1.10',
            'External C2 at 198.51.100.77'
          ],
          correctAnswer: 'WS-DISPATCH-09 at IP 10.20.1.45',
          explanation: 'DHCP logs and EDR artifacts confirm WS-DISPATCH-09 at 10.20.1.45 was the host where the malicious macro was executed.',
          points: 100
        },
        {
          id: 'zd-final-q3',
          question: 'What was the external Command & Control (C2) IP address and domain used by the adversary for persistent beaconing?',
          type: 'single_choice',
          options: [
            '198.51.100.77 (updates-portal.pension-citymetro-support.com)',
            '8.8.8.8 (dns.google)',
            '10.20.1.1 (gateway)',
            '127.0.0.1 (localhost)'
          ],
          correctAnswer: '198.51.100.77 (updates-portal.pension-citymetro-support.com)',
          explanation: 'DNS query logs and NetFlow telemetry document persistent HTTPS beaconing to 198.51.100.77.',
          points: 100
        },
        {
          id: 'zd-final-q4',
          question: 'What is the full SHA-256 cryptographic hash of the malicious initial dropper document?',
          type: 'single_choice',
          options: [
            '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
            '0000000000000000000000000000000000000000000000000000000000000000',
            'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
          ],
          correctAnswer: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
          explanation: 'Dossier 10 records the SHA-256 hash as 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q50-1',
        question: 'As Senior Cyber Investigator, what long-term architectural defense prevents future macro-based spear-phishing infections?',
        options: [
          'Enforcing Group Policy to block all macros in Office files downloaded from the internet and deploying Application Guard / attack surface reduction (ASR) rules',
          'Asking employees to look really closely at emails',
          'Deleting all email servers permanently',
          'Rebooting the building Wi-Fi routers every evening'
        ],
        correctIndex: 0,
        explanation: 'Disabling macros in untrusted internet documents via GPO and implementing Microsoft Attack Surface Reduction (ASR) rules blocks macro execution at the kernel level.'
      }
    ]
  }
};
