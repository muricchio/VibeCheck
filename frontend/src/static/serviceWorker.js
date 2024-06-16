function log(...data) {
    console.log("SWv1.0", ...data);
  }
  
  log("SW Script executing - adding event listeners");
  
  
  const STATIC_CACHE_NAME = 'vibecheck-static-v0';
  
  self.addEventListener('install', event => {
    log('install', event);
    event.waitUntil(
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll([
          '/offline',
          //CSS
          '/css/styles.css',
          '/css/createAccount.css',
          '/css/dashboard.css',
          '/css/login.css',
          '/css/offline.css',
          '/css/playlist.css',
          '/css/rankings.css',
          'tracks.css',
          //Images
          '/images/happiest.png',
          '/images/happy.png',
          '/images/neutral.png',
          '/images/sad.png',
          '/images/saddest.png',
          //Scripts
          '/js/common.js',
          '/js/create_account.js',
          '/js/dashboard.js',
          '/js/login.js',
          '/js/offline.js',
          '/js/playlist.js',
          '/js/rankings.js',
          '/js/spotify_authentication.js',
          '/js/tracks.js',
        ]);
      })
    );
  });
  
  self.addEventListener('activate', event => {
    log('activate', event);
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('vibecheck-') && cacheName != STATIC_CACHE_NAME;
          }).map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    var requestUrl = new URL(event.request.url);
    //Treat API calls (to our API) differently
    if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
      //If we are here, we are intercepting a call to our API
      if(event.request.method === "GET") {
        //Only intercept (and cache) GET API requests
        event.respondWith(
          cacheFirst(event.request)
        );
      }
    }
    else {
      //If we are here, this was not a call to our API
      event.respondWith(
        cacheFirst(event.request)
      );
    }
  
  });
  
  
  function cacheFirst(request) {
    return caches.match(request)
    .then(response => {
      //Return a response if we have one cached. Otherwise, get from the network
      return response || fetchAndCache(request);
    })
    .catch(error => {
      return caches.match('/offline');
    })
  }
  
  
  
  function fetchAndCache(request) {
    return fetch(request).then(response => {
      var requestUrl = new URL(request.url);
      //Cache everything except login
      if(response.ok && !requestUrl.pathname.startsWith('/login')) {
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
      return response.clone();
    });
  }
  
  
  
  self.addEventListener('message', event => {
    log('message', event.data);
    if(event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });