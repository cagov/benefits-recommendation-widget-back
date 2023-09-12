const arc = require("@architect/functions");
const { assembleLinks } = require("@architect/shared/links");
const { applyRules } = require("@architect/shared/rules");

/** Core function for get-benefits. */
exports.handler = arc.http.async(async (req) => {
  const host = decodeURIComponent(req.query.host || "");
  const language = req.query.language || "en";

  const allLinks = assembleLinks(language, host);
  console.log("All:" + allLinks.length);
  const links = await applyRules(allLinks, host);
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
