'use client';

import { useState, useEffect } from 'react';
import { getMondialRelayPickupPoints, type MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, MapPin, AlertCircle, Check } from 'lucide-react';
import { validatePostalCode } from '@/lib/checkout-utils';

interface PickupPointSelectorProps {
  country: string;
  postalCode?: string;
  onSelectPoint: (point: MondialRelayPickupPoint | null) => void;
  selectedPointId?: string;
}

export function PickupPointSelector({
  country,
  postalCode,
  onSelectPoint,
  selectedPointId,
}: PickupPointSelectorProps) {
  const [manualSearchCode, setManualSearchCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<MondialRelayPickupPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MondialRelayPickupPoint | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load pickup points for the country when component mounts or country changes
  useEffect(() => {
    loadAvailablePoints();
  }, [country]);

  const loadAvailablePoints = async () => {
    try {
      setLoading(true);
      setError(null);

      const pickupPoints = await getMondialRelayPickupPoints(country, '');

      if (pickupPoints.length === 0) {
        setError('Aucun point relais trouvé pour ce pays');
        setSelectedPoint(null);
      } else {
        setPoints(pickupPoints);
        // Don't auto-select - let user choose manually
        setSelectedPoint(null);
        onSelectPoint(null);
      }
    } catch (err) {
      console.error('Error selecting pickup point:', err);
      setError('Erreur lors de la sélection du point relais');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!manualSearchCode.trim()) {
        setError('Veuillez entrer un code');
        return;
      }

      // Create virtual point from code
      const manualPoint: MondialRelayPickupPoint = {
        id: manualSearchCode,
        name: `Point Mondial Relay - Code ${manualSearchCode}`,
        address: 'À confirmer sur le site Mondial Relay',
        postalCode: postalCode || '',
        city: 'À confirmer',
        country: country,
      };

      setSelectedPoint(manualPoint);
      onSelectPoint(manualPoint);
      setManualSearchCode('');
      setShowDetails(false);
    } catch (err) {
      console.error('Error with manual code:', err);
      setError('Erreur lors de la saisie du code');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while auto-selecting
  if (loading && !selectedPoint) {
    return (
      <Card className="border-accent/50 bg-accent/5">
        <CardContent className="pt-6 text-center space-y-3">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" />
          <p className="text-sm font-medium">Sélection du point relais le plus proche...</p>
        </CardContent>
      </Card>
    );
  }

  // Show selected point
  if (selectedPoint) {
    return (
      <div className="space-y-4">
        {/* Success Message */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Point relais sélectionné
                </p>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  Le point relais le plus proche a été sélectionné. Une confirmation sera envoyée par SMS et email.
                </p>

                {/* Selected Point Details */}
                <div className="mt-4 bg-white dark:bg-slate-950 rounded p-3 space-y-2">
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    📍 {selectedPoint.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {selectedPoint.address}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {selectedPoint.postalCode} {selectedPoint.city}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optional: Change point */}
        <details
          className="border rounded-lg cursor-pointer"
          open={showDetails}
          onToggle={() => setShowDetails(!showDetails)}
        >
          <summary className="px-4 py-3 font-medium text-sm hover:bg-muted transition-colors">
            🔧 Changer de point relais (optionnel)
          </summary>

          <div className="border-t p-4 space-y-4 bg-muted/30">
            {/* Manual Code Entry */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="manual-code" className="text-sm">
                  Entrez le code d'un autre point relais
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Trouvez un code sur <a href={`https://www.mondialrelay.fr/ww2/public/mr_pointrelais.aspx?s_cp=${postalCode}`} target="_blank" rel="noopener noreferrer" className="text-accent underline">le site Mondial Relay</a>
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  id="manual-code"
                  type="text"
                  placeholder="Ex: MR75001"
                  value={manualSearchCode}
                  onChange={(e) => setManualSearchCode(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  disabled={loading || !manualSearchCode.trim()}
                  onClick={handleManualSearch}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  size="sm"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Valider'}
                </Button>
              </div>
            </div>

            {/* Available Points List */}
            {points.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Autres points disponibles:</p>
                <RadioGroup
                  value={selectedPoint.id}
                  onValueChange={(pointId) => {
                    const selected = points.find(p => p.id === pointId);
                    if (selected) {
                      setSelectedPoint(selected);
                      onSelectPoint(selected);
                      setShowDetails(false);
                    }
                  }}
                >
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {points.map((point) => (
                      <div
                        key={point.id}
                        className="flex items-start space-x-3 p-2 border rounded hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value={point.id} id={point.id} className="mt-1" />
                        <Label
                          htmlFor={point.id}
                          className="flex-1 cursor-pointer text-sm space-y-0.5"
                        >
                          <div className="font-medium">{point.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {point.address}
                          </div>
                          {point.distance && (
                            <div className="text-xs text-accent">
                              À {point.distance.toFixed(1)} km
                            </div>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        </details>

        {error && (
          <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-red-900 dark:text-red-100">{error}</p>
              <p className="text-sm text-red-800 dark:text-red-200 mt-2">
                Vérifiez votre code postal et réessayez.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show list to select from if nothing selected yet
  if (points.length > 0 && !selectedPoint) {
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">Sélectionnez un point relais:</p>
        <RadioGroup
          value=""
          onValueChange={(pointId: string) => {
            const selected = points.find((p: MondialRelayPickupPoint) => p.id === pointId);
            if (selected) {
              setSelectedPoint(selected);
              onSelectPoint(selected);
            }
          }}
        >
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {points.map((point) => (
              <div
                key={point.id}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/10 cursor-pointer transition-colors"
              >
                <RadioGroupItem value={point.id} id={point.id} className="mt-1 flex-shrink-0" />
                <Label htmlFor={point.id} className="flex-1 cursor-pointer space-y-1">
                  <div className="font-medium text-sm">{point.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {point.address}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {point.postalCode} {point.city}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Card className="border-accent/50 bg-accent/5">
        <CardContent className="pt-6 text-center space-y-3">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" />
          <p className="text-sm font-medium">Chargement des points relais...</p>
        </CardContent>
      </Card>
    );
  }

  // Empty state - shouldn't happen
  return (
    <Card>
      <CardContent className="pt-6 text-center text-muted-foreground">
        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Aucun point relais disponible pour ce pays</p>
      </CardContent>
    </Card>
  );
}
