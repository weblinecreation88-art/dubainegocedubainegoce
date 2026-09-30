#!/usr/bin/env python3
"""
Script to convert PNG/JPG images to WebP format
Reduces image sizes significantly while maintaining quality
"""

import os
import sys
from pathlib import Path
from PIL import Image

def convert_images_to_webp(directory, quality=80, overwrite=False):
    """
    Convert all PNG/JPG images in a directory to WebP format

    Args:
        directory: Path to directory containing images
        quality: WebP quality (1-100, default 80)
        overwrite: Whether to overwrite original files with WebP
    """

    path = Path(directory)
    if not path.exists():
        print(f"Error: Directory {directory} does not exist")
        return 0

    image_extensions = {'.png', '.jpg', '.jpeg'}
    converted_count = 0
    total_original_size = 0
    total_new_size = 0

    # Find all image files
    for file_path in sorted(path.glob('*')):
        if file_path.suffix.lower() not in image_extensions:
            continue

        try:
            # Get original file size
            original_size = file_path.stat().st_size

            # Open and convert image
            img = Image.open(file_path)

            # Convert RGBA to RGB if necessary (WebP handles both)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background

            # Create output filename
            output_path = file_path.parent / f"{file_path.stem}.webp"

            # Save as WebP
            img.save(output_path, 'WEBP', quality=quality, method=6)

            new_size = output_path.stat().st_size
            savings = original_size - new_size
            savings_percent = (savings / original_size * 100) if original_size > 0 else 0

            total_original_size += original_size
            total_new_size += new_size

            print(f"[OK] {file_path.name}")
            print(f"     {original_size:,} bytes -> {new_size:,} bytes ({savings_percent:.1f}% smaller)")

            # Remove original if not overwriting
            if not overwrite:
                print(f"     Original kept: {file_path.name}")

            converted_count += 1

        except Exception as e:
            print(f"[ERROR] Converting {file_path.name}: {e}")

    # Summary
    print(f"\n{'='*60}")
    print(f"Conversion Summary")
    print(f"{'='*60}")
    print(f"Images converted: {converted_count}")
    print(f"Original total: {total_original_size:,} bytes")
    print(f"WebP total: {total_new_size:,} bytes")
    if total_original_size > 0:
        print(f"Total savings: {total_original_size - total_new_size:,} bytes ({(total_original_size - total_new_size) / total_original_size * 100:.1f}%)")

    return converted_count

if __name__ == '__main__':
    # Default to public/images-parfums directory
    directory = Path(__file__).parent.parent / 'public' / 'images-parfums'

    if len(sys.argv) > 1:
        directory = Path(sys.argv[1])
    else:
        directory = Path(directory)

    print(f"Converting images in: {directory}\n")

    if not directory.exists():
        print(f"Directory does not exist: {directory}")
        print("\nUsage: python convert-images-to-webp.py [directory]")
        sys.exit(1)

    converted = convert_images_to_webp(directory, quality=80)

    if converted > 0:
        print(f"\n[SUCCESS] Successfully converted {converted} images to WebP format!")
    else:
        print("\n[INFO] No images found to convert")
