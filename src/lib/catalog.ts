export type CategorySlug =
  | "home-appliances"
  | "electrical-materials"
  | "building-materials"
  | "home-solutions";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  oldPrice?: number;
  installFee?: number;
  installTime?: string;
  warranty: string;
  summary: string;
  specs: { label: string; value: string }[];
  badge?: string;
  rating: number;
  reviewCount: number;
  colorHex?: string;
  image: string;
};

export const categories: {
  slug: CategorySlug;
  name: string;
  blurb: string;
  icon: string;
  color: string;
  bgClass: string;
  image: string;
}[] = [
  {
    slug: "home-appliances",
    name: "Home Appliances",
    blurb: "Air conditioners, TVs, fridges, freezers, fans and inverters from trusted brands.",
    icon: "AirVent",
    color: "#3B82F6",
    bgClass: "from-blue-500/20 to-blue-600/5",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
  },
  {
    slug: "electrical-materials",
    name: "Electrical Materials",
    blurb: "Cables, breakers, distribution boards, sockets, lighting and accessories.",
    icon: "Zap",
    color: "#F59E0B",
    bgClass: "from-amber-500/20 to-amber-600/5",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
  },
  {
    slug: "building-materials",
    name: "Building Materials",
    blurb: "Conduits, PVC pipes, cement, tiles, roofing and site consumables.",
    icon: "Hammer",
    color: "#8B5CF6",
    bgClass: "from-violet-500/20 to-violet-600/5",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
  },
  {
    slug: "home-solutions",
    name: "Home Solutions",
    blurb: "Smart security, water systems, solar energy and home automation essentials.",
    icon: "Home",
    color: "#10B981",
    bgClass: "from-emerald-500/20 to-emerald-600/5",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
  },
];

