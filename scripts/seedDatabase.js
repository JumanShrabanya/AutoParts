import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGO_URL || "mongodb://localhost:27017/auto_parts";

const categories = [
  {
    name: "Engine Parts",
    description: "Complete engine components and accessories",
    icon: "engine",
    color: "from-red-500 to-orange-500",
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Brake System",
    description: "Brake pads, rotors, calipers, and brake lines",
    icon: "brakes",
    color: "from-blue-500 to-cyan-500",
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Electrical System",
    description: "Batteries, alternators, starters, and wiring",
    icon: "electrical",
    color: "from-yellow-500 to-amber-500",
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Suspension & Steering",
    description: "Shocks, struts, springs, and steering components",
    icon: "suspension",
    color: "from-green-500 to-emerald-500",
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "Exhaust System",
    description: "Headers, mufflers, catalytic converters, and pipes",
    icon: "exhaust",
    color: "from-purple-500 to-pink-500",
    isActive: true,
    sortOrder: 5,
  },
  {
    name: "Tires & Wheels",
    description: "Tires, rims, wheel bearings, and tire accessories",
    icon: "tires",
    color: "from-gray-500 to-slate-500",
    isActive: true,
    sortOrder: 6,
  },
  {
    name: "Lighting & Electrical",
    description: "Headlights, taillights, bulbs, and electrical accessories",
    icon: "lighting",
    color: "from-indigo-500 to-blue-500",
    isActive: true,
    sortOrder: 7,
  },
  {
    name: "Fluids & Lubricants",
    description: "Motor oil, transmission fluid, brake fluid, and additives",
    icon: "fluids",
    color: "from-orange-500 to-red-500",
    isActive: true,
    sortOrder: 8,
  },
  {
    name: "Transmission & Drivetrain",
    description: "Clutch, transmission, driveshaft, and differential parts",
    icon: "transmission",
    color: "from-teal-500 to-cyan-500",
    isActive: true,
    sortOrder: 9,
  },
  {
    name: "Cooling System",
    description: "Radiators, water pumps, thermostats, and hoses",
    icon: "cooling",
    color: "from-blue-500 to-indigo-500",
    isActive: true,
    sortOrder: 10,
  },
  {
    name: "Fuel System",
    description: "Fuel pumps, injectors, filters, and fuel lines",
    icon: "fuel",
    color: "from-green-500 to-teal-500",
    isActive: true,
    sortOrder: 11,
  },
  {
    name: "Interior & Exterior",
    description: "Seats, dashboards, body panels, and trim",
    icon: "interior",
    color: "from-pink-500 to-rose-500",
    isActive: true,
    sortOrder: 12,
  },
  {
    name: "Tools & Equipment",
    description: "Hand tools, diagnostic equipment, and shop supplies",
    icon: "tools",
    color: "from-gray-500 to-zinc-500",
    isActive: true,
    sortOrder: 13,
  },
  {
    name: "Performance Parts",
    description: "Turbochargers, superchargers, and performance upgrades",
    icon: "performance",
    color: "from-red-500 to-pink-500",
    isActive: true,
    sortOrder: 14,
  },
  {
    name: "Maintenance & Care",
    description: "Filters, wipers, belts, and maintenance kits",
    icon: "maintenance",
    color: "from-emerald-500 to-green-500",
    isActive: true,
    sortOrder: 15,
  },
];

