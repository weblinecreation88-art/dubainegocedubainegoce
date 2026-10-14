import { firestore } from '@/firebase/server';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/**
 * Liste toutes les commandes, tous clients confondus.
 *
 * Les commandes sont ecrites dans users/{uid}/orders : une lecture de la
 * collection racine `orders` renvoyait une liste vide, et le back-office
 * n'affichait donc jamais aucune commande. On interroge le groupe de
 * collections pour les recuperer toutes.
 */
export async function GET(req: NextRequest) {
  // La liste contient nom, e-mail, telephone et adresse des clients.
  const admin = await requireAdmin(req);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  if (!firestore) {
    return NextResponse.json({ error: 'Firestore non configuré.' }, { status: 500 });
  }

  try {
    const snapshot = await firestore.collectionGroup('orders').get();

    const orders = snapshot.docs.map((doc) => {
      const data = doc.data() as Record<string, any>;
      return {
        id: doc.id,
        // Chemin users/{uid}/orders/{orderId} : le uid est necessaire pour
        // cibler la commande lors d'une mise a jour (expedition).
        userId: data.userId || doc.ref.parent.parent?.id || null,
        ...data,
      };
    });

    orders.sort((a: any, b: any) => {
      const ta = new Date(a.orderDate || a.createdAt || 0).getTime();
      const tb = new Date(b.orderDate || b.createdAt || 0).getTime();
      return tb - ta;
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
