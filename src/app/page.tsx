'use client';

import { useState } from 'react';
import { AgeProofGenerator } from '@/components/AgeProofGenerator';
import { ProofVisualization } from '@/components/ProofVisualization';
import { createPublicProof } from '@/lib/zk-age';

type AppState = 'generator' | 'submitting' | 'verified';

interface VerificationResponse {
  isValid: boolean;
  message: string;
  timestamp: string;
}

export default function Home() {
  const [state, setState] = useState<AppState>('generator');
  const [publicProof, setPublicProof] = useState<ReturnType<typeof createPublicProof> | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState('');

  const handleProofGenerated = async (
    proof: ReturnType<typeof createPublicProof>
  ) => {
    setPublicProof(proof);
    setError('');
    setState('submitting');

    try {
      // Submit the proof to the server
      const response = await fetch('/api/verify-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proof),
      });

      if (!response.ok) {
        throw new Error('Failed to verify proof');
      }

      const result: VerificationResponse = await response.json();
      setVerificationResult(result);
      setState('verified');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setState('generator');
    }
  };

  const handleReset = () => {
    setState('generator');
    setPublicProof(null);
    setVerificationResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">🔐</span>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Zero-Knowledge Proofs
          </h1>
          <span className="text-4xl">🚀</span>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Prove you&apos;re 18+ without revealing your birthdate. All computation happens on your device.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {state === 'generator' && (
          <div className="flex justify-center">
            <AgeProofGenerator onProofGenerated={handleProofGenerated} />
          </div>
        )}

        {state === 'submitting' && (
          <div className="flex justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
                <svg
                  className="animate-spin h-8 w-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Verifying Proof
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Sending proof to server...</p>
            </div>
          </div>
        )}

        {state === 'verified' && publicProof && verificationResult && (
          <ProofVisualization
            publicProof={publicProof}
            verificationDetails={{
              isValid: verificationResult.isValid,
              message: verificationResult.message,
              timestamp: verificationResult.timestamp,
            }}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Educational Footer */}
      <div className="max-w-7xl mx-auto mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">What You Prove</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You generate a cryptographic proof that you&apos;re 18 or older, all computed locally on your device.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-3">🚫</div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">What&apos;s Private</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your actual birthdate never leaves your device. Only a cryptographic commitment is sent to the server.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-3">✨</div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Why It Works</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            SHA-256 hashing makes it cryptographically impossible to reverse-engineer your birthdate from the proof.
          </p>
        </div>
      </div>
    </div>
  );
}
