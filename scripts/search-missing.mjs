import https from 'https';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get({ hostname: u.hostname, path: u.pathname + u.search,
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }, timeout: 20000
    }, res => {
      let d = ''; res.setEncoding('utf8');
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve({}); } });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function getAll(col) {
  let all = [], page = 1;
  while (true) {
    const d = await fetchJson(`https://emiratesoud.co.uk/collections/${col}/products.json?limit=250&page=${page}`);
    if (!d.products || d.products.length === 0) break;
    all = all.concat(d.products);
    if (d.products.length < 250) break;
    page++;
    await new Promise(r => setTimeout(r, 400));
  }
  return all;
}

const ma = await getAll('maison-alhambra');
const fw = await getAll('fragrance-world');
const fa = await getAll('french-avenue');

const searches = [
  { keywords: ['minerva'], list: ma, label: 'Minerva [MA]' },
  { keywords: ['niche', 'rouge', 'royal rouge'], list: ma, label: 'Niche Royal Rouge [MA]' },
  { keywords: ['olivia'], list: ma, label: 'Olivia Blossom [MA]' },
  { keywords: ['intrude', 'intrus'], list: ma, label: "L'Intrude [MA]" },
  { keywords: ['zaffiro'], list: ma, label: 'Zaffiro [MA]' },
  { keywords: ['artist'], list: ma, label: 'The Artist [MA]' },
  { keywords: ['francique'], list: fw, label: 'Francique [FW]' },
  { keywords: ['francique'], list: fa, label: 'Francique [FA]' },
  { keywords: ['afgano', 'black afgano'], list: fw, label: 'Black Afgano [FW]' },
  { keywords: ['optimystic', 'optimistic'], list: fw, label: 'Optimystic [FW]' },
  { keywords: ['tour', 'havana'], list: fw, label: 'Tour De Havana [FW]' },
  { keywords: ['magnificent', 'absolute oud'], list: fw, label: 'Absolute Oud Magnificent 7 [FW]' },
  { keywords: ['amber neroli', 'neroli'], list: fw, label: 'Amber Neroli [FW]' },
  { keywords: ['kenzie'], list: fw, label: 'Kenzie [FW]' },
  { keywords: ['kenzie'], list: fa, label: 'Kenzie [FA]' },
  { keywords: ['lumiere', 'lumière', 'garcon', 'garçon'], list: fa, label: 'Lumière Garçon [FA]' },
];

for (const s of searches) {
  const found = s.list.filter(p =>
    s.keywords.some(kw => p.title.toLowerCase().includes(kw.toLowerCase()))
  );
  if (found.length > 0) {
    found.forEach(p => console.log(`✅ [${s.label}] ${p.title}\n   IMG: ${p.images?.[0]?.src?.substring(0, 90)}`));
  } else {
    console.log(`❌ Not found: ${s.label}`);
  }
}
