workbox.skipWaiting()
workbox.clientsClaim()

workbox.routing.registerRoute(
  new RegExp('https:.*min\.(css|js)'),
  workbox.strategies.staleWhileRevalidate()
)

workbox.routing.registerRoute(
  new RegExp('https://.*\.json'),
  workbox.strategies.networkFirst()
)

self.addEventListener('push', event => {
  event.waitUntil(self.registration.showNotification('Todo List', {
    icon: '/apple-touch-icon-120x120.png',
    body: event.data.text()
  }))
})


// self.addEventListener('install', event => {
//   const asyncInstall = new Promise(resolve => {
//     console.log("Waiting to resolve...")
//     setTimeout(resolve, 5000)
//   })

//   event.waitUntil(asyncInstall)
// })

// self.addEventListener('activate', event => {
//   console.log("activate")
// })

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
