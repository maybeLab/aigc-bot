/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute, RegExpRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

import { HundredPointsURL } from "@/utils";

const ONE_WEEK = 7 * 24 * 60 * 60;

clientsClaim();

const mf = self.__WB_MANIFEST;
console.log(mf);

precacheAndRoute(mf);

registerRoute(
  ({ request }) =>
    request.url === HundredPointsURL && request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "image-cache",
  })
);

registerRoute(
  new RegExpRoute(
    new RegExp(
      /https:\/\/[a-z]{2,}\.(tts\.speech\.microsoft\.com)\/cognitiveservices\/voices\/list/
    ),
    new CacheFirst({
      cacheName: "fetch-cache",
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: ONE_WEEK,
        }),
      ],
    })
  )
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
