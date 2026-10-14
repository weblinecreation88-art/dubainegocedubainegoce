/**
 * Liste des administrateurs, partagee entre le navigateur et le serveur.
 * Source : NEXT_PUBLIC_ADMIN_EMAILS (apphosting.yaml), separees par des virgules.
 * La securite reelle est assuree cote serveur par requireAdmin() ;
 * cote client, cette liste sert seulement a afficher ou masquer l'interface.
 */
export const ADMIN_EMAIL_LIST: string[] = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'weblinecreation88@gmail.com'
)
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAIL_LIST.includes(email.toLowerCase());
}
