// Usage:
//   npm run seed:products          (writes to Woo)
//   npm run seed:products -- --dry-run   (prints payloads only)
//
// Env required (loaded from .env.local via `node --env-file`):
//   NEXT_PUBLIC_WOOCOMMERCE_URL
//   WOOCOMMERCE_CONSUMER_KEY
//   WOOCOMMERCE_CONSUMER_SECRET    (must have Read/Write permission)

import WooCommerceRestApiPkg from "@woocommerce/woocommerce-rest-api";

const WooCommerceRestApi = WooCommerceRestApiPkg.default ?? WooCommerceRestApiPkg;

/**
 * @typedef {Object} ProductContent
 * @property {string} [short_description] - HTML
 * @property {string} [description] - HTML
 * @property {string} [weight] - in store weight unit (e.g. kg)
 * @property {{ length: string, width: string, height: string }} [dimensions]
 * @property {Record<string, string>} [attributes] - case-insensitive merge by name
 * @property {Record<string, unknown>} [meta] - meta_data key → value (Woo merges by key)
 */

/** @type {Record<string, ProductContent>} */
const content = {
  "one-chance-board-game": {
    short_description:
      "<p>One Chance is the perfect game for bringing people together and creating lasting memories while learning how the world and money truly work.</p>",
    description:
      "<p>One Chance is an intense and exciting experience. It is also fun and highly educational. The very first authentically Nigerian board game. One Chance packs the highs and lows of being Nigerian into a very intense and exciting experience for everyone.</p><p><i>It's like monopoly but better!</i></p>",
    weight: "0.75",
    dimensions: { length: "23", width: "23", height: "5" },
    attributes: {
      Age: "16+",
      Players: "2-6",
      "Play Time": "15 MIN",
    },
    meta: {
      oc_tagline: "The first authentic Nigerian board game",
      oc_box_items: [
        "One Chance Board",
        "Dice",
        "Tokens",
        "One Chance Cards",
        "Market Cards",
        "Naira Cash",
        "One Chance Naira Money",
        "Rule Book",
      ],
      oc_quick_start_image: "/images/shop/game-board.png",
      oc_quick_start_steps: [
        {
          title: "WHAT IS ONE CHANCE",
          description:
            "Learn about the core mechanics and the story behind Nigeria's first authentic board game.",
        },
        {
          title: "TRAFFIC & PRISON",
          description:
            "Navigate the notorious Lagos traffic and avoid the pitfalls of the prison squares.",
        },
        {
          title: "AJO CONTRIBUTION",
          description:
            "Participate in the communal savings scheme to boost your wealth or help a friend.",
        },
        {
          title: "GETTING RICH",
          description:
            "Strategize your moves to accumulate the most Naira and become the ultimate winner.",
        },
      ],
      oc_faqs: [
        {
          question: "What is the recommended age range for players of the game?",
          answer: "One Chance is recommended for players aged 16 and above.",
        },
        {
          question: "Are there multiple modes of playing the game?",
          answer:
            "Yes! One Chance can be played in multiple ways depending on your group size and time.",
        },
        {
          question: "How many players can play the game at once?",
          answer: "One Chance supports 2 to 6 players per game session.",
        },
        {
          question: "How does the game end?",
          answer:
            "The game ends when a player successfully navigates all challenges and accumulates the most wealth.",
        },
        {
          question: "Where can one find the game to play?",
          answer:
            "One Chance is available for purchase through our website and select retail partners.",
        },
        {
          question: "Can the game be customized or personalized in any way?",
          answer:
            "We offer customization options for bulk orders, including personalized cards and branding.",
        },
        {
          question: "Is the game available for bulk purchases?",
          answer: "Absolutely! We offer special pricing for bulk purchases.",
        },
      ],
    },
  },
  // Add more products here, keyed by slug:
  // "another-product-slug": { ... },
};

const dryRun = process.argv.includes("--dry-run");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://shopapi.yvpgame.com",
  consumerKey: requireEnv("WOOCOMMERCE_CONSUMER_KEY"),
  consumerSecret: requireEnv("WOOCOMMERCE_CONSUMER_SECRET"),
  version: "wc/v3",
});

async function findProductBySlug(slug) {
  const res = await api.get("products", { slug, status: "any" });
  return res.data[0] || null;
}

function mergeAttributes(existing, updates) {
  const norm = (s) => s.trim().toLowerCase();
  const updateMap = new Map(Object.entries(updates).map(([k, v]) => [norm(k), { name: k, value: v }]));
  const merged = existing.map((attr) => {
    const key = norm(attr.name);
    if (updateMap.has(key)) {
      const { value } = updateMap.get(key);
      updateMap.delete(key);
      return { ...attr, options: [value], visible: true };
    }
    return attr;
  });
  for (const { name, value } of updateMap.values()) {
    merged.push({
      name,
      options: [value],
      visible: true,
      variation: false,
    });
  }
  return merged;
}

function buildPayload(existing, plan) {
  const payload = {};
  if (plan.short_description !== undefined) payload.short_description = plan.short_description;
  if (plan.description !== undefined) payload.description = plan.description;
  if (plan.weight !== undefined) payload.weight = plan.weight;
  if (plan.dimensions !== undefined) payload.dimensions = plan.dimensions;
  if (plan.attributes) {
    payload.attributes = mergeAttributes(existing.attributes || [], plan.attributes);
  }
  if (plan.meta) {
    payload.meta_data = Object.entries(plan.meta).map(([key, value]) => ({ key, value }));
  }
  return payload;
}

async function seedOne(slug, plan) {
  const product = await findProductBySlug(slug);
  if (!product) {
    console.warn(`  ⚠  product not found: ${slug} — skipping`);
    return { slug, status: "missing" };
  }
  const payload = buildPayload(product, plan);
  const summary = {
    native: Object.keys(payload).filter((k) => !["attributes", "meta_data"].includes(k)),
    attributes: payload.attributes?.map((a) => `${a.name}=${a.options?.[0] ?? ""}`),
    meta: payload.meta_data?.map((m) => m.key),
  };
  console.log(`  → ${slug} (id=${product.id})`);
  console.log(`    native:     ${summary.native.join(", ") || "—"}`);
  console.log(`    attributes: ${summary.attributes?.join(", ") || "—"}`);
  console.log(`    meta:       ${summary.meta?.join(", ") || "—"}`);

  if (dryRun) return { slug, status: "dry-run" };

  await api.put(`products/${product.id}`, payload);
  return { slug, status: "updated" };
}

async function main() {
  console.log(`Seeding ${Object.keys(content).length} product(s)${dryRun ? " (dry run)" : ""}\n`);
  const results = [];
  for (const [slug, plan] of Object.entries(content)) {
    try {
      results.push(await seedOne(slug, plan));
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? String(err);
      console.error(`  ✗ ${slug}: ${msg}`);
      results.push({ slug, status: "error" });
    }
  }
  console.log("\nDone.");
  const counts = results.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {});
  for (const [status, n] of Object.entries(counts)) console.log(`  ${status}: ${n}`);
  if (counts.error) process.exit(1);
}

main();
