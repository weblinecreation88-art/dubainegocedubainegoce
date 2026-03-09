'use client';

import { useState, useEffect } from 'react';
import { getMondialRelayPickupPoints, type MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, MapPin, AlertCircle, ExternalLink } from 'lucide-react';
import { validatePostalCode } from '@/lib/checkout-utils';

interface PickupPointSelectorProps {
  country: string;
  onSelectPoint: (point: MondialRelayPickupPoint | null) => void;
  selectedPointId?: string;
}

export function PickupPointSelector({
  country,
  onSelectPoint,
  selectedPointId,
}: PickupPointSelectorProps) {
  const [postalCode, setPostalCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<MondialRelayPickupPoint[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'search' | 'manual'>('search');

  const handleSearch = async () => {
    setError(null);
    setPoints([]);

    // Validate postal code
    if (!validatePostalCode(postalCode, country)) {
      setError(`Code postal invalide pour ${country}`);
      return;
    }

    setLoading(true);
    try {
      const pickupPoints = await getMondialRelayPickupPoints(country, postalCode);

      if (pickupPoints.length === 0) {
        setError('Aucun point relais trouvé pour ce code postal');
      } else {
        // Sort by distance if available, closest first
        const sorted = [...pickupPoints].sort((a, b) => {
          if (a.distance && b.distance) {
            return a.distance - b.distance;
          }
          return 0;
        });
        setPoints(sorted);
        // Auto-select the closest one
        onSelectPoint(sorted[0]);
      }
      setSearched(true);
    } catch (err) {
      setError('Erreur lors de la recherche des points relais');
      console.error('Pickup point search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMondialRelayUrl = () => {
    const baseUrl = 'https://www.mondialrelay.fr/trouver-un-relais/';
    if (postalCode) {
      return `${baseUrl}?zipcode=${postalCode}`;
    }
    return baseUrl;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">📍 Sélectionnez votre point relais</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Recherchez un point relais Mondial Relay pour votre livraison
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setSelectedTab('search')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            selectedTab === 'search'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          🔍 Chercher
        </button>
        <button
          onClick={() => setSelectedTab('manual')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            selectedTab === 'manual'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          ✏️ Code relais
        </button>
      </div>

      {/* Tab 1: Search Mode */}
      {selectedTab === 'search' && (
        <>
          {/* Search Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recherche par code postal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Entrez votre code postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  disabled={loading || !postalCode.trim()}
                  onClick={handleSearch}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Recherche...
                    </>
                  ) : (
                    'Rechercher'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* External Link to Mondial Relay */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Chercher sur le site officiel
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-300 mb-3">
                    Accédez au localisateur officiel Mondial Relay pour voir tous les points relais disponibles et obtenir leurs codes.
                  </p>
                  <a
                    href={getMondialRelayUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                  >
                    Ouvrir Mondial Relay
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Tab 2: Manual Code Mode */}
      {selectedTab === 'manual' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Entrer le code du point relais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="manual-code" className="text-sm mb-2 block">
                Code ou numéro du point relais
              </Label>
              <Input
                id="manual-code"
                type="text"
                placeholder="Ex: 123456 ou MR75001"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Vous trouverez le code sur le site Mondial Relay après avoir sélectionné votre point relais
              </p>
            </div>
            <Button
              type="button"
              disabled={!manualCode.trim()}
              onClick={() => {
                // Create a virtual point with the manual code
                const manualPoint: MondialRelayPickupPoint = {
                  id: manualCode,
                  name: `Point Mondial Relay - Code ${manualCode}`,
                  address: 'Voir details sur mondialrelay.fr',
                  postalCode: '',
                  city: 'À confirmer',
                  country: country,
                };
                onSelectPoint(manualPoint);
              }}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Confirmer le code
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex gap-2 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Pickup Points List - Only show in search tab */}
      {selectedTab === 'search' && points.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {points.length} point{points.length > 1 ? 's' : ''} disponible{points.length > 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedPointId || ''} onValueChange={(pointId) => {
              const selected = points.find(p => p.id === pointId);
              onSelectPoint(selected || null);
            }}>
              <div className="space-y-3">
                {points.map((point) => (
                  <div
                    key={point.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <RadioGroupItem value={point.id} id={point.id} className="mt-1" />
                    <Label
                      htmlFor={point.id}
                      className="flex-1 cursor-pointer space-y-1"
                    >
                      <div className="font-semibold text-sm">{point.name}</div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div>{point.address}</div>
                        <div>{point.postalCode} {point.city}</div>
                        {point.distance && (
                          <div className="text-accent">
                            À {point.distance.toFixed(1)} km
                          </div>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {selectedTab === 'search' && searched && points.length === 0 && !error && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun point relais trouvé. Essayez un autre code postal.</p>
        </div>
      )}
    </div>
  );
}
