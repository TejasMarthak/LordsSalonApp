/**
 * Icon Components using HugeIcons | React
 * https://hugeicons.com/
 * Professional and modern icon library (Official package)
 */

import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Edit02Icon,
  Delete01Icon,
  Upload01Icon,
  File01Icon,
  Settings01Icon,
  CheckmarkCircle02Icon,
  Alert01Icon,
  EyeIcon as EyeHugeIcon,
  Copy01Icon,
  Search01Icon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";

// Dashboard & Navigation Icons
export const DashboardIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <HugeiconsIcon icon={DashboardSquare01Icon} size={size} color={color} className={className} strokeWidth={1.5} />
);

export const LayoutIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <HugeiconsIcon icon={DashboardSquare01Icon} size={size} color={color} className={className} strokeWidth={1.5} />
);

export const PaletteIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <HugeiconsIcon icon={Settings01Icon} size={size} color={color} className={className} strokeWidth={1.5} />
);

export const ImageIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

export const BriefcaseIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
  </svg>
);

export const GalleryIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

// Action Icons
export const EditIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <HugeiconsIcon icon={Edit02Icon} size={size} color={color} className={className} strokeWidth={1.5} />
);
export const TagIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

export const PhoneIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);
export const DeleteIcon = ({ size = 24, color = "#CB2431", className = "" }) => (
  <HugeiconsIcon icon={Delete01Icon} size={size} color={color} className={className} strokeWidth={1.5} />
);

export const SaveIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

export const UploadIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <HugeiconsIcon icon={Upload01Icon} size={size} color={color} className={className} strokeWidth={1.5} />
);

// Status & Feedback Icons
export const EyeIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <HugeiconsIcon icon={EyeHugeIcon} size={size} color={color} className={className} strokeWidth={1.5} />
);

export const CheckIcon = ({ size = 24, color = "#22863A", className = "" }) => (
  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={size} color={color} className={className} strokeWidth={1.5} />
);

export const AlertIcon = ({ size = 24, color = "#CB2431", className = "" }) => (
  <HugeiconsIcon icon={Alert01Icon} size={size} color={color} className={className} strokeWidth={1.5} />
);

export const SuccessIcon = ({ size = 24, color = "#22863A", className = "" }) => (
  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={size} color={color} className={className} strokeWidth={1.5} />
);

export const LoadingIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <HugeiconsIcon icon={Refresh01Icon} size={size} color={color} className={className + " animate-spin"} strokeWidth={1.5} />
);

// File & Content Icons
export const FileIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <HugeiconsIcon icon={File01Icon} size={size} color={color} className={className} strokeWidth={1.5} />
);

export const FileTextIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="13" x2="12" y2="17"></line>
    <line x1="10" y1="15" x2="14" y2="15"></line>
  </svg>
);

export const SettingsIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <HugeiconsIcon icon={Settings01Icon} size={size} color={color} className={className} strokeWidth={1.5} />
);

export const StarIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 10.26 24 10.35 17.27 16.61 19.16 25.88 12 20.77 4.84 25.88 6.73 16.61 0 10.35 8.91 10.26 12 2"></polygon>
  </svg>
);

// Utility Icons (Simple SVG for close/add)
export const CloseIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const AddIcon = ({ size = 24, color = "#000000", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
