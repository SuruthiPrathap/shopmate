// Draws a simple colourful picture for products whose image is "auto".
// (Used when there is no photo link yet. Replace "auto" with a photo link any time.)
const crypto = require("crypto");

const PALETTES = [
  { bg: "#fef3c7", c: "#f59e0b", d: "#b45309", l: "#fde68a" },
  { bg: "#dbeafe", c: "#3b82f6", d: "#1d4ed8", l: "#bfdbfe" },
  { bg: "#dcfce7", c: "#22c55e", d: "#15803d", l: "#bbf7d0" },
  { bg: "#fce7f3", c: "#ec4899", d: "#be185d", l: "#fbcfe8" },
  { bg: "#ede9fe", c: "#8b5cf6", d: "#6d28d9", l: "#ddd6fe" },
  { bg: "#ffedd5", c: "#f97316", d: "#c2410c", l: "#fed7aa" },
  { bg: "#cffafe", c: "#06b6d4", d: "#0e7490", l: "#a5f3fc" },
  { bg: "#fee2e2", c: "#ef4444", d: "#b91c1c", l: "#fecaca" },
];
const LEG = "#475569";

// Each icon is drawn on a 400 x 400 canvas. c = main colour, d = dark, l = light.
const ICONS = {
  sofa: ({ c, d, l }) => `
    <rect x="70" y="165" width="260" height="95" rx="24" fill="${c}"/>
    <rect x="48" y="210" width="62" height="105" rx="20" fill="${d}"/>
    <rect x="290" y="210" width="62" height="105" rx="20" fill="${d}"/>
    <rect x="100" y="228" width="200" height="72" rx="14" fill="${l}"/>
    <rect x="70" y="315" width="14" height="28" rx="4" fill="${LEG}"/>
    <rect x="316" y="315" width="14" height="28" rx="4" fill="${LEG}"/>`,
  chair: ({ c, d, l }) => `
    <rect x="135" y="85" width="130" height="125" rx="20" fill="${c}"/>
    <rect x="152" y="102" width="96" height="90" rx="12" fill="${l}"/>
    <rect x="112" y="210" width="176" height="42" rx="14" fill="${d}"/>
    <rect x="132" y="250" width="16" height="92" rx="4" fill="${LEG}"/>
    <rect x="252" y="250" width="16" height="92" rx="4" fill="${LEG}"/>`,
  bed: ({ c, d, l }) => `
    <rect x="75" y="100" width="250" height="100" rx="16" fill="${d}"/>
    <rect x="55" y="195" width="290" height="78" rx="16" fill="${c}"/>
    <rect x="85" y="160" width="95" height="44" rx="20" fill="#ffffff"/>
    <rect x="220" y="160" width="95" height="44" rx="20" fill="#ffffff"/>
    <rect x="55" y="228" width="290" height="48" rx="14" fill="${l}"/>
    <rect x="70" y="274" width="18" height="50" rx="4" fill="${LEG}"/>
    <rect x="312" y="274" width="18" height="50" rx="4" fill="${LEG}"/>`,
  table: ({ c, d, l }) => `
    <rect x="52" y="165" width="296" height="28" rx="12" fill="${c}"/>
    <rect x="84" y="192" width="22" height="138" rx="6" fill="${d}"/>
    <rect x="294" y="192" width="22" height="138" rx="6" fill="${d}"/>
    <rect x="150" y="192" width="100" height="36" rx="8" fill="${l}"/>
    <circle cx="200" cy="210" r="5" fill="${d}"/>
    <rect x="178" y="112" width="44" height="54" rx="14" fill="${l}"/>
    <circle cx="200" cy="100" r="16" fill="${d}"/>`,
  wardrobe: ({ c, d, l }) => `
    <rect x="102" y="60" width="196" height="22" rx="8" fill="${d}"/>
    <rect x="110" y="80" width="180" height="252" rx="10" fill="${c}"/>
    <rect x="198" y="80" width="4" height="252" fill="${d}"/>
    <circle cx="185" cy="205" r="7" fill="${l}"/>
    <circle cx="215" cy="205" r="7" fill="${l}"/>
    <rect x="102" y="330" width="196" height="16" rx="6" fill="${d}"/>`,
  shelf: ({ c, d, l }) => `
    <rect x="95" y="62" width="210" height="278" rx="12" fill="${c}"/>
    <rect x="112" y="80" width="176" height="242" rx="6" fill="${l}"/>
    <rect x="112" y="158" width="176" height="10" fill="${d}"/>
    <rect x="112" y="238" width="176" height="10" fill="${d}"/>
    <rect x="128" y="112" width="20" height="46" rx="3" fill="${d}"/>
    <rect x="152" y="100" width="20" height="58" rx="3" fill="${c}"/>
    <rect x="176" y="118" width="20" height="40" rx="3" fill="#ffffff"/>
    <rect x="128" y="190" width="24" height="48" rx="3" fill="${c}"/>
    <rect x="156" y="198" width="20" height="40" rx="3" fill="${d}"/>
    <rect x="226" y="205" width="46" height="33" rx="6" fill="#ffffff"/>
    <rect x="150" y="272" width="46" height="50" rx="8" fill="${d}"/>
    <circle cx="173" cy="262" r="18" fill="${c}"/>`,
  blocks: ({ c, d, l }) => `
    <rect x="88" y="232" width="104" height="104" rx="12" fill="${c}"/>
    <rect x="208" y="232" width="104" height="104" rx="12" fill="${d}"/>
    <rect x="148" y="122" width="104" height="104" rx="12" fill="${l}"/>
    <text x="140" y="306" font-size="64" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif">A</text>
    <text x="260" y="306" font-size="64" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif">B</text>
    <text x="200" y="196" font-size="64" font-weight="800" fill="${d}" text-anchor="middle" font-family="Arial, sans-serif">C</text>`,
  teddy: ({ c, d, l }) => `
    <circle cx="128" cy="108" r="34" fill="${d}"/>
    <circle cx="272" cy="108" r="34" fill="${d}"/>
    <circle cx="128" cy="108" r="17" fill="${l}"/>
    <circle cx="272" cy="108" r="17" fill="${l}"/>
    <ellipse cx="200" cy="305" rx="78" ry="56" fill="${c}"/>
    <ellipse cx="200" cy="308" rx="42" ry="34" fill="${l}"/>
    <circle cx="200" cy="172" r="88" fill="${c}"/>
    <ellipse cx="200" cy="203" rx="40" ry="31" fill="${l}"/>
    <ellipse cx="200" cy="192" rx="13" ry="9" fill="${d}"/>
    <circle cx="168" cy="154" r="10" fill="#1f2937"/>
    <circle cx="232" cy="154" r="10" fill="#1f2937"/>`,
  bottle: ({ c, d, l }) => `
    <path d="M184 72 Q200 36 216 72 L216 102 L184 102 Z" fill="${d}"/>
    <rect x="160" y="100" width="80" height="24" rx="9" fill="${c}"/>
    <rect x="152" y="122" width="96" height="206" rx="28" fill="#ffffff" stroke="${c}" stroke-width="7"/>
    <rect x="158" y="196" width="84" height="126" rx="22" fill="${l}"/>
    <rect x="162" y="152" width="34" height="5" rx="2" fill="${d}"/>
    <rect x="162" y="182" width="34" height="5" rx="2" fill="${d}"/>
    <rect x="162" y="212" width="34" height="5" rx="2" fill="${d}"/>`,
  tshirt: ({ c, d, l }) => `
    <path d="M130 88 L92 124 L62 166 L108 192 L130 170 L130 318 L270 318 L270 170 L292 192 L338 166 L308 124 L270 88 Q240 126 200 126 Q160 126 130 88 Z" fill="${c}"/>
    <path d="M160 90 Q200 138 240 90 L232 84 Q200 116 168 84 Z" fill="${d}"/>
    <rect x="212" y="206" width="40" height="40" rx="8" fill="${l}"/>
    <circle cx="232" cy="226" r="9" fill="${d}"/>`,
  backpack: ({ c, d, l }) => `
    <path d="M168 112 Q200 62 232 112" fill="none" stroke="${d}" stroke-width="13" stroke-linecap="round"/>
    <rect x="108" y="108" width="184" height="226" rx="52" fill="${c}"/>
    <rect x="93" y="172" width="24" height="114" rx="11" fill="${d}"/>
    <rect x="283" y="172" width="24" height="114" rx="11" fill="${d}"/>
    <rect x="134" y="214" width="132" height="94" rx="24" fill="${d}"/>
    <rect x="168" y="238" width="64" height="9" rx="4" fill="${l}"/>
    <rect x="140" y="140" width="120" height="9" rx="4" fill="${l}"/>`,
  notebook: ({ c, d, l }) => `
    <rect x="112" y="76" width="176" height="258" rx="14" fill="${c}"/>
    <rect x="112" y="76" width="28" height="258" rx="14" fill="${d}"/>
    <rect x="160" y="128" width="104" height="66" rx="10" fill="${l}"/>
    <rect x="174" y="146" width="76" height="7" rx="3" fill="${d}"/>
    <rect x="174" y="166" width="54" height="7" rx="3" fill="${d}"/>
    <rect x="262" y="76" width="12" height="258" fill="${d}"/>`,
  stroller: ({ c, d, l }) => `
    <path d="M104 192 Q104 100 198 100 L198 192 Z" fill="${c}"/>
    <path d="M104 192 L276 192 L258 276 L122 276 Z" fill="${l}"/>
    <rect x="104" y="190" width="172" height="14" rx="6" fill="${d}"/>
    <path d="M276 192 L314 118" stroke="${d}" stroke-width="12" stroke-linecap="round"/>
    <rect x="296" y="104" width="38" height="14" rx="7" fill="${d}" transform="rotate(-22 315 111)"/>
    <path d="M150 276 L136 324 M250 276 L264 324" stroke="${LEG}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="136" cy="326" r="30" fill="#374151"/><circle cx="136" cy="326" r="11" fill="#9ca3af"/>
    <circle cx="264" cy="326" r="30" fill="#374151"/><circle cx="264" cy="326" r="11" fill="#9ca3af"/>`,
  box: ({ c, d, l }) => `
    <rect x="92" y="150" width="216" height="30" rx="9" fill="${d}"/>
    <path d="M104 178 L296 178 L278 322 L122 322 Z" fill="${c}"/>
    <rect x="118" y="212" width="164" height="9" fill="${l}"/>
    <rect x="124" y="256" width="152" height="9" fill="${l}"/>`,
};

