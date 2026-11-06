/**
 * Liste des administrateurs, partagee entre le navigateur et le serveur.
 * Source : NEXT_PUBLIC_ADMIN_EMAILS (apphosting.yaml), separees par des virgules.
 * La securite reelle est assuree cote serveur par requireAdmin() ;
 * cote client, cette liste sert seulement a afficher ou masquer l'interface.
 */
const DEFAULT_ADMINS = [
  'weblinecreation88@gmail.com',
  'abderelmalki@gmail.com',
  'maghzaz.nourddine@hotmail.fr',
  'maghzaz.noureddine@outlook.fr',
];

export const ADMIN_EMAIL_LIST: string[] = Array.from(
  new Set([
    ...DEFAULT_ADMINS,
    ...(process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  ])
);

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAIL_LIST.includes(email.toLowerCase());
}
