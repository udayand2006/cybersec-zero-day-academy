import React, { useState } from 'react';
import { FOUNDATION_EXAM_QUESTION_BANK } from '../data/examQuestions';
import { QuizQuestion } from '../types/cyber';
import { AlertTriangle, Check, X, ArrowRight } from 'lucide-react';

interface FoundationExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamPassed: () => void;
  isAlreadyPassed: boolean;
}

export const FoundationExamModal: React.FC<FoundationExamModalProps> = ({
  isOpen,
  onClose,
  onExamPassed,
  isAlreadyPassed
}) => {
  const [questions] = useState<QuizQuestion[]>(() => {
    return [...FOUNDATION_EXAM_QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, 10);
  });

  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    let correctCount = 0;
    const weak: string[] = [];

    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      } else {
        if (q.category && !weak.includes(q.category)) {
          weak.push(q.category);
        }
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setWeakTopics(weak);
    setSubmitted(true);

    if (calculatedScore >= 80) {
      onExamPassed();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f0f11] border border-zinc-800 rounded-xl max-w-3xl w-full p-6 sm:p-7 space-y-6 my-8 text-zinc-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="border-b border-zinc-800 pb-3">
          <span className="text-xs font-mono text-zinc-400 uppercase font-semibold block">
            Academic Assessment Gate
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Level 15: Foundation Mastery Exam
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Randomized 10-question evaluation spanning networking, ports, protocols, and firewalls. Minimum 80% passing grade unlocks Level 16+.
          </p>
        </div>

        {!submitted ? (
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-black border border-zinc-800 rounded-lg p-4 space-y-2.5">
                <span className="text-xs font-mono text-zinc-400">Question {idx + 1} of 10</span>
                <p className="text-xs sm:text-sm font-medium text-white">{q.question}</p>
                <div className="space-y-1.5 pt-1">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => setAnswers({ ...answers, [q.id]: optIdx })}
                      className={`w-full text-left p-2.5 rounded border text-xs font-mono transition-colors ${
                        answers[q.id] === optIdx
                          ? 'bg-zinc-800 border-zinc-600 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-3 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium text-xs transition-colors"
              >
                Submit Exam for Evaluation
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                {score >= 80 ? 'Mastery Gate Verified' : 'Evaluation Incomplete'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Your score: <strong className="text-white">{score}%</strong> (Passing requirement: 80%)
              </p>
            </div>

            {score >= 80 ? (
              <div className="p-3.5 rounded bg-black border border-zinc-800 text-xs font-mono text-zinc-300 max-w-md mx-auto">
                Level 16+ Advanced Investigator Mode is now unlocked. You are cleared for multi-source log correlation.
              </div>
            ) : (
              <div className="p-3.5 rounded bg-black border border-zinc-800 text-xs font-mono text-zinc-300 max-w-md mx-auto space-y-1">
                <span className="text-zinc-400 font-bold block">Recommended Review Modules:</span>
                <p className="text-zinc-500">{weakTopics.join(', ') || 'Networking and Firewalls'}</p>
              </div>
            )}

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded text-xs font-medium"
              >
                Return to Curriculum
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
