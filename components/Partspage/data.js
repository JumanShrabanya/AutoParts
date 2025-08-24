import {
  Settings,
  Wrench,
  Battery,
  Car,
  Zap,
  Circle,
  Lightbulb,
  Droplets,
} from "lucide-react";

// Default category icons mapping for fallback
export const defaultCategoryIcons = {
  engine: Settings,
  brakes: Wrench,
  electrical: Battery,
  suspension: Car,
  exhaust: Zap,
  tires: Circle,
  lighting: Lightbulb,
  fluids: Droplets,
};

// Default category colors for fallback
export const defaultCategoryColors = {
  engine: "from-red-500 to-orange-500",
  brakes: "from-blue-500 to-cyan-500",
  electrical: "from-yellow-500 to-amber-500",
  suspension: "from-green-500 to-emerald-500",
  exhaust: "from-purple-500 to-pink-500",
  tires: "from-gray-500 to-slate-500",
  lighting: "from-indigo-500 to-blue-500",
  fluids: "from-orange-500 to-red-500",
};
