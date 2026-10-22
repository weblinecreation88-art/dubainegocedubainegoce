import { NextResponse } from 'next/server';

// This shop no longer accepts PayPal payments.
export async function POST() {
  return NextResponse.json(
    { error: 'Ce moyen de paiement n’est plus proposé. Veuillez payer par carte bancaire.' },
    { status: 410 }
  );
}
