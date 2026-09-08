// Minimal HTTPS GET helper shared by the dashboard's outbound integrations.
// The backend has no HTTP client dependency, and these three endpoints don't
// justify adding one.

const https = require("https");

const DEFAULT_TIMEOUT_MS = 8000;

// Some upstreams (Trading Economics) answer 403 to a request that carries no
// User-Agent at all, which Node's https client omits by default.
const DEFAULT_USER_AGENT = "noutfermeture-dashboard";

/** GET a URL and resolve its body as text. Rejects on non-2xx or timeout. */
function httpGetText(url, { headers = {}, timeout = DEFAULT_TIMEOUT_MS } = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": DEFAULT_USER_AGENT, ...headers } },
      (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          res.resume();
          return reject(
            new Error(`Request to ${url} failed with status ${res.statusCode}`)
          );
        }

        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => resolve(body));
      }
    );

    req.setTimeout(timeout, () => {
      req.destroy(new Error(`Request to ${url} timed out`));
    });
    req.on("error", reject);
  });
}

/** As httpGetText, but parses the body as JSON. */
async function httpGetJson(url, options) {
  const body = await httpGetText(url, options);
  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error(`Response from ${url} was not valid JSON`);
  }
}

module.exports = { httpGetText, httpGetJson };
