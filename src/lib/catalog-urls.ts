/** Existing catalogue routes; product URLs and IDs are deliberately unchanged. */
const brandSlugs: Record<string, string> = {
  Lattafa: 'lattafa', 'Maison Alhambra': 'maison-alhambra', 'Paris Corner': 'paris-corner',
  Armaf: 'armaf', 'Banafa for Oud': 'banafa-for-oud', 'Ard Al Zaafaran': 'ard-al-zaafaran',
  'Fragrance World': 'fragrance-world', 'Jean Couturier': 'jean-couturier',
  'JB Loves Fragrances': 'jb-loves-fragrances', PriveZarah: 'prive-zarah', Asdaaf: 'asdaaf',
  Rave: 'rave', 'Pandora Scents': 'pandora-scents', Nasomatto: 'nasomatto', MIRADA: 'mirada',
  Hamidi: 'hamidi', 'Loui Martin': 'loui-martin', Surrati: 'surrati',
  'French Avenue': 'french-avenue', Guerlain: 'guerlain', 'Jacques Yves': 'jacques-yves',
  'Gulf Orchid': 'gulf-orchid', Sublime: 'sublime', Naturafrika: 'naturafrika',
};

export function getBrandPath(name: string): string {
  const slug = brandSlugs[name];
  return slug ? `/shop/marque/${slug}` : `/shop/all?brands=${encodeURIComponent(name)}`;
}
