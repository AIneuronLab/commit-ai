import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { useApp } from '../i18n';

/** Bottom sheet: slides up, drag down or press Escape to close. Centered card on wide screens. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const { t } = useApp();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <motion.button
            aria-label={t.a11y.close}
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className="relative w-full max-w-lg rounded-t-[28px] border border-line-strong bg-card px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-30px_80px_-20px_rgba(0,0,0,.6)] outline-none md:rounded-[28px] md:pb-6"
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            drag={reduce ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => { if (info.offset.y > 90 || info.velocity.y > 500) onClose(); }}
          >
            <span aria-hidden="true" className="mx-auto mb-3 block h-1.5 w-11 rounded-full bg-line-strong md:hidden" />
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="m-0 font-display text-2xl font-bold tracking-tight">{title}</h2>
              <button onClick={onClose} aria-label={t.a11y.close} className="flex size-11 items-center justify-center rounded-full border border-line text-soft hover:border-line-strong">
                <X className="size-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
