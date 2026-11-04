import {
  Bookmark,
  Compass,
  Heart,
  House,
  MessageCircle,
  Settings,
  SquarePen,
} from "lucide-react";
export const navigation = [
  { href: "/", icon: House, key: "home" },
  { href: "/explore", icon: Compass, key: "explore" },
  { href: "/messages", icon: MessageCircle, key: "messages" },
  { href: "/saved", icon: Bookmark, key: "saved" },
  { href: "/memberships", icon: Heart, key: "memberships" },
] as const;
export const accountNavigation = [
  { href: "/studio", icon: SquarePen, label: "Estúdio" },
  { href: "/settings", icon: Settings, label: "Configurações" },
] as const;
