
export function AnnouncementBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="h-10 w-full whitespace-nowrap">
          <div className="animate-marquee py-2.5">
            <span className="mx-4 font-semibold">🎁 Livraison Mondial Relay OFFERTE dès maintenant !</span>
            <span className="mx-4">💎 Tous nos parfums authentiques à prix unique : 35€</span>
            <span className="mx-4">✨ 100% Authentiques - Importés directement de Dubaï</span>
            <span className="mx-4 font-semibold">🎁 Livraison Mondial Relay OFFERTE dès maintenant !</span>
            <span className="mx-4">💎 Tous nos parfums authentiques à prix unique : 35€</span>
            <span className="mx-4">✨ 100% Authentiques - Importés directement de Dubaï</span>
          </div>
        </div>
      </div>
    </div>
  );
}
