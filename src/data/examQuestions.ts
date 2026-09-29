import { QuizQuestion } from '../types/cyber';

export const FOUNDATION_EXAM_QUESTION_BANK: QuizQuestion[] = [
  {
    id: 'exam-q1',
    category: 'Subnetting',
    question: 'An organization is allocated the subnet 192.168.10.0/26. How many usable host IP addresses are available in this subnet, and what is its broadcast address?',
    options: [
      '62 usable hosts; Broadcast is 192.168.10.63',
      '64 usable hosts; Broadcast is 192.168.10.64',
      '126 usable hosts; Broadcast is 192.168.10.127',
      '30 usable hosts; Broadcast is 192.168.10.31'
    ],
    correctIndex: 0,
    explanation: 'A /26 mask leaves 6 bits for hosts (32 - 26 = 6). Total addresses = 2^6 = 64. Usable hosts = 64 - 2 = 62 (excluding network 192.168.10.0 and broadcast 192.168.10.63).'
  },
  {
    id: 'exam-q2',
    category: 'OSI Model',
    question: 'A router inspects destination logical addresses to forward packets across different subnets. At which OSI layer does this decision take place?',
    options: [
      'Layer 2 (Data Link Layer)',
      'Layer 3 (Network Layer)',
      'Layer 4 (Transport Layer)',
      'Layer 5 (Session Layer)'
    ],
    correctIndex: 1,
    explanation: 'Layer 3 (Network Layer) is responsible for logical addressing (IP addresses) and path routing across distinct networks.'
  },
  {
    id: 'exam-q3',
    category: 'TCP/IP Handshake',
    question: 'During a TCP 3-way connection establishment, what packet sequence is transmitted between the client and the server before payload data can flow?',
    options: [
      'ACK → SYN → ACK-SYN',
      'SYN → SYN-ACK → ACK',
      'SYN → ACK → SYN-ACK',
      'FIN → SYN → ACK'
    ],
    correctIndex: 1,
    explanation: 'TCP 3-way handshake begins with client sending SYN, server responding with SYN-ACK, and client completing the session setup with ACK.'
  },
  {
    id: 'exam-q4',
    category: 'ARP Protocol',
    question: 'If Host A broadcasts "Who has 192.168.1.1? Tell 192.168.1.50", and receives two differing MAC addresses claiming to own 192.168.1.1, what security phenomenon is most likely occurring?',
    options: [
      'Normal DHCP dynamic pool allocation',
      'ARP Cache Poisoning / ARP Spoofing attack',
      'DNS recursive resolver timeout',
      'TCP flow window scaling adjustment'
    ],
    correctIndex: 1,
    explanation: 'Multiple conflicting ARP replies claiming the same IP address indicate an adversary is attempting ARP spoofing to position themselves as a Man-in-the-Middle.'
  },
  {
    id: 'exam-q5',
    category: 'DNS Investigation',
    question: 'A security analyst discovers multiple internal systems querying random high-entropy subdomains like "x9f2a1b.exfil.badactor-domain.internal". Which technique is being abused?',
    options: [
      'DNS Tunneling / Data Exfiltration via TXT or A queries',
      'BGP Hijacking',
      'DHCP Starvation',
      'MAC Address Flooding'
    ],
    correctIndex: 0,
    explanation: 'Adversaries encode sensitive data into subdomains of an attacker-controlled authoritative DNS server to bypass perimeter firewalls that permit port 53 outbound.'
  },
  {
    id: 'exam-q6',
    category: 'Firewall Rules',
    question: 'To protect an internal web server at 10.0.1.50 hosting an encrypted public website while denying all management access from the public internet, which stateful firewall rule set is correct?',
    options: [
      'ALLOW Inbound TCP Any -> 10.0.1.50:443; DENY Inbound Any -> 10.0.1.50:Any',
      'ALLOW Inbound UDP Any -> 10.0.1.50:80; ALLOW Inbound TCP Any -> 10.0.1.50:22',
      'ALLOW Inbound ICMP Any -> 10.0.1.50:Any; DENY Inbound TCP Any -> 10.0.1.50:443',
      'DENY All Inbound; DENY All Outbound'
    ],
    correctIndex: 0,
    explanation: 'Stateful firewalls track connections. Allowing inbound TCP to port 443 (HTTPS) while denying all other inbound ports prevents external exposure of SSH (22) or RDP (3389).'
  },
  {
    id: 'exam-q7',
    category: 'DHCP Security',
    question: 'What is the primary danger when an unauthorized rogue DHCP server is connected to a corporate switch access port?',
    options: [
      'It can assign its own rogue IP as the default gateway and rogue DNS, intercepting all client traffic',
      'It forcibly changes the MAC addresses of hardware NICs',
      'It deletes the router firmware flash memory',
      'It crashes all Layer 1 fiber transceivers'
    ],
    correctIndex: 0,
    explanation: 'A rogue DHCP server hands out malicious gateway and DNS server IP addresses to unsuspecting clients during the DORA process, facilitating seamless MITM interception.'
  },
  {
    id: 'exam-q8',
    category: 'Port Services',
    question: 'An alert shows cleartext credentials transmitted over destination port 23. Which legacy protocol is this, and which secure protocol should replace it?',
    options: [
      'Telnet (unencrypted); should be replaced with SSH (port 22)',
      'FTP (port 21); should be replaced with TFTP (port 69)',
      'HTTP (port 80); should be replaced with SNMPv1 (port 161)',
      'SMTP (port 25); should be replaced with POP3 (port 110)'
    ],
    correctIndex: 0,
    explanation: 'Port 23 is Telnet, which transmits all session traffic including passwords in plaintext. It must be replaced by SSH (Secure Shell) on port 22.'
  },
  {
    id: 'exam-q9',
    category: 'IP Addressing',
    question: 'Which of the following IPv4 address ranges is designated as Private (RFC 1918) and therefore non-routable on the public internet?',
    options: [
      '172.16.0.0 to 172.31.255.255',
      '128.0.0.0 to 191.255.255.255',
      '203.0.113.0 to 203.0.113.255',
      '8.8.8.0 to 8.8.8.255'
    ],
    correctIndex: 0,
    explanation: 'RFC 1918 defines three private IPv4 blocks: 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0 - 172.31.255.255), and 192.168.0.0/16.'
  },
  {
    id: 'exam-q10',
    category: 'Transport Layer',
    question: 'Why does streaming live audio or DNS query lookups frequently choose UDP over TCP?',
    options: [
      'UDP requires no handshake, eliminates retransmission delays, and prioritizes low latency over guaranteed delivery',
      'UDP has built-in 256-bit AES encryption by default',
      'UDP guarantees that packets never arrive out of order',
      'UDP uses larger 64-bit sequence numbers than TCP'
    ],
    correctIndex: 0,
    explanation: 'UDP is connectionless and lightweight. For real-time audio or brief single-packet DNS lookups, the overhead of establishing a 3-way handshake and retransmitting dropped packets is undesirable.'
  },
  {
    id: 'exam-q11',
    category: 'MAC & Switching',
    question: 'How does an Ethernet switch know which physical switch port to forward an incoming frame to?',
    options: [
      'It checks its MAC Address Table (CAM table) to match the destination MAC with the learned physical port',
      'It queries the DNS server for the MAC address of the destination',
      'It broadcasts every frame to all ports permanently regardless of destination',
      'It reads the Layer 7 HTTP Host header'
    ],
    correctIndex: 0,
    explanation: 'Ethernet switches inspect source MACs to populate their CAM/MAC address table and lookup destination MACs to forward frames directly to the designated port.'
  },
  {
    id: 'exam-q12',
    category: 'Network Architecture',
    question: 'What is the purpose of placing internet-facing public servers (such as Web and Mail) inside a Demilitarized Zone (DMZ)?',
    options: [
      'To prevent an attacker who compromises a public server from directly pivoting into the internal trusted corporate network',
      'To double the bandwidth of public internet connections',
      'To eliminate the need for patch management on web servers',
      'To convert all IPv4 packets into IPv6'
    ],
    correctIndex: 0,
    explanation: 'A DMZ creates a segmented buffer zone between the untrusted internet and the trusted internal LAN, enforcing firewall inspection and restricting internal access if compromised.'
  }
];
