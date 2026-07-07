import * as React from "react";

type LucideProps = React.SVGProps<SVGSVGElement> & {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
};

type LucideIcon = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

declare module "lucide-react" {
  export type { LucideProps, LucideIcon };
  export const Activity: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Award: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Bell: LucideIcon;
  export const Box: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronDownIcon: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronLeftIcon: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronRightIcon: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Circle: LucideIcon;
  export const Clock: LucideIcon;
  export const Eye: LucideIcon;
  export const FileText: LucideIcon;
  export const GripVertical: LucideIcon;
  export const Heart: LucideIcon;
  export const Headphones: LucideIcon;
  export const Image: LucideIcon;
  export const LayoutGrid: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const Mail: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Menu: LucideIcon;
  export const Minus: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Package: LucideIcon;
  export const PanelLeft: LucideIcon;
  export const Phone: LucideIcon;
  export const Play: LucideIcon;
  export const Plus: LucideIcon;
  export const Quote: LucideIcon;
  export const Rocket: LucideIcon;
  export const Search: LucideIcon;
  export const Shield: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Sprout: LucideIcon;
  export const Star: LucideIcon;
  export const Store: LucideIcon;
  export const Target: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const UserCog: LucideIcon;
  export const Users: LucideIcon;
  export const Wallet: LucideIcon;
  export const X: LucideIcon;
  export const Zap: LucideIcon;
  export const MapPin: LucideIcon;
}
