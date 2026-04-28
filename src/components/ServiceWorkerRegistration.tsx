"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            // Service Worker registered
          },
          function (err) {
            // Service Worker registration failed
          },
        );
      });
    }
  }, []);

  return null;
}
