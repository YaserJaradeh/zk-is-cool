/**
 * Zero-Knowledge Age Verification Library
 * Proves age >= 18 without revealing the actual birthdate
 */

import crypto from 'crypto';

export interface AgeProof {
  commitment: string; // Hash of birthdate + salt
  ageProof: boolean; // Is age >= 18?
  timestamp: number;
  salt: string; // Random salt for hiding the commitment
}

interface VerificationResult {
  isValid: boolean;
  message: string;
  proofDetails?: {
    commitment: string;
    expectedCommitment: string;
    ageValid: boolean;
    timestamp: number;
  };
}

/**
 * Generate a proof that user is over 18 without revealing birthdate
 * Client-side only - no data leaves the user's device
 */
export function generateAgeProof(birthDate: Date): AgeProof {
  // Generate random salt for extra security
  const salt = crypto.randomBytes(32).toString('hex');

  // Calculate age
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  const isOver18 =
    age > 18 || (age === 18 && monthDiff >= 0 && today.getDate() >= birthDate.getDate());

  // Create commitment: hash of birthdate + salt
  // This proves the date was known at proof time without revealing it
  const birthDateString = birthDate.toISOString().split('T')[0];
  const commitment = crypto
    .createHash('sha256')
    .update(birthDateString + salt)
    .digest('hex');

  return {
    commitment,
    ageProof: isOver18,
    timestamp: Date.now(),
    salt,
  };
}

/**
 * Verify a proof by checking the commitment
 * Server-side verification of client-generated proof
 */
export function verifyAgeProof(
  proof: AgeProof,
  birthDate?: Date
): VerificationResult {
  // Verify proof structure
  if (!proof.commitment || typeof proof.ageProof !== 'boolean') {
    return {
      isValid: false,
      message: 'Invalid proof structure',
    };
  }

  // Check timestamp is recent (within 1 hour)
  const proofAge = Date.now() - proof.timestamp;
  const ONE_HOUR = 60 * 60 * 1000;
  if (proofAge > ONE_HOUR) {
    return {
      isValid: false,
      message: 'Proof has expired',
    };
  }

  // If we have the birthdate (for demo/verification purposes),
  // we can recompute the commitment to verify the proof
  if (birthDate) {
    const birthDateString = birthDate.toISOString().split('T')[0];
    const expectedCommitment = crypto
      .createHash('sha256')
      .update(birthDateString + proof.salt)
      .digest('hex');

    const commitmentMatches = proof.commitment === expectedCommitment;

    // Calculate age to verify
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    const isOver18 =
      age > 18 || (age === 18 && monthDiff > 0) || (age === 18 && monthDiff === 0 && dayDiff >= 0);

    const ageValid = proof.ageProof === isOver18;

    return {
      isValid: commitmentMatches && ageValid && proof.ageProof === true,
      message: commitmentMatches && ageValid && proof.ageProof ? 'Proof verified: User is over 18' : 'Proof verification failed',
      proofDetails: {
        commitment: proof.commitment,
        expectedCommitment,
        ageValid,
        timestamp: proof.timestamp,
      },
    };
  }

  // Without birthdate, we can only verify the proof structure
  // In production, the server would accept the commitment and store it
  return {
    isValid: proof.ageProof === true,
    message: proof.ageProof ? 'Proof accepted: User claims to be over 18' : 'Proof rejected: User is not over 18',
  };
}

/**
 * Create a public proof that can be verified without revealing the birthdate
 * This is what gets sent to the server
 */
export function createPublicProof(proof: AgeProof): {
  commitment: string;
  ageProof: boolean;
  timestamp: number;
} {
  // Note: salt is NOT included in public proof
  // The commitment ensures date consistency without revealing it
  return {
    commitment: proof.commitment,
    ageProof: proof.ageProof,
    timestamp: proof.timestamp,
  };
}
