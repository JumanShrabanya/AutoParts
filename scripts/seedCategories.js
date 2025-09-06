const mongoose = require("mongoose");
const Category = require("../models/category.model.js");

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI =
  process.env.MONGO_URL || "mongodb://localhost:27017/auto_parts";

// Hardcoded categories data
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

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("🗑️  Cleared existing categories");

    // Insert new categories
    const result = await Category.insertMany(categories);
    console.log(`✅ Successfully inserted ${result.length} categories`);

    // Display inserted categories
    console.log("\n📋 Inserted Categories:");
    result.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} - ${category.description}`);
    });

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

// Run the seeding function
seedCategories();
