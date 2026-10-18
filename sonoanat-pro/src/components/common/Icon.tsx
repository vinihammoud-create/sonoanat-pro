import type React from 'react';

export type IconName =
  | 'back' | 'search' | 'star' | 'starFilled' | 'settings' | 'backup' | 'studio' | 'eye' | 'eyeOff'
  | 'flip' | 'zoomIn' | 'zoomOut' | 'reset' | 'close' | 'upload' | 'download' | 'trash' | 'undo'
  | 'check' | 'info' | 'warning' | 'layers' | 'home' | 'probe' | 'needle' | 'pill' | 'book'
  | 'image' | 'edit' | 'plus' | 'chevronRight' | 'install' | 'link' | 'logo' | 'tag' | 'move';

const PATHS: Record<IconName, React.ReactNode> = {
  back: <path d="M15 18l-6-6 6-6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  star: <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" />,
  starFilled: <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" fill="currentColor" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z" /></>,
  backup: <><path d="M4 4h16v16H4z" /><path d="M4 9h16M9 9v11" /></>,
  studio: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.6 7.6" /><circle cx="11" cy="11" r="2" /></>,
  eye: <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M17.9 17.9A10 10 0 0112 20C5 20 1 12 1 12a18 18 0 015-5.9M9.9 4.2A9.1 9.1 0 0112 4c7 0 11 8 11 8a18 18 0 01-2.2 3.2M14.1 14.1a3 3 0 01-4.2-4.2" /><path d="M1 1l22 22" /></>,
  flip: <><path d="M12 3v18" strokeDasharray="3 3" /><path d="M9 7L4 12l5 5M15 7l5 5-5 5" /></>,
  zoomIn: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5M11 8v6M8 11h6" /></>,
  zoomOut: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5M8 11h6" /></>,
  reset: <><path d="M3 12a9 9 0 109-9 9.8 9.8 0 00-6.7 2.8L3 8" /><path d="M3 3v5h5" /></>,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  upload: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M17 8l-5-5-5 5M12 3v12" /></>,
  download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M7 10l5 5 5-5M12 15V3" /></>,
  trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /></>,
  undo: <><path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-15-6.7L3 13" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
  warning: <><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>,
  layers: <><path d="M12 2l10 5-10 5L2 7l10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></>,
  home: <><path d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></>,
  probe: <><rect x="7" y="2" width="10" height="7" rx="2" /><path d="M9 9v6a3 3 0 006 0V9" /><path d="M12 18v4M5 13c0 0 2 1 7 1s7-1 7-1" /></>,
  needle: <><path d="M3 21l9-9" /><path d="M12 12l7-7a1.5 1.5 0 012 2l-7 7" /><path d="M14 10l3 3" /><path d="M3 21l2-5 3 3-5 2z" /></>,
  pill: <><rect x="2" y="8" width="20" height="8" rx="4" transform="rotate(-45 12 12)" /><path d="M8.5 15.5l7-7" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></>,
  edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  chevronRight: <path d="M9 18l6-6-6-6" />,
  install: <><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></>,
  link: <><path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.5 1.5" /><path d="M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.5-1.5" /></>,
  logo: <><rect x="6" y="2" width="12" height="6" rx="2" /><path d="M8 8c0 4 1 6 4 10 3-4 4-6 4-10" /><path d="M5 20c2-1 4-1 7-1s5 0 7 1" /></>,
  tag: <><path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8z" /><path d="M7 7h.01" /></>,
  move: <><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" /></>,
};

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
