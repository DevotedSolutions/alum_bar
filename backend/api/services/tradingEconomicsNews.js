// Reads the Trading Economics headline stream for the dashboard's news column.
//
//   https://tradingeconomics.com/ws/stream.ashx?start=0&size=20
//
// Only aluminium stories are wanted. Two things shape how this works:
//
//  1. The feed uses the US spelling ("Aluminum Hovers Near 3-Week High"), so a
//     literal "aluminium" match finds nothing - both spellings are accepted.
//  2. Aluminium stories are rare (roughly one per few hundred headlines), so a
//     single size=20 page is almost always empty. Several pages are swept and
//     the matches are stored, letting the panel show the most recent finds
//     rather than whatever happens to be on page one right now.

const { httpGetJson } = require("./httpGet");

const STREAM_URL = "https://tradingeconomics.com/ws/stream.ashx";
const SITE_URL = "https://tradingeconomics.com";

// Both spellings, and only as a whole word so "aluminium-adjacent" coinages
// in other contexts don't sneak in.
const ALUMINIUM_RE = /\balumini?um\b/i;

const PAGE_SIZE = 100;
const DEFAULT_PAGES = 4; // ~400 headlines back

const clean = (s) => String(s == null ? "" : s).trim();

/** Does this headline concern aluminium? Exported so the rule stays testable. */
function isAluminiumStory(item, { includeDescription = false } = {}) {
  if (ALUMINIUM_RE.test(clean(item?.title))) return true;
  return includeDescription && ALUMINIUM_RE.test(clean(item?.description));
}

/** Map a feed entry onto the fields the news collection stores. */
function normalize(item) {
  const url = clean(item?.url);
  return {
    externalId: item?.ID == null ? null : String(item.ID),
    title: clean(item?.title),
    description: clean(item?.description),
    category: clean(item?.category),
    country: clean(item?.country),
    // Feed URLs are site-relative paths such as "/commodity/aluminum".
    url: url ? (url.startsWith("http") ? url : `${SITE_URL}${url}`) : "",
    publishedAt: item?.date ? new Date(item.date) : new Date(),
    source: "Trading Economics",
  };
}

/**
 * Sweep the stream and return the aluminium stories found, newest first.
 * `includeDescription` widens the net to stories that only mention aluminium
 * in the body - off by default, matching "title includes aluminium".
 */
async function fetchAluminiumNews({
  pages = DEFAULT_PAGES,
  size = PAGE_SIZE,
  includeDescription = false,
} = {}) {
  const seen = new Map();

  for (let page = 0; page < pages; page += 1) {
    const url = `${STREAM_URL}?start=${page * size}&size=${size}`;
    // One bad page shouldn't discard the pages that did come back, but it
    // shouldn't vanish silently either - an empty panel is otherwise
    // indistinguishable from "no aluminium news today".
    let batch;
    try {
      batch = await httpGetJson(url);
    } catch (error) {
      console.log(`Trading Economics page ${page} failed:`, error.message);
      break;
    }
    if (!Array.isArray(batch) || batch.length === 0) break;

    batch.forEach((item) => {
      if (!isAluminiumStory(item, { includeDescription })) return;
      const mapped = normalize(item);
      if (!mapped.title) return;
      const key = mapped.externalId || mapped.title;
      if (!seen.has(key)) seen.set(key, mapped);
    });
  }

  return Array.from(seen.values()).sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
}

module.exports = {
  fetchAluminiumNews,
  isAluminiumStory,
  ALUMINIUM_RE,
  STREAM_URL,
};
