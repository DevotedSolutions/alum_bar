// Reads the live metals board behind the dashboard's aluminium price card.
//
//   https://metals.g.apised.com/v1/latest?symbols=...&base_currency=USD
//
// Base metals (ALU, NI, ZNC, LEAD) are quoted in USD per metric tonne, while
// the schema and the UI work in USD per kilogram - hence the /1000.

const { httpGetJson } = require("./httpGet");

const METALS_URL =
  "https://metals.g.apised.com/v1/latest?symbols=XAU%2CXAG%2CXPD%2CXPT%2CXCU%2CNI%2CZNC%2CALU%2CLEAD&base_currency=USD";

// Provided for this integration. Override with METALS_API_KEY in .env.
const DEFAULT_API_KEY = "sk_45D35122a1222D4B04aa2Cb4482f83273aC331E49A568344";

const KG_PER_TONNE = 1000;

// Symbols the API quotes per tonne, keyed by the metal name we store.
const SYMBOL_BY_METAL = {
  aluminium: "ALU",
  nickel: "NI",
  zinc: "ZNC",
  lead: "LEAD",
};

/**
 * Fetch the board and return the price for one metal in USD per kilogram.
 * Rejects when the symbol is absent or not a usable number.
 */
async function fetchMetalPricePerKg(metal = "aluminium") {
  const symbol = SYMBOL_BY_METAL[String(metal).toLowerCase()];
  if (!symbol) {
    throw new Error(`No market symbol mapped for metal "${metal}"`);
  }

  const payload = await httpGetJson(METALS_URL, {
    headers: { "x-api-key": process.env.METALS_API_KEY || DEFAULT_API_KEY },
  });

  if (payload?.status !== "success" || !payload?.data?.rates) {
    throw new Error("Metals API returned an unexpected payload");
  }

  const perTonne = Number(payload.data.rates[symbol]);
  if (!Number.isFinite(perTonne) || perTonne <= 0) {
    throw new Error(`Metals API did not quote ${symbol}`);
  }

  // The API's timestamp is in milliseconds.
  const stamp = Number(payload.data.timestamp);
  const recordedAt = Number.isFinite(stamp) ? new Date(stamp) : new Date();

  return {
    metal: String(metal).toLowerCase(),
    symbol,
    pricePerKg: perTonne / KG_PER_TONNE,
    pricePerTonne: perTonne,
    currency: payload.data.base_currency || "USD",
    recordedAt,
  };
}

module.exports = { fetchMetalPricePerKg, METALS_URL, SYMBOL_BY_METAL };