const brands = [
  {
    name: "Toyota",
    description: "Japanese automotive manufacturer known for reliability",
    logo: "toyota-logo.png",
    website: "https://www.toyota.com",
    country: "Japan",
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Honda",
    description: "Japanese manufacturer of automobiles and motorcycles",
    logo: "honda-logo.png",
    website: "https://www.honda.com",
    country: "Japan",
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Ford",
    description: "American multinational automaker",
    logo: "ford-logo.png",
    website: "https://www.ford.com",
    country: "USA",
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "BMW",
    description: "German luxury vehicle and motorcycle manufacturer",
    logo: "bmw-logo.png",
    website: "https://www.bmw.com",
    country: "Germany",
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "Mercedes-Benz",
    description: "German global automobile marque",
    logo: "mercedes-logo.png",
    website: "https://www.mercedes-benz.com",
    country: "Germany",
    isActive: true,
    sortOrder: 5,
  },
  {
    name: "Audi",
    description: "German automobile manufacturer of luxury vehicles",
    logo: "audi-logo.png",
    website: "https://www.audi.com",
    country: "Germany",
    isActive: true,
    sortOrder: 6,
  },
  {
    name: "Volkswagen",
    description: "German multinational automotive manufacturer",
    logo: "volkswagen-logo.png",
    website: "https://www.volkswagen.com",
    country: "Germany",
    isActive: true,
    sortOrder: 7,
  },
  {
    name: "Nissan",
    description: "Japanese multinational automobile manufacturer",
    logo: "nissan-logo.png",
    website: "https://www.nissan.com",
    country: "Japan",
    isActive: true,
    sortOrder: 8,
  },
  {
    name: "Chevrolet",
    description: "American automobile division of General Motors",
    logo: "chevrolet-logo.png",
    website: "https://www.chevrolet.com",
    country: "USA",
    isActive: true,
    sortOrder: 9,
  },
  {
    name: "Hyundai",
    description: "South Korean multinational automotive manufacturer",
    logo: "hyundai-logo.png",
    website: "https://www.hyundai.com",
    country: "South Korea",
    isActive: true,
    sortOrder: 10,
  },
  {
    name: "Kia",
    description: "South Korean multinational automotive manufacturer",
    logo: "kia-logo.png",
    website: "https://www.kia.com",
    country: "South Korea",
    isActive: true,
    sortOrder: 11,
  },
  {
    name: "Mazda",
    description: "Japanese multinational automaker",
    logo: "mazda-logo.png",
    website: "https://www.mazda.com",
    country: "Japan",
    isActive: true,
    sortOrder: 12,
  },
  {
    name: "Subaru",
    description: "Japanese automobile manufacturer",
    logo: "subaru-logo.png",
    website: "https://www.subaru.com",
    country: "Japan",
    isActive: true,
    sortOrder: 13,
  },
  {
    name: "Volvo",
    description: "Swedish luxury vehicle manufacturer",
    logo: "volvo-logo.png",
    website: "https://www.volvo.com",
    country: "Sweden",
    isActive: true,
    sortOrder: 14,
  },
  {
    name: "Lexus",
    description: "Japanese luxury vehicle division of Toyota",
    logo: "lexus-logo.png",
    website: "https://www.lexus.com",
    country: "Japan",
    isActive: true,
    sortOrder: 15,
  },
  {
    name: "Acura",
    description: "Japanese luxury vehicle division of Honda",
    logo: "acura-logo.png",
    website: "https://www.acura.com",
    country: "Japan",
    isActive: true,
    sortOrder: 16,
  },
  {
    name: "Infiniti",
    description: "Japanese luxury vehicle division of Nissan",
    logo: "infiniti-logo.png",
    website: "https://www.infiniti.com",
    country: "Japan",
    isActive: true,
    sortOrder: 17,
  },
  {
    name: "Buick",
    description: "American automobile division of General Motors",
    logo: "buick-logo.png",
    website: "https://www.buick.com",
    country: "USA",
    isActive: true,
    sortOrder: 18,
  },
  {
    name: "Cadillac",
    description: "American luxury vehicle division of General Motors",
    logo: "cadillac-logo.png",
    website: "https://www.cadillac.com",
    country: "USA",
    isActive: true,
    sortOrder: 19,
  },
  {
    name: "Lincoln",
    description: "American luxury vehicle division of Ford",
    logo: "lincoln-logo.png",
    website: "https://www.lincoln.com",
    country: "USA",
    isActive: true,
    sortOrder: 20,
  },
];

async function seedDatabase() {
  try {
    // Dynamic imports for ES modules
    const Category = (await import("../models/category.model.js")).default;
    const Brand = (await import("../models/brand.model.js")).default;

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    console.log("\n🌱 Starting database seeding...\n");

    // Seed Categories
    console.log("📋 Seeding Categories...");
    await Category.deleteMany({});
    console.log("🗑️  Cleared existing categories");

    const categoryResult = await Category.insertMany(categories);
    console.log(`✅ Successfully inserted ${categoryResult.length} categories`);

    // Seed Brands
    console.log("\n🏷️  Seeding Brands...");
    await Brand.deleteMany({});
    console.log("🗑️  Cleared existing brands");

    const brandResult = await Brand.insertMany(brands);
    console.log(`✅ Successfully inserted ${brandResult.length} brands`);

    console.log("\n📊 Seeding Summary:");
    console.log(`   Categories: ${categoryResult.length}`);
    console.log(`   Brands: ${brandResult.length}`);
    console.log(`   Total: ${categoryResult.length + brandResult.length}`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n💡 You can now use the parts page with real data!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

seedDatabase();
