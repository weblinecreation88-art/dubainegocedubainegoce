'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface PointRelais {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

interface BoxtalMapWidgetProps {
  onPointSelected: (point: PointRelais | null) => void;
  selectedPoint: PointRelais | null;
}

export function BoxtalMapWidget({ onPointSelected, selectedPoint }: BoxtalMapWidgetProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = process.env.NEXT_PUBLIC_BOXTAL_MAP_ACCESS_TOKEN;

  const initializeMap = useCallback(async () => {
    if (!mapContainerRef.current || mapInstanceRef.current || !accessToken) {
      if (!accessToken) {
        setError('Configuration API manquante');
      }
      return;
    }

    try {
      const { BoxtalParcelPointMap } = await import('@boxtal/parcel-point-map');

      const map = new BoxtalParcelPointMap({
        domToLoadMap: 'boxtal-map-container',
        accessToken: accessToken,
        debug: false,
        config: {
          locale: 'fr',
          parcelPointNetworks: [
            { code: 'MONR' }, // Mondial Relay
            { code: 'SOGP' }, // Relais Colis
          ],
          options: {
            autoSelectNearestParcelPoint: false,
            primaryColor: '#c58a3d',
          },
        },
        onMapLoaded: () => {
          setIsLoaded(true);
          setError(null);
        },
      });

      mapInstanceRef.current = map;

      // Ecouter la selection d'un point relais
      map.onSearchParcelPointsResponse((parcelPoints) => {
        if (parcelPoints && parcelPoints.length > 0) {
          // Les points sont charges, l'utilisateur peut maintenant en selectionner un
        }
      });

      // Rechercher automatiquement les points relais pres de Paris par defaut
      map.searchParcelPoints(
        {
          country: 'FR',
          zipCode: '75001',
          city: 'Paris',
        },
        (selectedParcelPoint) => {
          // Un point a ete selectionne
          if (selectedParcelPoint) {
            const point: PointRelais = {
              id: selectedParcelPoint.code,
              name: selectedParcelPoint.name,
              address: selectedParcelPoint.location?.street || '',
              postalCode: selectedParcelPoint.location?.zipCode || '',
              city: selectedParcelPoint.location?.city || '',
              country: selectedParcelPoint.location?.country || 'FR',
            };
            onPointSelected(point);
          }
        }
      );
    } catch (err) {
      console.error('[BoxtalMap] Error initializing map:', err);
      setError('Erreur lors du chargement de la carte');
    }
  }, [accessToken, onPointSelected]);

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeMap();
    }, 100);

    return () => {
      clearTimeout(timer);
      mapInstanceRef.current = null;
    };
  }, [initializeMap]);

  return (
    <Card className="border-2 border-dashed border-[#c58a3d]/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-[#c58a3d]" />
          Choisir un Point Relais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <p className="text-sm text-red-500 text-center py-2">{error}</p>
        )}

        {/* Point selectionne */}
        {selectedPoint && (
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">{selectedPoint.name}</p>
                <p className="text-sm text-green-700 dark:text-green-300">{selectedPoint.address}</p>
                <p className="text-sm text-green-700 dark:text-green-300">{selectedPoint.postalCode} {selectedPoint.city}</p>
              </div>
            </div>
          </div>
        )}

        {/* Container pour la carte Boxtal */}
        <div
          id="boxtal-map-container"
          ref={mapContainerRef}
          className="w-full h-[400px] rounded-lg overflow-hidden border"
          style={{ minHeight: '400px' }}
        >
          {!isLoaded && !error && (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <div className="h-8 w-8 border-2 border-[#c58a3d] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <p className="text-xs text-muted-foreground text-center">
          Entrez votre adresse dans la carte pour trouver les points relais a proximite, puis cliquez sur un point pour le selectionner.
        </p>
      </CardContent>
    </Card>
  );
}
