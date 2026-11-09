import { useSyncExternalStore } from 'react';

/** Live `matchMedia` as a React value (false on the server / when unsupported). */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', notify);
      return () => m.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Phones and tablets: the 3D scenes switch to a lighter version (fewer particles, lower resolution) that looks the same at that size. */
export const LITE_3D = '(pointer: coarse), (max-width: 767px)';

/** Full choreography (smooth scroll, pinned horizontal projects, cursor) only on large screens with a mouse. */
export const DESKTOP_MOTION = '(min-width: 1024px) and (pointer: fine)';
