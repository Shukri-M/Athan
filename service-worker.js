// service-worker.js
self.addEventListener('install', event => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches.open('static-v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/script.js',
                '/al-quran.html',
                '/asr.html',
                '/clothing.html',
                '/deed-checklist.html',
                '/dhuhr.html',
                '/dua.html',
                '/facing-kabah.html',
                '/fajr.html',
                '/how-to-pray.html',
                '/isha.html',
                '/maghrib.html',
                '/prayer.html',
                '/ramadan-calendar.html',
                '/tasbeeh.html',
                '/wudu.html',
                '/audio/adhan.mp3', 
                '/images/background.jpg',
                '/images/clothing.png',
                '/images/ka\'bah.png',
                '/images/Men-clothing.png',
                '/images/prayers.png',
                '/images/Women-clothing.png',
                '/images/wudu.png',
                '/images/icon.png', 
                '/images/badge.png' 
                
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker: Activated');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push received', data);

    const options = {
        body: data.body,
        icon: 'images/icon.png', 
        badge: 'images/badge.png' 
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
