// Reads the MCB indicative forex board, the source behind the dashboard's
// exchange-rate panel.
//
//   https://mcb.mu/webapi/mcb/getforexRate?c=MUR
//
// The endpoint answers with JSON ({"Html": "<table>..."}) by default and with
// XML (the same markup, entity-escaped inside <Html>) when asked for it, so
// both shapes are handled. Either way the payload is an HTML table of
// currency / buy / sell rows plus a "rate-date" paragraph, which is parsed
// here rather than pulling in an HTML parser for one endpoint.

const { httpGetText } = require("./httpGet");

const MCB_FOREX_URL = "https://mcb.mu/webapi/mcb/getforexRate?c=MUR";
const REQUEST_TIMEOUT_MS = 8000;

const ENTITIES = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&amp;": "&",
};

// &amp; last so "&amp;lt;" doesn't collapse into "<".
const unescapeEntities = (s) =>
  Object.keys(ENTITIES).reduce(
    (acc, entity) => acc.split(entity).join(ENTITIES[entity]),
    String(s)
  );

const stripTags = (s) => String(s).replace(/<[^>]*>/g, "");

const toNumber = (s) => {
  const n = Number(String(s).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
};

/** Pull the HTML fragment out of either the JSON or the XML response body. */
function extractHtml(body) {
  const text = String(body || "").trim();
  if (!text) return "";

  if (text.startsWith("{")) {
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.Html === "string") return parsed.Html;
    } catch (e) {
      // Fall through to the XML handling below.
    }
  }

  const match = text.match(/<Html>([\s\S]*?)<\/Html>/i);
  if (match) return unescapeEntities(match[1]);

  // Already a bare HTML fragment.
  return text;
}

/**
 * Parse the forex board into { asOf, rates }. `mid` is the midpoint of the
 * buy/sell spread and is what the dashboard quotes as "the" rate.
 */
function parseMcbForexPayload(body) {
  const html = extractHtml(body);

  const rates = [];
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let row;
  while ((row = rowRe.exec(html)) !== null) {
    const cells = [];
    const cellRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cell;
    while ((cell = cellRe.exec(row[1])) !== null) {
      cells.push(stripTags(cell[1]).trim());
    }
    if (cells.length < 3) continue; // header row, or a layout row

    const base = cells[0].toUpperCase();
    if (!/^[A-Z]{3}$/.test(base)) continue;

    const buy = toNumber(cells[1]);
    const sell = toNumber(cells[2]);
    if (buy === null || sell === null || buy <= 0 || sell <= 0) continue;

    rates.push({ base, buy, sell, mid: (buy + sell) / 2 });
  }

  // "<p id="rate-date" ...><small> 08/09/2026</small>" - day first.
  let asOf = null;
  const dateMatch = html.match(
    /id=["']?rate-date["']?[^>]*>[\s\S]*?(\d{2})\/(\d{2})\/(\d{4})/i
  );
  if (dateMatch) {
    const [, dd, mm, yyyy] = dateMatch;
    // Fixed at UTC midnight so one board = one reading per day regardless of
    // the server's timezone.
    asOf = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
    if (Number.isNaN(asOf.getTime())) asOf = null;
  }

  return { asOf, rates };
}

/** GET the live board and parse it. Rejects on transport or parse failure. */
async function fetchMcbRates(url = MCB_FOREX_URL) {
  const body = await httpGetText(url, {
    headers: { Accept: "application/json" },
    timeout: REQUEST_TIMEOUT_MS,
  });

  const parsed = parseMcbForexPayload(body);
  if (!parsed.rates.length) {
    throw new Error("MCB forex response contained no rates");
  }
  return parsed;
}

module.exports = {
  MCB_FOREX_URL,
  fetchMcbRates,
  parseMcbForexPayload,
};
