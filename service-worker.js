// Nome do cache (é como dar um nome a uma pasta onde os arquivos vão ser guardados)
const CACHE_NAME = 'sw-cache-v1';

// Aqui a gente lista os arquivos que queremos guardar no cache (memória do navegador)
const urlsToCache = [
 './',
 'idenx2.html',
 'manifest.webmanifest',
 'service-worker.js',
 'style/main.css',
 'src/main2.js',
 'img/LogoEmpire.png',
 'img/icons/icon-192x192.png',
 'img/icons/icon-256x256.png',
 'img/icons/icon-512x512.png'
]

// INSTALAÇÃO do Service Worker (acontece na primeira vez que o navegador vê o site)
self.addEventListener('install', (event) => {
  // Espera até que todos os arquivos sejam adicionados ao cache
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Adiciona os arquivos à “pasta de cache”
      return cache.addAll(urlsToCache);
    })
  );
});

// ATIVAÇÃO do Service Worker (acontece quando o navegador atualiza o SW)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Remove versões antigas do cache que não sejam a atual
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// INTERCEPTA REQUISIÇÕES - sempre que o site pedir um arquivo (html, css, imagem...), o SW olha primeiro no cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request) // Verifica se já tem o arquivo no cache
      .then((response) => {
        // Se tiver no cache, usa ele. Se não tiver, baixa da internet (fetch)
        return response || fetch(event.request);
      })
  );
});