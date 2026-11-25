const CACHE='zero2talkinghero-v1.0.0';
const ROOT=new URL('./',self.registration.scope);
const ASSETS=['index.html','manifest.json','icon-192.png','icon-512.png'].map(p=>new URL(p,ROOT).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zero2talkinghero-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const r=event.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==ROOT.origin||!u.href.startsWith(ROOT.href))return;
  if(r.mode==='navigate'){
    event.respondWith(fetch(r).then(response=>{if(response.ok&&['', 'index.html'].includes(u.pathname.slice(ROOT.pathname.length))) {const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(ASSETS[0],copy)));}return response;}).catch(()=>caches.match(ASSETS[0])));return;
  }
  if(ASSETS.includes(u.href))event.respondWith(caches.match(r).then(cached=>cached||fetch(r)));
});
