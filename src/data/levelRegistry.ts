import { LevelData } from '../types/cyber';
import { ALL_50_LEVELS } from './curriculum';
import { LEVELS_1_TO_15 } from './levels1_15';
import { LEVELS_16_TO_30 } from './levels16_30';
import { LEVELS_31_TO_45 } from './levels31_45';
import { LEVELS_46_TO_50 } from './levels46_50';

export function getLevelData(levelId: number): LevelData {
  // Check explicit full implementations
  if (LEVELS_1_TO_15[levelId]) {
    return LEVELS_1_TO_15[levelId];
  }
  if (LEVELS_16_TO_30[levelId]) {
    return LEVELS_16_TO_30[levelId];
  }
  if (LEVELS_31_TO_45[levelId]) {
    return LEVELS_31_TO_45[levelId];
  }
  if (LEVELS_46_TO_50[levelId]) {
    return LEVELS_46_TO_50[levelId];
  }

  // Fallback to high-fidelity curated generator based on the curriculum metadata
  const meta = ALL_50_LEVELS.find(l => l.id === levelId) || ALL_50_LEVELS[0];

  const isAdvanced = levelId > 15;

  return {
    metadata: meta,
    theory: {
      concept: `${meta.title}: In modern enterprise cybersecurity, ${meta.subtitle.toLowerCase()} represents a critical defensive and investigative capability.`,
      explainLikeImNew: `When protecting a digital network, ${meta.title} acts like a specialized checkpoint. If you understand how data flows and how attackers exploit this vector, you can quickly locate anomalous behavior before severe damage occurs.`,
      architecture: `Standard architecture for ${meta.title} involves monitoring telemetry across endpoints, network perimeters, and centralized directory services to enforce security invariants.`,
      technicalDetails: [
        `Core protocols and standards governing ${meta.title}.`,
        `Telemetry capture mechanisms and event parsing formats.`,
        `Cryptographic or procedural validation checks required for secure operation.`
      ],
      securityPerspective: `Adversaries target ${meta.title} to establish persistence, elevate privileges, or bypass traditional detection systems.`,
      detectionIndicators: [
        `Sudden deviations from historical baseline metrics for ${meta.title}.`,
        `Uncorrelated authentication or packet anomalies matching known adversary TTPs.`
      ],
      defensiveMeasures: [
        `Apply least privilege principles and strict perimeter segmentation.`,
        `Configure comprehensive audit logging with centralized SIEM forwarding.`
      ],
      realWorldContext: {
        incidentTitle: `Enterprise Incident Vector: ${meta.title}`,
        whatHappened: `Security teams observed unauthorized probing and access attempts targeting ${meta.subtitle.toLowerCase()}.`,
        whatDefendersLearned: `Continuous visibility and fast correlation are essential to intercept multi-stage intrusions.`
      },
      investigationExample: {
        scenario: `An alert flags unusual telemetry associated with ${meta.title} on host 10.0.1.25.`,
        analystThoughtProcess: `Correlate the timestamp with related authentication and network flow logs. Rule out normal scheduled maintenance before flagging as a confirmed intrusion.`,
        keyTakeaway: `Always confirm whether unexpected activity matches an approved administrative change window.`
      }
    },
    preLabAssessment: isAdvanced ? [
      {
        id: `pre-${levelId}-1`,
        question: `In the context of ${meta.title}, which defensive measure is most effective for mitigating risk?`,
        options: [
          'Enforcing strict least privilege and comprehensive audit logging',
          'Disabling all firewalls and security agents',
          'Using default passwords across all systems',
          'Turning off network time synchronization'
        ],
        correctIndex: 0,
        explanation: 'Enforcing least privilege and retaining audit logs are foundational security controls across all systems.'
      },
      {
        id: `pre-${levelId}-2`,
        question: `When analyzing suspicious activity related to ${meta.title}, what is the first step an investigator should take?`,
        options: [
          'Verify evidence integrity and correlate timestamps across system clocks',
          'Delete all log files immediately',
          'Power off the entire organization data center without taking memory dumps',
          'Announce the incident on public social media'
        ],
        correctIndex: 0,
        explanation: 'Verifying evidence integrity and normalizing timestamps are critical first steps in any digital forensic investigation.'
      }
    ] : undefined,
    simulation: {
      toolType: levelId % 2 === 0 ? 'packet_inspector' : 'siem_correlation',
      title: `${meta.title} Interactive Simulation Lab`,
      instructions: `Interact with the simulated telemetry stream for ${meta.title}. Filter and inspect the recorded events to locate the anomaly.`,
      targetGoal: `Isolate the anomalous event matching ${meta.title}.`
    },
    investigation: {
      firComplaint: {
        reportNumber: `FIR-2026-LVL-${String(levelId).padStart(3, '0')}`,
        date: '2026-09-29',
        organization: 'Apex Enterprise Infrastructure',
        complainant: 'Cyber Operations Center',
        summary: `Suspicious activity detected regarding ${meta.title} (${meta.subtitle}).`,
        reportedImpact: 'Potential operational disruption or unauthorized data access.'
      },
      evidenceSources: [
        {
          name: `${meta.title} Telemetry Log`,
          type: 'network',
          description: `Captured security telemetry for Level ${levelId}.`,
          logs: [
            {
              id: `log-${levelId}-1`,
              timestamp: '14:20:10',
              sourceIp: '10.0.1.45',
              destIp: '10.0.1.1',
              eventType: 'Standard Telemetry',
              system: 'Core-Sensor',
              details: `Normal baseline activity for ${meta.title}.`,
              severity: 'info',
              isDecoy: true
            },
            {
              id: `log-${levelId}-2`,
              timestamp: '14:22:45',
              sourceIp: '10.0.1.45',
              destIp: '198.51.100.99',
              eventType: 'Anomalous Event Detected',
              system: 'Core-Sensor',
              details: `Anomalous pattern identified in ${meta.subtitle}. Outbound connection established to untrusted destination.`,
              severity: 'critical',
              isMalicious: true
            }
          ]
        }
      ],
      investigationQuestions: [
        {
          id: `inv-${levelId}-q1`,
          question: `Based on the telemetry log for Level ${levelId}, which event indicates an active security anomaly?`,
          type: 'single_choice',
          options: [
            `Event at 14:22:45: Outbound connection established to untrusted destination 198.51.100.99`,
            `Event at 14:20:10: Normal baseline activity`,
            `Routine switch port link keepalive`,
            `Local loopback 127.0.0.1 ping`
          ],
          correctAnswer: `Event at 14:22:45: Outbound connection established to untrusted destination 198.51.100.99`,
          explanation: 'Log log-' + levelId + '-2 explicitly documents the anomalous outbound connection to untrusted external IP 198.51.100.99.',
          points: 100
        }
      ]
    },
    finalQuiz: [
      {
        id: `quiz-${levelId}-1`,
        question: `What is the primary security objective when defending ${meta.title}?`,
        options: [
          'Ensuring confidentiality, integrity, and availability through defense-in-depth',
          'Allowing all external unauthenticated connections',
          'Eliminating all audit logs',
          'Using unencrypted cleartext protocols exclusively'
        ],
        correctIndex: 0,
        explanation: 'The CIA triad (Confidentiality, Integrity, Availability) enforced through defense-in-depth is the core security objective.'
      }
    ]
  };
}