export const products: Product[] = [
  // ── Home Appliances ────────────────────────────────────────────────────────
  {
    slug: "lg-1-5hp-dual-inverter-ac",
    name: "LG 1.5HP Dual Inverter Split AC",
    brand: "LG",
    category: "home-appliances",
    price: 585000,
    oldPrice: 640000,
    installFee: 35000,
    installTime: "3 – 4 hours",
    warranty: "2 years compressor warranty (10 years on inverter)",
    summary:
      "Energy-saving dual inverter split unit with fast cooling, low noise operation and gold-fin anti-corrosion coating — ideal for Nigerian power conditions.",
    specs: [
      { label: "Capacity", value: "1.5HP (12,000 BTU)" },
      { label: "Type", value: "Split, wall mounted" },
      { label: "Energy", value: "Inverter, works on 1.5kVA+" },
      { label: "Includes", value: "Indoor + outdoor unit, remote, copper kit" },
    ],
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 312,
    colorHex: "#DBEAFE",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "hisense-55-inch-4k-smart-tv",
    name: 'Hisense 55" 4K UHD Smart TV',
    brand: "Hisense",
    category: "home-appliances",
    price: 498000,
    installFee: 18000,
    installTime: "1 – 2 hours",
    warranty: "1 year manufacturer warranty",
    summary:
      "Crisp 4K panel with VIDAA smart platform, Dolby Audio and slim bezels. Professional wall mounting available with concealed cabling.",
    specs: [
      { label: "Screen", value: '55" 4K UHD' },
      { label: "Smart", value: "VIDAA OS, Netflix, YouTube" },
      { label: "Ports", value: "3x HDMI, 2x USB" },
      { label: "Mount", value: "VESA 300x300" },
    ],
    rating: 4.6,
    reviewCount: 189,
    colorHex: "#DBEAFE",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "haier-thermocool-inverter-fridge",
    name: "Haier Thermocool 350L Inverter Fridge",
    brand: "Haier Thermocool",
    category: "home-appliances",
    price: 712000,
    installFee: 12000,
    installTime: "45 minutes",
    warranty: "5 years compressor, 1 year parts",
    summary:
      "Double-door inverter refrigerator with stabiliser-free operation and 12-hour cooling retention during power cuts.",
    specs: [
      { label: "Capacity", value: "350 litres" },
      { label: "Doors", value: "Double door, frost free" },
      { label: "Power", value: "Stabiliser-free 140V – 260V" },
      { label: "Colour", value: "Silver" },
    ],
    rating: 4.5,
    reviewCount: 97,
    colorHex: "#DBEAFE",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "ox-ceiling-fan-56",
    name: 'OX 56" Ceiling Fan',
    brand: "OX",
    category: "home-appliances",
    price: 68500,
    installFee: 15000,
    installTime: "1 – 2 hours",
    warranty: "1 year warranty",
    summary:
      "Heavy-duty copper-wound ceiling fan with quiet high-speed motor and reversible airflow.",
    specs: [
      { label: "Sweep", value: '56" (1400mm)' },
      { label: "Motor", value: "100% copper winding" },
      { label: "Speeds", value: "5-step regulator" },
      { label: "Fitting", value: "Concrete or ceiling board" },
    ],
    rating: 4.4,
    reviewCount: 54,
    colorHex: "#DBEAFE",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "felicity-3-5kva-hybrid-inverter",
    name: "Felicity 3.5kVA Hybrid Inverter System",
    brand: "Felicity",
    category: "home-appliances",
    price: 1450000,
    installFee: 120000,
    installTime: "1 – 2 working days",
    warranty: "2 years inverter, 3 years battery",
    summary:
      "Complete backup solution with pure sine wave inverter, lithium battery bank and change-over. Sized for a 3-bedroom home.",
    specs: [
      { label: "Rating", value: "3.5kVA / 24V pure sine wave" },
      { label: "Battery", value: "2x 200Ah lithium" },
      { label: "Solar ready", value: "Yes, MPPT built in" },
      { label: "Includes", value: "Rack, cables, change-over" },
    ],
    badge: "Popular",
    rating: 4.9,
    reviewCount: 221,
    colorHex: "#DBEAFE",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "elepaq-6-5kva-generator",
    name: "Elepaq 6.5kVA Key-Start Generator",
    brand: "Elepaq",
    category: "home-appliances",
    price: 895000,
    installFee: 55000,
    installTime: "4 – 6 hours",
    warranty: "1 year engine warranty",
    summary:
      "Reliable petrol generator with key start, low-noise muffler and automatic voltage regulation. Installation covers siting, change-over and earthing.",
    specs: [
      { label: "Output", value: "6.5kVA / 100% copper alternator" },
      { label: "Start", value: "Key start + recoil" },
      { label: "Tank", value: "25 litres" },
      { label: "Fuel", value: "Petrol" },
    ],
    rating: 4.3,
    reviewCount: 78,
    colorHex: "#DBEAFE",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  },

  // ── Electrical Materials ───────────────────────────────────────────────────
  {
    slug: "nocaco-4mm-copper-cable",
    name: "Nocaco 4mm² Single Copper Cable (100m)",
    brand: "Nocaco",
    category: "electrical-materials",
    price: 148000,
    warranty: "SON certified, factory guaranteed",
    summary:
      "Full 100-metre coil of pure copper single-core cable for socket circuits and sub-mains. SON certified with accurate gauge.",
    specs: [
      { label: "Size", value: "4mm² single core" },
      { label: "Length", value: "100 metres" },
      { label: "Conductor", value: "99.9% pure copper" },
      { label: "Insulation", value: "PVC, 450/750V" },
    ],
    rating: 4.7,
    reviewCount: 143,
    colorHex: "#FEF3C7",
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "schneider-8-way-distribution-board",
    name: "Schneider 8-Way Distribution Board",
    brand: "Schneider Electric",
    category: "electrical-materials",
    price: 96500,
    installFee: 45000,
    installTime: "4 – 6 hours",
    warranty: "2 years warranty",
    summary:
      "Surface-mount consumer unit with busbar and neutral/earth links — ready for MCB and RCD population.",
    specs: [
      { label: "Ways", value: "8-way single phase" },
      { label: "Rating", value: "100A busbar" },
      { label: "Mounting", value: "Surface or flush" },
      { label: "Standard", value: "IEC 61439" },
    ],
    badge: "New",
    rating: 4.8,
    reviewCount: 66,
    colorHex: "#FEF3C7",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "led-panel-light-18w",
    name: "18W LED Recessed Panel Light (Pack of 10)",
    brand: "Rayflex",
    category: "electrical-materials",
    price: 82000,
    installFee: 30000,
    installTime: "2 – 3 hours",
    warranty: "1 year replacement warranty",
    summary:
      "Slim daylight panels for ceiling boards and POP — even glare-free output with long-life drivers.",
    specs: [
      { label: "Power", value: "18W each" },
      { label: "Colour", value: "6500K daylight" },
      { label: "Cut-out", value: "Ø 170mm" },
      { label: "Pack", value: "10 pieces + drivers" },
    ],
    rating: 4.5,
    reviewCount: 112,
    colorHex: "#FEF3C7",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "sockets-and-switches-bundle",
    name: "Premium Sockets & Switches Bundle (20pcs)",
    brand: "Clopal",
    category: "electrical-materials",
    price: 64000,
    warranty: "1 year warranty",
    summary:
      "Mixed bundle of 13A switched sockets and 1-gang/2-gang switches with brushed finish faceplates.",
    specs: [
      { label: "Contents", value: "12 sockets, 8 switches" },
      { label: "Rating", value: "13A / 250V" },
      { label: "Finish", value: "Brushed white & gold trim" },
      { label: "Box", value: "Metal back boxes included" },
    ],
    rating: 4.4,
    reviewCount: 88,
    colorHex: "#FEF3C7",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
  },

  // ── Building Materials ─────────────────────────────────────────────────────
  {
    slug: "pvc-conduit-pipes-20mm",
    name: "20mm PVC Electrical Conduit Pipes (Bundle of 50)",
    brand: "Rocket",
    category: "building-materials",
    price: 118000,
    warranty: "Factory guaranteed",
    summary:
      "Heavy-gauge conduit for concrete casting and wall chasing. Impact resistant and easy to bend with a spring.",
    specs: [
      { label: "Diameter", value: "20mm" },
      { label: "Length", value: "3m per pipe" },
      { label: "Bundle", value: "50 pipes" },
      { label: "Grade", value: "Heavy duty" },
    ],
    rating: 4.3,
    reviewCount: 41,
    colorHex: "#EDE9FE",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "porcelain-floor-tiles-60x60",
    name: "60x60 Porcelain Floor Tiles (per m²)",
    brand: "Goodwill",
    category: "building-materials",
    price: 12500,
    installFee: 6500,
    installTime: "Quoted per m²",
    warranty: "Batch-matched guarantee",
    summary:
      "Matte porcelain tiles with a soft stone finish — hard-wearing for living rooms, shops and corridors.",
    specs: [
      { label: "Size", value: "600 x 600mm" },
      { label: "Finish", value: "Matte porcelain" },
      { label: "Coverage", value: "Priced per square metre" },
      { label: "Use", value: "Interior floors" },
    ],
    badge: "Sale",
    rating: 4.6,
    reviewCount: 134,
    colorHex: "#EDE9FE",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "aluminium-roofing-sheet",
    name: "0.55mm Aluminium Roofing Sheet (per metre)",
    brand: "First Aluminium",
    category: "building-materials",
    price: 9800,
    warranty: "15 years anti-rust guarantee",
    summary:
      "Long-span aluminium roofing in step-tile or corrugated profile, cut to your rafter length.",
    specs: [
      { label: "Thickness", value: "0.55mm" },
      { label: "Profile", value: "Step tile / corrugated" },
      { label: "Width", value: "1.2m effective" },
      { label: "Colours", value: "Charcoal, blue, red" },
    ],
    rating: 4.5,
    reviewCount: 57,
    colorHex: "#EDE9FE",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "dangote-cement",
    name: "Dangote 3X Cement (per bag)",
    brand: "Dangote",
    category: "building-materials",
    price: 9200,
    warranty: "Fresh stock, dated bags",
    summary:
      "Grade 42.5R cement for foundations, blockwork and plastering. Bulk pricing available for site orders.",
    specs: [
      { label: "Grade", value: "42.5R" },
      { label: "Weight", value: "50kg bag" },
      { label: "Delivery", value: "Truckload options available" },
      { label: "Storage", value: "Dry, dated stock" },
    ],
    rating: 4.7,
    reviewCount: 209,
    colorHex: "#EDE9FE",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80",
  },

  // ── Home Solutions ─────────────────────────────────────────────────────────
  {
    slug: "hikvision-4ch-cctv-kit",
    name: "Hikvision 4-Channel 1080p CCTV Kit",
    brand: "Hikvision",
    category: "home-solutions",
    price: 385000,
    installFee: 60000,
    installTime: "4 – 6 hours",
    warranty: "2 years manufacturer warranty",
    summary:
      "Complete 4-camera DVR kit with night vision, mobile viewing and 1TB storage — covers a full residential compound.",
    specs: [
      { label: "Cameras", value: "4x 2MP dome cameras" },
      { label: "DVR", value: "4-channel, H.265+" },
      { label: "Storage", value: "1TB HDD included" },
      { label: "Night vision", value: "Up to 30m IR range" },
    ],
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 176,
    colorHex: "#D1FAE5",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "yale-smart-door-lock",
    name: "Yale Smart Fingerprint Door Lock",
    brand: "Yale",
    category: "home-solutions",
    price: 148000,
    installFee: 25000,
    installTime: "2 – 3 hours",
    warranty: "2 years warranty",
    summary:
      "Biometric door lock with fingerprint, PIN code and physical key backup — fits most standard doors.",
    specs: [
      { label: "Access", value: "Fingerprint, PIN, key" },
      { label: "Power", value: "4x AA batteries (~12 months)" },
      { label: "Capacity", value: "100 fingerprints" },
      { label: "Backlit", value: "Yes, anti-peep PIN" },
    ],
    badge: "New",
    rating: 4.7,
    reviewCount: 93,
    colorHex: "#D1FAE5",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "grundfos-water-pump-1hp",
    name: "Grundfos 1HP Surface Water Pump",
    brand: "Grundfos",
    category: "home-solutions",
    price: 265000,
    installFee: 40000,
    installTime: "3 – 4 hours",
    warranty: "2 years motor warranty",
    summary:
      "High-performance centrifugal pump for overhead tank transfer and borehole applications. Self-priming, quiet operation.",
    specs: [
      { label: "Power", value: "1HP (0.75kW)" },
      { label: "Flow rate", value: "Up to 60 L/min" },
      { label: "Head", value: "Up to 35m" },
      { label: "Voltage", value: "220V single phase" },
    ],
    rating: 4.9,
    reviewCount: 148,
    colorHex: "#D1FAE5",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "longi-400w-solar-panel",
    name: "LONGi 400W Mono PERC Solar Panel",
    brand: "LONGi",
    category: "home-solutions",
    price: 189000,
    installFee: 85000,
    installTime: "1 working day",
    warranty: "25 years power output guarantee",
    summary:
      "Tier-1 monocrystalline panel with high efficiency and guaranteed output — the foundation of any reliable solar system.",
    specs: [
      { label: "Wattage", value: "400W" },
      { label: "Efficiency", value: "21.3%" },
      { label: "Type", value: "Mono PERC" },
      { label: "Warranty", value: "25 years linear output" },
    ],
    badge: "Popular",
    rating: 4.9,
    reviewCount: 267,
    colorHex: "#D1FAE5",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "automated-gate-motor",
    name: "BFT Virgo Sliding Gate Motor Kit",
    brand: "BFT",
    category: "home-solutions",
    price: 720000,
    installFee: 95000,
    installTime: "1 working day",
    warranty: "2 years",
    summary:
      "Robust sliding gate automation with remote controls, obstacle detection and backup battery for power-cut operation.",
    specs: [
      { label: "Gate weight", value: "Up to 1000kg" },
      { label: "Gate length", value: "Up to 18m" },
      { label: "Backup", value: "Battery backup included" },
      { label: "Remotes", value: "2x included, expandable" },
    ],
    rating: 4.6,
    reviewCount: 52,
    colorHex: "#D1FAE5",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "5000l-water-tank",
    name: "Roto 5000L Polyethylene Water Tank",
    brand: "Roto Tanks",
    category: "home-solutions",
    price: 195000,
    installFee: 35000,
    installTime: "Half day",
    warranty: "10 years UV-stabilised warranty",
    summary:
      "Food-grade polyethylene tank with UV-resistant black body and anti-mosquito fittings. Suitable for rooftop or ground installation.",
    specs: [
      { label: "Capacity", value: "5000 litres" },
      { label: "Material", value: "Food-grade PE" },
      { label: "Colour", value: "Black (UV resistant)" },
      { label: "Fittings", value: "In/out, overflow, breather" },
    ],
    rating: 4.7,
    reviewCount: 119,
    colorHex: "#D1FAE5",
    image: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&auto=format&fit=crop&q=80",
  },
];

