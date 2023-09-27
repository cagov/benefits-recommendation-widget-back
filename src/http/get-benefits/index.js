const arc = require("@architect/functions");
const { assembleLinks } = require("@architect/shared/links");
const { applyRules } = require("@architect/shared/rules");
const { getDefinitions } = require("@architect/shared/s3");

// Definitions will be loaded from benefits-recs-defs.json in S3.
// We keep it outside the handler to cache it between Lambda runs.
let definitions = {};

/** Core function for get-benefits. */
exports.handler = arc.http.async(async (req) => {
  // If definitions is empty, fetch it from S3.
  if (Object.keys(definitions).length === 0) {
    definitions = await getDefinitions();
  }

  // Grab data from URL query parameters.
  const host = decodeURIComponent(req.query.host || "");
  const language = req.query.language || "en";

  const allLinks = assembleLinks(definitions, language, host);
  console.log("All:" + allLinks.length);
  const links = await applyRules(definitions, allLinks, host);
  console.log("Filtered:" + links.length);
  const data = {
    header: "Apply for more benefits!",
    tagline: "You might be able to get:",
    experimentName: "2023-08-01-resume-tracking",
    experimentVariation: links.map((link) => link.id).join("-"),
    links,
  };

  return {
    cors: true,
    json: JSON.stringify(data),
  };
});
