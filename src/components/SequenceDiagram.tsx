'use client';

import { useState, useEffect, useRef } from 'react';

interface ProofData {
  commitment: string;
  ageProof: boolean;
  timestamp: number;
}

interface VerificationInfo {
  isValid: boolean;
  message: string;
  timestamp: string;
}

type Direction = 'client-to-server' | 'server-to-client' | 'internal';

interface SequenceStep {
  id: string;
  direction: Direction;
  label: string;
  description: string;
  detail?: string;
  side?: 'client' | 'server';
  arrowLabel?: string;
}

interface SequenceDiagramProps {
  publicProof: ProofData;
  verification?: VerificationInfo;
}

const formatHash = (hash: string, maxLength: number = 12) => {
  if (hash.length <= maxLength) return hash;
  return `${hash.substring(0, maxLength)}...`;
};

const formatDate = (timestamp: number) => new Date(timestamp).toLocaleString();

const getSequenceSteps = (
  proof: ProofData,
  verification?: VerificationInfo
): SequenceStep[] => [
  {
    id: 'step-1',
    direction: 'internal',
    side: 'client',
    label: 'Enter Birth Date',
    description: 'You provide your birth date (stays private on your device)',
  },
  {
    id: 'step-2',
    direction: 'internal',
    side: 'client',
    label: 'Generate Proof',
    description: 'Client creates SHA-256 hash + random salt',
    detail: `Hash: ${formatHash(proof.commitment)}`,
  },
  {
    id: 'step-3',
    direction: 'internal',
    side: 'client',
    label: 'Check Age',
    description: 'Verify you are 18+ before proceeding',
    detail: `Status: ${proof.ageProof ? '✓ Over 18' : '✗ Under 18'}`,
  },
  {
    id: 'step-4',
    direction: 'client-to-server',
    label: 'Send Commitment',
    description: 'Send hash, age status, and timestamp to server',
    arrowLabel: `commitment=${formatHash(proof.commitment)}, age=${
      proof.ageProof ? '18+' : 'under 18'
    }, ts=${formatDate(proof.timestamp)}`,
  },
  {
    id: 'step-5',
    direction: 'internal',
    side: 'server',
    label: 'Verify Proof',
    description: 'Server validates proof timestamp and structure',
  },
  {
    id: 'step-6',
    direction: 'server-to-client',
    label: 'Return Result',
    description: 'Server responds with verification result',
    arrowLabel: verification
      ? `result=${verification.isValid ? '✓ valid' : '✗ invalid'} — ${
          verification.message
        }`
      : 'result=processing...'
  },
  {
    id: 'step-7',
    direction: 'internal',
    side: 'client',
    label: 'Access Granted',
    description: 'You are verified as 18+ without revealing birthdate',
  },
];

