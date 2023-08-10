let arc = require("@architect/functions");
const throttleDefs = require("@architect/shared/throttles.json");
const linkDefs = require("./links.json");

exports.handler = arc.http.async(handler);

async function handler(req) {
  // These values comes in via URL query parameter.
  const host = req.query.host;
  const language = req.query.language;

  try {
    const throttles = [...throttleDefs];

    const day = new Date().toISOString().split("T")[0].toString();
    const dynamo = await arc.tables();

    // Query each throttle in DynamoDB to see if we've reached the limit.
    // Add current stats to each throttle object.
    const promises = throttles.map(async (throttle) => {
      const name = throttle.name;
      return dynamo.throttleclicks.get({ name, day }).then((response) => {
        const count = response?.hits || 0;
        throttle.count = count;
        throttle.exceeded = count >= throttle.limit;
        console.log(
          `Throttle for ${name} on ${day} is at ${count}/${throttle.limit}.`
        );
      });
    });

    // Wait for all of our throttle queries to finish.
    await Promise.all(promises);

    console.log(throttles);

    const allowedLinks = pickAllowedLinks(throttles, host, 3);
    const data = assembleData(allowedLinks);

    return {
      cors: true,
      json: JSON.stringify(data),
    };
  } catch (e) {
    // error occurred trying to lookup throttles
    console.log(e);

    const randomLinks = pickRandomLinks(linkDefs.links, host, 3);
    const data = assembleData(randomLinks);

    // return default info
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

function pickAllowedLinks(throttles, host, n) {
  const links = { ...linkDefs };

  const data = links.links.reduce((bucket, link) => {
    const blockingThrottles = throttles.filter(
      (throttle) => throttle.urls.includes(link.url) && throttle.exceeded
    );

    if (blockingThrottles.length < 1) bucket.push(link);
    return bucket;
  }, []);

  return pickRandomLinks(data, host, n);
}

function assembleData(links) {
  return Object.assign(linkDefs, {
    experimentName: "2023-08-01-resume-tracking",
    experimentVariation: links.map((link) => link.key).join("-"),
    links,
  });
}
