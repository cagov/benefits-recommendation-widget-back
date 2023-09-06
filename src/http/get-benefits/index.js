let arc = require("@architect/functions");
const throttleDefs = require("@architect/shared/throttles.json");
const linkDefs = require("@architect/shared/links.json");
const icons = require("@architect/shared/icons.js");

exports.handler = arc.http.async(handler);

async function handler(req) {
  // These values come in via URL query parameter.
  const host = req.query.host;
  const language = req.query.language || "en";

  const links = assembleLinks(language);

  try {
    const throttles = [...throttleDefs];

    const day = new Date().toISOString().split("T")[0].toString();
    const dynamo = await arc.tables();

    const promises = [];

    // Check each throttle to see if we've reached the limit.
    // Add current stats to each throttle object.
    throttles.forEach(async (throttle) => {
      const name = throttle.name;

      // If the throttle is already set to zero, we don't need to check DynamoDB.
      if (throttle.limit === 0) {
        throttle.count = 0;
        throttle.exceeded = true;
      } else {
        const promise = dynamo.throttleclicks
          .get({ name, day })
          .then((response) => {
            const count = response?.hits || 0;
            throttle.count = count;
            throttle.exceeded = count >= throttle.limit;
            console.log(
              `Throttle for ${name} on ${day} is at ${count}/${throttle.limit}.`
            );
          });

        promises.push(promise);
      }
    });

    await Promise.all(promises);

    const allowedLinks = pickAllowedLinks(links, throttles, host, 3);
    const data = assembleData(allowedLinks);

    return {
      cors: true,
      json: JSON.stringify(data),
    };
  } catch (e) {
    console.log(e); // Log the error.

    // Just get random default data.
    const randomLinks = pickRandomLinks(links, host, 3);
    const data = assembleData(randomLinks);

    return {
      cors: true,
      json: JSON.stringify(data),
    };
  }
}

function pickRandomLinks(links, host, n = 3) {
  return links
    .filter((link) => link.key !== host)
    .map((link) => ({ link, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ link }) => link)
    .slice(0, n);
}

function pickAllowedLinks(links, throttles, host, n) {
  const data = links.reduce((bucket, link) => {
    const blockingThrottles = throttles.filter(
      (throttle) => throttle.urls.includes(link.url) && throttle.exceeded
    );

    if (blockingThrottles.length < 1) bucket.push(link);
    return bucket;
  }, []);

  return pickRandomLinks(data, host, n);
}

function assembleData(links) {
  return {
    header: "Apply for more benefits!",
    tagline: "You might be able to get:",
    experimentName: "2023-08-01-resume-tracking",
    experimentVariation: links.map((link) => link.key).join("-"),
    links,
  };
}

function assembleLinks(language = "en") {
  // Unless it's Chinese, strip the language code down to two characters.
  // We need to preserve the Chinese code to display Traditional vs. Simplified.
  const langKey = language.startsWith("zh") ? language : language.slice(0, 2);

  // Return a single set of values for each link, based on language.
  // Default to English where values are unavailable.
  const links = Object.keys(linkDefs).map((linkKey) => {
    const link = linkDefs[linkKey];

    // Get the SVG markup for the icon.
    const iconKey = link[langKey]?.icon || link.en.icon;
    const iconGraphic = icons[iconKey];

    return {
      linktext: link[langKey]?.linktext || link.en.linktext,
      description: link[langKey]?.description || link.en.description,
      program: link[langKey]?.program || link.en.program,
      url: link[langKey]?.url || link.en.url,
      graphic: iconGraphic,
      key: linkKey,
    };
  });

  return links;
}
