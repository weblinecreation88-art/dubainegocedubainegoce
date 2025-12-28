'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export function GoogleReviewsCta() {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800">
      <CardContent className="p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Texte à gauche */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col items-center md:items-start gap-3">
              <Image
                src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                alt="Google"
                width={100}
                height={32}
                className="h-8"
              />
              <h2 className="text-2xl md:text-3xl font-headline font-bold">Votre avis compte!</h2>
            </div>

            <p className="text-muted-foreground text-lg">
              Vous avez aimé votre expérience DubaiNegoce? Partagez votre avis sur Google et aidez d'autres passionnés de parfums à découvrir nos trésors olfactifs.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Bouton à droite */}
          <div className="flex-shrink-0">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg px-8 py-6 h-auto"
            >
              <a
                href="https://g.page/r/CYfNDXizM9KSEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Laisser un avis
                <ExternalLink className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
