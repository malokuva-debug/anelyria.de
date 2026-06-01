import type { SVGProps } from "react";
import { cn } from "../utils/cn";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

// =============================================================================
// Brand mark for "Anelyria"
// A minimalist geometric A-monogram in silver/white
// =============================================================================
export function AnelyriaLogo({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id="anelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e4e4e7" />
          <stop offset="100%" stopColor="#71717a" />
        </linearGradient>
      </defs>
      {/* Outer diamond frame */}
      <path
        d="M32 4 L58 32 L32 60 L6 32 Z"
        fill="none"
        stroke="url(#anelGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Inner A monogram */}
      <path
        d="M20 44 L32 14 L44 44 M25 34 H39"
        stroke="url(#anelGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Accent dot */}
      <circle cx="32" cy="24" r="1.5" fill="#ffffff" />
    </svg>
  );
}

// Backwards-compatibility alias
export const OctopusLogo = AnelyriaLogo;

// =============================================================================
// CHI Type Indicators — monochrome with subtle colored fill
// =============================================================================
export function ChiPositive({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-emerald-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.2" fill="currentColor" />
      <circle cx="15" cy="10" r="1.2" fill="currentColor" />
      <path d="M8.5 13.5 Q12 17 15.5 13.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function ChiNeutral({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-amber-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.2" fill="currentColor" />
      <circle cx="15" cy="10" r="1.2" fill="currentColor" />
      <line x1="8.5" y1="14" x2="15.5" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChiNegative({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-rose-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.2" fill="currentColor" />
      <circle cx="15" cy="10" r="1.2" fill="currentColor" />
      <path d="M8.5 15 Q12 12 15.5 15" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// =============================================================================
// Octo Coin (now Anelyria Coin) — silver/white coin
// =============================================================================
export function Coin({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-amber-200", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <radialGradient id="coinGrad" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="60%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#coinGrad)" stroke="#fbbf24" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7" fill="none" stroke="#92400e" strokeWidth="0.75" opacity="0.3" />
      <text x="12" y="15.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#78350f" fontFamily="system-ui">
        AC
      </text>
    </svg>
  );
}

// =============================================================================
// Streak / Fire
// =============================================================================
export function Flame({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-orange-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
      </defs>
      <path
        d="M12 2 C12 2 8 6 8 11 C8 13 9.5 15 12 17 C14.5 15 16 13 16 11 C16 6 12 2 12 2 Z"
        fill="url(#flameGrad)"
        opacity="0.9"
        strokeLinejoin="round"
      />
      <path
        d="M12 10 C12 10 10 12 10 14 C10 15.5 11 17 12 18 C13 17 14 15.5 14 14 C14 12 12 10 12 10 Z"
        fill="#fef3c7"
        opacity="0.9"
      />
    </svg>
  );
}

// =============================================================================
// Achievements / Badges
// =============================================================================
export function Trophy({ className, color = "#fbbf24", ...rest }: IconProps & { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id={`trophy-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={`${color}aa`} />
        </linearGradient>
      </defs>
      <path d="M7 4 H17 V9 A5 5 0 0 1 7 9 Z" fill={`url(#trophy-${color})`} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 6 H4 V8 A3 3 0 0 0 7 11" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M17 6 H20 V8 A3 3 0 0 1 17 11" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="10" y="13" width="4" height="4" fill={color} stroke={color} strokeWidth="1.5" />
      <rect x="8" y="17" width="8" height="3" rx="1" fill={color} stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function Crown({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path
        d="M3 8 L5 17 H19 L21 8 L16 12 L12 5 L8 12 Z"
        fill="url(#crownGrad)"
        stroke="#fde047"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="5" y="17" width="14" height="2" rx="1" fill="#d97706" stroke="#d97706" strokeWidth="1" />
      <circle cx="12" cy="8" r="1" fill="#fef3c7" />
    </svg>
  );
}

export function StarBadge({ className, filled = false, ...rest }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-amber-200", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M12 2 L15 9 L22 9 L16.5 13.5 L18.5 21 L12 17 L5.5 21 L7.5 13.5 L2 9 L9 9 Z"
        fill={filled ? "currentColor" : "currentColor"}
        opacity={filled ? 0.9 : 0.2}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Diamond({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-cyan-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
      </defs>
      <path
        d="M6 3 H18 L22 9 L12 21 L2 9 Z"
        fill="url(#diamondGrad)"
        stroke="#67e8f9"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6 3 L10 9 L12 21" stroke="#0e7490" strokeWidth="1" fill="none" />
      <path d="M18 3 L14 9 L12 21" stroke="#0e7490" strokeWidth="1" fill="none" />
      <path d="M2 9 L22 9" stroke="#0e7490" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function Medal({ className, color = "#a1a1aa", ...rest }: IconProps & { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <radialGradient id={`medal-${color}`} cx="50%" cy="40%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <path d="M8 3 H16 V9 H8 Z" fill={color} opacity="0.6" stroke={color} strokeWidth="1.5" />
      <path d="M9 3 L11 9 M15 3 L13 9" stroke={color} strokeWidth="1" />
      <circle cx="12" cy="14" r="7" fill={`url(#medal-${color})`} stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="14" r="4" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <polygon points="12,10 13,12.5 15.5,12.5 13.5,14.5 14.5,17 12,15.5 9.5,17 10.5,14.5 8.5,12.5 11,12.5" fill={color} />
    </svg>
  );
}

export function Shield({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-white", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#a1a1aa" />
        </linearGradient>
      </defs>
      <path
        d="M12 2 L20 6 V11 C20 16 16 20 12 22 C8 20 4 16 4 11 V6 Z"
        fill="url(#shieldGrad)"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12 L11 14 L15 10" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// =============================================================================
// Level Badge — silver/white shield with monogram
// =============================================================================
export function LevelBadge({ level = 1, className, ...rest }: IconProps & { level?: number }) {
  const colors: Record<number, { from: string; to: string; stroke: string }> = {
    1: { from: "#ffffff", to: "#a1a1aa", stroke: "#ffffff" },
    2: { from: "#fde047", to: "#d97706", stroke: "#fde047" },
    3: { from: "#f0abfc", to: "#a855f7", stroke: "#f0abfc" },
  };
  const c = colors[level] || colors[1];

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id={`lvl-${level}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.from} />
          <stop offset="100%" stopColor={c.to} />
        </linearGradient>
      </defs>
      <path
        d="M50 8 L85 22 V55 C85 72 70 86 50 94 C30 86 15 72 15 55 V22 Z"
        fill={`url(#lvl-${level})`}
        stroke={c.stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M25 35 Q15 40 18 52 Q22 50 28 46" fill={c.from} opacity="0.5" stroke={c.stroke} strokeWidth="1" />
      <path d="M75 35 Q85 40 82 52 Q78 50 72 46" fill={c.from} opacity="0.5" stroke={c.stroke} strokeWidth="1" />
      <circle cx="50" cy="48" r="14" fill="rgba(0,0,0,0.3)" stroke={c.stroke} strokeWidth="1.5" />
      {/* A monogram */}
      <path d="M44 54 L50 40 L56 54 M46 49 H54" stroke={c.stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="50" y="80" textAnchor="middle" fontSize="13" fontWeight="700" fill={c.stroke} letterSpacing="1">
        LVL {level}
      </text>
    </svg>
  );
}

// =============================================================================
// Notification icons — monochrome with colored accents
// =============================================================================
export function IconAchievement({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-amber-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d="M12 2 L15 9 L22 9 L16.5 13.5 L18.5 21 L12 17 L5.5 21 L7.5 13.5 L2 9 L9 9 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBonus({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-emerald-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 6 V12 L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconTask({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-white", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12 L11 15 L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRedemption({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-rose-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <rect x="3" y="8" width="18" height="12" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12 H21" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 8 V5 A2 2 0 0 1 9 3 H15 A2 2 0 0 1 17 5 V8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconImport({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-cyan-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8 V14 M12 14 L9 11 M12 14 L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconInfo({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-zinc-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
      <path d="M12 11 V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// =============================================================================
// Category icons for rewards
// =============================================================================
export function IconGiftCard({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-white", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <rect x="2" y="6" width="20" height="12" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 10 H22" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="14" r="2" fill="currentColor" />
      <rect x="6" y="13" width="6" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

export function IconMerch({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-rose-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d="M5 10 L12 4 L19 10 V20 H5 Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 4 V10 H15 V4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="15" r="2" fill="currentColor" />
    </svg>
  );
}

export function IconPerk({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-emerald-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12 L11 14 L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconExperience({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-amber-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id="expGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path d="M12 2 L15 9 L22 9 L16.5 13.5 L18.5 21 L12 17 L5.5 21 L7.5 13.5 L2 9 L9 9 Z" fill="url(#expGrad)" opacity="0.3" stroke="#fde047" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function RewardCategoryIcon({ category, className, ...rest }: { category: string } & IconProps) {
  switch (category) {
    case "gift_cards": return <IconGiftCard className={className} {...rest} />;
    case "merch": return <IconMerch className={className} {...rest} />;
    case "perks": return <IconPerk className={className} {...rest} />;
    case "experiences": return <IconExperience className={className} {...rest} />;
    default: return <IconGiftCard className={className} {...rest} />;
  }
}

// =============================================================================
// Achievement badge icons (large decorative SVGs)
// =============================================================================
export function BadgeFiveCHIs({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id="b5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#a1a1aa" />
        </linearGradient>
      </defs>
      <polygon points="50,8 62,35 92,38 70,58 76,88 50,74 24,88 30,58 8,38 38,35" fill="url(#b5)" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="50" cy="42" r="14" fill="rgba(0,0,0,0.3)" />
      <text x="50" y="48" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">5+</text>
      <path d="M35 65 L50 75 L65 65" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BadgeStreak({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id="bstreak" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
      </defs>
      <polygon points="50,8 62,35 92,38 70,58 76,88 50,74 24,88 30,58 8,38 38,35" fill="url(#bstreak)" stroke="#fde047" strokeWidth="2" strokeLinejoin="round" />
      <path d="M50 30 C50 30 35 48 35 62 C35 72 42 80 50 85 C58 80 65 72 65 62 C65 48 50 30 50 30 Z" fill="#fef3c7" opacity="0.95" stroke="#d97706" strokeWidth="1" />
      <path d="M50 50 C50 50 43 60 43 68 C43 75 47 80 50 83 C53 80 57 75 57 68 C57 60 50 50 50 50 Z" fill="#fde047" />
    </svg>
  );
}

export function BadgeTopPerformer({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id="btop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <polygon points="50,8 62,35 92,38 70,58 76,88 50,74 24,88 30,58 8,38 38,35" fill="url(#btop)" stroke="#fde047" strokeWidth="2" strokeLinejoin="round" />
      <path d="M30 45 H70 V58 A20 20 0 0 1 30 58 Z" fill="#fef3c7" opacity="0.95" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M30 47 H35 V45 M70 47 H65 V45" stroke="#d97706" strokeWidth="1.5" />
      <rect x="45" y="62" width="10" height="10" fill="#d97706" stroke="#d97706" strokeWidth="1.5" />
      <rect x="40" y="72" width="20" height="8" rx="2" fill="#d97706" stroke="#d97706" strokeWidth="1.5" />
    </svg>
  );
}

export function BadgePerfectMonth({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id="bperfect" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#71717a" />
        </linearGradient>
      </defs>
      <polygon points="50,8 62,35 92,38 70,58 76,88 50,74 24,88 30,58 8,38 38,35" fill="url(#bperfect)" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="22" fill="rgba(0,0,0,0.4)" stroke="#ffffff" strokeWidth="1.5" />
      <path d="M38 50 L47 59 L62 40" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BadgeElite({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        <linearGradient id="belite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <polygon points="50,8 62,35 92,38 70,58 76,88 50,74 24,88 30,58 8,38 38,35" fill="url(#belite)" stroke="#e9d5ff" strokeWidth="2" strokeLinejoin="round" />
      <path d="M50 28 L56 45 L74 45 L60 56 L65 74 L50 64 L35 74 L40 56 L26 45 L44 45 Z" fill="#fef3c7" stroke="#e9d5ff" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function AchievementIcon({ criteria, className, ...rest }: { criteria: string } & IconProps) {
  switch (criteria) {
    case "5_positive_chis": return <BadgeFiveCHIs className={className} {...rest} />;
    case "30_day_streak": return <BadgeStreak className={className} {...rest} />;
    case "top_performer": return <BadgeTopPerformer className={className} {...rest} />;
    case "perfect_month": return <BadgePerfectMonth className={className} {...rest} />;
    case "elite_score": return <BadgeElite className={className} {...rest} />;
    default: return <BadgeFiveCHIs className={className} {...rest} />;
  }
}

// =============================================================================
// Rank icons
// =============================================================================
export function RankBadge({ rank, className, ...rest }: { rank: number } & IconProps) {
  if (rank === 1) return <Crown className={className} {...rest} />;
  if (rank === 2) return <Medal className={className} color="#d4d4d8" {...rest} />;
  if (rank === 3) return <Medal className={className} color="#fb923c" {...rest} />;
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <circle cx="12" cy="12" r="9" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a1a1aa">{rank}</text>
    </svg>
  );
}

// =============================================================================
// Misc
// =============================================================================
export function IconGreeting({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-amber-300", className)} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2 V4 M12 20 V22 M2 12 H4 M20 12 H22 M5 5 L6.5 6.5 M17.5 17.5 L19 19 M5 19 L6.5 17.5 M17.5 6.5 L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
