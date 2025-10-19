import { verifyAgeProof } from '@/lib/zk-age';

interface ProofRequest {
  commitment: string;
  ageProof: boolean;
  timestamp: number;
}

export async function POST(request: Request) {
  try {
    const body: ProofRequest = await request.json();

    // Validate request structure
    if (!body.commitment || typeof body.ageProof !== 'boolean' || !body.timestamp) {
      return Response.json(
        { error: 'Invalid proof structure' },
        { status: 400 }
      );
    }

    // Verify the proof (without birthdate, just structure and timestamp validation)
    const result = verifyAgeProof({
      commitment: body.commitment,
      ageProof: body.ageProof,
      timestamp: body.timestamp,
      salt: '', // We don't have the salt in public proof
    });

    return Response.json({
      isValid: result.isValid,
      message: result.message,
      timestamp: new Date().toLocaleString(),
    });
  } catch (error) {
    console.error('Proof verification error:', error);
    return Response.json(
      { error: 'Failed to verify proof' },
      { status: 500 }
    );
  }
}
