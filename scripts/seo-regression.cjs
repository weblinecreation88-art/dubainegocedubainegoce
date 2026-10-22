const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const ts = require('typescript');

function loadData(source) {
  const filename = path.resolve('src/lib/data.ts');
  const m = new Module(filename, module);
  m.filename = filename;
  m.paths = module.paths;
  m._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, filename);
  return m.exports;
}
const before = loadData(execFileSync('git', ['show', '763f960:src/lib/data.ts'], { encoding: 'utf8' }));
const after = loadData(fs.readFileSync('src/lib/data.ts', 'utf8'));
const fields = ['id', 'slug', 'price', 'stock', 'images', 'volumeMl', 'brand'];
const stable = products => products.map(p => Object.fromEntries(fields.map(k => [k, p[k]])));
assert.deepEqual(stable(after.getProducts()), stable(before.getProducts()));
for (const count of [1, 2, 3]) {
  assert.equal(after.computeShippingCost('colissimo', 'FR', count, count * 35), before.computeShippingCost('colissimo', 'FR', count, count * 35));
}
const report = JSON.parse(fs.readFileSync('docs/seo/evidence/local-after.json', 'utf8'));
const route = p => report.results.find(r => new URL(r.requested).pathname + new URL(r.requested).search === p);
for (const p of ['/shop/all', '/shop/marque/lattafa', '/shop/marque/maison-alhambra', '/shop/marque/french-avenue', '/shop/marque/fragrance-world', '/shop/marque/paris-corner', '/shop/famille/boise', '/shop/genre/femme']) {
  const r = route(p);
  assert.equal(r.status, 200, p);
  assert.equal(r.h1.length, 1, p);
  assert.ok(r.productLinks.length > 0, p);
  assert.equal((r.titles[0].match(/Dubainegoce/gi) || []).length, 1, p);
}
assert.equal(route('/shop/all?q=khamrah').xRobots, 'noindex, follow');
assert.equal(route('/seo-route-inexistante-20261022').status, 404);
const sitemap = route('/sitemap.xml');
assert.equal(sitemap.lastmod.length, 0);
assert.ok(!sitemap.sitemapUrls.some(u => /\/account$|\/shop$|\?/.test(u)));
assert.ok(sitemap.sitemapUrls.includes('https://dubainegoce.fr/shop/marque/paris-corner'));
for (const slug of ['tobacco-touch-maison-alhambra', 'liquide-brun-french-avenue']) {
  const product = after.getProducts().find(p => p.slug === slug);
  const r = route('/parfum/' + slug);
  const schema = r.jsonld.find(x => x['@type'] === 'Product');
  assert.ok(schema, slug);
  assert.equal(Number(schema.offers.price), product.price);
  assert.equal(schema.offers.availability.endsWith('InStock'), product.stock > 0);
  assert.ok(!schema.aggregateRating && !schema.review && !schema.mpn && !schema.weight);
  assert.ok(schema.image.every(u => /^https:\/\//.test(u)));
}
const result = { checkedAt: new Date().toISOString(), productsPreserved: after.getProducts().length, fields, httpAssertions: 'passed', shippingRules: 'unchanged' };
fs.writeFileSync('docs/seo/evidence/regression.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));

async function checkFeed() {
  const response = await fetch('http://localhost:3001/api/google-feed');
  assert.equal(response.status, 200);
  const xml = await response.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
  assert.equal(items.length, after.getProducts().length);
  for (const p of after.getProducts()) {
    const item = items.find(s => s.includes(`<g:id>${p.id}</g:id>`));
    assert.ok(item, p.id);
    assert.ok(item.includes(`<g:price>${p.price.toFixed(2)} EUR</g:price>`), p.id);
    assert.ok(item.includes(`<g:availability>${p.stock > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>`), p.id);
    assert.ok(item.includes(`/parfum/${p.slug}</g:link>`), p.id);
    const shipping = item.match(/<g:shipping>([\s\S]*?)<\/g:shipping>/)[1];
    assert.ok(shipping.includes(`<g:price>${after.computeShippingCost('colissimo', 'FR', 1, p.price).toFixed(2)} EUR</g:price>`), p.id);
    assert.ok(!item.includes('Mondial Relay'));
  }
  const crawl = JSON.parse(fs.readFileSync('docs/seo/evidence/local-crawl.json', 'utf8'));
  const sitemap = crawl.results.find(r => r.sitemapUrls?.length).sitemapUrls;
  for (const url of sitemap) {
    const r = crawl.results.find(r => new URL(r.requested).pathname === new URL(url).pathname);
    assert.ok(r, url);
    assert.equal(r.status, 200, url);
    assert.equal(r.redirects.length, 0, url);
    assert.ok(!r.xRobots?.includes('noindex') && !r.robots.some(v => v.includes('noindex')), url);
  }
  for (const p of after.getProducts()) {
    const r = crawl.results.find(r => new URL(r.requested).pathname === `/parfum/${p.slug}`);
    const schema = r?.jsonld.find(x => x['@type'] === 'Product');
    assert.ok(schema, p.id);
    assert.equal(Number(schema.offers.price), p.price, p.id);
    assert.equal(schema.offers.availability.endsWith('InStock'), p.stock > 0, p.id);
    assert.ok(!schema.aggregateRating && !schema.review && !schema.mpn, p.id);
  }
  result.feedProductsChecked = items.length;
  result.productSchemasChecked = after.getProducts().length;
  result.sitemapDirect200Checked = sitemap.length;
  result.compiledServer = true;
  fs.writeFileSync('docs/seo/evidence/regression.json', JSON.stringify(result, null, 2));
  console.log(`Feed: ${items.length} products; sitemap: ${sitemap.length} direct 200 responses.`);
}
checkFeed().catch(error => { console.error(error); process.exitCode = 1; });
