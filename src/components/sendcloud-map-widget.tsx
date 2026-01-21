'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Check, Navigation } from 'lucide-react';

export interface PointRelais {
    id: string;
    name: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
}

interface SendcloudMapWidgetProps {
    onPointSelected: (point: PointRelais | null) => void;
    selectedPoint: PointRelais | null;
}

declare global {
    interface Window {
        sendcloud?: {
            servicePoints: {
                open: (
                    config: any,
                    successCallback: (servicePoint: any, postNumber: string) => void,
                    failureCallback: (errors: string[]) => void
                ) => void;
            };
        };
    }
}

export function SendcloudMapWidget({ onPointSelected, selectedPoint }: SendcloudMapWidgetProps) {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_SENDCLOUD_ID;

    // Charger le script SendCloud
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Verifier si le script est deja charge
        if (window.sendcloud) {
            setIsScriptLoaded(true);
            return;
        }

        const existingScript = document.querySelector('script[src*="sendcloud.sc/spp"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => setIsScriptLoaded(true));
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://embed.sendcloud.sc/spp/1.0.0/api.min.js';
        script.async = true;
        script.onload = () => {
            setIsScriptLoaded(true);
        };
        script.onerror = () => {
            setError('Erreur lors du chargement du service de points relais');
        };
        document.body.appendChild(script);

        return () => {
            // Ne pas supprimer le script car il peut etre reutilise
        };
    }, []);

    const openServicePointPicker = useCallback(() => {
        if (!window.sendcloud || !apiKey) {
            setError('Service de points relais non disponible');
            return;
        }

        setIsLoading(true);
        setError(null);

        const config = {
            apiKey: apiKey,
            country: 'fr',
            language: 'fr-fr',
            carriers: 'mondial_relay,colissimo,chronopost',
        };

        window.sendcloud.servicePoints.open(
            config,
            (servicePoint: any, postNumber: string) => {
                setIsLoading(false);
                console.log('[SendCloud] Point selectionne:', servicePoint);

                if (servicePoint) {
                    const point: PointRelais = {
                        id: String(servicePoint.id),
                        name: servicePoint.name || '',
                        address: [servicePoint.street, servicePoint.house_number].filter(Boolean).join(' '),
                        postalCode: servicePoint.postal_code || '',
                        city: servicePoint.city || '',
                        country: servicePoint.country || 'FR',
                    };
                    onPointSelected(point);
                }
            },
            (errors: string[]) => {
                setIsLoading(false);
                if (errors && errors.length > 0) {
                    console.error('[SendCloud] Erreurs:', errors);
                    // Ne pas afficher d'erreur si l'utilisateur a juste ferme la popup
                    if (!errors.includes('closed')) {
                        setError('Erreur lors de la selection du point relais');
                    }
                }
            }
        );
    }, [apiKey, onPointSelected]);

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
                            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-green-800 dark:text-green-200">{selectedPoint.name}</p>
                                <p className="text-sm text-green-700 dark:text-green-300">{selectedPoint.address}</p>
                                <p className="text-sm text-green-700 dark:text-green-300">{selectedPoint.postalCode} {selectedPoint.city}</p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                {/* Bouton pour ouvrir le selecteur */}
                <Button
                    onClick={openServicePointPicker}
                    disabled={!isScriptLoaded || isLoading || !apiKey}
                    className="w-full bg-[#c58a3d] hover:bg-[#b67a2d] text-white"
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Chargement...
                        </>
                    ) : (
                        <>
                            <Navigation className="h-4 w-4 mr-2" />
                            {selectedPoint ? 'Changer de point relais' : 'Trouver un point relais'}
                        </>
                    )}
                </Button>

                {!apiKey && (
                    <p className="text-xs text-red-500 text-center">
                        Configuration SendCloud manquante
                    </p>
                )}

                <p className="text-xs text-muted-foreground text-center">
                    Mondial Relay, Colissimo, Chronopost disponibles
                </p>
            </CardContent>
        </Card>
    );
}
