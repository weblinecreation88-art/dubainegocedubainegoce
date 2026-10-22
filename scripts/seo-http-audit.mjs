import fs from 'node:fs/promises';
import path from 'node:path';

const args=process.argv.slice(2);
const option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const base=option('--base','https://dubainegoce.fr');
const output=option('--output','docs/seo/evidence/production-before.json');
const targets=['/','/shop/all','/shop/all?brands=Lattafa','/shop/all?q=khamrah',
  '/shop/marque/lattafa','/shop/marque/maison-alhambra','/shop/marque/french-avenue',
  '/shop/marque/fragrance-world','/shop/marque/paris-corner','/shop/famille/boise',
  '/shop/genre/femme','/parfum/tobacco-touch-maison-alhambra','/parfum/liquide-brun-french-avenue',
  '/blog','/robots.txt','/sitemap.xml','/seo-route-inexistante-20261022'];
const clean=s=>s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),m[2]]));
const results=[];
async function inspect(route){
  const requested=new URL(route,base).href, redirects=[];
  let url=requested,response;
  try {
    for(let i=0;i<6;i++){
      response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(45000)});
      if(response.status>=300&&response.status<400&&response.headers.has('location')){
        const next=new URL(response.headers.get('location'),url);
        if(![new URL(base).hostname,'www.'+new URL(base).hostname].includes(next.hostname))throw new Error('Redirection hors domaine non suivie');
        redirects.push({from:url,status:response.status,to:next.href});url=next.href;
      }else break;
    }
    const html=await response.text(),text=clean(html);
    const meta=[...html.matchAll(/<meta\b[^>]*>/gi)].map(m=>attrs(m[0]));
    const links=[...html.matchAll(/<link\b[^>]*>/gi)].map(m=>attrs(m[0]));
    const productLinks=[...html.matchAll(/<a\b[^>]*href=["']([^"']*\/parfum\/[^"']+)["']/gi)].map(m=>m[1]);
    const jsonld=[...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m=>{try{return JSON.parse(m[1])}catch{return {parseError:true}}});
    const entry={requested,url,status:response.status,redirects,bytes:Buffer.byteLength(html),
      titles:[...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map(m=>clean(m[1])),
      h1:[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>clean(m[1])),
      canonical:links.filter(x=>x.rel==='canonical').map(x=>x.href),
      robots:meta.filter(x=>x.name==='robots').map(x=>x.content),xRobots:response.headers.get('x-robots-tag'),
      description:meta.find(x=>x.name==='description')?.content,
      productLinks:[...new Set(productLinks)],jsonld,
      pricePromise:text.match(/.{0,35}(?:prix unique|prix fixe|tarif unique|tarif fixe).{0,65}/gi)||[],
      lastmod:[...html.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map(m=>m[1]),
      sitemapUrls:[...html.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),
      ...(route==='/robots.txt'?{body:html}:{})};
    results.push(entry);console.log(response.status,route,entry.h1.length+' H1',entry.productLinks.length+' liens produits');
  }catch(error){results.push({requested,error:String(error)});console.log('ERREUR',route,String(error));}
}
// Sequential requests keep the exploratory audit light on the live shop.
for(const target of targets)await inspect(target);
if(args.includes('--sitemap')) {
  const sitemap=results.find(r=>new URL(r.requested).pathname==='/sitemap.xml');
  const visited=new Set(results.map(r=>r.requested));
  for(const loc of sitemap?.sitemapUrls||[]) {
    const url=new URL(loc);
    if(url.hostname!=='dubainegoce.fr')continue;
    const target=new URL(url.pathname+url.search,base).href;
    if(visited.has(target))continue;
    visited.add(target);
    await inspect(url.pathname+url.search);
    await new Promise(resolve=>setTimeout(resolve,150));
  }
}
await fs.mkdir(path.dirname(output),{recursive:true});
await fs.writeFile(output,JSON.stringify({recordedAt:new Date().toISOString(),base,method:'HTTP GET sans JavaScript, sans authentification',results},null,2));
