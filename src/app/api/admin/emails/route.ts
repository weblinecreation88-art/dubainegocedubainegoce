import { firestore } from '@/firebase/server-only';
import { collection, getDocs } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const emailsSnapshot = await getDocs(collection(firestore, 'emailLogs'));
    const emails: any[] = [];

    emailsSnapshot.forEach((doc) => {
      const data = doc.data();
      emails.push({
        id: doc.id,
        type: data.type || 'unknown',
        recipient: data.recipient || data.email || 'unknown',
        subject: data.subject || 'Sans objet',
        status: data.status || 'sent',
        opened: data.opened || false,
        clicked: data.clicked || false,
        sentAt: data.sentAt?.toDate?.() || new Date(data.sentAt),
      });
    });

    // Sort by date (newest first)
    emails.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());

    return NextResponse.json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
