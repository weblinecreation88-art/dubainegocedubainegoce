import { notFound } from 'next/navigation';

export default function CatchAllPage() {
  // Les redirections permanentes (301) sont gérées par next.config.mjs
  // Cette route ne s'active que pour les URLs non mappées
  // → Retourner 404 au lieu de rediriger
  notFound();
}
