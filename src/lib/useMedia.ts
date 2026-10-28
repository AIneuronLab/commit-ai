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

/** Full choreography (smooth scroll, pinned horizontal projects, cursor) only on large screens with a mouse. */
export const DESKTOP_MOTION = '(min-width: 1024px) and (pointer: fine)';
