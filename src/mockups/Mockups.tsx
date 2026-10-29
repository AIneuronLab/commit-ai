/**
 * Frames that wrap the project visuals: a browser window and a phone body.
 */
import type { ReactNode } from 'react';
import { Lock } from 'lucide-react';

export function BrowserFrame({ url, children, className = '' }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`@container flex flex-col overflow-hidden rounded-xl border border-line bg-card shadow-[0_40px_80px_-30px_rgba(0,0,0,.55)] ${className}`}>
      <div className="flex h-9 shrink-0 items-center gap-1.5 border-b border-line bg-card-alt px-3">
        <span className="size-2.5 rounded-full bg-coral" />
        <span className="size-2.5 rounded-full bg-amber" />
        <span className="size-2.5 rounded-full bg-mint" />
        <span className="ml-3 flex h-6 max-w-[300px] flex-1 items-center gap-1.5 truncate rounded-md border border-line bg-card px-2 font-mono text-[11px] text-muted">
          <Lock className="size-3 shrink-0" /> {url}
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

export function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`aspect-[250/520] w-full max-w-[250px] rounded-[42px] grad-phone p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)] ${className}`}>
      <div className="relative h-full overflow-hidden rounded-[33px] bg-bg">
        <span className="absolute top-2 left-1/2 z-10 h-5.5 w-21 -translate-x-1/2 rounded-xl bg-black" />
        {children}
      </div>
    </div>
  );
}
