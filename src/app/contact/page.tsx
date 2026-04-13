
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Contactez-nous',
    description: 'Une question ou une suggestion ? Contactez l\'équipe de DubaiNegoce.',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline">Contactez-nous</CardTitle>
                    <CardDescription>
                        Nous sommes à votre écoute pour toute question ou suggestion.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input id="name" placeholder="Votre nom complet" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Votre adresse email" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Sujet</Label>
                            <Input id="subject" placeholder="L'objet de votre message" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Écrivez votre message ici..." rows={6} />
                        </div>
                        <Button type="submit" className="w-full" size="lg">Envoyer le message</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
