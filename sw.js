importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

const staticAssests = [
  './',
  './mytodos.html',
  './todo.html',
  './contact.html',
  './resources/css/reset.min.css',
  './resources/css/list.css',
  './resources/css/style.css',
  './resources/js/mytodos.js',
  './resources/js/todo.js',
  './resources/js/polyfills.js',
  './resources/js/modernizr-2.6.2.min.js',
  './resources/js/node_modules/sweetalert',
  './resources/img/add_icon.svg',
  './resources/img/done_icon.svg',
  './resources/img/icons8-menu.svg',
  './resources/img/logow.png',
  './resources/img/remove_icon.svg',
];

workbox.precaching.precacheAndRoute(staticAssests);

workbox.routing.registerRoute(/.*/, workbox.strategies.cacheFirst());