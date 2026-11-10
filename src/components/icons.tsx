type IconProps = { className?: string; size?: number };

const base = (size = 16) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const ArrowUpRight = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const ArrowRight = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const ArrowLeft = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
);

export const MenuIcon = ({ className, size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);

export const CloseIcon = ({ className, size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const MailIcon = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const PhoneIcon = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z" />
  </svg>
);

export const InstagramIcon = ({ className, size = 18 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const PinterestIcon = ({ className, size = 18 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12.04 2C6.9 2 4 5.3 4 8.9c0 1.7 1 3.9 2.6 4.6.3.1.4 0 .5-.2l.3-1c.1-.3 0-.4-.1-.6a3.5 3.5 0 0 1-.7-2.1c0-2.7 2-5.1 5.4-5.1 3 0 4.6 1.8 4.6 4.2 0 3.1-1.4 5.8-3.4 5.8-1.2 0-2-1-1.7-2.1.3-1.4 1-2.9 1-3.9 0-.9-.5-1.6-1.5-1.6-1.2 0-2.1 1.2-2.1 2.9 0 1 .4 1.7.4 1.7l-1.4 5.9c-.4 1.7 0 3.8 0 4 0 .1.2.2.3 0 .1-.1 1.7-2.2 2.2-4.2l.6-2.2c.4.8 1.5 1.4 2.6 1.4 3.5 0 5.9-3.2 5.9-7.4C21.1 4.8 18.2 2 12.04 2Z" />
  </svg>
);

export const SpotifyIcon = ({ className, size = 18 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.5 14.4a.8.8 0 0 1-1.1.3c-3-1.8-6.7-2.2-11.1-1.2a.8.8 0 1 1-.4-1.6c4.8-1.1 8.9-.6 12.3 1.4.4.2.5.7.3 1.1Zm1.2-2.7a1 1 0 0 1-1.3.3c-3.4-2-8.5-2.6-12.5-1.4a1 1 0 1 1-.6-1.9c4.6-1.4 10.3-.7 14.2 1.6.4.3.6.9.2 1.4Zm.1-2.8c-4-2.4-10.6-2.6-14.4-1.4a1.2 1.2 0 1 1-.7-2.3c4.4-1.3 11.7-1.1 16.3 1.6a1.2 1.2 0 1 1-1.2 2.1Z" />
  </svg>
);

export const WhatsAppIcon = ({ className, size = 18 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A9.9 9.9 0 1 0 12.04 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-3-.2-.3a8 8 0 1 1 6.8 3.8Zm4.5-5.9c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.1-.2 0-.3.1-.4l.5-.6c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.2s.9 2.6 1 2.8c.1.2 1.8 2.8 4.4 3.8 1.6.6 2.3.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3Z" />
  </svg>
);

export const ShareIcon = ({ className, size = 16 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 16V3M8 7l4-4 4 4" />
  </svg>
);
