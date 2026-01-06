
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProductImageProps {
    images: string | string[];
    alt: string;
    className?: string;
    sizes: string;
    priority?: boolean;
}

const placeholderImage = 'https://picsum.photos/seed/placeholder/800/800';

export function ProductImage({ images, alt, className, sizes, priority = false }: ProductImageProps) {
    const imageList = Array.isArray(images) ? images : [images];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const currentImage = imageList[currentImageIndex] || placeholderImage;

    useEffect(() => {
        // Reset when images array changes
        setCurrentImageIndex(0);
    }, [images]);

    const handleError = () => {
        if (currentImageIndex < imageList.length - 1) {
            setCurrentImageIndex(prevIndex => prevIndex + 1);
        } else if (currentImage !== placeholderImage) {
            // This ensures we only try the placeholder once all others have failed
            setCurrentImageIndex(imageList.length); // An index that will result in placeholder
        }
    };

    return (
        <Image
            src={currentImage}
            alt={alt}
            fill
            sizes={sizes}
            className={className}
            priority={priority}
            onError={handleError}
        />
    );
}
