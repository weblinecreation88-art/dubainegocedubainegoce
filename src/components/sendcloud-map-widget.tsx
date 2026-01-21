'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

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

export function SendcloudMapWidget({ onPointSelected, selectedPoint }: SendcloudMapWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Injecter script Sendcloud
        const script = document.createElement('script');
        script.src = "https://embed.sendcloud.sc/spp/v1.0.0/api.min.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const config = {
            // Clé d'intégration Sendcloud
            apiKey: process.env.NEXT_PUBLIC_SENDCLOUD_ID,
            country: 'fr',
            language: 'fr-fr',
            servicePointId: selectedPoint?.id || null,
            postNumber: null
        };

        const handleSelection = (data: any) => {
            if (!data || !data.id) return;

            console.log("Sendcloud Selection:", data);

            const point: PointRelais = {
                id: String(data.id),
                name: data.name,
                address: data.street + ' ' + data.house_number,
                postalCode: data.postal_code,
                city: data.city,
                country: data.country
            };

            onPointSelected(point);
        };

        // Attendre que l'objet sendcloud soit disponible
        const interval = setInterval(() => {
            if ((window as any).sendcloud) {
                clearInterval(interval);
                const elem = containerRef.current;
                if (elem) {
                    (window as any).sendcloud.servicePoints.render(
                        elem,
                        config,
                        handleSelection
                    );
                }
            }
        }, 500);

        return () => clearInterval(interval);

    }, [onPointSelected, selectedPoint]);


    return (
        <Card className="border-2 border-dashed border-[#c58a3d]/30 overflow-hidden">
            <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-900/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-[#c58a3d]" />
                    Point de retrait (Mondial Relay / Chronopost / Colissimo)
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div
                    ref={containerRef}
                    style={{ width: '100%', height: '500px' }}
                    className="min-h-[500px] w-full"
                >
                    <div className="flex h-full items-center justify-center text-muted-foreground p-8">
                        Chargement de la carte des points relais...
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
