const mongoose = require("mongoose");
const Brand = require("../models/brand.model.js");

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI =
  process.env.MONGO_URL || "mongodb://localhost:27017/auto_parts";

// Hardcoded brands data
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

async function seedBrands() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing brands
    await Brand.deleteMany({});
    console.log("🗑️  Cleared existing brands");

    // Insert new brands
    const result = await Brand.insertMany(brands);
    console.log(`✅ Successfully inserted ${result.length} brands`);

    // Display inserted brands
    console.log("\n📋 Inserted Brands:");
    result.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name} - ${brand.country}`);
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
seedBrands();
