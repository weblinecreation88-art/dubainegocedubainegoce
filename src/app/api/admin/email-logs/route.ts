import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/firebase/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    // Récupérer tous les logs des emails
    const logsSnapshot = await firestore
      .collection('emailLogs')
      .orderBy('sentAt', 'desc')
      .limit(1000)
      .get();

    const logs = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      sentAt: doc.data().sentAt // Garder le timestamp Firestore
    }));

    return NextResponse.json({
      success: true,
      logs,
      total: logs.length
    });
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        logs: []
      },
      { status: 500 }
    );
  }
}
