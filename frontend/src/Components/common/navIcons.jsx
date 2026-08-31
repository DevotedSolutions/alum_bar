// Inline nav/action icons, extracted verbatim from the design mockup
// ("Frontend Redesign v2.dc.html") so the sidebar matches pixel-for-pixel
// instead of relying on the (visually different) MUI icon set.

const base = (size, children) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const CalendarIcon = ({ size = 20 }) =>
  base(size, (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ));

export const DashboardIcon = ({ size = 20 }) =>
  base(size, (
    <>
      <circle cx="12" cy="13" r="8" />
      <line x1="12" y1="13" x2="16" y2="9" />
      <line x1="12" y1="5" x2="12" y2="5.01" />
    </>
  ));

export const InventoryIcon = ({ size = 20 }) =>
  base(size, (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="10" y1="13" x2="14" y2="13" />
    </>
  ));

export const AddIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const ScannerIcon = ({ size = 20 }) =>
  base(size, (
    <>
      <path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3" />
      <line x1="8" y1="9" x2="8" y2="15" />
      <line x1="11" y1="9" x2="11" y2="15" />
      <line x1="14" y1="9" x2="14" y2="15" />
      <line x1="16.5" y1="9" x2="16.5" y2="15" />
    </>
  ));

export const LeavesIcon = ({ size = 20 }) =>
  base(size, (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 21c0-4 3.1-6.4 7-6.4s7 2.4 7 6.4" />
    </>
  ));

export const UsersIcon = ({ size = 20 }) =>
  base(size, (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <circle cx="17" cy="9.5" r="2.4" />
      <path d="M3 20c0-3.6 2.7-5.8 6-5.8s6 2.2 6 5.8" />
      <path d="M15 14.6c2.6.3 4.5 2.2 4.5 5.4" />
    </>
  ));

export const QuoteAppIcon = ({ size = 20 }) =>
  base(size, (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="8" y2="12.01" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
      <line x1="16" y1="12" x2="16" y2="12.01" />
      <line x1="8" y1="16" x2="8" y2="16.01" />
      <line x1="12" y1="16" x2="12" y2="16.01" />
      <line x1="16" y1="16" x2="16" y2="16.01" />
    </>
  ));

export const QuoteExportIcon = ({ size = 20 }) =>
  base(size, (
    <>
      <path d="M14 3v5h5" />
      <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
      <path d="M9 14l3 3 3-3M12 17v-6" />
    </>
  ));

export const JobsIcon = ({ size = 20 }) =>
  base(size, (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="13" y2="16" />
    </>
  ));

export const LogoutIcon = ({ size = 20 }) =>
  base(size, (
    <>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>
  ));

export const ChevronLeftIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronRightIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
