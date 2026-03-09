'use client';

import { useState, useEffect } from 'react';
import { getMondialRelayPickupPoints, type MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<MondialRelayPickupPoint[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">📍 Sélectionnez votre point relais</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Recherchez les points Mondial Relay disponibles dans votre région
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Recherche par code postal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Entrez votre code postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !postalCode.trim()}
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
          </form>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="flex gap-2 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Pickup Points List */}
      {points.length > 0 && (
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
      {searched && points.length === 0 && !error && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun point relais trouvé. Essayez un autre code postal.</p>
        </div>
      )}

      {/* Help Text */}
      {!searched && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 Entrez votre code postal pour voir les points relais Mondial Relay disponibles près de chez vous.
          </p>
        </div>
      )}
    </div>
  );
}
