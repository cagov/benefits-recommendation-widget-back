const linkDefs = require("./links.json");
const hostDefs = require("./hosts.json");
const icons = require("./icons");
const url = require("./url");

const AnalyticEngines = {
  GA: "ga",
  PIWIK: "piwik",
};

/**
 * Find the host definition for a given host url.
 * @param {string} host
 */
const findHostDef = (host) => {
  const pHostUrl = url.parse(host);

  if (pHostUrl) {
    return hostDefs.find((hostDef) =>
      hostDef.urls.some((hostDefUrl) => {
        const pHostDefUrl = url.parse(hostDefUrl);
        return pHostDefUrl.hostname === pHostUrl.hostname;
      })
    );
  } else {
    return undefined;
  }
};

/**
 * Add query string parameters for the target site's analytics engine.
 * @param {string} linkUrl
 * @param {string} analytics
 * @param {any} hostDef
 */
const addAnalytics = (linkUrl, analytics, hostDef) => {
  const pUrl = url.parse(linkUrl);

  if (pUrl && hostDef) {
    if (hostDef && analytics === AnalyticEngines.GA) {
      pUrl.searchParams.append("utm_source", hostDef.id);
      pUrl.searchParams.append("utm_medium", "referral");
      pUrl.searchParams.append("utm_campaign", "odibr");
    }

    return pUrl.href;
  } else {
    return linkUrl;
  }
};

/**
 * Construct link objects for the given language and host.
 * @param {string} language
 * @param {string} host
 * @returns
 */
exports.assembleLinks = (language, host) => {
  // Unless it's Chinese, strip the language code down to two characters.
  // We need to preserve the Chinese code to display Traditional vs. Simplified.
  const langKey = language.startsWith("zh") ? language : language.slice(0, 2);

  const hostDef = findHostDef(host);

  // Return a single set of values for each link, based on language.
  // Default to English where values are unavailable.
  const links = Object.keys(linkDefs).map((key) => {
    const link = linkDefs[key];

    // Get the SVG markup for the icon.
    const iconKey = link[langKey]?.icon || link.en.icon;
    const graphic = icons[iconKey];

    const lead = link[langKey]?.lead || link.en.lead || "";
    const catalyst = link[langKey]?.catalyst || link.en.catalyst || "";
    const description = link[langKey]?.description || link.en.description || "";
    const linkUrl = link[langKey]?.url || link.en.url || "";
    const analytics = link[langKey]?.analytics || link.en.analytics || "";

    const urlWithAnalytics = addAnalytics(linkUrl, analytics, hostDef);

    return {
      linktext: lead, // linktext depreciated
      program: catalyst, // program depreciated
      lead,
      catalyst,
      description, // description possibly depreciated
      url: urlWithAnalytics,
      graphic,
      language: langKey,
      id: key,
    };
  });

  return links;
};
