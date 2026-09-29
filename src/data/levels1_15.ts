import { LevelData } from '../types/cyber';

export const LEVELS_1_TO_15: Record<number, LevelData> = {
  1: {
    metadata: {
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
    theory: {
      concept: 'A computer network is two or more computing systems connected by communication links to share data, services, and hardware peripherals.',
      explainLikeImNew: 'Imagine a modern office. If computers could not talk to each other, you would have to run across the room with a USB flash drive every time you wanted to share a file or print a page. A network connects computers through cables or radio signals so they can exchange messages directly.',
      architecture: 'Networks are categorized by geographical scale: Local Area Networks (LAN) span a single building; Metropolitan Area Networks (MAN) span a city; Wide Area Networks (WAN) like the Internet connect across countries.',
      technicalDetails: [
        'LAN: High data-transfer rates, low latency, confined geographical area (Ethernet/Wi-Fi).',
        'WAN: Interconnects multiple LANs across public or leased telecommunication lines.',
        'Client-Server Model: Centralized servers fulfill requests (web, file, email) sent by client workstations.',
        'Peer-to-Peer (P2P): Systems share resources symmetrically without a central authority.'
      ],
      securityPerspective: 'Adversaries study network boundaries to identify where internal trusted networks touch untrusted external networks. An unsegmented network allows an intruder who breaches one office computer to reach any database or server.',
      detectionIndicators: [
        'Sudden spikes in broadcast traffic across a LAN segment.',
        'Unusual peer-to-peer connections between workstations that normally only speak to central servers.'
      ],
      defensiveMeasures: [
        'Implement strict network segmentation using VLANs to isolate sensitive servers from general workstations.',
        'Enforce boundary firewalls between LAN segments and external WAN uplinks.'
      ],
      realWorldContext: {
        incidentTitle: 'Flat Corporate Network Lateral Movement (Historical Vector)',
        whatHappened: 'Attackers penetrated an HVAC contractor laptop on a building management network and moved unimpeded into corporate payment systems because the network lacked internal segmentation.',
        whatDefendersLearned: 'Never trust internal network boundaries implicitly. Segment operational networks from financial and corporate workstations.'
      },
      investigationExample: {
        scenario: 'A workstation at 192.168.1.105 is attempting direct SMB file connections to 192.168.1.110 and 192.168.1.112 instead of querying the central file server at 192.168.1.10.',
        analystThoughtProcess: 'Workstations rarely need direct file shares with neighboring desks. This lateral pattern indicates potential automated worm propagation or manual attacker probing.',
        keyTakeaway: 'Normal LAN traffic flows client-to-server; peer-to-peer workstation file queries warrant investigation.'
      }
    },
    simulation: {
      toolType: 'device_topology',
      title: 'Interactive Topology & Device Identifier',
      instructions: 'Click on nodes in the fictional Acme Corp office layout. Identify which nodes act as Clients, Servers, or Network Gateways.',
      targetGoal: 'Identify the node acting as the central file repository.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-NET-001',
        date: '2026-09-29',
        organization: 'Apex Logistics LLC',
        complainant: 'Sarah Jenkins (IT Administrator)',
        summary: 'Workstation WS-04 reported inability to access the internal logistics database. Preliminary logs show unexpected network communications.',
        reportedImpact: 'Dispatch operations halted on terminal 4.'
      },
      evidenceSources: [
        {
          name: 'Core Switch Port Log',
          type: 'network',
          description: 'Port activity captured on Core-SW-01 between 08:00 and 08:30 UTC.',
          logs: [
            {
              id: 'log-101',
              timestamp: '08:12:01',
              sourceIp: '192.168.1.104',
              destIp: '192.168.1.1',
              eventType: 'Ping / ICMP Echo',
              system: 'Core-SW-01',
              details: 'WS-04 pinged default gateway 192.168.1.1. Status: SUCCESS (0.4ms)',
              severity: 'info'
            },
            {
              id: 'log-102',
              timestamp: '08:14:22',
              sourceIp: '192.168.1.104',
              destIp: '192.168.1.50',
              eventType: 'TCP Connection Attempt',
              system: 'Core-SW-01',
              details: 'WS-04 attempted TCP 5432 to Database Server 192.168.1.50. Status: REJECTED (Subnet ACL Rule #4)',
              severity: 'high'
            },
            {
              id: 'log-103',
              timestamp: '08:14:25',
              sourceIp: '192.168.1.102',
              destIp: '192.168.1.50',
              eventType: 'TCP Connection Established',
              system: 'Core-SW-01',
              details: 'WS-02 established session with Database Server 192.168.1.50:5432. Status: PERMITTED',
              severity: 'low',
              isDecoy: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-1-q1',
          question: 'Based on the Core Switch logs, why was WS-04 (192.168.1.104) unable to communicate with the database server at 192.168.1.50?',
          type: 'single_choice',
          options: [
            'Physical cable disconnected at WS-04',
            'Connection was actively rejected by Subnet ACL Rule #4 on the network switch/gateway',
            'The database server was powered down',
            'WS-04 was unable to reach the default gateway 192.168.1.1'
          ],
          correctAnswer: 'Connection was actively rejected by Subnet ACL Rule #4 on the network switch/gateway',
          explanation: 'Log-102 explicitly shows the connection attempt to 192.168.1.50 was REJECTED due to Subnet ACL Rule #4.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q1-1',
        question: 'Which network type spans a localized geographic area like an office suite or university laboratory?',
        options: ['WAN', 'LAN', 'MAN', 'SAN'],
        correctIndex: 1,
        explanation: 'LAN (Local Area Network) is designed for a localized geographical area.'
      },
      {
        id: 'q2-1',
        question: 'In a client-server architecture, what is the primary role of a server?',
        options: [
          'To browse the internet and display web graphics',
          'To provide shared services, files, or applications to requesting clients',
          'To act as a physical electrical transformer',
          'To generate random MAC addresses'
        ],
        correctIndex: 1,
        explanation: 'Servers are dedicated centralized systems that fulfill requests sent by clients.'
      }
    ]
  },

  2: {
    metadata: {
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
    theory: {
      concept: 'Specialized hardware devices manage the flow of network traffic. Hubs repeat signals blindly, switches intelligently forward frames based on physical addresses (MAC), routers connect disparate networks based on logical addresses (IP), and firewalls enforce security policies.',
      explainLikeImNew: 'Think of a hub as an old-fashioned loudspeaker: when someone talks, everyone hears it. A switch is like a private telephone operator: it connects you directly to the person you called. A router is like an international post office: it reads the country/zip code on your letter and sends it onto the highway.',
      architecture: 'Hubs operate at Layer 1 (Physical). Switches operate at Layer 2 (Data Link). Routers operate at Layer 3 (Network). Firewalls and Proxies inspect traffic up to Layer 7 (Application).',
      technicalDetails: [
        'Hub: Broadcasts all received electrical signals to every connected port, causing collision domains.',
        'Switch: Inspects Layer 2 MAC addresses to populate a Content Addressable Memory (CAM) table and forwards traffic only to the recipient port.',
        'Router: Maintains routing tables to forward Layer 3 IP packets across differing network boundaries.',
        'Default Gateway: The local router interface that host computers must forward traffic to when communicating outside their local subnet.'
      ],
      securityPerspective: 'Hubs are inherently insecure because any device in the collision domain can sniff all network packets in promiscuous mode. Switches mitigate passive sniffing, but attackers can overflow CAM tables (MAC flooding) or perform ARP spoofing to intercept frames.',
      detectionIndicators: [
        'Rapid churn in switch CAM tables indicating MAC flooding attempts.',
        'Unauthorized gateway advertisements on internal segments.'
      ],
      defensiveMeasures: [
        'Enable Port Security on enterprise switches (limit MAC addresses per physical port).',
        'Decommission legacy hubs entirely in favor of managed Layer 2/3 switches with 802.1X authentication.'
      ],
      realWorldContext: {
        incidentTitle: 'Legacy Hub Packet Sniffing (Historical Vector)',
        whatHappened: 'A rogue contractor plugged an unauthorized laptop into a legacy hub in a server room and silently captured unencrypted passwords passing across the entire subnet.',
        whatDefendersLearned: 'Hubs broadcast all packets unconditionally. Managed switches with port security must replace legacy broadcast hardware.'
      },
      investigationExample: {
        scenario: 'A switch table shows 4,000 unique random MAC addresses associated with a single physical access port Port-12 in less than 30 seconds.',
        analystThoughtProcess: 'A single laptop cannot legitimately generate thousands of MAC addresses. The attacker is executing a MAC flood to force the switch into "fail-open" hub mode.',
        keyTakeaway: 'CAM table saturation is an indicator of MAC address exhaustion attacks.'
      }
    },
    simulation: {
      toolType: 'device_topology',
      title: 'Packet Routing & Device Inspection',
      instructions: 'Examine the simulated topology connecting Subnet A (10.0.1.0/24) to Subnet B (10.0.2.0/24). Select the device responsible for routing between subnets.',
      targetGoal: 'Identify the Layer 3 Router connecting the segments.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-NET-002',
        date: '2026-09-29',
        organization: 'Helios Financial Services',
        complainant: 'Marcus Vance (Security Analyst)',
        summary: 'Network monitoring detected abnormal broadcast packet replication across the trading floor switch.',
        reportedImpact: 'High network latency on workstation terminals.'
      },
      evidenceSources: [
        {
          name: 'Hardware Port Status Report',
          type: 'network',
          description: 'Telemetry report from Edge-Switch-04.',
          logs: [
            {
              id: 'hw-201',
              timestamp: '09:01:10',
              eventType: 'Port Link Up',
              system: 'Edge-Switch-04',
              details: 'Port GigabitEthernet 0/14 link up at 100Mbps Half-Duplex. Device identified: 4-Port Legacy Hub (Vendor ID: LegacyLink).',
              severity: 'high'
            },
            {
              id: 'hw-202',
              timestamp: '09:02:15',
              eventType: 'Broadcast Rate Alarm',
              system: 'Edge-Switch-04',
              details: 'Port 0/14 broadcast storm: 85% bandwidth consumed by unswitched packet replication.',
              severity: 'critical'
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-2-q1',
          question: 'What unauthorized piece of hardware was plugged into Port 0/14 that caused the broadcast storm and packet replication?',
          type: 'single_choice',
          options: [
            'A Managed Layer 3 Switch',
            'A Legacy 4-Port Hub',
            'A Hardware Firewall Appliance',
            'A Fiber Optic Patch Panel'
          ],
          correctAnswer: 'A Legacy 4-Port Hub',
          explanation: 'Log hw-201 clearly reveals a 4-Port Legacy Hub was attached to Port 0/14, forcing half-duplex packet replication.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q2-1-hw',
        question: 'Which network hardware device uses MAC addresses to forward frames strictly to the intended recipient?',
        options: ['Repeater', 'Hub', 'Switch', 'Modem'],
        correctIndex: 2,
        explanation: 'A Switch operates at Layer 2 and uses MAC address tables to switch frames only to the relevant destination port.'
      },
      {
        id: 'q2-2-hw',
        question: 'Which device is responsible for forwarding traffic between different IP networks and subnets?',
        options: ['Router', 'Hub', 'Network Interface Card (NIC)', 'Patch Panel'],
        correctIndex: 0,
        explanation: 'Routers operate at Layer 3 to route packets across disparate IP networks.'
      }
    ]
  },

  3: {
    metadata: {
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
    theory: {
      concept: 'An IP address is a logical numerical label assigned to each device on a network. IPv4 uses 32-bit addresses formatted as four octets (e.g., 192.168.1.1). Subnetting divides large IP networks into smaller, efficient, isolated broadcast domains using CIDR notation.',
      explainLikeImNew: 'Imagine an apartment building address. "100 Main Street" is the building (Network Address), while "Apartment 4B" is the specific resident (Host Address). A subnet mask tells you exactly where the street number ends and the apartment number begins.',
      architecture: 'An IPv4 address has two parts: Network ID and Host ID. The subnet mask determines the boundary. RFC 1918 reserves private address ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) for internal use.',
      technicalDetails: [
        'CIDR /24 = 255.255.255.0 = 256 total addresses (254 usable hosts, 1 network, 1 broadcast).',
        'CIDR /26 = 255.255.255.192 = 64 total addresses (62 usable hosts).',
        'Usable host formula: 2^(32 - prefix) - 2.',
        'Network address has all host bits set to 0. Broadcast address has all host bits set to 1.'
      ],
      securityPerspective: 'Improper subnet boundaries allow unauthorized cross-department traffic. Adversaries target the network broadcast address to execute amplification attacks (such as Smurf attacks).',
      detectionIndicators: [
        'Packets addressed to broadcast addresses (.255 in a /24) bearing spoofed source IPs.',
        'Host configured with an IP outside the assigned DHCP subnet pool.'
      ],
      defensiveMeasures: [
        'Design isolated subnets (e.g., /28 for critical database servers, /24 for user pools).',
        'Disable directed broadcast forwarding on all Layer 3 routers.'
      ],
      realWorldContext: {
        incidentTitle: 'Broadcast Amplification Attack (Smurf Attack)',
        whatHappened: 'Attackers sent ICMP echo requests to a network broadcast address with a spoofed victim source IP, causing all 250 internal hosts to flood the victim with replies.',
        whatDefendersLearned: 'Routers must discard directed broadcasts to avoid turning internal subnets into denial-of-service amplifiers.'
      },
      investigationExample: {
        scenario: 'A workstation at 192.168.5.140 cannot reach the gateway at 192.168.5.129 on a /28 subnet.',
        analystThoughtProcess: 'Subnet 192.168.5.128/28 spans from .128 to .143. Host .140 is inside the subnet, but wait: 128 + 15 = 143. The broadcast is .143, usable hosts are .129 to .142. If the user set subnet mask to /29, .140 falls into a different subnet (136–143)!',
        keyTakeaway: 'Always verify subnet mask parity when hosts fail to communicate within identical numerical octets.'
      }
    },
    simulation: {
      toolType: 'subnet_calc',
      title: 'Interactive CIDR & Usable Host Calculator',
      instructions: 'Enter an IP and CIDR prefix (e.g., 192.168.10.0/24 or 10.0.0.0/26). Observe how host bits, network address, and broadcast addresses are derived.',
      targetGoal: 'Calculate the usable hosts for 172.16.4.0/26.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-NET-003',
        date: '2026-09-29',
        organization: 'Vanguard Medical Labs',
        complainant: 'Dr. Kevin Zhao',
        summary: 'Lab centrifuge terminal Lab-CT-09 cannot reach the medical imaging server on subnet 192.168.10.0/26.',
        reportedImpact: 'Sample processing delayed.'
      },
      evidenceSources: [
        {
          name: 'Network Interface Card Configuration',
          type: 'endpoint',
          description: 'IP configuration dump from Lab-CT-09.',
          logs: [
            {
              id: 'ip-301',
              timestamp: '09:30:00',
              eventType: 'NIC Configuration',
              system: 'Lab-CT-09',
              details: 'IP: 192.168.10.63 | Subnet Mask: 255.255.255.192 (/26) | Gateway: 192.168.10.1',
              severity: 'critical'
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-3-q1',
          question: 'Why is Lab-CT-09 unable to send normal unicast traffic with IP 192.168.10.63 in subnet 192.168.10.0/26?',
          type: 'single_choice',
          options: [
            '192.168.10.63 is the reserved Subnet Broadcast address for a /26 and cannot be assigned to an individual host',
            '192.168.10.63 is a public non-routable IP address',
            'Subnet /26 only supports up to 30 total devices',
            'The gateway IP 192.168.10.1 is invalid'
          ],
          correctAnswer: '192.168.10.63 is the reserved Subnet Broadcast address for a /26 and cannot be assigned to an individual host',
          explanation: 'In 192.168.10.0/26, the block size is 64 (0 to 63). 192.168.10.0 is the network address, and 192.168.10.63 is the broadcast address. Assigning the broadcast address to a host creates IP stack failures.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q3-1',
        question: 'How many usable host IP addresses are available in a standard /24 IPv4 subnet?',
        options: ['256', '254', '128', '512'],
        correctIndex: 1,
        explanation: 'A /24 subnet has 2^8 = 256 addresses minus 2 (network and broadcast) = 254 usable hosts.'
      },
      {
        id: 'q3-2',
        question: 'Which of the following is an RFC 1918 private IPv4 address?',
        options: ['8.8.8.8', '192.168.1.50', '204.15.20.1', '1.1.1.1'],
        correctIndex: 1,
        explanation: '192.168.0.0/16 is designated as private RFC 1918 address space.'
      }
    ]
  },

  4: {
    metadata: {
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
    theory: {
      concept: 'A Media Access Control (MAC) address is a unique 48-bit physical hardware identifier burned into a Network Interface Card (NIC). The Address Resolution Protocol (ARP) translates logical IP addresses into physical MAC addresses within the local data link layer.',
      explainLikeImNew: 'If an IP address is your postal address, a MAC address is your government Social Security Number. When computer Alice wants to send a letter to computer Bob on the same floor, she shouts into the room: "Who has IP 192.168.1.10? Tell me your MAC address!" Bob hears the shout and replies with his MAC address.',
      architecture: 'ARP operates between Layer 2 and Layer 3. Devices store discovered mappings in a dynamic ARP cache table. Because classic ARP is stateless and lacks authentication, any device can send unsolicited ARP replies.',
      technicalDetails: [
        'MAC format: 6 pairs of hexadecimal digits (e.g., 00:1A:2B:3C:4D:5E).',
        'First 3 octets: Organizationally Unique Identifier (OUI) assigned to hardware manufacturer.',
        'ARP Request: Broadcast to FF:FF:FF:FF:FF:FF.',
        'ARP Reply: Unicast sent directly to the requester.',
        'ARP Spoofing: An attacker emits fake ARP replies claiming their MAC owns the default gateway IP.'
      ],
      securityPerspective: 'ARP spoofing/poisoning enables Man-in-the-Middle (MITM) attacks where all outbound traffic flows through the attacker workstation, allowing passive eavesdropping or payload tampering.',
      detectionIndicators: [
        'A single MAC address associated with multiple distinct IP addresses in the ARP table.',
        'Unsolicited ARP replies ("gratuitous ARP") without prior requests.'
      ],
      defensiveMeasures: [
        'Configure Dynamic ARP Inspection (DAI) on enterprise managed switches.',
        'Enable DHCP Snooping so switches can validate ARP packets against trusted bindings.'
      ],
      realWorldContext: {
        incidentTitle: 'Internal Banking MITM via ARP Spoofing',
        whatHappened: 'An attacker plugged a malicious device into a bank conference room ethernet jack, spoofed the gateway MAC address via ARP, and captured cleartext intranet credentials.',
        whatDefendersLearned: 'Switch-level Dynamic ARP Inspection (DAI) is vital to reject unauthenticated ARP replies.'
      },
      investigationExample: {
        scenario: 'Host A displays an ARP cache where both 192.168.1.1 (Gateway) and 192.168.1.45 (Workstation) map to MAC 00:0c:29:ab:cd:ef.',
        analystThoughtProcess: 'Two different IP addresses cannot share the same physical NIC unless an attacker is spoofing the gateway IP to hijack traffic.',
        keyTakeaway: 'Duplicate MAC mappings in an ARP table for critical infrastructure IPs indicate ARP cache poisoning.'
      }
    },
    simulation: {
      toolType: 'arp_table',
      title: 'ARP Cache Inspector & Spoofing Detector',
      instructions: 'Review the dynamic ARP table entries on Workstation 10.0.0.15. Compare the gateway IP with connected hardware MAC addresses.',
      targetGoal: 'Identify the anomalous MAC address claiming the default gateway.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-NET-004',
        date: '2026-09-29',
        organization: 'AeroTech Defense Labs',
        complainant: 'David Ross (Systems Engineer)',
        summary: 'Workstations in research wing B experienced intermittent connection resets. Wireshark captures show duplicate ARP replies.',
        reportedImpact: 'Potential unauthorized interception of engineering drawings.'
      },
      evidenceSources: [
        {
          name: 'Host ARP Cache Snapshot',
          type: 'network',
          description: 'ARP table dump from workstation WS-ENG-03.',
          logs: [
            {
              id: 'arp-401',
              timestamp: '10:02:11',
              eventType: 'ARP Table State',
              system: 'WS-ENG-03',
              details: 'IP: 10.0.0.1 (Gateway) | MAC: 00:50:56:FE:ED:01 (Type: Dynamic)',
              severity: 'info',
              isDecoy: true
            },
            {
              id: 'arp-402',
              timestamp: '10:02:45',
              eventType: 'Gratuitous ARP Received',
              system: 'WS-ENG-03',
              details: 'Unsolicited ARP Reply: 10.0.0.1 is at b8:27:eb:99:aa:11 (Raspberry Pi Foundation OUI)',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'arp-403',
              timestamp: '10:02:46',
              eventType: 'ARP Table Overwrite',
              system: 'WS-ENG-03',
              details: 'IP: 10.0.0.1 updated to MAC: b8:27:eb:99:aa:11. Host b8:27:eb:99:aa:11 also registered to IP 10.0.0.88.',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-4-q1',
          question: 'What attack is occurring based on log arp-402 and arp-403?',
          type: 'single_choice',
          options: [
            'ARP Cache Poisoning / Spoofing by host 10.0.0.88 (MAC b8:27:eb:99:aa:11)',
            'Standard DNS zone transfer',
            'DHCP address renewal',
            'BGP route flapping'
          ],
          correctAnswer: 'ARP Cache Poisoning / Spoofing by host 10.0.0.88 (MAC b8:27:eb:99:aa:11)',
          explanation: 'Host 10.0.0.88 sent an unsolicited ARP reply claiming that the default gateway 10.0.0.1 is at its own MAC address (b8:27:eb:99:aa:11), successfully poisoning WS-ENG-03 cache.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q4-1',
        question: 'What is the primary function of the Address Resolution Protocol (ARP)?',
        options: [
          'Translate domain names into IP addresses',
          'Map known IP addresses to physical MAC addresses on a local network',
          'Encrypt packets in transit between routers',
          'Assign dynamic IP addresses automatically'
        ],
        correctIndex: 1,
        explanation: 'ARP resolves Layer 3 IP addresses to Layer 2 MAC addresses on local data links.'
      },
      {
        id: 'q4-2',
        question: 'What switch security feature validates ARP packets against DHCP snooping databases to stop ARP poisoning?',
        options: ['Spanning Tree Protocol (STP)', 'Dynamic ARP Inspection (DAI)', 'Network Address Translation (NAT)', 'Link Aggregation (LACP)'],
        correctIndex: 1,
        explanation: 'Dynamic ARP Inspection (DAI) inspects and validates ARP packets on switch ports to prevent poisoning.'
      }
    ]
  },

  5: {
    metadata: {
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
    theory: {
      concept: 'Zero-Day Boss Challenge: Combine your knowledge of computer networks, devices, subnetting, and ARP to solve a multi-stage corporate network infiltration.',
      explainLikeImNew: 'This is your first major boss investigation. An attacker has breached an office network, manipulated routing, and planted a rogue device. You will analyze real evidence logs, correlate events, and stop the adversary.',
      architecture: 'Adversaries chain network misconfigurations: unauthorized physical access -> rogue hardware attachment -> ARP cache poisoning -> traffic rerouting through unauthorized subnets.',
      technicalDetails: [
        'Correlate MAC vendor OUIs with physical inventory.',
        'Verify subnet boundaries and identify hosts outside legitimate CIDR blocks.',
        'Detect anomalous default gateway redirections.'
      ],
      securityPerspective: 'Physical and data link layer compromises undermine all higher-layer assumptions. If Layer 2 is compromised, encryption can still protect payload content, but routing and availability are jeopardized.',
      detectionIndicators: [
        'Unknown MAC OUIs appearing on switch management consoles.',
        'Spike in latency to external web hosts due to MITM proxy overhead.'
      ],
      defensiveMeasures: [
        'Port security with maximum MAC address count of 1 and sticky MAC learning.',
        'Physical port lockouts on unoccupied ethernet jacks.'
      ],
      realWorldContext: {
        incidentTitle: 'Dropbox Drop-Box Hardware Implant Attack',
        whatHappened: 'Penetration testers placed a small single-board computer behind an IP phone in a conference room, establishing an unauthorized tunnel back to their command server.',
        whatDefendersLearned: 'Network Access Control (802.1X) must be enforced on all wall jacks to reject unauthenticated hardware.'
      },
      investigationExample: {
        scenario: 'A rogue device with MAC b8:27:eb (Raspberry Pi) plugged into switch port 8 claims IP 192.168.1.254 and begins replying to gateway ARP requests.',
        analystThoughtProcess: 'Verify if 192.168.1.254 is an authorized gateway. Check port 8 switch logs. Isolate port 8 immediately.',
        keyTakeaway: 'Correlate switch port physical events with network layer anomalies.'
      }
    },
    simulation: {
      toolType: 'device_topology',
      title: 'Zero-Day Boss Network Map & Packet Analyzer',
      instructions: 'Trace the path of packets originating from Financial Terminal FT-01. Notice which gateway node intercepts the stream before reaching the external internet.',
      targetGoal: 'Isolate the rogue node intercepting financial traffic.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-ZD-001',
        date: '2026-09-29',
        organization: 'OmniCorp Global Holdings',
        complainant: 'Chief Information Security Officer (CISO)',
        summary: 'Accounting department reports confidential wire transfer documents were leaked. Network traffic to banking portal was routed through an unapproved internal address.',
        reportedImpact: 'Potential wire fraud exceeding $250,000.'
      },
      evidenceSources: [
        {
          name: 'Core Switch CAM & Flow Logs',
          type: 'network',
          description: 'Core switch telemetry during the breach incident.',
          logs: [
            {
              id: 'zd1-501',
              timestamp: '14:20:00',
              eventType: 'New Link Active',
              system: 'Switch-Floor-2',
              details: 'Port Fa0/22 link state UP. MAC learned: d8:3a:dd:44:aa:bb (Raspberry Pi Foundation).',
              severity: 'medium'
            },
            {
              id: 'zd1-502',
              timestamp: '14:21:15',
              eventType: 'Gratuitous ARP Blast',
              system: 'Switch-Floor-2',
              details: 'MAC d8:3a:dd:44:aa:bb announced itself as default gateway 192.168.10.1.',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'zd1-503',
              timestamp: '14:22:30',
              eventType: 'Traffic Redirection',
              system: 'Switch-Floor-2',
              details: 'FT-01 (192.168.10.45) outbound traffic to 198.51.100.25 (Bank Portal) forwarded via Fa0/22 instead of Gi0/1 (Real Router).',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'zd1-q1',
          question: 'Which switch port was the rogue implant plugged into according to the Core Switch logs?',
          type: 'single_choice',
          options: ['Port Fa0/22', 'Port Gi0/1', 'Port Fa0/01', 'Port Fa0/10'],
          correctAnswer: 'Port Fa0/22',
          explanation: 'Log zd1-501 records the new link active on Fa0/22 with a Raspberry Pi MAC address.',
          points: 100
        },
        {
          id: 'zd1-q2',
          question: 'What technique did the rogue device on Fa0/22 use to redirect banking traffic from FT-01 through itself?',
          type: 'single_choice',
          options: [
            'Gratuitous ARP Spoofing claiming to be the default gateway 192.168.10.1',
            'DNS Server buffer overflow',
            'BGP Route poisoning on the public internet',
            'Physical fiber optic cable tapping'
          ],
          correctAnswer: 'Gratuitous ARP Spoofing claiming to be the default gateway 192.168.10.1',
          explanation: 'Log zd1-502 records Gratuitous ARP Blast from the device announcing itself as the default gateway 192.168.10.1.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q5-1',
        question: 'What immediate switch configuration action stops a rogue device on port Fa0/22 from sending any more frames?',
        options: [
          'Administer "shutdown" on interface Fa0/22',
          'Increase the MTU on Gi0/1',
          'Reboot the entire office building transformer',
          'Change the subnet from /24 to /16'
        ],
        correctIndex: 0,
        explanation: 'Administratively shutting down interface Fa0/22 instantly severs the rogue implant from the network.'
      }
    ]
  },

  6: {
    metadata: {
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
    theory: {
      concept: 'The Open Systems Interconnection (OSI) model standardizes network communication into 7 distinct abstraction layers, from physical electrical impulses up to user software applications.',
      explainLikeImNew: 'Imagine sending a birthday present abroad. Layer 7 is deciding what toy to buy. Layer 6 is wrapping it in gift paper. Layer 5 is writing down who sent it. Layer 4 is choosing express or standard delivery. Layer 3 is addressing the shipping label. Layer 2 is loading the parcel onto a specific delivery truck. Layer 1 is the asphalt road under the wheels.',
      architecture: 'Layer 7: Application (HTTP, DNS, SSH). Layer 6: Presentation (TLS, ASCII, JPEG). Layer 5: Session (RPC, NetBIOS). Layer 4: Transport (TCP, UDP). Layer 3: Network (IP, ICMP). Layer 2: Data Link (Ethernet, MAC, PPP). Layer 1: Physical (Cables, Radio Waves, Hubs).',
      technicalDetails: [
        'Data Encapsulation: As data descends the stack, each layer appends a Protocol Data Unit (PDU) header: Data -> Segment (L4) -> Packet (L3) -> Frame (L2) -> Bits (L1).',
        'De-encapsulation: The receiving host strips headers sequentially as bits ascend the stack.',
        'Logical vs Physical: Layer 3 uses logical IP addressing; Layer 2 uses physical MAC addressing.'
      ],
      securityPerspective: 'Adversaries operate across every OSI layer: Layer 1 (wiretapping), Layer 2 (MAC flood, ARP spoofing), Layer 3 (IP spoofing, Smurf), Layer 4 (SYN flood, port scan), Layer 7 (SQL injection, XSS, HTTP flood).',
      detectionIndicators: [
        'Malformed headers failing PDU validation at Layer 3 or Layer 4.',
        'Mismatch between Layer 2 MAC addresses and Layer 3 IP sender addresses.'
      ],
      defensiveMeasures: [
        'Adopt Defense-in-Depth aligning controls with each OSI layer (e.g. 802.1X at L2, IPsec at L3, TLS at L6, WAF at L7).',
        'Conduct root-cause analysis by isolating the failing layer.'
      ],
      realWorldContext: {
        incidentTitle: 'Cross-Layer Exploit Chains',
        whatHappened: 'Attackers initiated an ARP poison attack at Layer 2 to redirect traffic, then spoofed DNS answers at Layer 7 to route users to a credential harvester.',
        whatDefendersLearned: 'Network defense cannot solely focus on application security; lower-layer compromises undermine higher-layer controls.'
      },
      investigationExample: {
        scenario: 'A web client cannot connect to https://portal.internal. Ping succeeds (Layer 3 OK), but web requests hang.',
        analystThoughtProcess: 'Ping uses ICMP at Layer 3. If ping succeeds, L1, L2, and L3 are functional. The issue lies at Layer 4 (firewall blocking TCP 443) or Layer 7 (web service down or TLS cert failure).',
        keyTakeaway: 'Use OSI layer isolation to diagnose network incidents systematically.'
      }
    },
    simulation: {
      toolType: 'osi_stack',
      title: 'Interactive OSI 7-Layer PDU Encapsulator',
      instructions: 'Click through the 7 layers to observe how payload data is encapsulated into Segments, Packets, Frames, and Bits.',
      targetGoal: 'Identify the OSI layer responsible for logical routing.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-OSI-006',
        date: '2026-09-29',
        organization: 'Apex BioTech Systems',
        complainant: 'Network Operations Center',
        summary: 'Workstation WS-30 can ping the server IP (10.10.2.50) successfully, but all attempts to open the internal web portal fail with connection refused.',
        reportedImpact: 'Researchers unable to access genomic data.'
      },
      evidenceSources: [
        {
          name: 'Network Diagnostic Log',
          type: 'network',
          description: 'Host network diagnostics from WS-30.',
          logs: [
            {
              id: 'osi-601',
              timestamp: '11:15:02',
              eventType: 'ICMP Echo Reply',
              system: 'WS-30',
              details: 'Reply from 10.10.2.50: bytes=32 time=1.2ms TTL=64 (Layer 3 Network connectivity verified)',
              severity: 'info',
              isDecoy: true
            },
            {
              id: 'osi-602',
              timestamp: '11:15:20',
              eventType: 'TCP SYN / RST',
              system: 'WS-30',
              details: 'TCP SYN sent to 10.10.2.50:443. Server replied with TCP RST-ACK (Connection Refused at Layer 4 Transport)',
              severity: 'high'
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-6-q1',
          question: 'Since ping (ICMP) succeeds but TCP 443 is refused with a TCP RST, which OSI layer is functioning and at which layer is the failure occurring?',
          type: 'single_choice',
          options: [
            'Layer 3 (Network) is functioning; failure is occurring at Layer 4 (Transport) because port 443 service is not listening or blocked',
            'Layer 1 (Physical) cable is broken',
            'Layer 2 (Data Link) has duplicate MAC addresses',
            'Layer 7 (Application) certificate expired'
          ],
          correctAnswer: 'Layer 3 (Network) is functioning; failure is occurring at Layer 4 (Transport) because port 443 service is not listening or blocked',
          explanation: 'ICMP operates at Layer 3; since it succeeds, physical, data link, and IP routing are working. The failure is at Layer 4 where TCP port 443 receives a RST packet.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q6-1',
        question: 'Which OSI layer is responsible for end-to-end data delivery, error recovery, and flow control (e.g. TCP)?',
        options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 6 (Presentation)'],
        correctIndex: 2,
        explanation: 'Layer 4 (Transport Layer) handles end-to-end communication, segmentation, flow control, and reliability.'
      }
    ]
  },

  7: {
    metadata: {
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
    theory: {
      concept: 'The TCP/IP model (also called the Internet Protocol Suite) simplifies the 7 OSI layers into 4 practical layers: Network Access, Internet, Transport, and Application. It is the architectural blueprint of the global internet.',
      explainLikeImNew: 'While OSI is the academic theory model with 7 layers, TCP/IP is the practical engineering model that actually runs the Internet. It consolidates OSI Layers 5, 6, and 7 into a single "Application" layer, and OSI Layers 1 and 2 into "Network Access".',
      architecture: 'Layer 4: Application (HTTP, DNS, SMTP, SSH). Layer 3: Transport (TCP, UDP). Layer 2: Internet (IP, ICMP, ARP). Layer 1: Network Access (Ethernet, Wi-Fi, MAC hardware).',
      technicalDetails: [
        'Network Access: Deals with physical media, frame framing, and hardware MAC addressing.',
        'Internet: Handles logical addressing (IPv4/IPv6) and packet routing across networks.',
        'Transport: Manages host-to-host communication channels and port multiplexing.',
        'Application: Programs and protocols that interface directly with user applications.'
      ],
      securityPerspective: 'Adversaries exploit discrepancies between OSI and TCP/IP protocol implementations, such as IP fragmentation overlapping to bypass intrusion detection systems.',
      detectionIndicators: [
        'Fragmented packets with offset anomalies crossing network access boundaries.',
        'Unexpected protocol identifiers inside IPv4 headers.'
      ],
      defensiveMeasures: [
        'Deploy Next-Generation Firewalls capable of reassembling packet fragments prior to inspection.',
        'Maintain strict protocol conformity checks at perimeter gateways.'
      ],
      realWorldContext: {
        incidentTitle: 'Teardrop IP Fragmentation Exploit',
        whatHappened: 'Attackers sent malformed overlapping IP packet fragments at the Internet layer, crashing operating system IP stacks upon reassembly.',
        whatDefendersLearned: 'Network stacks must validate packet fragmentation offsets rigorously before passing reassembled data to the Transport layer.'
      },
      investigationExample: {
        scenario: 'A firewall permits TCP port 80, but an adversary tunnels ICMP payload packets disguised inside Layer 2 frames.',
        analystThoughtProcess: 'Examine protocol field in the IP header. Protocol 1 is ICMP, while Protocol 6 is TCP. The firewall rule only applied to Protocol 6.',
        keyTakeaway: 'Always verify the Internet layer protocol number, not just port numbers.'
      }
    },
    simulation: {
      toolType: 'osi_stack',
      title: 'OSI vs TCP/IP Stack Comparative Matrix',
      instructions: 'Map OSI layers 5, 6, and 7 to their corresponding TCP/IP Application layer protocols.',
      targetGoal: 'Verify the protocol mapping across both models.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-TCPIP-007',
        date: '2026-09-29',
        organization: 'Quant Systems Trading',
        complainant: 'Security Operations Center',
        summary: 'Intrusion Detection System flagged non-standard protocol encapsulation traversing the perimeter gateway.',
        reportedImpact: 'Potential covert channel bypassing application inspection.'
      },
      evidenceSources: [
        {
          name: 'Packet Header Inspection Log',
          type: 'network',
          description: 'Captured raw packet headers on WAN-GW-01.',
          logs: [
            {
              id: 'tcpip-701',
              timestamp: '12:00:15',
              eventType: 'IPv4 Header Decoded',
              system: 'WAN-GW-01',
              details: 'Version: 4 | Protocol: 1 (ICMP) | Source: 198.51.100.99 | Dest: 10.0.1.10 | Payload: Base64 Encoded Executable String',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-7-q1',
          question: 'According to the packet header log, which protocol number is listed in the IPv4 Internet layer header, and how is it being abused?',
          type: 'single_choice',
          options: [
            'Protocol 1 (ICMP); abused for covert data tunneling instead of benign ping diagnostics',
            'Protocol 6 (TCP); legitimate web traffic',
            'Protocol 17 (UDP); standard DNS traffic',
            'Protocol 47 (GRE); virtual private network tunnel'
          ],
          correctAnswer: 'Protocol 1 (ICMP); abused for covert data tunneling instead of benign ping diagnostics',
          explanation: 'Protocol 1 in the IPv4 header is ICMP. The details indicate a malicious executable string is embedded in the ICMP payload (ICMP tunneling).',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q7-1',
        question: 'Which TCP/IP model layer corresponds to OSI Layers 5 (Session), 6 (Presentation), and 7 (Application)?',
        options: ['Internet Layer', 'Transport Layer', 'Application Layer', 'Network Access Layer'],
        correctIndex: 2,
        explanation: 'In the TCP/IP 4-layer model, the Application layer encompasses OSI Session, Presentation, and Application layers.'
      }
    ]
  },

  8: {
    metadata: {
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
    theory: {
      concept: 'A port is a 16-bit numerical identifier (0–65535) used by transport protocols (TCP/UDP) to multiplex communication to specific software processes. A socket is the combination of an IP address and a port number (e.g., 192.168.1.10:443).',
      explainLikeImNew: 'If an IP address is an apartment building, the port number is the apartment door number. Mail carrier TCP delivers the envelope to the building, but the port number ensures the letter goes specifically to tenant "Web Browser" (door 443) instead of tenant "File Server" (door 21).',
      architecture: 'Well-Known Ports: 0–1023 (Reserved for system/core services). Registered Ports: 1024–49151 (Vendor applications). Ephemeral/Dynamic Ports: 49152–65535 (Assigned temporarily to client outbound connections).',
      technicalDetails: [
        'Port 21: FTP (Cleartext file transfer). Port 22: SSH (Encrypted remote shell).',
        'Port 23: Telnet (Cleartext terminal - obsolete/insecure).',
        'Port 25: SMTP (Email relay). Port 53: DNS (Domain resolution).',
        'Port 80: HTTP (Cleartext web). Port 443: HTTPS (Encrypted web).',
        'Port 3389: RDP (Windows Remote Desktop).'
      ],
      securityPerspective: 'Adversaries conduct port scanning (SYN stealth scans) to enumerate listening services and unpatched software versions. Leaving dangerous management ports like 23 (Telnet) or 3389 (RDP) exposed to the public internet invites brute force and exploit attacks.',
      detectionIndicators: [
        'A single external IP sending SYN packets to dozens of sequential ports within seconds.',
        'High-numbered ephemeral port listening for inbound external connections (indicative of backdoors).'
      ],
      defensiveMeasures: [
        'Close or block all unused ports at the perimeter firewall (Principle of Least Privilege).',
        'Never expose management ports (SSH 22, RDP 3389) directly to the public internet; require VPN access with MFA.'
      ],
      realWorldContext: {
        incidentTitle: 'BlueKeep RDP Exploitation (CVE-2019-0708)',
        whatHappened: 'Thousands of internet-exposed Windows servers with Port 3389 (RDP) open were compromised by remote pre-authentication code execution worms.',
        whatDefendersLearned: 'Management ports like 3389 must never be exposed directly to untrusted public networks.'
      },
      investigationExample: {
        scenario: 'A server at 192.168.1.5 has an unexpected listening socket on TCP port 4444 established with an external IP 203.0.113.88:443.',
        analystThoughtProcess: 'Port 4444 is the default listener port for common penetration testing payloads (Metasploit Meterpreter reverse shells). The internal server initiated a reverse connection.',
        keyTakeaway: 'Unusual outbound connections from high-numbered ports to suspicious external endpoints warrant immediate host isolation.'
      }
    },
    simulation: {
      toolType: 'packet_inspector',
      title: 'Interactive Socket & Port Mapper',
      instructions: 'Inspect the active socket table on Server SRV-01. Identify which services are listening on secure vs insecure cleartext ports.',
      targetGoal: 'Locate the legacy unencrypted Telnet service on port 23.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-PORT-008',
        date: '2026-09-29',
        organization: 'Metropolitan Water District',
        complainant: 'SCADA Security Lead',
        summary: 'Audit identified unauthorized remote management sessions established from an external IP directly to a pump control PLC.',
        reportedImpact: 'Risk of unauthorized manipulation of water pressure valves.'
      },
      evidenceSources: [
        {
          name: 'Perimeter Connection State Table',
          type: 'network',
          description: 'Active socket connections on SCADA-PLC-02.',
          logs: [
            {
              id: 'port-801',
              timestamp: '13:10:04',
              sourceIp: '198.51.100.42',
              destIp: '10.50.1.20',
              sourcePort: 49812,
              destPort: 23,
              protocol: 'TCP',
              eventType: 'Session Established',
              system: 'SCADA-PLC-02',
              details: 'Inbound Telnet connection established. Username "admin" and password "admin123" transmitted in plaintext.',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-8-q1',
          question: 'Which insecure legacy service port was breached on SCADA-PLC-02, and why is it dangerous?',
          type: 'single_choice',
          options: [
            'Port 23 (Telnet); transmits all keystrokes and credentials in unencrypted plaintext',
            'Port 443 (HTTPS); encrypts data with AES-256',
            'Port 53 (DNS); resolves domain names',
            'Port 22 (SSH); enforces cryptographic authentication'
          ],
          correctAnswer: 'Port 23 (Telnet); transmits all keystrokes and credentials in unencrypted plaintext',
          explanation: 'Port 23 is Telnet. It provides no transport encryption, exposing all credentials and control commands to eavesdropping.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q8-1',
        question: 'Which port number is officially assigned to Secure Shell (SSH)?',
        options: ['Port 21', 'Port 22', 'Port 23', 'Port 25'],
        correctIndex: 1,
        explanation: 'Port 22 is the standard port for SSH.'
      },
      {
        id: 'q8-2',
        question: 'What is the default TCP port used for encrypted HTTPS web traffic?',
        options: ['80', '8080', '443', '8443'],
        correctIndex: 2,
        explanation: 'Port 443 is the standard port for HTTPS.'
      }
    ]
  },

  9: {
    metadata: {
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
    theory: {
      concept: 'Transmission Control Protocol (TCP) provides reliable, ordered, error-checked delivery of octets using a 3-way handshake and connection state tracking. User Datagram Protocol (UDP) is connectionless and lightweight, providing no delivery guarantees.',
      explainLikeImNew: 'TCP is like a registered certified letter: you call the recipient first to confirm they are ready (SYN), they confirm they are ready (SYN-ACK), you acknowledge (ACK), and only then do you send the message. If any page is missing, you resend it. UDP is like shouting across a crowded soccer field: you yell the information as fast as possible; if someone misses a word, you do not stop to repeat it.',
      architecture: 'TCP Header Flags: SYN (Synchronize sequence numbers), ACK (Acknowledge received data), FIN (Gracefully finish session), RST (Abruptly reset connection), PSH (Push data to app immediately), URG (Urgent pointer).',
      technicalDetails: [
        '3-Way Handshake: Client -> SYN (seq=x) -> Server; Server -> SYN-ACK (seq=y, ack=x+1) -> Client; Client -> ACK (ack=y+1) -> Server.',
        'Connection Teardown: FIN -> ACK -> FIN -> ACK (or immediate RST).',
        'SYN Flood Attack: Adversary sends massive SYN packets with spoofed source IPs and never replies with final ACK, consuming server memory half-open queues.'
      ],
      securityPerspective: 'Adversaries manipulate TCP flags to scan networks invisibly: SYN scans (half-open, leaving no application logs), FIN scans, Xmas scans (FIN+PSH+URG set), and Null scans. TCP sequence prediction allows blind connection hijacking.',
      detectionIndicators: [
        'High ratio of SYN packets to completed ACK connections (SYN flood / port scan indicator).',
        'Packets containing invalid flag combinations like SYN+FIN simultaneously.'
      ],
      defensiveMeasures: [
        'Enable TCP SYN Cookies on servers to survive half-open connection exhaustion.',
        'Configure stateful firewalls to drop out-of-order packets and malformed flag combinations.'
      ],
      realWorldContext: {
        incidentTitle: 'SYN Flood Denial of Service Attacks',
        whatHappened: 'Attackers targeted major online commerce sites by emitting millions of spoofed SYN packets per second, filling server connection tables and preventing legitimate shoppers from connecting.',
        whatDefendersLearned: 'Operating systems must deploy SYN Cookies to defer memory allocation until the client completes the full 3-way handshake.'
      },
      investigationExample: {
        scenario: 'A web server receives 50,000 TCP SYN packets from random external IPs with no subsequent ACK packets, causing CPU and memory spikes.',
        analystThoughtProcess: 'The server backlog queue is exhausted by half-open connections. This is a classic SYN flood DoS attack.',
        keyTakeaway: 'Massive SYN counts without matching ACKs signal half-open exhaustion or SYN scanning.'
      }
    },
    simulation: {
      toolType: 'packet_inspector',
      title: 'Interactive TCP 3-Way Handshake & Flag Visualizer',
      instructions: 'Step through the SYN, SYN-ACK, and ACK sequence. Toggle TCP flags (SYN, ACK, RST, FIN) and watch the connection state machine change.',
      targetGoal: 'Establish an ESTABLISHED TCP connection.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-TCP-009',
        date: '2026-09-29',
        organization: 'Apex E-Commerce Ltd',
        complainant: 'Infrastructure Lead',
        summary: 'Web servers stopped responding to customer traffic during promotional sale. Server connection tables are saturated.',
        reportedImpact: 'Estimated loss of $80,000/hr in checkout revenue.'
      },
      evidenceSources: [
        {
          name: 'Edge Packet Capture Analyzer',
          type: 'network',
          description: 'TCP flag distribution on Web-Front-01.',
          logs: [
            {
              id: 'tcp-901',
              timestamp: '14:00:01',
              sourceIp: '198.51.100.100',
              destIp: '10.0.1.80',
              protocol: 'TCP',
              eventType: 'TCP SYN Received',
              system: 'Web-Front-01',
              details: 'Flags: [SYN] | Seq: 1084201 | State: SYN_RECEIVED | Waiting for ACK (Never received)',
              severity: 'high'
            },
            {
              id: 'tcp-902',
              timestamp: '14:00:02',
              sourceIp: '198.51.100.101',
              destIp: '10.0.1.80',
              protocol: 'TCP',
              eventType: 'TCP SYN Received',
              system: 'Web-Front-01',
              details: 'Flags: [SYN] | Seq: 9840211 | State: SYN_RECEIVED | Waiting for ACK (Never received)',
              severity: 'high'
            },
            {
              id: 'tcp-903',
              timestamp: '14:00:03',
              sourceIp: '10.0.1.80',
              destIp: '0.0.0.0',
              protocol: 'TCP',
              eventType: 'Backlog Queue Full',
              system: 'Web-Front-01',
              details: 'TCP listen backlog queue full (1024/1024 half-open sessions). Dropping new SYN requests.',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-9-q1',
          question: 'What type of Denial of Service (DoS) attack is documented in the Edge Packet logs?',
          type: 'single_choice',
          options: [
            'TCP SYN Flood attack causing half-open connection backlog exhaustion',
            'DNS amplification attack',
            'SQL injection database crash',
            'ARP cache poisoning storm'
          ],
          correctAnswer: 'TCP SYN Flood attack causing half-open connection backlog exhaustion',
          explanation: 'The logs show repetitive incoming TCP SYN packets without corresponding ACKs, filling the listen backlog queue (1024/1024) to capacity.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q9-1',
        question: 'Which TCP flag is sent by a server to acknowledge a connection request while simultaneously initiating its side of the connection?',
        options: ['ACK', 'SYN', 'SYN-ACK', 'RST'],
        correctIndex: 2,
        explanation: 'SYN-ACK is the second step of the 3-way handshake sent by the server.'
      },
      {
        id: 'q9-2',
        question: 'Which TCP flag abruptly terminates an illegitimate or invalid connection without waiting for a 4-step teardown?',
        options: ['FIN', 'RST', 'PSH', 'URG'],
        correctIndex: 1,
        explanation: 'RST (Reset) immediately resets and terminates the connection.'
      }
    ]
  },

  10: {
    metadata: {
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
    theory: {
      concept: 'Zero-Day Boss Challenge: Apply your knowledge of OSI layers, TCP handshakes, ports, and sockets to solve a complex packet stream disruption affecting an enterprise financial gateway.',
      explainLikeImNew: 'An unknown adversary is attacking the core transaction gateway using crafted packet streams. You will dissect raw packet headers, correlate sequence numbers, identify malicious TCP flags, and stop the session hijack.',
      architecture: 'Deep Packet Inspection (DPI) verifies that packets comply with RFC specifications for TCP state tracking and PDU formatting across OSI layers 3, 4, and 7.',
      technicalDetails: [
        'Analyze TCP sequence and acknowledgment numbers.',
        'Detect anomalous TCP RST injection used by attackers to terminate legitimate sessions.',
        'Isolate the source IP and MAC generating spoofed reset frames.'
      ],
      securityPerspective: 'Adversaries capable of observing traffic can inject TCP RST packets with matching sequence numbers to sever connections between client and server (TCP Reset Attack).',
      detectionIndicators: [
        'Sudden surge in TCP RST packets bearing sequence numbers within the active receive window.',
        'Session terminations immediately following high-value financial API requests.'
      ],
      defensiveMeasures: [
        'Enforce TCP Window Tracking and reject out-of-window RST packets.',
        'Use IPsec or TLS to protect transport session integrity from blind injection.'
      ],
      realWorldContext: {
        incidentTitle: 'Nation-State TCP Reset Censorship & Injection',
        whatHappened: 'Deep packet inspection appliances on network backbones inspected plaintext HTTP keywords and injected forged TCP RST packets back to both endpoints to tear down forbidden connections.',
        whatDefendersLearned: 'Unencrypted transport protocols can be severed by forged RST packets; end-to-end TLS encryption blinds eavesdropping injectors.'
      },
      investigationExample: {
        scenario: 'A database query session is repeatedly broken with a RST packet. Notice the TTL of the RST is 58, while normal packets from the client have a TTL of 128.',
        analystThoughtProcess: 'The different Time-To-Live (TTL) proves the RST packet was generated by an intermediate third-party device closer to the router, not the legitimate client!',
        keyTakeaway: 'TTL discrepancies in TCP RST packets reveal third-party injection attacks.'
      }
    },
    simulation: {
      toolType: 'packet_inspector',
      title: 'Deep Packet Inspection & Stream Reassembler',
      instructions: 'Review the captured TCP packet stream. Compare sequence numbers and TTL hops to spot the injected packet.',
      targetGoal: 'Identify the forged TCP RST packet with anomalous TTL.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-ZD-002',
        date: '2026-09-29',
        organization: 'Apex Stock Exchange',
        complainant: 'Trading Systems Architect',
        summary: 'High-frequency order placement streams are abruptly closing milliseconds before execution. Traders report unexpected connection resets.',
        reportedImpact: 'Market disruption and millions in delayed trade volume.'
      },
      evidenceSources: [
        {
          name: 'Trading Engine Packet Stream',
          type: 'network',
          description: 'TCP stream capture on Trading-Engine-01 (Port 8443).',
          logs: [
            {
              id: 'zd2-1001',
              timestamp: '15:30:10.100',
              sourceIp: '10.200.1.15',
              destIp: '10.200.1.5',
              sourcePort: 54120,
              destPort: 8443,
              protocol: 'TCP',
              eventType: 'Data Transfer',
              system: 'Trading-Engine-01',
              details: 'Flags: [PSH, ACK] | Seq: 41200 | Ack: 98100 | TTL: 64 | Order: BUY 10,000 APX',
              severity: 'info',
              isDecoy: true
            },
            {
              id: 'zd2-1002',
              timestamp: '15:30:10.102',
              sourceIp: '10.200.1.15',
              destIp: '10.200.1.5',
              sourcePort: 54120,
              destPort: 8443,
              protocol: 'TCP',
              eventType: 'Forged TCP Reset Injected',
              system: 'Trading-Engine-01',
              details: 'Flags: [RST] | Seq: 41200 | TTL: 24 (Anomalous TTL, originating from rogue node on LAN) | Connection Terminated',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'zd2-q1',
          question: 'What evidence in log zd2-1002 proves that the TCP RST packet was forged by an adversary and not sent by the real client workstation?',
          type: 'single_choice',
          options: [
            'The Time-To-Live (TTL) suddenly dropped from 64 to 24, indicating a forged packet injected from a different route/system',
            'The port number changed to UDP port 53',
            'The destination IP was a private broadcast address',
            'The TCP sequence number was 0'
          ],
          correctAnswer: 'The Time-To-Live (TTL) suddenly dropped from 64 to 24, indicating a forged packet injected from a different route/system',
          explanation: 'Legitimate packets from the client had a consistent TTL of 64. The abrupt drop to TTL 24 reveals a forged packet injected into the stream by an attacker.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q10-1',
        question: 'Which security control best prevents an adversary on the local wire from reading or forging application data inside a TCP stream?',
        options: ['End-to-End TLS Encryption', 'Disabling IPv6', 'Changing the subnet mask to /30', 'Increasing the MTU to 9000'],
        correctIndex: 0,
        explanation: 'TLS encryption validates cryptographic message authentication codes (MAC), rejecting any forged or injected plaintext packets.'
      }
    ]
  },

  11: {
    metadata: {
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
    theory: {
      concept: 'The Domain Name System (DNS) is the distributed phonebook of the Internet, translating human-friendly domain names (e.g. corp.internal) into machine-routable IP addresses over UDP/TCP port 53.',
      explainLikeImNew: 'You do not memorize your best friend phone number—you just tap their name in your phone contacts. DNS does the exact same thing for computers: when you type "bank.com", DNS looks up the numerical IP address so your computer knows where to send the packets.',
      architecture: 'Hierarchy: Root Servers (.) -> Top-Level Domain (TLD) Servers (.com, .org) -> Authoritative Nameservers (ns1.example.com). Recursive Resolvers cache answers to speed up queries.',
      technicalDetails: [
        'A Record: Maps hostname to 32-bit IPv4 address.',
        'AAAA Record: Maps hostname to 128-bit IPv6 address.',
        'CNAME Record: Canonical name alias pointing one domain name to another.',
        'MX Record: Mail exchange routing server.',
        'TXT Record: Text data (used for SPF, DKIM, domain verification).',
        'NS Record: Authoritative nameserver for the zone.'
      ],
      securityPerspective: 'Adversaries abuse DNS in three major ways: 1. DNS Cache Poisoning (redirecting users to fake phishing sites), 2. DNS Tunneling (encoding stolen data or C2 beacons into subdomains like data123.attacker.com), 3. Fast Flux & DGA (rapidly changing IP mappings to evade blocklists).',
      detectionIndicators: [
        'Unusually long, high-entropy subdomain queries (e.g., a8f9c0e2b4.tunnel.evil.com).',
        'Large volume of TXT record requests with base64 encoded payloads.',
        'Internal workstations directly querying external DNS servers instead of the enterprise resolver.'
      ],
      defensiveMeasures: [
        'Deploy DNS sinkholing and Response Policy Zones (RPZ) to block known malicious domains.',
        'Block all outbound UDP/TCP 53 traffic at the firewall EXCEPT from authorized internal DNS resolvers.',
        'Implement DNSSEC to cryptographically sign DNS records and eliminate cache poisoning.'
      ],
      realWorldContext: {
        incidentTitle: 'DNS Tunneling in Enterprise Breaches (e.g. Wekby APT)',
        whatHappened: 'Attackers compressed proprietary CAD files, split them into chunks, and sent them out inside hundreds of subdomains of a malicious domain, bypassing outbound proxy filters.',
        whatDefendersLearned: 'Outbound DNS must be inspected for query entropy, subdomain length, and volume anomalies.'
      },
      investigationExample: {
        scenario: 'A workstation queries "78616c6c6f.exfil.darkops.xyz" 400 times in 10 minutes.',
        analystThoughtProcess: '"78616c6c6f" is hexadecimal string data. The attacker is tunneling exfiltrated data through DNS query labels. Port 53 was not properly monitored.',
        keyTakeaway: 'High-frequency, high-entropy subdomain requests are signatures of DNS tunneling.'
      }
    },
    simulation: {
      toolType: 'dns_flow',
      title: 'Interactive Recursive DNS Query Visualizer',
      instructions: 'Trace the resolution of "secure.internal" from Client -> Recursive Resolver -> Root -> TLD -> Authoritative Server.',
      targetGoal: 'Identify the authoritative nameserver returning the malicious A record.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-DNS-011',
        date: '2026-09-29',
        organization: 'Cobalt Biopharmaceutical',
        complainant: 'Threat Hunting Analyst',
        summary: 'Security monitoring noted an internal endpoint querying thousands of unique subdomains of domain "update-check-cdn9.net".',
        reportedImpact: 'Suspected intellectual property data exfiltration.'
      },
      evidenceSources: [
        {
          name: 'Enterprise DNS Resolver Query Logs',
          type: 'dns',
          description: 'Queries processed by internal resolver 10.0.0.53.',
          logs: [
            {
              id: 'dns-1101',
              timestamp: '16:02:11',
              sourceIp: '10.0.2.88',
              eventType: 'DNS Query (A Record)',
              system: 'DNS-Resolver-01',
              details: 'Query: dXNlcl9jcmVkcw==.update-check-cdn9.net | Response: 198.51.100.5 | Size: 180 bytes',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'dns-1102',
              timestamp: '16:02:12',
              sourceIp: '10.0.2.88',
              eventType: 'DNS Query (TXT Record)',
              system: 'DNS-Resolver-01',
              details: 'Query: cGFzc3dvcmQxMjM=.update-check-cdn9.net | Response: TXT "ACK_CHUNK_01" | Size: 240 bytes',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'dns-1103',
              timestamp: '16:02:15',
              sourceIp: '10.0.2.14',
              eventType: 'DNS Query (A Record)',
              system: 'DNS-Resolver-01',
              details: 'Query: intranet.internal | Response: 10.0.0.10',
              severity: 'low',
              isDecoy: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-11-q1',
          question: 'What technique is endpoint 10.0.2.88 executing based on logs dns-1101 and dns-1102?',
          type: 'single_choice',
          options: [
            'DNS Tunneling / Data Exfiltration using Base64 encoded subdomains',
            'Legitimate NTP time synchronization',
            'DHCP address lease negotiation',
            'Standard ARP broadcast'
          ],
          correctAnswer: 'DNS Tunneling / Data Exfiltration using Base64 encoded subdomains',
          explanation: 'The subdomains "dXNlcl9jcmVkcw==" (Base64 for "user_creds") and "cGFzc3dvcmQxMjM=" (Base64 for "password123") demonstrate active data exfiltration via DNS tunneling.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q11-1',
        question: 'Which DNS record type maps a domain name directly to an IPv4 address?',
        options: ['A', 'AAAA', 'MX', 'CNAME'],
        correctIndex: 0,
        explanation: 'The A record maps a hostname to an IPv4 address.'
      },
      {
        id: 'q11-2',
        question: 'What port and protocol are primarily used for standard client DNS query resolution?',
        options: ['UDP Port 53', 'TCP Port 80', 'TCP Port 443', 'UDP Port 67'],
        correctIndex: 0,
        explanation: 'Standard DNS queries use UDP port 53.'
      }
    ]
  },

  12: {
    metadata: {
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
    theory: {
      concept: 'The Dynamic Host Configuration Protocol (DHCP) automatically assigns IP addresses, subnet masks, default gateways, and DNS server addresses to joining network clients using the 4-step DORA process.',
      explainLikeImNew: 'Imagine entering a hotel. You do not bring your own room key. You walk up to reception and say: "I need a room!" (Discover). The receptionist says: "I have room 302 available" (Offer). You say: "I accept room 302" (Request). The receptionist hands you the key and breakfast voucher (Acknowledge).',
      architecture: 'DORA Sequence: 1. Discover (Client broadcasts to 255.255.255.255:67), 2. Offer (DHCP Server offers IP from pool), 3. Request (Client formally requests offered IP), 4. Acknowledgment (Server commits lease). UDP Ports: 67 (Server), 68 (Client).',
      technicalDetails: [
        'Lease Time: Duration a host is permitted to retain the assigned IP address.',
        'DHCP Options: Option 3 (Default Gateway/Router), Option 6 (Domain Name Servers).',
        'Rogue DHCP Server: An unauthorized DHCP server operating on the network to distribute malicious gateway and DNS configurations.',
        'DHCP Starvation: Attacker floods the network with fake MAC addresses to exhaust the IP pool.'
      ],
      securityPerspective: 'If an adversary places a rogue DHCP server on the LAN, clients that accept its offer will route all external traffic to the attacker computer (Option 3 Gateway) and resolve domains through the attacker DNS (Option 6), creating a silent Man-in-the-Middle intercept.',
      detectionIndicators: [
        'Multiple DHCP Offers received in response to a single Discover broadcast.',
        'Clients receiving gateway IPs that do not match the organization standard router.'
      ],
      defensiveMeasures: [
        'Enable DHCP Snooping on managed switches (classifies ports as Trusted vs Untrusted).',
        'Configure switch access ports to drop DHCP Offer and ACK packets from untrusted ports.'
      ],
      realWorldContext: {
        incidentTitle: 'Hotel Network Rogue DHCP Interception',
        whatHappened: 'A malicious actor attached a portable Wi-Fi router running a rogue DHCP server in a hotel conference hall, capturing financial login sessions from conference attendees.',
        whatDefendersLearned: 'Switch-level DHCP Snooping must be enforced on all access edge ports to prevent unauthorized DHCP servers.'
      },
      investigationExample: {
        scenario: 'A workstation at 192.168.1.55 reports its default gateway is 192.168.1.189, while company routers are strictly 192.168.1.1.',
        analystThoughtProcess: 'A rogue DHCP server answered the client DORA request first and injected its own IP as Option 3 (Router).',
        keyTakeaway: 'Unapproved default gateway addresses assigned by DHCP indicate a rogue server on the broadcast domain.'
      }
    },
    simulation: {
      toolType: 'dhcp_dora',
      title: 'Interactive DHCP DORA Simulator & Rogue Detector',
      instructions: 'Trigger a DHCP Discover broadcast. Inspect competing DHCP Offer replies to differentiate the legitimate corporate server from the rogue attacker server.',
      targetGoal: 'Identify the rogue DHCP server offering the malicious gateway.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-DHCP-012',
        date: '2026-09-29',
        organization: 'Apex Engineering Group',
        complainant: 'Network Operations Desk',
        summary: 'Multiple newly booted laptops received incorrect IP settings pointing to an unknown DNS server (198.51.100.99).',
        reportedImpact: 'Staff redirected to phishing warning pages.'
      },
      evidenceSources: [
        {
          name: 'DHCP Traffic Capture',
          type: 'dhcp',
          description: 'Packet capture of DORA sequence on VLAN 10.',
          logs: [
            {
              id: 'dhcp-1201',
              timestamp: '08:45:01',
              sourceIp: '0.0.0.0',
              destIp: '255.255.255.255',
              protocol: 'UDP/68->67',
              eventType: 'DHCP Discover',
              system: 'Edge-SW-02',
              details: 'Client MAC: 00:1a:2b:3c:4d:5e requested IP configuration',
              severity: 'info',
              isDecoy: true
            },
            {
              id: 'dhcp-1202',
              timestamp: '08:45:01.020',
              sourceIp: '192.168.1.250',
              destIp: '255.255.255.255',
              protocol: 'UDP/67->68',
              eventType: 'DHCP Offer (Rogue Server)',
              system: 'Edge-SW-02',
              details: 'Offered IP: 192.168.1.115 | Gateway: 192.168.1.250 | DNS: 198.51.100.99 (Untrusted External DNS) | Switch Port: Gi0/18',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'dhcp-1203',
              timestamp: '08:45:01.050',
              sourceIp: '192.168.1.1',
              destIp: '255.255.255.255',
              protocol: 'UDP/67->68',
              eventType: 'DHCP Offer (Legitimate Server)',
              system: 'Edge-SW-02',
              details: 'Offered IP: 192.168.1.115 | Gateway: 192.168.1.1 | DNS: 192.168.1.10 | Switch Port: Gi0/1',
              severity: 'info',
              isDecoy: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-12-q1',
          question: 'Which device is the Rogue DHCP Server according to log dhcp-1202?',
          type: 'single_choice',
          options: [
            '192.168.1.250 connected to switch port Gi0/18 handing out malicious DNS 198.51.100.99',
            '192.168.1.1 connected to switch port Gi0/1',
            'Client 00:1a:2b:3c:4d:5e',
            'The edge core switch itself'
          ],
          correctAnswer: '192.168.1.250 connected to switch port Gi0/18 handing out malicious DNS 198.51.100.99',
          explanation: 'Log dhcp-1202 reveals 192.168.1.250 on port Gi0/18 answered first with malicious Gateway (192.168.1.250) and external DNS (198.51.100.99).',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q12-1',
        question: 'What is the correct 4-step sequence of the DHCP lease assignment process?',
        options: [
          'Discover → Offer → Request → Acknowledgment (DORA)',
          'Demand → Obtain → Receive → Authorize',
          'Deploy → Organize → Route → Access',
          'Define → Open → Read → Acknowledge'
        ],
        correctIndex: 0,
        explanation: 'DHCP follows the DORA sequence: Discover, Offer, Request, Acknowledgment.'
      },
      {
        id: 'q12-2',
        question: 'Which switch security feature prevents unauthorized rogue DHCP servers from answering client requests?',
        options: ['DHCP Snooping', 'Spanning Tree FastPort', 'Port Mirroring', 'Jumbo Frames'],
        correctIndex: 0,
        explanation: 'DHCP Snooping designates switch ports as trusted or untrusted, discarding rogue DHCP offers on untrusted access ports.'
      }
    ]
  },

  13: {
    metadata: {
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
    theory: {
      concept: 'Hypertext Transfer Protocol (HTTP) transmits data across port 80 in cleartext. HTTPS secures communication across port 443 by encapsulating HTTP inside Transport Layer Security (TLS), ensuring confidentiality, integrity, and server authentication.',
      explainLikeImNew: 'Sending a message over HTTP is like sending a postcard through the mail: every postal worker, driver, and neighbor along the route can read your message. HTTPS puts your message inside a locked titanium safe that only the intended recipient possesses the key to unlock.',
      architecture: 'TLS Handshake: 1. ClientHello (supported ciphers, TLS version, random string), 2. ServerHello (chosen cipher, digital certificate containing public key), 3. Authentication & Key Exchange (client validates cert with CA, exchanges pre-master secret), 4. Finished (traffic encrypted symmetrically with session keys).',
      technicalDetails: [
        'X.509 Certificates: Bind a public key to an organization identity, digitally signed by a Certificate Authority (CA).',
        'Cipher Suite: Combination of Key Exchange (e.g. ECDHE), Authentication (RSA/ECDSA), Encryption (AES-GCM), and Hash (SHA256).',
        'HSTS (HTTP Strict Transport Security): Enforces HTTPS-only communication, blocking SSL stripping attacks.'
      ],
      securityPerspective: 'Without HTTPS, adversaries on the path execute SSL Stripping or Man-in-the-Middle credential interception. Attackers also generate self-signed or forged certificates to fool users into trusting spoofed websites.',
      detectionIndicators: [
        'Invalid, expired, or self-signed certificates presented during the TLS handshake.',
        'Downgrade attacks where traffic suddenly reverts from port 443 to port 80.'
      ],
      defensiveMeasures: [
        'Enforce HTTP Strict Transport Security (HSTS) with preloading in modern browsers.',
        'Implement Certificate Pinning or Certificate Transparency monitoring to catch rogue certificates.'
      ],
      realWorldContext: {
        incidentTitle: 'SSL Stripping Attacks in Public Wi-Fi Hotspots',
        whatHappened: 'Attackers at airports ran tools like SSLstrip that intercepted victim requests for https://bank.com and silently proxied them back to the user as cleartext http://bank.com, harvesting credentials.',
        whatDefendersLearned: 'HSTS headers ensure browsers never attempt an unencrypted HTTP connection even if a proxy instructs them to.'
      },
      investigationExample: {
        scenario: 'A user logs into an intranet portal. Network sniffer captures the string "POST /login.php HTTP/1.1" with payload "username=cfo&password=SecretPassword2026!".',
        analystThoughtProcess: 'The session was conducted over plaintext HTTP (port 80). Any device along the local or upstream path can view these credentials.',
        keyTakeaway: 'Plaintext HTTP exposes all credentials and cookies to passive packet sniffing.'
      }
    },
    simulation: {
      toolType: 'packet_inspector',
      title: 'Interactive TLS Handshake & Cipher Inspector',
      instructions: 'Step through the TLS 1.3 handshake: ClientHello, ServerHello, Certificate Validation, and Session Key Generation.',
      targetGoal: 'Identify the certificate issuer and cipher suite.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-TLS-013',
        date: '2026-09-29',
        organization: 'Apex Legal Partners',
        complainant: 'Managing Partner',
        summary: 'Attorneys received browser security warnings stating "Certificate Authority Invalid" when accessing the corporate document cloud.',
        reportedImpact: 'Suspected active MITM interception on office Wi-Fi.'
      },
      evidenceSources: [
        {
          name: 'TLS Certificate Inspection Dump',
          type: 'network',
          description: 'X.509 certificate presented to client browser.',
          logs: [
            {
              id: 'tls-1301',
              timestamp: '10:14:02',
              eventType: 'Certificate Presented',
              system: 'Proxy-Inspect-01',
              details: 'Subject: CN=docs.apexlegal.com | Issuer: CN=EvilCorp MITM Intercept CA (Self-Signed) | Validity: Expired | Fingerprint: 9a:8b:7c...',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-13-q1',
          question: 'Why did the browser raise a critical security alert according to log tls-1301?',
          type: 'single_choice',
          options: [
            'The certificate was issued by an untrusted self-signed entity ("EvilCorp MITM Intercept CA") rather than a verified Certificate Authority',
            'The web server hard drive was full',
            'The client computer had an invalid MAC address',
            'The port was changed to UDP port 53'
          ],
          correctAnswer: 'The certificate was issued by an untrusted self-signed entity ("EvilCorp MITM Intercept CA") rather than a verified Certificate Authority',
          explanation: 'The certificate issuer is an untrusted, self-signed entity with an expired validity period, indicating an active MITM proxy interception attempt.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q13-1',
        question: 'What security feature forces web browsers to communicate exclusively over encrypted HTTPS and ignore HTTP downgrades?',
        options: ['HSTS (HTTP Strict Transport Security)', 'BGP Route Reflection', 'ARP Inspection', 'CIDR Prefixing'],
        correctIndex: 0,
        explanation: 'HSTS instructs the browser to always use HTTPS, preventing SSL stripping downgrade attacks.'
      }
    ]
  },

  14: {
    metadata: {
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
    theory: {
      concept: 'A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on an organization established security policy. Network segmentation divides a network into smaller, isolated zones to prevent unauthorized lateral movement.',
      explainLikeImNew: 'A firewall is the security guard stationed at the entrance of a high-security facility. The guard holds a checklist: if your name, department, and ID badge match the rules, you are allowed in. If not, the door remains locked.',
      architecture: 'Stateless firewalls filter individual packets based on static criteria (IPs/ports) without context. Stateful firewalls track the full state of connections in a state table, automatically permitting return traffic for established outbound requests.',
      technicalDetails: [
        'Access Control Lists (ACLs): Rules evaluated sequentially top-to-bottom. First matching rule applies.',
        'Implicit Deny: The default final rule in any secure firewall: if no explicit rule matches, the traffic is dropped.',
        'Demilitarized Zone (DMZ): A perimeter network segment isolating external-facing servers (web, mail) from the trusted internal corporate network.',
        'Zero Trust Architecture: "Never trust, always verify" across every internal and external network hop.'
      ],
      securityPerspective: 'Adversaries scan firewalls to identify permissive rules (e.g. any-to-any outbound rules) that allow reverse shells or data exfiltration over common ports like 80, 443, or 53.',
      detectionIndicators: [
        'High volume of firewall DENY logs on sequential ports from an internal host (internal reconnaissance).',
        'Outbound traffic initiated from DMZ servers directly toward internal database servers.'
      ],
      defensiveMeasures: [
        'Strictly enforce default Implicit Deny on all inbound and outbound interfaces.',
        'Isolate sensitive networks (financial, healthcare, production) into dedicated micro-segmented VLANs with stateful inspection.'
      ],
      realWorldContext: {
        incidentTitle: 'Target Breach Lateral Pivot (2013)',
        whatHappened: 'Attackers compromised third-party vendor credentials to access a flat vendor portal, then traversed unimpeded into point-of-sale payment networks because internal firewall segmentation was absent.',
        whatDefendersLearned: 'Internal network segmentation between corporate systems and sensitive transaction networks is mandatory.'
      },
      investigationExample: {
        scenario: 'A web server in the DMZ (10.0.100.10) initiates an SSH connection to an internal Active Directory domain controller (10.0.1.5).',
        analystThoughtProcess: 'DMZ systems should never initiate outbound connections into the internal trusted core. This is a primary indicator of web server compromise and lateral pivoting.',
        keyTakeaway: 'DMZ-to-Internal connection attempts should trigger immediate containment.'
      }
    },
    simulation: {
      toolType: 'firewall_rules',
      title: 'Interactive Stateful Firewall Rule Engine',
      instructions: 'Build and test firewall rules. Allow HTTPS (443) and DNS (53) while enforcing Implicit Deny for all other traffic.',
      targetGoal: 'Block unauthorized SSH (22) and Telnet (23) attempts.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-FW-014',
        date: '2026-09-29',
        organization: 'Apex Nuclear Energy',
        complainant: 'Perimeter Defense Team',
        summary: 'Firewall log analysis detected unauthorized outbound connection attempts from an internal turbine controller toward an external IP.',
        reportedImpact: 'Attempted exfiltration blocked by firewall perimeter rule.'
      },
      evidenceSources: [
        {
          name: 'Perimeter Firewall Filter Logs',
          type: 'firewall',
          description: 'Stateful firewall access logs on Edge-FW-01.',
          logs: [
            {
              id: 'fw-1401',
              timestamp: '11:20:00',
              sourceIp: '10.50.2.10',
              destIp: '198.51.100.77',
              sourcePort: 49122,
              destPort: 4444,
              protocol: 'TCP',
              eventType: 'Traffic Dropped',
              system: 'Edge-FW-01',
              details: 'Action: DENY | Rule: Default-Implicit-Deny | Reason: No matching outbound permit rule for port 4444',
              severity: 'high'
            },
            {
              id: 'fw-1402',
              timestamp: '11:20:05',
              sourceIp: '10.50.2.10',
              destIp: '198.51.100.77',
              sourcePort: 49123,
              destPort: 80,
              protocol: 'TCP',
              eventType: 'Traffic Permitted',
              system: 'Edge-FW-01',
              details: 'Action: ALLOW | Rule #12: Outbound-HTTP-Permit | Bytes Sent: 14,200',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'inv-14-q1',
          question: 'How did the compromised turbine controller (10.50.2.10) bypass the initial block on port 4444 to communicate with the external adversary server?',
          type: 'single_choice',
          options: [
            'It switched to TCP port 80, which was overly permitted by Rule #12 (Outbound-HTTP-Permit)',
            'It encrypted its MAC address',
            'It shut down the physical router interface',
            'It converted the packets to IPv6'
          ],
          correctAnswer: 'It switched to TCP port 80, which was overly permitted by Rule #12 (Outbound-HTTP-Permit)',
          explanation: 'Log fw-1402 proves the attacker shifted from blocked port 4444 to port 80, taking advantage of an overly permissive outbound rule on the firewall.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q14-1',
        question: 'What is the default security principle applied at the end of a firewall rule set that drops all unapproved traffic?',
        options: ['Implicit Deny', 'Explicit Permit', 'Dynamic Routing', 'Address Resolution'],
        correctIndex: 0,
        explanation: 'Implicit Deny ensures that any traffic not explicitly permitted by a prior rule is dropped.'
      }
    ]
  },

  15: {
    metadata: {
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
    theory: {
      concept: 'Major Milestone & Knowledge Gate: This level marks the boundary between beginner networking concepts and advanced cybersecurity investigation. You must solve a multi-vector perimeter intrusion investigation AND pass the comprehensive Foundation Mastery Exam (80%+) to unlock Level 16.',
      explainLikeImNew: 'Congratulations on reaching Level 15! You have mastered networking, IP addressing, subnetting, the OSI model, TCP/IP, ports, DNS, DHCP, and firewalls. Now, you face a major real-world incident. After this investigation, you must prove your mastery in the Foundation Exam before advancing to deep cyber forensics and incident response.',
      architecture: 'Multi-Vector Incident: Adversary leverages an unsegmented DMZ web server, executes DNS tunneling for C2 beacons, bypasses firewall rules via port hopping, and poisons internal ARP caches.',
      technicalDetails: [
        'Correlate multi-source telemetry: Firewall logs + DNS query logs + ARP tables.',
        'Synthesize chronological timeline of breach events.',
        'Isolate patient-zero workstation and identify initial access vectors.'
      ],
      securityPerspective: 'Sophisticated attackers do not exploit single vulnerabilities; they chain minor misconfigurations across networking layers into catastrophic enterprise compromises.',
      detectionIndicators: [
        'Simultaneous alerts across multiple disparate network sensors.',
        'Anomalous outbound DNS traffic following perimeter web server alerts.'
      ],
      defensiveMeasures: [
        'Implement strict egress filtering (limit outbound connections strictly to authorized proxies).',
        'Enforce micro-segmentation between DMZ and internal core networks.'
      ],
      realWorldContext: {
        incidentTitle: 'Equifax Breach Chain (2017)',
        whatHappened: 'Attackers exploited an unpatched web vulnerability in a customer dispute portal, discovered unencrypted internal credentials, and queried internal databases for months because internal network traffic was uninspected.',
        whatDefendersLearned: 'Perimeter defenses are insufficient; deep internal visibility, micro-segmentation, and egress filtering are essential.'
      },
      investigationExample: {
        scenario: 'Web server in DMZ generates an outbound connection to an unknown IP over port 53, followed by internal SMB probes to the finance subnet.',
        analystThoughtProcess: 'Web servers do not perform direct external DNS queries or internal SMB shares. The server has been weaponized as an internal pivot node.',
        keyTakeaway: 'Any unexpected protocol or direction from a perimeter node indicates adversary control.'
      }
    },
    simulation: {
      toolType: 'siem_correlation',
      title: 'Perimeter Breach Multi-Log Correlation Console',
      instructions: 'Correlate Firewall deny logs, DNS tunneling queries, and ARP cache alerts to map out the attacker multi-stage progression.',
      targetGoal: 'Identify the compromised host and exfiltration channel.'
    },
    investigation: {
      firComplaint: {
        reportNumber: 'FIR-2026-ZD-015',
        date: '2026-09-29',
        organization: 'Apex Sovereign Bank',
        complainant: 'Chief Information Security Officer (CISO)',
        summary: 'Emergency Incident: Suspicious activity detected across DMZ web portal, internal DNS resolver, and perimeter firewall. Database exfiltration suspected.',
        reportedImpact: 'Potential compromise of 500,000 customer banking records.'
      },
      evidenceSources: [
        {
          name: 'Perimeter Firewall Security Log',
          type: 'firewall',
          description: 'Egress traffic filtered by Edge-FW-01.',
          logs: [
            {
              id: 'zd3-1501',
              timestamp: '18:02:10',
              sourceIp: '10.0.100.5',
              destIp: '198.51.100.9',
              sourcePort: 48910,
              destPort: 443,
              protocol: 'TCP',
              eventType: 'HTTPS Inbound Permitted',
              system: 'Edge-FW-01',
              details: 'Inbound POST to https://banking.apexbank.com/api/v1/transfer. Status: 200 OK',
              severity: 'info',
              isDecoy: true
            },
            {
              id: 'zd3-1502',
              timestamp: '18:04:35',
              sourceIp: '10.0.100.5',
              destIp: '203.0.113.88',
              sourcePort: 51204,
              destPort: 53,
              protocol: 'UDP',
              eventType: 'DNS Exfiltration Beacon',
              system: 'Edge-FW-01',
              details: 'Query: exfil-c7821.shadow-c2.net | Response: 1.1.1.1 | Total 240 queries in 30 seconds',
              severity: 'critical',
              isMalicious: true
            },
            {
              id: 'zd3-1503',
              timestamp: '18:06:00',
              sourceIp: '10.0.100.5',
              destIp: '10.0.1.50',
              sourcePort: 49100,
              destPort: 1433,
              protocol: 'TCP',
              eventType: 'Internal Lateral Movement Attempt',
              system: 'Edge-FW-01',
              details: 'DMZ Web Server attempted direct SQL connection to Core Database 10.0.1.50:1433. Status: DENIED by DMZ-Isolation-Rule #1',
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: 'zd3-q1',
          question: 'Which host inside the organization was compromised by the adversary as Patient Zero?',
          type: 'single_choice',
          options: [
            'DMZ Web Server at 10.0.100.5',
            'Core Database Server at 10.0.1.50',
            'External IP 203.0.113.88',
            'DNS Resolver 1.1.1.1'
          ],
          correctAnswer: 'DMZ Web Server at 10.0.100.5',
          explanation: 'Log zd3-1502 and zd3-1503 show that all malicious DNS exfiltration and unauthorized internal database pivoting originated from DMZ Web Server 10.0.100.5.',
          points: 100
        },
        {
          id: 'zd3-q2',
          question: 'What channel was used by the attacker to communicate with external command and control (C2)?',
          type: 'single_choice',
          options: [
            'DNS Tunneling queries over UDP port 53 to shadow-c2.net',
            'Cleartext Telnet over port 23',
            'Encrypted SSH over port 22',
            'ICMP Echo broadcasts'
          ],
          correctAnswer: 'DNS Tunneling queries over UDP port 53 to shadow-c2.net',
          explanation: 'Log zd3-1502 records 240 high-frequency DNS queries over UDP 53 to domain shadow-c2.net.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: 'q15-1',
        question: 'What immediate containment action should the incident response team execute for DMZ Web Server 10.0.100.5?',
        options: [
          'Isolate host 10.0.100.5 from the network while preserving volatile memory artifacts',
          'Delete the entire database server 10.0.1.50',
          'Disable firewall rule #1',
          'Reboot the building power generators'
        ],
        correctIndex: 0,
        explanation: 'Host isolation severs attacker control while preserving volatile RAM artifacts for forensic analysis.'
      }
    ]
  }
};

