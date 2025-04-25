// Nome do cache (é como dar um nome a uma pasta onde os arquivos vão ser guardados)
const CACHE_NAME = 'starwars-wiki-v1';

// Aqui a gente lista os arquivos que queremos guardar no cache (memória do navegador)
const urlsToCache = [
  './',
  'index.html',
  'login.html',           // Adicionado
  'manifest.webmanifest',
  'service-worker.js',
  'style/main.css',
  'style/login.css',      // Adicionado
  'src/main.js',
  'src/login.js',         // Adicionado
  'img/LogoEmpire.png',
  'img/icons/icon-192x192.png',
  'img/icons/icon-256x256.png',
  'img/icons/icon-512x512.png'
];

// INSTALAÇÃO do Service Worker (acontece na primeira vez que o navegador vê o site)
self.addEventListener('install', (event) => {
  // Espera até que todos os arquivos sejam adicionados ao cache
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberto');
      // Adiciona os arquivos à "pasta de cache"
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
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// INTERCEPTA REQUISIÇÕES - sempre que o site pedir um arquivo (html, css, imagem...), o SW olha primeiro no cache
self.addEventListener('fetch', (event) => {
  // Não interceptamos requisições para a API, pois queremos dados atualizados
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request) // Verifica se já tem o arquivo no cache
      .then((response) => {
        // Se tiver no cache, usa ele
        if (response) {
          return response;
        }
        
        // Se não tiver no cache, faz a requisição para a internet
        return fetch(event.request)
          .then((response) => {
            // Se a resposta não for válida, retorna ela direto
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clona a resposta, pois ela só pode ser usada uma vez
            const responseToCache = response.clone();
            
            // Adiciona a resposta ao cache para uso futuro
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
      .catch(() => {
        // Se ocorrer um erro (como estar offline), tenta servir a página inicial
        if (event.request.url.includes('html')) {
          return caches.match('index.html');
        }
      })
  );
});