'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Package,
    Search,
    Truck,
    CheckCircle,
    Clock,
    MapPin,
    ExternalLink,
    AlertCircle,
    PackageOpen,
} from 'lucide-react';

// Transporteurs supportés et leurs URL de tracking
const CARRIERS = {
    colissimo: {
        name: 'Colissimo',
        trackingUrl: (num: string) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${num}`,
        pattern: /^[A-Z]{2}\d{9}[A-Z]{2}$/,
        example: 'EX123456789FR',
    },
    mondialRelay: {
        name: 'Mondial Relay',
        trackingUrl: (num: string) => `https://www.mondialrelay.fr/suivi-de-colis/?NumColis=${num}`,
        pattern: /^\d{8,14}$/,
        example: '12345678',
    },
};

type CarrierKey = keyof typeof CARRIERS;

function detectCarrier(trackingNumber: string): CarrierKey | null {
    if (CARRIERS.colissimo.pattern.test(trackingNumber.toUpperCase())) return 'colissimo';
    if (CARRIERS.mondialRelay.pattern.test(trackingNumber)) return 'mondialRelay';
    return null;
}

const steps = [
    { icon: <Package className="h-5 w-5" />, label: 'Commande reçue', description: 'Votre commande a été enregistrée.' },
    { icon: <PackageOpen className="h-5 w-5" />, label: 'En préparation', description: 'Votre colis est en cours de préparation.' },
    { icon: <Truck className="h-5 w-5" />, label: 'Expédié', description: 'Votre colis a été remis au transporteur.' },
    { icon: <MapPin className="h-5 w-5" />, label: 'En transit', description: 'Votre colis est en cours d\'acheminement.' },
    { icon: <CheckCircle className="h-5 w-5" />, label: 'Livré', description: 'Votre colis a été livré avec succès.' },
];

export default function SuiviCommandePage() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [carrier, setCarrier] = useState<CarrierKey | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const num = trackingNumber.trim();
        if (!num) {
            setError('Veuillez saisir un numéro de suivi.');
            return;
        }

        const detected = detectCarrier(num);
        if (!detected) {
            // Still allow proceeding with unfamiliar format
            setCarrier(null);
            setError('');
            setSubmitted(true);
            return;
        }

        setCarrier(detected);
        setError('');
        setSubmitted(true);
    };

    const handleTrackExternal = () => {
        if (!carrier) return;
        const url = CARRIERS[carrier].trackingUrl(trackingNumber.trim().toUpperCase());
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleReset = () => {
        setTrackingNumber('');
        setSubmitted(false);
        setCarrier(null);
        setError('');
    };

    return (
        <div className="container max-w-2xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Truck className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold font-headline">Suivi de Commande</h1>
                <p className="text-muted-foreground mt-2">
                    Entrez votre numéro de suivi pour localiser votre colis
                </p>
            </div>

            {!submitted ? (
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Votre numéro de suivi</CardTitle>
                        <CardDescription>
                            Vous pouvez trouver ce numéro dans votre e-mail de confirmation d&apos;expédition.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    id="tracking-number"
                                    placeholder="Ex : EX123456789FR ou 12345678"
                                    value={trackingNumber}
                                    onChange={e => setTrackingNumber(e.target.value)}
                                    className="text-base h-12"
                                    autoFocus
                                />
                                {error && (
                                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3.5 w-3.5" /> {error}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" className="w-full h-12 text-base" size="lg">
                                <Search className="mr-2 h-4 w-4" /> Suivre mon colis
                            </Button>
                        </form>

                        <Separator className="my-6" />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="rounded-lg border p-4 bg-muted/30">
                                <p className="font-semibold mb-1 flex items-center gap-2">
                                    <Truck className="h-4 w-4" /> Colissimo
                                </p>
                                <p className="text-muted-foreground text-xs">Format : EX123456789FR</p>
                                <p className="text-muted-foreground text-xs">Délai : 48h à domicile</p>
                            </div>
                            <div className="rounded-lg border p-4 bg-muted/30">
                                <p className="font-semibold mb-1 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Mondial Relay
                                </p>
                                <p className="text-muted-foreground text-xs">Format : 12345678</p>
                                <p className="text-muted-foreground text-xs">Délai : 3-5j en point relais</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card className="border-2">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Numéro de suivi</p>
                                    <p className="text-xl font-bold font-mono tracking-wider">{trackingNumber.toUpperCase()}</p>
                                </div>
                                {carrier && (
                                    <Badge variant="secondary" className="text-sm px-3 py-1">
                                        {CARRIERS[carrier].name}
                                    </Badge>
                                )}
                            </div>

                            <Separator className="my-5" />

                            {carrier ? (
                                <>
                                    {/* Timeline simplifiée - état "Expédié" actif par défaut */}
                                    <div className="relative">
                                        {steps.map((step, index) => {
                                            const activeIndex = 2; // "Expédié" par défaut
                                            const isCompleted = index < activeIndex;
                                            const isActive = index === activeIndex;
                                            return (
                                                <div key={index} className="flex gap-4 mb-4 last:mb-0">
                                                    <div className="flex flex-col items-center">
                                                        <div
                                                            className={`flex items-center justify-center w-9 h-9 rounded-full border-2 flex-shrink-0 transition-colors ${isCompleted
                                                                    ? 'bg-primary border-primary text-primary-foreground'
                                                                    : isActive
                                                                        ? 'border-primary text-primary bg-primary/10'
                                                                        : 'border-muted-foreground/30 text-muted-foreground/30'
                                                                }`}
                                                        >
                                                            {step.icon}
                                                        </div>
                                                        {index < steps.length - 1 && (
                                                            <div
                                                                className={`w-0.5 h-6 mt-1 ${isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
                                                                    }`}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="pb-2">
                                                        <p
                                                            className={`font-semibold text-sm ${isActive ? 'text-primary' : isCompleted ? '' : 'text-muted-foreground/40'
                                                                }`}
                                                        >
                                                            {step.label}
                                                            {isActive && (
                                                                <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
                                                                    <Clock className="h-3 w-3" /> En cours
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className={`text-xs mt-0.5 ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Separator className="my-5" />

                                    <Button className="w-full" size="lg" onClick={handleTrackExternal}>
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Suivi en temps réel sur {CARRIERS[carrier].name}
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <AlertCircle className="mx-auto h-10 w-10 text-amber-500 mb-3" />
                                    <p className="font-semibold">Format non reconnu automatiquement</p>
                                    <p className="text-sm text-muted-foreground mt-1 mb-5">
                                        Choisissez votre transporteur pour suivre votre colis :
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => window.open(CARRIERS.colissimo.trackingUrl(trackingNumber.toUpperCase()), '_blank', 'noopener,noreferrer')}
                                        >
                                            <Truck className="mr-2 h-4 w-4" /> Colissimo
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => window.open(CARRIERS.mondialRelay.trackingUrl(trackingNumber), '_blank', 'noopener,noreferrer')}
                                        >
                                            <MapPin className="mr-2 h-4 w-4" /> Mondial Relay
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <Button variant="ghost" onClick={handleReset}>
                            ← Suivre un autre colis
                        </Button>
                    </div>

                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="pt-5">
                            <p className="text-sm font-medium mb-2">Besoin d'aide ?</p>
                            <p className="text-sm text-muted-foreground">
                                Si vous ne retrouvez pas votre colis ou si vous avez une question,{' '}
                                <a href="/contact" className="underline underline-offset-2 text-primary hover:text-primary/80">
                                    contactez notre support
                                </a>
                                . Nous vous répondons sous 24h.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
