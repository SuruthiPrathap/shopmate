// Checks an Indian business registration number: GSTIN (15 characters) or Udyam registration number.
// This proves the number is CORRECTLY FORMED (right pattern, real state code, correct check character).
// It does NOT prove the shop exists. Only the official portal (or a paid verification API) can do that,
// so the admin also checks the number there before approving. (Same rules as client/src/utils/registration.js)

const GST_STATES = {
  "01": "Jammu & Kashmir", "02": "Himachal Pradesh", "03": "Punjab", "04": "Chandigarh", "05": "Uttarakhand",
  "06": "Haryana", "07": "Delhi", "08": "Rajasthan", "09": "Uttar Pradesh", "10": "Bihar", "11": "Sikkim",
  "12": "Arunachal Pradesh", "13": "Nagaland", "14": "Manipur", "15": "Mizoram", "16": "Tripura",
  "17": "Meghalaya", "18": "Assam", "19": "West Bengal", "20": "Jharkhand", "21": "Odisha",
  "22": "Chhattisgarh", "23": "Madhya Pradesh", "24": "Gujarat", "26": "Dadra & Nagar Haveli and Daman & Diu",
  "27": "Maharashtra", "29": "Karnataka", "30": "Goa", "31": "Lakshadweep", "32": "Kerala", "33": "Tamil Nadu",
  "34": "Puducherry", "35": "Andaman & Nicobar Islands", "36": "Telangana", "37": "Andhra Pradesh", "38": "Ladakh",
  "97": "Other Territory", "99": "Centre Jurisdiction",
};

// 4th letter of the PAN inside a GSTIN tells what kind of business it is
const PAN_TYPES = {
  P: "Individual / Proprietor", C: "Company", H: "Hindu Undivided Family", F: "Firm / Partnership",
  A: "Association of Persons", T: "Trust", B: "Body of Individuals", L: "Local Authority",
  J: "Artificial Juridical Person", G: "Government",
};

const UDYAM_STATES = new Set([
  "AN", "AP", "AR", "AS", "BR", "CG", "CH", "DD", "DL", "GA", "GJ", "HP", "HR", "JH", "JK", "KA", "KL", "LA",
  "LD", "MH", "ML", "MN", "MP", "MZ", "NL", "OD", "PB", "PY", "RJ", "SK", "TN", "TR", "TS", "UK", "UP", "WB",
]);

const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const GST_PATTERN = /^(\d{2})([A-Z]{5}\d{4}[A-Z])([1-9A-Z])Z([0-9A-Z])$/;

// The 15th character is calculated from the first 14 (a "check character", like the last digit of a card number)
function gstCheckChar(first14) {
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const value = CHARS.indexOf(first14[i]) * (i % 2 === 0 ? 1 : 2);
    sum += Math.floor(value / 36) + (value % 36);
  }
  return CHARS[(36 - (sum % 36)) % 36];
}

export function checkRegistration(raw) {
  const text = String(raw || "").trim().toUpperCase().replace(/[\s_]+/g, "");
  if (!text) {
    return { valid: false, message: "Please enter your GSTIN or Udyam registration number" };
  }

  // Udyam, written with or without dashes: UDYAM-TN-00-1234567
  const udyam = text.match(/^UDYAM-?([A-Z]{2})-?(\d{2})-?(\d{7})$/);
  if (udyam) {
    if (!UDYAM_STATES.has(udyam[1])) {
      return { valid: false, message: `"${udyam[1]}" is not a valid state code in a Udyam number` };
    }
    return {
      valid: true,
      type: "Udyam",
      number: `UDYAM-${udyam[1]}-${udyam[2]}-${udyam[3]}`,
      state: udyam[1],
    };
  }

  if (text.length === 15) {
    const m = text.match(GST_PATTERN);
    if (!m) {
      return { valid: false, message: "A GSTIN has 15 characters in this pattern: 33ABCDE1234F1Z5 (state code, PAN, entity number, Z, check character)" };
    }
    if (!GST_STATES[m[1]]) {
      return { valid: false, message: `"${m[1]}" is not a valid GST state code` };
    }
    if (gstCheckChar(text.slice(0, 14)) !== text[14]) {
      return { valid: false, message: "This GSTIN is not valid: its last character does not match. Please check every character." };
    }
    return {
      valid: true,
      type: "GST",
      number: text,
      state: GST_STATES[m[1]],
      pan: m[2],
      entity: PAN_TYPES[m[2][3]] || "Other",
    };
  }

  return {
    valid: false,
    message: "Enter a valid GSTIN (15 characters, like 33ABCDE1234F1Z5) or a Udyam number (like UDYAM-TN-00-1234567)",
  };
}

