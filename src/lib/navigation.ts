import {
  Home,
  Sprout,
  Camera,
  CloudSun,
  Brain,
  History,
  BellRing,
  User,
  ShieldAlert,
  FlaskConical,
  Mic,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

/** Primary farmer-friendly navigation shown in the sidebar and mobile bar. */
export const primaryNav: NavItem[] = [
  { to: "/dashboard", label: "Home", icon: Home, description: "Today's field summary" },
  { to: "/fields", label: "My Fields", icon: Sprout, description: "Your land and crops" },
  { to: "/diagnosis", label: "Diagnosis", icon: Camera, description: "Check a crop photo" },
  { to: "/weather", label: "Weather", icon: CloudSun, description: "Rain, heat and wind" },
  { to: "/intelligence", label: "Field Intelligence", icon: Brain, description: "Decisions and why" },
  { to: "/history", label: "History", icon: History, description: "Past checks and actions" },
  { to: "/reminders", label: "Reminders", icon: BellRing, description: "What to do next" },
  { to: "/profile", label: "Profile", icon: User, description: "Language and account" },
];

/** Secondary tools reachable from Field Intelligence. */
export const secondaryNav: NavItem[] = [
  { to: "/risk", label: "Risk Prediction", icon: ShieldAlert, description: "What may go wrong" },
  { to: "/what-if", label: "What-If", icon: FlaskConical, description: "Compare your choices" },
  { to: "/chat", label: "Talk to My Field", icon: Mic, description: "Ask by voice" },
];

/** Items shown in the compact mobile bottom bar. */
export const mobileNav: NavItem[] = [
  primaryNav[0]!,
  primaryNav[1]!,
  primaryNav[2]!,
  primaryNav[3]!,
  primaryNav[7]!,
];