// Which icon belongs to which product group (a word in the product name can pick a better one)
function pickIcon(subcategory, name) {
  const n = (name || "").toLowerCase();
  const sub = (subcategory || "").toLowerCase();
  if (sub === "sofas & chairs") return /chair|stool|recliner/.test(n) ? "chair" : "sofa";
  if (sub === "beds") return "bed";
  if (sub === "tables & desks") return "table";
  if (sub === "wardrobes & storage") return /rack|shelf/.test(n) ? "shelf" : "wardrobe";
  if (sub === "shelves & racks") return "shelf";
  if (sub === "toys & games") return /teddy|plush|soft/.test(n) ? "teddy" : "blocks";
  if (sub === "baby care") return "bottle";
  if (sub === "kids clothing") return "tshirt";
  if (sub === "school supplies") return /bag|backpack/.test(n) ? "backpack" : "notebook";
  if (sub === "baby gear") return "stroller";
  return "box";
}

// Returns an image address (data URL) that works in <img src="...">
function makeAutoImage(subcategory, name) {
  const h = parseInt(crypto.createHash("md5").update(name).digest("hex").slice(0, 8), 16);
  const p = PALETTES[h % PALETTES.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800">` +
    `<rect width="400" height="400" fill="${p.bg}"/>` +
    `<circle cx="200" cy="200" r="150" fill="#ffffff" opacity="0.55"/>` +
    `<ellipse cx="200" cy="350" rx="120" ry="12" fill="#000000" opacity="0.08"/>` +
    ICONS[pickIcon(subcategory, name)](p) +
    `</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg.replace(/\s+/g, " "));
}

module.exports = { makeAutoImage, ICONS, PALETTES };