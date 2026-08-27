export type CategorySlug = "home-appliances" | "electrical-materials" | "building-materials";

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
};

export const categories: {
  slug: CategorySlug;
  name: string;
  blurb: string;
  icon: string;
}[] = [
  {
    slug: "home-appliances",
    name: "Home Appliances",
    blurb: "Air conditioners, TVs, fridges, freezers, fans and inverters from trusted brands.",
    icon: "AirVent",
  },
  {
    slug: "electrical-materials",
    name: "Electrical Materials",
    blurb: "Cables, breakers, distribution boards, sockets, lighting and accessories.",
    icon: "Zap",
  },
  {
    slug: "building-materials",
    name: "Building Materials",
    blurb: "Conduits, PVC pipes, cement, tiles, roofing and site consumables.",
    icon: "Hammer",
  },
];

export const products: Product[] = [
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
    badge: "Best seller",
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
  },
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
  },
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
    includes: [
      "Bracket & wall drilling",
      "Copper piping up to 3m",
      "Vacuum & gas test",
      "Drain routing",
    ],
  },
  {
    slug: "tv-wall-mounting",
    name: "TV Wall Mounting",
    from: 18000,
    duration: "1 – 2 hours",
    warranty: "3 months workmanship warranty",
    description:
      "Secure bracket fixing on block, concrete or drywall with cable concealment and device setup.",
    includes: ["Bracket fitting", "Level & anchor check", "Cable concealment", "Channel tuning"],
  },
  {
    slug: "ceiling-fan-installation",
    name: "Ceiling Fan Installation",
    from: 15000,
    duration: "1 – 2 hours",
    warranty: "3 months workmanship warranty",
    description: "Safe hook or rod mounting with regulator wiring and balance testing.",
    includes: ["Hook/rod mounting", "Regulator wiring", "Balance test", "Earth continuity check"],
  },
  {
    slug: "electrical-wiring",
    name: "Electrical Wiring & Rewiring",
    from: 150000,
    duration: "2 – 5 working days",
    warranty: "12 months workmanship warranty",
    description:
      "Full house or shop wiring, conduit work, distribution board population, earthing and certification.",
    includes: [
      "Conduit & cable pulling",
      "DB & MCB installation",
      "Earthing pit",
      "Load testing report",
    ],
  },
  {
    slug: "lighting-installation",
    name: "Lighting Installation",
    from: 30000,
    duration: "2 – 4 hours",
    warranty: "6 months workmanship warranty",
    description:
      "Panel lights, chandeliers, strip lighting and security floodlights fitted neatly with switching plans.",
    includes: [
      "Ceiling cut-outs",
      "Driver wiring",
      "Switch grouping",
      "Dimmer setup where applicable",
    ],
  },
  {
    slug: "inverter-system-installation",
    name: "Inverter & Solar System Setup",
    from: 120000,
    duration: "1 – 2 working days",
    warranty: "12 months workmanship warranty",
    description:
      "Load audit, battery rack assembly, change-over wiring and commissioning with usage training.",
    includes: [
      "Load audit",
      "Battery rack & cabling",
      "Change-over wiring",
      "Commissioning & training",
    ],
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
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
