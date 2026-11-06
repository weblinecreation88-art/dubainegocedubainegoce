'use client';

import { useState, useEffect, useRef } from 'react';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { getMondialRelayPickupPoints } from '@/lib/mondial-relay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MapPin, Check, AlertCircle, RefreshCw, Search } from 'lucide-react';

interface PickupPointSelectorProps {
  country: string;
  postalCode?: string;
  onSelectPoint: (point: MondialRelayPickupPoint | null) => void;
  selectedPointId?: string;
}

export function PickupPointSelector({
  country = 'FR',
  postalCode = '',
  onSelectPoint,
  selectedPointId,
}: PickupPointSelectorProps) {
  const [selectedPoint, setSelectedPoint] = useState<MondialRelayPickupPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [widgetError, setWidgetError] = useState(false);
  const [searchPostalCode, setSearchPostalCode] = useState(postalCode || '');
  const [isMapVisible, setIsMapVisible] = useState(true);
  const widgetInitializedRef = useRef(false);

  // Synchronise le code postal de l'adresse avec le champ de recherche
  useEffect(() => {
    if (postalCode && postalCode.trim() !== searchPostalCode) {
      setSearchPostalCode(postalCode.trim());
      if (widgetInitializedRef.current && typeof window !== 'undefined' && (window as any).$) {
        try {
          (window as any).$('#Zone_Widget').trigger('MR_DoSearch', [postalCode.trim(), (country || 'FR').toUpperCase()]);
        } catch (e) {
          console.warn('MR_DoSearch trigger:', e);
        }
      }
    }
  }, [postalCode, country]);

  // Chargement dynamique des scripts officiels Mondial Relay (Leaflet + OpenStreetMap 100% GRATUIT)
  useEffect(() => {
    let isCancelled = false;

    async function initMondialRelayWidget() {
      setLoading(true);
      setWidgetError(false);

      try {
        // 1. Feuille de style Leaflet (OpenStreetMap)
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // 2. jQuery (requis par le widget officiel Mondial Relay)
        if (!(window as any).jQuery) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Impossible de charger jQuery'));
            document.head.appendChild(script);
          });
        }

        // 3. Leaflet JS
        if (!(window as any).L) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Impossible de charger Leaflet'));
            document.head.appendChild(script);
          });
        }

        // 4. Plugin officiel Mondial Relay ParcelShopPicker
        if (!(window as any).$?.fn?.MR_ParcelShopPicker) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Impossible de charger le widget Mondial Relay'));
            document.head.appendChild(script);
          });
        }

        if (isCancelled) return;

        // Attente courte que le DOM soit prêt pour monter le widget
        setTimeout(() => {
          if (isCancelled) return;
          const $ = (window as any).$;
          const zoneWidget = $('#Zone_Widget');

          if (!zoneWidget.length) {
            setLoading(false);
            return;
          }

          const targetCountry = (country || 'FR').toUpperCase();
          const targetPostCode = postalCode || searchPostalCode || '75001';
          const brandCode = process.env.NEXT_PUBLIC_MONDIAL_RELAY_BRAND || 'BDTEST';

          try {
            zoneWidget.MR_ParcelShopPicker({
              Target: '#Retour_Widget',
              Brand: brandCode,
              Country: targetCountry,
              PostCode: targetPostCode,
              ColLivMod: '24R',
              Responsive: true,
              ShowResultsOnMap: true,
              EnableGmap: false, // Force Leaflet + OpenStreetMap (100% gratuit)
              MapScrollWheel: false,
              OnParcelShopSelected: function (data: any) {
                const point: MondialRelayPickupPoint = {
                  id: String(data.ID || data.Id || data.PUP || ''),
                  name: String(data.Nom || 'Point Relais Mondial Relay'),
                  address: String(data.Adresse1 || data.Adresse || ''),
                  postalCode: String(data.CP || data.Cp || ''),
                  city: String(data.Ville || ''),
                  country: String(data.Pays || targetCountry),
                };

                setSelectedPoint(point);
                onSelectPoint(point);
                setIsMapVisible(false);
              },
            });

            widgetInitializedRef.current = true;
            setLoading(false);
          } catch (initErr) {
            console.error('Erreur initialisation MR_ParcelShopPicker :', initErr);
            setWidgetError(true);
            setLoading(false);
          }
        }, 150);
      } catch (err) {
        console.warn('Le chargement du widget Mondial Relay a échoué (adblocker ou réseau) :', err);
        if (!isCancelled) {
          setWidgetError(true);
          setLoading(false);
        }
      }
    }

    initMondialRelayWidget();

    return () => {
      isCancelled = true;
    };
  }, [country]);

  // Déclencher une recherche manuelle de code postal dans le widget
  const handleSearchPostalCode = () => {
    if (!searchPostalCode.trim()) return;
    if (widgetInitializedRef.current && typeof window !== 'undefined' && (window as any).$) {
      try {
        (window as any).$('#Zone_Widget').trigger('MR_DoSearch', [searchPostalCode.trim(), (country || 'FR').toUpperCase()]);
      } catch (e) {
        console.warn('MR_DoSearch error:', e);
      }
    }
  };

  // Fallback si le widget officiel externe est bloqué (par un adblocker par ex)
  const [fallbackPoints, setFallbackPoints] = useState<MondialRelayPickupPoint[]>([]);
  useEffect(() => {
    if (widgetError) {
      getMondialRelayPickupPoints(country, searchPostalCode).then((pts) => {
        setFallbackPoints(pts);
      });
    }
  }, [widgetError, country, searchPostalCode]);

  return (
    <div className="space-y-3">
      {/* 1. Point sélectionné (si l'utilisateur en a choisi un) */}
      {selectedPoint && (
        <Card className="border-green-300 bg-green-50/80 dark:bg-green-950/40">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full text-green-700 dark:text-green-300 shrink-0 mt-0.5">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-green-950 dark:text-green-100 flex items-center gap-1.5">
                    <span>Point Relais / Locker sélectionné :</span>
                  </div>
                  <div className="font-semibold text-base mt-0.5 text-foreground">{selectedPoint.name}</div>
                  <div className="text-xs text-muted-foreground">{selectedPoint.address}</div>
                  <div className="text-xs font-medium text-foreground">
                    {selectedPoint.postalCode} {selectedPoint.city} ({selectedPoint.country})
                  </div>
                  <div className="text-[11px] text-green-700 dark:text-green-300 mt-1">
                    ✓ Colis disponible 8 jours • Notification par email dès l'arrivée
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsMapVisible(true)}
                className="shrink-0 text-xs border-green-300 hover:bg-green-100 dark:hover:bg-green-900"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Changer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. Barre de recherche de code postal */}
      {isMapVisible && (
        <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg border">
          <MapPin className="h-4 w-4 text-accent shrink-0 ml-1" />
          <Input
            type="text"
            placeholder="Code postal ou ville (ex: 75011, Lyon, 69002...)"
            value={searchPostalCode}
            onChange={(e) => setSearchPostalCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchPostalCode())}
            className="h-8 text-xs bg-background"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleSearchPostalCode}
            className="h-8 text-xs bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
          >
            <Search className="h-3.5 w-3.5 mr-1" />
            Chercher
          </Button>
        </div>
      )}

      {/* 3. Carte interactive officielle Mondial Relay (OpenStreetMap / Leaflet) */}
      <div className={!isMapVisible && selectedPoint ? 'hidden' : 'block'}>
        {loading && (
          <div className="p-8 text-center border rounded-lg bg-card space-y-2">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" />
            <p className="text-xs text-muted-foreground">Chargement de la carte des Lockers et Points Relais...</p>
          </div>
        )}

        {/* Zone où Mondial Relay injecte la carte et la liste */}
        <div
          id="Zone_Widget"
          className="w-full min-h-[480px] rounded-lg border bg-background overflow-hidden text-xs shadow-sm"
          style={{ minHeight: '480px' }}
        />
        <input type="hidden" id="Retour_Widget" />
      </div>

      {/* 4. Solution de secours en cas de blocage CDN */}
      {widgetError && (
        <Card className="border-amber-300 bg-amber-50/70 dark:bg-amber-950/30">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Points relais disponibles à proximité :</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {fallbackPoints.map((pt) => (
                <div
                  key={pt.id}
                  onClick={() => {
                    setSelectedPoint(pt);
                    onSelectPoint(pt);
                    setIsMapVisible(false);
                  }}
                  className="p-2.5 bg-background border rounded hover:border-accent cursor-pointer transition-colors text-xs flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">{pt.name}</div>
                    <div className="text-muted-foreground">{pt.address} - {pt.postalCode} {pt.city}</div>
                  </div>
                  <Button type="button" size="sm" variant="ghost" className="h-7 text-xs text-accent">
                    Choisir
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedPoint && (
        <div className="flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded border border-amber-200 dark:border-amber-900">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span>Cliquez sur le point relais ou le Locker de votre choix sur la carte ci-dessus.</span>
        </div>
      )}
    </div>
  );
}