export type Service = {
  slug: string;
  name: string;
  from: number;
  duration: string;
  warranty: string;
  description: string;
  includes: string[];
  image: string;
};

export const services: Service[] = [
  {
    slug: "air-conditioner-installation",
    name: "Air Conditioner Installation",
    from: 35000,
    duration: "3 – 4 hours",
    warranty: "6 months workmanship warranty",
    description:
      "Split and window unit installation with proper bracket mounting, vacuuming, gas check and drainage routing.",
    includes: ["Bracket & wall drilling", "Copper piping up to 3m", "Vacuum & gas test", "Drain routing"],
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "tv-wall-mounting",
    name: "TV Wall Mounting",
    from: 18000,
    duration: "1 – 2 hours",
    warranty: "3 months workmanship warranty",
    description: "Secure bracket fixing on block, concrete or drywall with cable concealment and device setup.",
    includes: ["Bracket fitting", "Level & anchor check", "Cable concealment", "Channel tuning"],
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "ceiling-fan-installation",
    name: "Ceiling Fan Installation",
    from: 15000,
    duration: "1 – 2 hours",
    warranty: "3 months workmanship warranty",
    description: "Safe hook or rod mounting with regulator wiring and balance testing.",
    includes: ["Hook/rod mounting", "Regulator wiring", "Balance test", "Earth continuity check"],
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "electrical-wiring",
    name: "Electrical Wiring & Rewiring",
    from: 150000,
    duration: "2 – 5 working days",
    warranty: "12 months workmanship warranty",
    description:
      "Full house or shop wiring, conduit work, distribution board population, earthing and certification.",
    includes: ["Conduit & cable pulling", "DB & MCB installation", "Earthing pit", "Load testing report"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "lighting-installation",
    name: "Lighting Installation",
    from: 30000,
    duration: "2 – 4 hours",
    warranty: "6 months workmanship warranty",
    description:
      "Panel lights, chandeliers, strip lighting and security floodlights fitted neatly with switching plans.",
    includes: ["Ceiling cut-outs", "Driver wiring", "Switch grouping", "Dimmer setup where applicable"],
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "inverter-system-installation",
    name: "Inverter & Solar System Setup",
    from: 120000,
    duration: "1 – 2 working days",
    warranty: "12 months workmanship warranty",
    description: "Load audit, battery rack assembly, change-over wiring and commissioning with usage training.",
    includes: ["Load audit", "Battery rack & cabling", "Change-over wiring", "Commissioning & training"],
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "generator-installation",
    name: "Generator Installation",
    from: 55000,
    duration: "4 – 6 hours",
    warranty: "6 months workmanship warranty",
    description:
      "Generator siting, base pad, exhaust routing, change-over switch and earthing for safe operation.",
    includes: ["Siting & base pad", "Exhaust routing", "Change-over switch", "Earthing & test run"],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "cctv-installation",
    name: "CCTV & Security Installation",
    from: 60000,
    duration: "4 – 6 hours",
    warranty: "6 months workmanship warranty",
    description: "Camera positioning, cable routing, DVR/NVR setup, remote viewing configuration and testing.",
    includes: ["Camera mounting", "Cable routing & trunking", "DVR/NVR setup", "Remote view config"],
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "smart-lock-installation",
    name: "Smart Lock & Access Control",
    from: 25000,
    duration: "2 – 3 hours",
    warranty: "3 months workmanship warranty",
    description: "Door prep, lock fitting, fingerprint/PIN enrolment and user training.",
    includes: ["Door assessment", "Lock fitting", "Fingerprint enrolment", "User training"],
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "water-pump-installation",
    name: "Water Pump & Tank Installation",
    from: 35000,
    duration: "3 – 5 hours",
    warranty: "6 months workmanship warranty",
    description: "Pump siting, pipework, pressure switch, control panel and test run to full flow.",
    includes: ["Pump siting & plinth", "Pipework & fittings", "Pressure switch wiring", "Test run"],
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "solar-panel-installation",
    name: "Solar Panel Installation",
    from: 85000,
    duration: "1 working day",
    warranty: "12 months workmanship warranty",
    description:
      "Panel racking, cable runs, combiner box, inverter connection and full system commissioning.",
    includes: ["Panel racking", "DC cable runs", "Combiner box", "System commissioning"],
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
