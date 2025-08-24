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

export const categories = [
  {
    id: "engine",
    name: "Engine Parts",
    icon: Settings,
    color: "from-red-500 to-orange-500",
    count: 1247,
  },
  {
    id: "brakes",
    name: "Brake System",
    icon: Wrench,
    color: "from-blue-500 to-cyan-500",
    count: 892,
  },
  {
    id: "electrical",
    name: "Electrical",
    icon: Battery,
    color: "from-yellow-500 to-amber-500",
    count: 1563,
  },
  {
    id: "suspension",
    name: "Suspension",
    icon: Car,
    color: "from-green-500 to-emerald-500",
    count: 734,
  },
  {
    id: "exhaust",
    name: "Exhaust System",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    count: 445,
  },
  {
    id: "tires",
    name: "Tires & Wheels",
    icon: Circle,
    color: "from-gray-500 to-slate-500",
    count: 1201,
  },
  {
    id: "lighting",
    name: "Lighting",
    icon: Lightbulb,
    color: "from-indigo-500 to-blue-500",
    count: 678,
  },
  {
    id: "fluids",
    name: "Fluids & Lubricants",
    icon: Droplets,
    color: "from-orange-500 to-red-500",
    count: 389,
  },
];

export const brands = [
  "Toyota",
  "Honda",
  "Ford",
  "BMW",
  "Mercedes",
  "Audi",
  "Volkswagen",
  "Nissan",
  "Chevrolet",
  "Hyundai",
];

export const dummyParts = [
  {
    id: 1,
    name: "High Performance Air Filter",
    category: "engine",
    brand: "K&N",
    price: 89.99,
    rating: 4.8,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    description:
      "Premium air filter for improved engine performance and fuel efficiency",
  },
  {
    id: 2,
    name: "Ceramic Brake Pads",
    category: "brakes",
    brand: "Brembo",
    price: 129.99,
    rating: 4.9,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    description: "High-performance brake pads with excellent stopping power",
  },
  {
    id: 3,
    name: "LED Headlight Bulbs",
    category: "lighting",
    brand: "Philips",
    price: 79.99,
    rating: 4.7,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    description: "Bright LED headlights for improved visibility and safety",
  },
  {
    id: 4,
    name: "Performance Exhaust System",
    category: "exhaust",
    brand: "Borla",
    price: 899.99,
    rating: 4.6,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    description: "Sport exhaust system for enhanced sound and performance",
  },
  {
    id: 5,
    name: "Synthetic Motor Oil",
    category: "fluids",
    brand: "Mobil 1",
    price: 34.99,
    rating: 4.8,
    reviews: 445,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    description: "Full synthetic motor oil for maximum engine protection",
  },
  {
    id: 6,
    name: "Performance Tires",
    category: "tires",
    brand: "Michelin",
    price: 189.99,
    rating: 4.9,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    description: "High-performance tires for sport driving and handling",
  },
  {
    id: 7,
    name: "Battery Charger",
    category: "electrical",
    brand: "NOCO",
    price: 59.99,
    rating: 4.7,
    reviews: 123,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    description: "Smart battery charger with multiple charging modes",
  },
  {
    id: 8,
    name: "Coilover Suspension Kit",
    category: "suspension",
    brand: "BC Racing",
    price: 1299.99,
    rating: 4.5,
    reviews: 45,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    description:
      "Adjustable suspension kit for custom ride height and handling",
  },
];
