'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Check, Search, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postalCode, setPostalCode] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);

  const accessToken = process.env.NEXT_PUBLIC_BOXTAL_MAP_ACCESS_TOKEN;

  useEffect(() => {
    console.log('[Boxtal Debug] Environment check:', {
      hasAccessToken: !!accessToken,
      tokenPrefix: accessToken ? accessToken.substring(0, 5) + '...' : 'undefined',
      nodeEnv: process.env.NODE_ENV
    });
  }, [accessToken]);

  const initializeMap = useCallback(async (zipCode: string, city?: string) => {
    if (!mapContainerRef.current || !accessToken) {
      if (!accessToken) {
        setError('Configuration API manquante');
      }
      return;
    }

    // Nettoyer l'ancienne instance si elle existe
    if (mapInstanceRef.current) {
      mapInstanceRef.current = null;
      const container = document.getElementById('boxtal-map-container');
      if (container) {
        container.innerHTML = '';
      }
    }

    setIsLoadingMap(true);
    setError(null);

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
          setIsLoadingMap(false);
          setError(null);
        },
      });

      mapInstanceRef.current = map;

      // Rechercher les points relais avec le code postal fourni
      map.searchParcelPoints(
        {
          country: 'FR',
          zipCode: zipCode,
          city: city || '',
        },
        (selectedParcelPoint: any) => {
          if (selectedParcelPoint) {
            const point: PointRelais = {
              id: selectedParcelPoint.code,
              name: selectedParcelPoint.name,
              address: selectedParcelPoint.location?.street || '',
              postalCode: selectedParcelPoint.location?.zipCode || zipCode,
              city: selectedParcelPoint.location?.city || city || '',
              country: selectedParcelPoint.location?.country || 'FR',
            };
            onPointSelected(point);
          }
        }
      );
    } catch (err) {
      console.error('[BoxtalMap] Error initializing map:', err);
      setError('Erreur lors du chargement de la carte');
      setIsLoadingMap(false);
    }
  }, [accessToken, onPointSelected]);

  const handleSearch = () => {
    if (postalCode.length < 5) {
      setError('Veuillez entrer un code postal valide (5 chiffres)');
      return;
    }
    setShowMap(true);
    setTimeout(() => {
      initializeMap(postalCode);
    }, 100);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('La geolocalisation n\'est pas supportee par votre navigateur');
      return;
    }

    setIsGeolocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Utiliser l'API de reverse geocoding pour obtenir le code postal
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();

          if (data.address && data.address.postcode) {
            const zip = data.address.postcode;
            const city = data.address.city || data.address.town || data.address.village || '';
            setPostalCode(zip);
            setShowMap(true);
            setTimeout(() => {
              initializeMap(zip, city);
            }, 100);
          } else {
            setError('Impossible de determiner votre code postal');
          }
        } catch (err) {
          setError('Erreur lors de la geolocalisation');
        } finally {
          setIsGeolocating(false);
        }
      },
      (err) => {
        setIsGeolocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Vous avez refuse la geolocalisation');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Position non disponible');
            break;
          case err.TIMEOUT:
            setError('Delai de geolocalisation depasse');
            break;
          default:
            setError('Erreur de geolocalisation');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="border-2 border-dashed border-[#c58a3d]/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-[#c58a3d]" />
          Choisir un Point Relais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {/* Etape 1: Entrer le code postal ou utiliser la geolocalisation */}
        {!showMap && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Entrez votre code postal pour trouver les points relais a proximite
            </p>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Code postal (ex: 75001)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                onKeyPress={handleKeyPress}
                className="flex-1"
                maxLength={5}
              />
              <Button
                onClick={handleSearch}
                disabled={postalCode.length < 5}
                className="bg-[#c58a3d] hover:bg-[#b67a2d]"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGeolocation}
              disabled={isGeolocating}
              className="w-full"
            >
              {isGeolocating ? (
                <div className="h-4 w-4 border-2 border-[#c58a3d] border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Navigation className="h-4 w-4 mr-2" />
              )}
              {isGeolocating ? 'Localisation en cours...' : 'Utiliser ma position'}
            </Button>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {/* Etape 2: Afficher la carte */}
        {showMap && (
          <>
            {/* Bouton pour changer de code postal */}
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Code postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                onKeyPress={handleKeyPress}
                className="flex-1"
                maxLength={5}
              />
              <Button
                onClick={handleSearch}
                disabled={postalCode.length < 5 || isLoadingMap}
                size="sm"
                className="bg-[#c58a3d] hover:bg-[#b67a2d]"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Container pour la carte Boxtal */}
            <div
              id="boxtal-map-container"
              ref={mapContainerRef}
              className="w-full h-[400px] rounded-lg overflow-hidden border"
              style={{ minHeight: '400px' }}
            >
              {isLoadingMap && (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center">
                    <div className="h-8 w-8 border-2 border-[#c58a3d] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Cliquez sur un point relais sur la carte pour le selectionner
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
