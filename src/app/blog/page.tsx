
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Blog - DubaiNegoce',
    description: 'Explorez nos articles sur les tendances, les marques et les secrets de la parfumerie orientale.',
};

const blogPosts = [
    {
        title: 'À découvrir cet été 2025 : la marque Alhambra continue de captiver',
        description: 'La marque Alhambra continue de captiver l’univers du bijou senteur avec ses créations uniques pour l\'été 2025.',
        link: '/blog/alhambra-ete-2025',
        imageUrl: 'https://res.cloudinary.com/dhjwimevi/image/upload/v1765958123/ChatGPT_Image_29_juil._2025_01_03_23_f4fvfe.png',
        imageHint: 'perfume display'
    },
    {
        title: 'Parfumerie 2025 : comment la tendance des parfums orientaux redéfinit le marché',
        description: 'La tendance des parfums orientaux redéfinit le marché avec ses notes riches et complexes. Découvrez ce qui vous attend pour 2025.',
        link: '/blog/tendances-parfums-orientaux-2025',
        imageUrl: 'https://res.cloudinary.com/dhjwimevi/image/upload/v1765958235/ChatGPT_Image_17_d%C3%A9c._2025_08_56_48_elcbtv.png',
        imageHint: 'oriental perfume market'
    },
    {
        title: 'Top 5 des parfums Lattafa à absolument tester en 2025',
        description: 'Découvrez notre sélection des incontournables de la maison Lattafa pour l\'année 2025, des fragrances qui marquent les esprits.',
        link: '/blog/top-5-lattafa-2025',
        imageUrl: 'https://res.cloudinary.com/dhjwimevi/image/upload/v1765957474/ChatGPT_Image_17_d%C3%A9c._2025_08_44_19_neymoa.png',
        imageHint: 'Lattafa perfume collection'
    }
];

export default function BlogPage() {
    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Le Blog DubaiNegoce</h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Actualités, conseils et découvertes sur le monde fascinant des parfums de Dubaï.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                    <Card key={index} className="flex flex-col bg-card group">
                        <CardHeader className="p-0">
                            <Link href={post.link} className="block">
                                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={post.imageHint}
                                    />
                                </div>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-6 flex-grow">
                            <p className="text-sm text-primary font-semibold mb-2">Article parfum</p>
                            <CardTitle className="text-xl font-headline mb-2 min-h-[3.75rem]">
                                <Link href={post.link} className="hover:text-primary transition-colors">
                                    {post.title}
                                </Link>
                            </CardTitle>
                            <CardDescription>
                                {post.description}
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                             <Button asChild variant="link" className="p-0 group">
                                <Link href={post.link}>
                                    En lire plus
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
