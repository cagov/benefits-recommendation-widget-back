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
const findHostDef = (host, hostDefs) => {
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
 * @param {object} definitions
 * @param {string} language
 * @param {string} host
 * @returns
 */
exports.assembleLinks = (definitions, language, host) => {
  const { targets, hosts: hostDefs } = definitions;
  const hostDef = findHostDef(host, hostDefs);

  // Unless it's Chinese, strip the language code down to two characters.
  // We need to preserve the Chinese code to display Traditional vs. Simplified.
  const langKey = language.startsWith("zh") ? language : language.slice(0, 2);

  // Return a single set of values for each link, based on language.
  // Default to English where values are unavailable.
  const links = targets.map((target) => {
    const { id, translations } = target;

    // Get the SVG markup for the icon.
    const iconKey = translations[langKey]?.icon || translations.en.icon;
    const graphic = icons[iconKey];

    const lead = translations[langKey]?.lead || translations.en.lead || "";

    const catalyst =
      translations[langKey]?.catalyst || translations.en.catalyst || "";

    const description =
      translations[langKey]?.description || translations.en.description || "";

    const linkUrl = translations[langKey]?.url || translations.en.url || "";

    const analytics =
      translations[langKey]?.analytics || translations.en.analytics || "";

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
      id,
    };
  });

  return links;
};
