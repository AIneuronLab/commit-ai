import { useId, type SVGProps } from 'react';

/**
 * Commit·AI — custom service icons (React + SVG, no icon font).
 * Duotone: brand gradients + an "ink" colour for details.
 *   <IconChatbot className="size-12" />                                   // dark UI (default)
 *   <IconChatbot className="size-12" ink="#0B1730" soft="rgba(33,150,243,.18)" />  // white UI
 * For generic UI icons (arrows, check, menu…) use lucide-react.
 */
export type IconProps = SVGProps<SVGSVGElement> & { ink?: string; soft?: string };

function Grads({ uid }: { uid: string }) {
  return (
    <defs>
      <linearGradient id={`${uid}igA`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4FC3F7" />
        <stop offset="1" stopColor="#1565C0" />
      </linearGradient>
      <linearGradient id={`${uid}igB`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#67E8F9" />
        <stop offset="1" stopColor="#2196F3" />
      </linearGradient>
      <radialGradient id={`${uid}igGlow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#67E8F9" stopOpacity={0.9} />
        <stop offset="1" stopColor="#67E8F9" stopOpacity={0} />
      </radialGradient>
    </defs>
  );
}

const useUid = () => 'ca' + useId().replace(/[^a-zA-Z0-9]/g, '');

/** Chatbots IA sur documents */
export function IconChatbot({ ink = '#EEF5FD', soft = 'rgba(79,195,247,.22)', ...props }: IconProps) {
  const uid = useUid();
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <Grads uid={uid} />
      <rect x="8" y="10" width="26" height="34" rx="4" fill={soft} /><rect x="13" y="6" width="26" height="34" rx="4" fill={`url(#${uid}igA)`} />
<path d="M19 15h14M19 21h14M19 27h9" stroke={ink} strokeWidth={2.2} strokeLinecap="round" />
<path d="M30 34h22a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-9l-7 6v-6h-6a4 4 0 0 1-4-4V38a4 4 0 0 1 4-4z" fill={`url(#${uid}igB)`} />
<circle cx="37" cy="43" r="2" fill="#05080F" /><circle cx="43" cy="43" r="2" fill="#05080F" /><circle cx="49" cy="43" r="2" fill="#05080F" />
    </svg>
  );
}

/** API & backends */
export function IconApi({ ink = '#EEF5FD', soft = 'rgba(79,195,247,.22)', ...props }: IconProps) {
  const uid = useUid();
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <Grads uid={uid} />
      <rect x="6" y="12" width="20" height="16" rx="4" fill={`url(#${uid}igA)`} /><rect x="38" y="12" width="20" height="16" rx="4" fill={soft} />
<rect x="22" y="38" width="20" height="16" rx="4" fill={`url(#${uid}igB)`} />
<path d="M26 20h12M16 28v6a4 4 0 0 0 4 4h2M48 28v6a4 4 0 0 1-4 4h-2" stroke={ink} strokeWidth={2.2} strokeLinecap="round" />
<path d="M13 18l-3 2 3 2M19 18l3 2-3 2" stroke="#05080F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
<circle cx="32" cy="46" r="3" fill="#05080F" />
    </svg>
  );
}

/** Automatisation & collecte */
export function IconAutomation({ ink = '#EEF5FD', soft = 'rgba(79,195,247,.22)', ...props }: IconProps) {
  const uid = useUid();
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <Grads uid={uid} />
      <circle cx="26" cy="30" r="15" fill={`url(#${uid}igA)`} />
<path d="M26 11v5M26 44v5M7 30h5M40 30h5M12.6 16.6l3.5 3.5M35.9 39.9l3.5 3.5M12.6 43.4l3.5-3.5M35.9 20.1l3.5-3.5" stroke={`url(#${uid}igA)`} strokeWidth={4} strokeLinecap="round" />
<circle cx="26" cy="30" r="6" fill="#05080F" /><circle cx="26" cy="30" r="2.5" fill="#67E8F9" />
<path d="M44 40a12 12 0 0 1 12 12" stroke={ink} strokeWidth={2.4} strokeLinecap="round" /><path d="M57 46l-1 6-6-1" stroke={ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Tableaux de bord & analyse */
export function IconDashboard({ ink = '#EEF5FD', soft = 'rgba(79,195,247,.22)', ...props }: IconProps) {
  const uid = useUid();
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <Grads uid={uid} />
      <rect x="6" y="8" width="52" height="40" rx="5" fill={soft} />
<rect x="13" y="30" width="7" height="12" rx="2" fill={`url(#${uid}igB)`} /><rect x="24" y="22" width="7" height="20" rx="2" fill={`url(#${uid}igA)`} /><rect x="35" y="26" width="7" height="16" rx="2" fill={`url(#${uid}igB)`} /><rect x="46" y="16" width="7" height="26" rx="2" fill={`url(#${uid}igA)`} />
<path d="M12 22l12-7 11 5 15-9" stroke={ink} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /><circle cx="50" cy="11" r="3" fill="#67E8F9" />
<path d="M22 54h20" stroke={ink} strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  );
}

/** Modèles d’IA */
export function IconAiModel({ ink = '#EEF5FD', soft = 'rgba(79,195,247,.22)', ...props }: IconProps) {
  const uid = useUid();
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <Grads uid={uid} />
      <circle cx="32" cy="32" r="24" fill={`url(#${uid}igGlow)`} />
<path d="M14 18L32 32M14 46L32 32M50 18L32 32M50 46L32 32M14 18L14 46M50 18L50 46M14 18L50 18" stroke={ink} strokeOpacity={.55} strokeWidth={1.8} />
<circle cx="14" cy="18" r="5" fill={`url(#${uid}igA)`} /><circle cx="14" cy="46" r="5" fill={`url(#${uid}igA)`} /><circle cx="50" cy="18" r="5" fill={`url(#${uid}igA)`} /><circle cx="50" cy="46" r="5" fill={`url(#${uid}igA)`} />
<circle cx="32" cy="32" r="8" fill={`url(#${uid}igB)`} /><circle cx="32" cy="32" r="3" fill="#05080F" />
    </svg>
  );
}

/** Sites & applications web */
export function IconWebApp({ ink = '#EEF5FD', soft = 'rgba(79,195,247,.22)', ...props }: IconProps) {
  const uid = useUid();
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <Grads uid={uid} />
      <rect x="4" y="10" width="42" height="34" rx="5" fill={`url(#${uid}igA)`} /><path d="M4 18h42" stroke="#05080F" strokeWidth={2} />
<circle cx="10" cy="14" r="1.6" fill="#05080F" /><circle cx="15" cy="14" r="1.6" fill="#05080F" />
<rect x="10" y="24" width="18" height="4" rx="2" fill={ink} /><rect x="10" y="32" width="12" height="4" rx="2" fill={ink} fillOpacity={.6} />
<rect x="38" y="24" width="20" height="34" rx="5" fill={`url(#${uid}igB)`} stroke="#05080F" strokeWidth={2} /><rect x="43" y="30" width="10" height="3" rx="1.5" fill="#05080F" /><rect x="43" y="36" width="10" height="10" rx="2" fill="#05080F" fillOpacity={.35} /><circle cx="48" cy="53" r="1.8" fill="#05080F" />
    </svg>
  );
}

export const serviceIcons = {
  chatbot: IconChatbot,
  api: IconApi,
  automation: IconAutomation,
  dashboard: IconDashboard,
  aiModel: IconAiModel,
  webApp: IconWebApp,
} as const;
export type ServiceIconKey = keyof typeof serviceIcons;
