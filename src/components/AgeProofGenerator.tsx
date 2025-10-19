'use client';

import { useState } from 'react';
import { generateAgeProof, createPublicProof, type AgeProof } from '@/lib/zk-age';

interface AgeProofGeneratorProps {
  onProofGenerated: (proof: ReturnType<typeof createPublicProof>, internalProof: AgeProof) => void;
}

export function AgeProofGenerator({ onProofGenerated }: AgeProofGeneratorProps) {
  const [birthDate, setBirthDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateProof = async () => {
    setError('');

    if (!birthDate) {
      setError('Please select a birth date');
      return;
    }

    try {
      setIsGenerating(true);

      const date = new Date(birthDate);
      if (isNaN(date.getTime())) {
        setError('Invalid date');
        return;
      }

      // Check if date is in the past
      if (date > new Date()) {
        setError('Birth date must be in the past');
        return;
      }

      // Generate the proof on the client side only
      const internalProof = generateAgeProof(date);

      // Check if over 18
      if (!internalProof.ageProof) {
        setError('You must be 18 or older to continue');
        setBirthDate('');
        return;
      }

      // Create the public proof to send to server
      const publicProof = createPublicProof(internalProof);

      // Pass both proofs to parent - internal for display, public to send to server
      onProofGenerated(publicProof, internalProof);

      // Reset form
      setBirthDate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg p-8 border border-purple-200 dark:border-purple-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Age Verification
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Generate a zero-knowledge proof that you&apos;re 18+ without revealing your birthdate
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Your Birth Date
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setError('');
              }}
              max={maxDateString}
              disabled={isGenerating}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Only dates in the past are accepted
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerateProof}
            disabled={isGenerating || !birthDate}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Proof...
              </>
            ) : (
              '🔐 Generate Zero-Knowledge Proof'
            )}
          </button>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-3">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Privacy Notice:</strong> Your birthdate never leaves your device. The proof is generated locally and only a cryptographic commitment is sent to the server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
