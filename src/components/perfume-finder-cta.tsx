
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { PerfumeFinder } from './perfume-finder';
import Image from 'next/image';

export function PerfumeFinderCta() {
    return (
        <Dialog>
            <Card className="overflow-hidden bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-secondary/20">
                <div className="grid md:grid-cols-2 items-center">
                    <div className="p-8 md:p-12">
                        <CardHeader className="p-0">
                            <div className="flex items-center gap-3 text-secondary mb-2">
                                <Sparkles className="h-6 w-6"/>
                            </div>
                            <CardTitle className="text-3xl font-headline text-gradient-yara">Vous n'êtes pas sûr ?</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mt-4">
                            <CardDescription className="text-lg">
                                Laissez notre expert en parfums vous guider. Répondez à quelques questions et trouvez le sillage qui vous correspond parfaitement.
                            </CardDescription>
                            <DialogTrigger asChild>
                                <Button size="lg" className="mt-6 group bg-gradient-yara hover:opacity-90 text-white border-0">
                                    Trouver mon parfum
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </DialogTrigger>
                        </CardContent>
                    </div>
                    <div className="relative h-64 md:h-full w-full">
                         <Image 
                            src="https://res.cloudinary.com/dzntnjtkc/image/upload/v1766756828/vanilla_so_sweet_mydhls.png"
                            alt="Recherche de parfum par IA"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            data-ai-hint="perfume finder elegant"
                         />
                    </div>
                </div>
            </Card>

            <DialogContent className="sm:max-w-4xl">
                 <DialogHeader>
                    <DialogTitle className="text-3xl font-headline text-gradient-yara text-center">Votre Sillage Unique</DialogTitle>
                    <DialogDescription className="text-center">
                       Laissez-nous vous guider vers le parfum de vos rêves.
                    </DialogDescription>
                </DialogHeader>
                <PerfumeFinder />
            </DialogContent>
        </Dialog>
    );
}
