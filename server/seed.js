const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Product = require("./models/Product");
const { connectMongoWithDnsFallback } = require("./utils/mongoConnection");

const products = [
  {
    name: "Chronos Artifact v2",
    slug: "chronos-artifact-v2",
    description: "Precision wearable chronograph with neural-sync telemetry.",
    price: 799,
    category: "Peripherals",
    brand: "TECH_ARTIFACT",
    specs: {
      processor: "TA SyncCore M2",
      gpu: "Integrated",
      ram: "2 GB",
      storage: "32 GB",
      display: "AMOLED 1.8\"",
      battery: "72 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 48,
    rating: 4.8,
    reviewCount: 312,
    featured: true
  },
  {
    name: "Echo Isolation Pro",
    slug: "echo-isolation-pro",
    description: "Studio-grade active noise isolation headset for creators.",
    price: 449,
    category: "Audio",
    brand: "Aural",
    specs: {
      processor: "Aural DSP-X",
      gpu: "N/A",
      ram: "N/A",
      storage: "N/A",
      display: "Touch controls",
      battery: "40 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 72,
    rating: 4.7,
    reviewCount: 210,
    featured: true
  },
  {
    name: "Tactile Precision K-8",
    slug: "tactile-precision-k-8",
    description: "Low-latency mechanical keyboard with adaptive switch feedback.",
    price: 229,
    category: "Peripherals",
    brand: "Vector",
    specs: {
      processor: "Input Matrix G6",
      gpu: "N/A",
      ram: "N/A",
      storage: "Profiles 16 MB",
      display: "OLED status strip",
      battery: "Wired"
    },
    images: [
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 19,
    rating: 4.6,
    reviewCount: 174,
    featured: true
  },
  {
    name: "X9 Graphene Titanium Pro",
    slug: "x9-graphene-titanium-pro",
    description: "Flagship workstation for intensive rendering and AI workloads.",
    price: 2499,
    category: "Workstations",
    brand: "TECH_ARTIFACT",
    specs: {
      processor: "TA Quantum i9",
      gpu: "RTX 5090 24GB",
      ram: "64 GB DDR5",
      storage: "2 TB NVMe",
      display: "16\" 4K OLED",
      battery: "11 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587614382346-ac55c0f9a142?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 9,
    rating: 4.9,
    reviewCount: 402,
    featured: true
  },
  {
    name: "Aura Book Pro 16",
    slug: "aura-book-pro-16",
    description: "Thin productivity workstation with all-day battery.",
    price: 1899,
    category: "Laptops",
    brand: "Dell Pro",
    specs: {
      processor: "Intel Ultra 9",
      gpu: "RTX 4070",
      ram: "32 GB",
      storage: "1 TB SSD",
      display: "16\" QHD",
      battery: "14 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 24,
    rating: 4.5,
    reviewCount: 133,
    featured: false
  },
  {
    name: "Titan Tower G1",
    slug: "titan-tower-g1",
    description: "High-core desktop tower with ultra-stable thermal profile.",
    price: 2199,
    category: "Workstations",
    brand: "Razer",
    specs: {
      processor: "Ryzen 9 9950X",
      gpu: "RTX 5080",
      ram: "64 GB",
      storage: "2 TB SSD",
      display: "External",
      battery: "N/A"
    },
    images: [
      "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 17,
    rating: 4.6,
    reviewCount: 87,
    featured: false
  },
  {
    name: "Vision X 34 OLED",
    slug: "vision-x-34-oled",
    description: "Ultra-wide OLED monitor for precision color workflows.",
    price: 1199,
    category: "Peripherals",
    brand: "Samsung",
    specs: {
      processor: "N/A",
      gpu: "N/A",
      ram: "N/A",
      storage: "N/A",
      display: "34\" OLED",
      battery: "N/A"
    },
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 38,
    rating: 4.7,
    reviewCount: 211,
    featured: false
  },
  {
    name: "X-Frame Slim 14",
    slug: "x-frame-slim-14",
    description: "Portable machine optimized for design and note-taking.",
    price: 1399,
    category: "Laptops",
    brand: "Apple",
    specs: {
      processor: "M5 Pro",
      gpu: "16-core GPU",
      ram: "24 GB",
      storage: "512 GB SSD",
      display: "14\" Liquid Retina",
      battery: "16 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 30,
    rating: 4.8,
    reviewCount: 305,
    featured: false
  },
  {
    name: "Sketch Pad Pro 12",
    slug: "sketch-pad-pro-12",
    description: "High-response drawing tablet with haptic stylus support.",
    price: 699,
    category: "Peripherals",
    brand: "Apple",
    specs: {
      processor: "A18X",
      gpu: "10-core GPU",
      ram: "16 GB",
      storage: "256 GB",
      display: "12\" Mini-LED",
      battery: "12 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 54,
    rating: 4.7,
    reviewCount: 198,
    featured: false
  },
  {
    name: "NeuroPulse X-1",
    slug: "neuropulse-x-1",
    description: "Adaptive wireless mouse tuned for ergonomic precision.",
    price: 149,
    category: "Peripherals",
    brand: "Vector",
    specs: {
      processor: "VectorSense",
      gpu: "N/A",
      ram: "N/A",
      storage: "N/A",
      display: "N/A",
      battery: "120 days"
    },
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 12,
    rating: 4.4,
    reviewCount: 91,
    featured: false
  },
  {
    name: "Tactile-G6 Console",
    slug: "tactile-g6-console",
    description: "Compact control console for studio and command setups.",
    price: 499,
    category: "Peripherals",
    brand: "Vector",
    specs: {
      processor: "ControlCore G6",
      gpu: "N/A",
      ram: "4 GB",
      storage: "128 GB",
      display: "7\" touch panel",
      battery: "Wired"
    },
    images: [
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 8,
    rating: 4.5,
    reviewCount: 64,
    featured: false
  },
  {
    name: "AetherBook Pro",
    slug: "aetherbook-pro",
    description: "All-round business laptop with secure enclave encryption.",
    price: 1649,
    category: "Laptops",
    brand: "Dell Pro",
    specs: {
      processor: "Intel Ultra 7",
      gpu: "RTX 4060",
      ram: "32 GB",
      storage: "1 TB SSD",
      display: "15\" QHD",
      battery: "13 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1200&q=80"
    ],
    stock: 5,
    rating: 4.3,
    reviewCount: 58,
    featured: false
  }
];

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Add it to .env before seeding.");
  }

  await connectMongoWithDnsFallback(mongoUri);
  await Product.deleteMany({});
  await Product.insertMany(products);
  // eslint-disable-next-line no-console
  console.log(`Seed completed: ${products.length} products inserted.`);
  await mongoose.disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", error.message);
    process.exit(1);
  });