export function SequenceDiagram({ publicProof, verification }: SequenceDiagramProps) {
  const [animatedSteps, setAnimatedSteps] = useState<string[]>([]);
  const [shouldAnimate, setShouldAnimate] = useState(true);
const sequenceSteps = getSequenceSteps(publicProof, verification);
  const stepsRef = useRef(sequenceSteps);

  // Update ref when steps change
  useEffect(() => {
    stepsRef.current = sequenceSteps;
  }, [sequenceSteps]);

  useEffect(() => {
    if (!shouldAnimate) return;

    // Animate steps sequentially with defensive guards
    const steps = stepsRef.current ?? [];
    let currentIndex = 0;

    // Start by showing the first step immediately (if available)
    if (steps.length > 0) {
      setAnimatedSteps([steps[0].id]);
      currentIndex = 1;
    } else {
      setAnimatedSteps([]);
      setShouldAnimate(false);
      return;
    }

    const timer = setInterval(() => {
      const step = steps[currentIndex];
      if (step) {
        setAnimatedSteps((prev) => [...prev, step.id]);
        currentIndex++;
      } else {
        clearInterval(timer);
        setShouldAnimate(false);
      }
    }, 400);

    return () => clearInterval(timer);
  }, [shouldAnimate]);

  const resetAnimation = () => {
    setShouldAnimate(true);
  };

  return (
    <div className="w-full">
      {/* Desktop Sequence Diagram */}
      <div className="hidden md:block">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-8">
          <div className="col-span-4 flex flex-col items-center">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl shadow-lg border-2 border-blue-700">💻</div>
            <div className="mt-2 text-center">
              <p className="font-bold text-gray-900 dark:text-white">Client</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your Device</p>
            </div>
          </div>
          <div className="col-span-4" />
          <div className="col-span-4 flex flex-col items-center">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-3xl shadow-lg border-2 border-purple-700">🖥️</div>
            <div className="mt-2 text-center">
              <p className="font-bold text-gray-900 dark:text-white">Server</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Verification Service</p>
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="mt-6 space-y-4">
          {sequenceSteps.map((step) => {
            const isAnimated = animatedSteps.includes(step.id);
            if (step.direction === 'internal') {
              return (
                <div key={step.id} className="grid grid-cols-12 items-center">
                  {step.side === 'client' ? (
                    <>
                      <div className="col-span-4 transition-all duration-500">
                        {isAnimated && (
                          <div className="bg-blue-50 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-600 rounded-lg p-3 w-48 text-center mx-auto">
                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">{step.label}</p>
                            {step.detail && (
                              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 font-mono break-all">{step.detail}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="col-span-4" />
                      <div className="col-span-4" />
                    </>
                  ) : (
                    <>
                      <div className="col-span-4" />
                      <div className="col-span-4" />
                      <div className="col-span-4 transition-all duration-500">
                        {isAnimated && (
                          <div className="bg-purple-50 dark:bg-purple-900 border-2 border-purple-300 dark:border-purple-600 rounded-lg p-3 w-48 text-center mx-auto">
                            <p className="text-xs font-semibold text-purple-900 dark:text-purple-100">{step.label}</p>
                            {step.detail && (
                              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1 font-mono break-all">{step.detail}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            }

            // Arrow rows
            return (
              <div key={step.id} className="grid grid-cols-12 items-center">
                <div className="col-span-4" />
                <div className="col-span-4">
                  <div className={`relative h-10 transition-all duration-500 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
                    {step.arrowLabel && (
                      <div className="absolute left-1/2 -translate-x-1/2 -top-5">
                        <span className="px-2 py-0.5 text-[11px] rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-mono whitespace-nowrap">
                          {step.arrowLabel}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                      {step.direction === 'client-to-server' ? (
                        <div className="flex items-center">
                          <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400" />
                          <div className="ml-1 text-purple-600">→</div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="mr-1 text-blue-600">←</div>
                          <div className="flex-1 h-0.5 bg-gradient-to-l from-purple-400 to-blue-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-4" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Compact View */}
      <div className="mt-8 block md:hidden">
        <div className="space-y-4">
          {sequenceSteps.map((step, idx) => {
            const isAnimated = animatedSteps.includes(step.id);

            return (
              <div
                key={step.id}
                className={`transition-all duration-500 ${
                  isAnimated
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-4'
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white text-sm ${
                      step.direction === 'internal'
                        ? 'bg-blue-500'
                        : step.direction === 'client-to-server'
                          ? 'bg-blue-600'
                          : 'bg-purple-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {step.label}
                      </span>
                      {step.direction === 'client-to-server' && (
                        <span className="text-blue-500 text-sm">→</span>
                      )}
                      {step.direction === 'server-to-client' && (
                        <span className="text-purple-500 text-sm">←</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                    {step.detail && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                        {step.detail}
                      </p>
                    )}
                    {step.arrowLabel && (
                      <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 font-mono">
                        {step.arrowLabel}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Animation Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={resetAnimation}
          className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 rounded-lg transition-colors"
        >
          🔄 Replay Animation
        </button>
      </div>
    </div>
  );
}