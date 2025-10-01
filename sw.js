// NewsHub Service Worker
// Обеспечивает PWA функциональность, кэширование и offline режим

const CACHE_NAME = 'newshub-v1.2.0';
const STATIC_CACHE = 'newshub-static-v1.2.0';
const DYNAMIC_CACHE = 'newshub-dynamic-v1.2.0';

// Статические ресурсы для кэширования
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/js/filterSystem.js',
    '/js/colorSystem.js',
    '/js/reactBitsIntegration.js',
    '/js/rssAggregator.js',
    '/js/newsCardRenderer.js',
    '/manifest.json'
];

// Ресурсы для динамического кэширования
const CACHE_STRATEGIES = {
    // Стратегия Cache First для статических ресурсов
    CACHE_FIRST: 'cache-first',
    // Стратегия Network First для API запросов
    NETWORK_FIRST: 'network-first',
    // Стратегия Stale While Revalidate для RSS данных
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Установка Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                return self.skipWaiting();
            })
            .catch(error => {
                // Ошибка кэширования статических ресурсов
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Удаляем старые кэши
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

// Обработка fetch запросов
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Игнорируем запросы к chrome-extension и другим протоколам
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Определяем стратегию кэширования
    if (isStaticAsset(request)) {
        event.respondWith(cacheFirstStrategy(request));
    } else if (isAPIRequest(request)) {
        event.respondWith(networkFirstStrategy(request));
    } else if (isRSSRequest(request)) {
        event.respondWith(staleWhileRevalidateStrategy(request));
    } else {
        event.respondWith(networkFirstStrategy(request));
    }
});

// Проверка, является ли запрос статическим ресурсом
function isStaticAsset(request) {
    const url = new URL(request.url);
    return STATIC_ASSETS.some(asset => url.pathname.endsWith(asset)) ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.png') ||
           url.pathname.endsWith('.jpg') ||
           url.pathname.endsWith('.jpeg') ||
           url.pathname.endsWith('.svg') ||
           url.pathname.endsWith('.ico');
}

// Проверка, является ли запрос API запросом
function isAPIRequest(request) {
    const url = new URL(request.url);
    return url.hostname.includes('api.openai.com') ||
           url.hostname.includes('api.hh.ru') ||
           url.pathname.includes('/api/');
}

// Проверка, является ли запрос RSS запросом
function isRSSRequest(request) {
    const url = new URL(request.url);
    return url.hostname.includes('allorigins.win') ||
           url.searchParams.has('url') ||
           request.url.includes('rss') ||
           request.url.includes('feed');
}

// Стратегия Cache First
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        return new Response('Offline', { status: 503 });
    }
}

// Стратегия Network First
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        // Кэшируем только GET запросы
        if (networkResponse.ok && request.method === 'GET') {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Возвращаем offline страницу для HTML запросов
        if (request.headers.get('accept').includes('text/html')) {
            return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>NewsHub - Offline</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            height: 100vh; 
                            margin: 0; 
                            background: #F8F9FA;
                            color: #2C3E50;
                        }
                        .offline-container {
                            text-align: center;
                            padding: 2rem;
                            background: white;
                            border-radius: 12px;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        }
                        .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
                        h1 { margin-bottom: 0.5rem; }
                        p { color: #7F8C8D; margin-bottom: 1.5rem; }
                        button {
                            background: #4A90E2;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 1rem;
                        }
                        button:hover { background: #357ABD; }
                    </style>
                </head>
                <body>
                    <div class="offline-container">
                        <div class="offline-icon">📡</div>
                        <h1>Нет подключения</h1>
                        <p>Проверьте интернет соединение и попробуйте снова</p>
                        <button onclick="location.reload()">Обновить</button>
                    </div>
                </body>
                </html>
            `, {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        return new Response('Offline', { status: 503 });
    }
}

// Стратегия Stale While Revalidate
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Запускаем обновление в фоне
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(error => {
        return cachedResponse;
    });
    
    // Возвращаем кэшированную версию если есть, иначе ждем сеть
    return cachedResponse || fetchPromise;
}

// Обработка сообщений от главного потока
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_CACHE_SIZE':
            getCacheSize().then(size => {
                event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
            });
            break;
            
        case 'CLEAR_CACHE':
            clearCache(data.cacheName).then(success => {
                event.ports[0].postMessage({ type: 'CACHE_CLEARED', success });
            });
            break;
            
        case 'CACHE_RSS_DATA':
            cacheRSSData(data.url, data.data).then(success => {
                event.ports[0].postMessage({ type: 'RSS_CACHED', success });
            });
            break;
    }
});

// Получение размера кэша
async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
    }
    
    return totalSize;
}

// Очистка кэша
async function clearCache(cacheName) {
    try {
        if (cacheName) {
            return await caches.delete(cacheName);
        } else {
            const cacheNames = await caches.keys();
            const deletePromises = cacheNames.map(name => caches.delete(name));
            await Promise.all(deletePromises);
            return true;
        }
    } catch (error) {
        return false;
    }
}

// Кэширование RSS данных
async function cacheRSSData(url, data) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=1800' // 30 минут
            }
        });
        
        await cache.put(url, response);
        return true;
    } catch (error) {
        return false;
    }
}

// Периодическая очистка старых кэшей
self.addEventListener('periodicsync', event => {
    if (event.tag === 'cache-cleanup') {
        event.waitUntil(cleanupOldCaches());
    }
});

// Очистка старых кэшей
async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
        !name.includes('v1.0.0') && 
        (name.includes('newshub') || name.includes('dynamic'))
    );
    
    return Promise.all(oldCaches.map(name => caches.delete(name)));
}
