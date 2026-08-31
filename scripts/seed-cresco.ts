import { categories, products, services } from "../src/lib/catalog";

const CRESCO_URL = process.env.CRESCO_API_URL || "http://localhost:3000";

async function seed() {
  console.log(`\n🌱 Starting CrescoDB Seeding against ${CRESCO_URL}...\n`);

  try {
    // 1. Test connection
    const healthCheck = await fetch(`${CRESCO_URL}/categories`).catch(() => null);
    if (!healthCheck) {
      console.warn(`⚠️  Could not reach CrescoDB on ${CRESCO_URL}.`);
      console.warn(`👉 Make sure CrescoDB is running (run 'cresco dev' in your terminal).`);
      console.log(`ℹ️  Your application is already configured to gracefully use catalog fallbacks.\n`);
      return;
    }

    // 2. Seed Categories
    console.log(`📦 Seeding ${categories.length} Categories...`);
    for (const cat of categories) {
      try {
        await fetch(`${CRESCO_URL}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: cat.slug,
            name: cat.name,
            blurb: cat.blurb,
            icon: cat.icon,
            color: cat.color,
            bgClass: cat.bgClass,
            image: cat.image,
            createdAt: new Date().toISOString(),
          }),
        });
      } catch {
        // ignore duplicate
      }
    }
    console.log("  ✓ Categories seeded.");

    // 3. Seed Products
    console.log(`📦 Seeding ${products.length} Products...`);
    for (const prod of products) {
      try {
        await fetch(`${CRESCO_URL}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...prod,
            inStock: true,
            createdAt: new Date().toISOString(),
          }),
        });
      } catch {
        // ignore duplicate
      }
    }
    console.log("  ✓ Products seeded.");

    // 4. Seed Services
    console.log(`📦 Seeding ${services.length} Services...`);
    for (const serv of services) {
      try {
        await fetch(`${CRESCO_URL}/services`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: serv.slug,
            name: serv.name,
            tagline: serv.description,
            startingPrice: serv.from,
            duration: serv.duration,
            warranty: serv.warranty,
            highlights: serv.includes,
            image: serv.image,
            createdAt: new Date().toISOString(),
          }),
        });
      } catch {
        // ignore duplicate
      }
    }
    console.log("  ✓ Services seeded.");

    console.log("\n🎉 CrescoDB database successfully initialized and seeded with clean Lumora catalog!\n");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

seed();
