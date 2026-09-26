// Mission Genève : réseau d'abord (pour recevoir le bilan du matin), copie locale en secours hors ligne.
const VERSION = "mission-geneve-v1";
const COQUE = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (evenement) => {
  evenement.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(COQUE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((cle) => cle !== VERSION).map((cle) => caches.delete(cle))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evenement) => {
  const requete = evenement.request;
  const url = new URL(requete.url);
  if (requete.method !== "GET" || url.origin !== self.location.origin) return;
  // Les données chiffrées sont demandées avec ?t=… : on les range sans paramètre.
  const cleCache = url.pathname.endsWith(".enc") ? url.origin + url.pathname : requete;
  evenement.respondWith(
    fetch(requete)
      .then((reponse) => {
        if (reponse.ok) {
          const copie = reponse.clone();
          caches.open(VERSION).then((cache) => cache.put(cleCache, copie));
        }
        return reponse;
      })
      .catch(() => caches.match(cleCache, { ignoreSearch: true })),
  );
});
