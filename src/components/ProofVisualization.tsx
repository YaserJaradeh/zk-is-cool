'use client';

import { useState } from 'react';
import { SequenceDiagram } from './SequenceDiagram';

interface ProofData {
  commitment: string;
  ageProof: boolean;
  timestamp: number;
}

interface VerificationDetails {
  isValid: boolean;
  message: string;
  timestamp: string;
}

interface ProofVisualizationProps {
  publicProof: ProofData;
  verificationDetails: VerificationDetails;
  onReset: () => void;
}

export function ProofVisualization({
  publicProof,
  verificationDetails,
  onReset,
}: ProofVisualizationProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatHash = (hash: string, maxLength: number = 16) => {
    if (hash.length <= maxLength) return hash;
    return `${hash.substring(0, maxLength)}...`;
  };

  const Section = ({
    title,
    id,
    icon,
    children,
  }: {
    title: string;
    id: string;
    icon: string;
    children: React.ReactNode;
  }) => (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-3 flex items-center justify-between transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
          <span className="text-xl">{icon}</span>
          {title}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${expandedSection === id ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
      {expandedSection === id && (
        <div className="px-4 py-4 border-t border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-8 border border-green-200 dark:border-green-800 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
            {verificationDetails.isValid ? '✓ Proof Verified!' : '✗ Proof Invalid'}
          </h3>
        </div>
        <p className="text-green-700 dark:text-green-300">{verificationDetails.message}</p>
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">{verificationDetails.timestamp}</p>
      </div>

      <div className="space-y-4 mb-8">
        <Section title="Proof Flow Visualization" id="flowVisualization" icon="🔄">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-6">
            <SequenceDiagram publicProof={publicProof} verification={verificationDetails} />
          </div>
        </Section>

        <Section title="How Zero-Knowledge Proofs Work" id="howItWorks" icon="🧠">
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              A zero-knowledge proof allows you to prove something is true without revealing the underlying information. In this case:
            </p>
            <div className="bg-blue-50 dark:bg-blue-900 rounded p-4 space-y-2">
              <p><strong>What you proved:</strong> &quot;I am 18 years old or older&quot;</p>
              <p><strong>What the server learned:</strong> Your proof is valid</p>
              <p><strong>What was NOT sent:</strong> Your actual birthdate</p>
            </div>
            <p className="text-sm italic">
              The magic happens through cryptographic commitment: we hash your birthdate with a random salt to create a one-way commitment. This proves we knew your birthdate without revealing it.
            </p>
          </div>
        </Section>

        <Section title="What Was Sent to the Server" id="sentData" icon="📤">
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Age Status</p>
              <p className="font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                {publicProof.ageProof ? '✓ Over 18' : '✗ Under 18'}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Cryptographic Commitment (SHA-256 Hash)</p>
              <p className="font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                {publicProof.commitment}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This hash proves we knew your birthdate, but reveals nothing about it.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Proof Timestamp</p>
              <p className="font-mono text-sm text-gray-900 dark:text-gray-100">
                {formatDate(publicProof.timestamp)}
              </p>
            </div>
          </div>
        </Section>

        <Section title="Why This Is Private" id="privacy" icon="🔒">
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">No birthdate is stored or transmitted</p>
                <p className="text-sm">Your actual birth date never leaves your device</p>
              </div>
            </div>

            <div className="flex gap-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">Only age status is revealed</p>
                <p className="text-sm">The server learns you&apos;re 18+, nothing else</p>
              </div>
            </div>

            <div className="flex gap-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">Cryptographic protection</p>
                <p className="text-sm">The commitment is one-way - your date can&apos;t be reverse-engineered</p>
              </div>
            </div>

            <div className="flex gap-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">Proof expires quickly</p>
                <p className="text-sm">Proofs are only valid for 1 hour to prevent replay attacks</p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Verification Process" id="verification" icon="✓">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold text-sm">1</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Client generates proof locally</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your browser hashes your birthdate with a random salt</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold text-sm">2</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Client checks age eligibility</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Verifies you&apos;re 18+ before sending anything</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold text-sm">3</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Public proof is sent to server</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Only commitment, age status, and timestamp are shared</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold text-sm">4</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Server verifies proof</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Checks timestamp and confirms age proof is valid</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold text-sm">✓</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Access is granted</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">You&apos;re verified as 18+ without revealing your birthdate</p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Technical Details" id="technical" icon="⚙️">
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-mono">
            <p><strong>Algorithm:</strong> SHA-256 (Cryptographic Hash Function)</p>
            <p><strong>Salt Length:</strong> 32 bytes (256 bits)</p>
            <p><strong>Salt:</strong> {formatHash(publicProof.commitment)}</p>
            <p><strong>Proof Type:</strong> Commitment-based Zero-Knowledge Proof</p>
            <p><strong>Verification Method:</strong> Hash commitment verification</p>
            <p className="text-gray-600 dark:text-gray-400 mt-3">
              Note: This demo uses cryptographic commitments. Production systems might use more advanced techniques like SNARKs (Succinct Non-Interactive Arguments of Knowledge).
            </p>
          </div>
        </Section>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Generate Another Proof
      </button>
    </div>
  );
}
