'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface PointRelais {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

interface MondialRelayWidgetProps {
  onPointSelected: (point: PointRelais | null) => void;
  selectedPoint: PointRelais | null;
}

interface RelayPoint {
  Num: string;
  LgAdr1: string;
  LgAdr3: string;
  CP: string;
  Ville: string;
  Pays: string;
  Latitude: string;
  Longitude: string;
  Horaires_Lundi?: { string: string[] };
  Horaires_Mardi?: { string: string[] };
  Horaires_Mercredi?: { string: string[] };
  Horaires_Jeudi?: { string: string[] };
  Horaires_Vendredi?: { string: string[] };
  Horaires_Samedi?: { string: string[] };
  Horaires_Dimanche?: { string: string[] };
}

export function MondialRelayWidget({ onPointSelected, selectedPoint }: MondialRelayWidgetProps) {
  const [postalCode, setPostalCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [relayPoints, setRelayPoints] = useState<RelayPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const searchRelayPoints = async () => {
    if (!postalCode || postalCode.length < 5) {
      setError('Veuillez entrer un code postal valide (5 chiffres)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Utilise l'API publique de recherche de points relais via un proxy CORS ou directement
      const response = await fetch(`/api/mondial-relay?cp=${postalCode}`);

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const data = await response.json();

      if (data.points && data.points.length > 0) {
        setRelayPoints(data.points);
      } else {
        setError('Aucun point relais trouve. Essayez un autre code postal.');
        setRelayPoints([]);
      }
    } catch (err) {
      setError('Erreur lors de la recherche des points relais');
      setRelayPoints([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPoint = (point: RelayPoint) => {
    const selectedPointData: PointRelais = {
      id: point.Num,
      name: point.LgAdr1,
      address: point.LgAdr3,
      postalCode: point.CP,
      city: point.Ville,
      country: point.Pays || 'FR'
    };
    onPointSelected(selectedPointData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchRelayPoints();
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
        {/* Recherche par code postal */}
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
            onClick={searchRelayPoints}
            disabled={isLoading || postalCode.length < 5}
            className="bg-[#c58a3d] hover:bg-[#b67a2d]"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
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

        {/* Liste des points relais */}
        {relayPoints.length > 0 && (
          <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2">
            {relayPoints.map((point) => (
              <button
                key={point.Num}
                onClick={() => selectPoint(point)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedPoint?.id === point.Num
                    ? 'border-[#c58a3d] bg-[#c58a3d]/10'
                    : 'border-gray-200 hover:border-[#c58a3d]/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-2">
                  <MapPin className={`h-4 w-4 mt-0.5 ${selectedPoint?.id === point.Num ? 'text-[#c58a3d]' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium text-sm">{point.LgAdr1}</p>
                    <p className="text-xs text-muted-foreground">{point.LgAdr3}</p>
                    <p className="text-xs text-muted-foreground">{point.CP} {point.Ville}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Message d'aide */}
        {!selectedPoint && relayPoints.length === 0 && !error && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Entrez votre code postal pour trouver les points relais a proximite
          </p>
        )}
      </CardContent>
    </Card>
  );
}
