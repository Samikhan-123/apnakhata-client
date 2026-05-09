import { useState, useEffect } from "react";

/**
 * SSR-safe hook to read window dimensions.
 * Returns { width: 0, height: 0 } on the server, then syncs to real values on mount.
 */
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    update(); // Set immediately on mount
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
