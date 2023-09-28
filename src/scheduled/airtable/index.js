/* global fetch */
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const {
  CloudFrontClient,
  CreateInvalidationCommand,
} = require("@aws-sdk/client-cloudfront");

/**
 * Here's what we're doing with the fetch commands below.
 *
 * Via apiSources, we're making multiple calls to the Airtable API.
 * The fetchSource function creates an object out of each response.
 * For example: { targets: [airtable API data] }
 *
 * Then in the handler, we combine all these airtable responses into airData.
 * For example: { targets: [airtable data], throttles: [airtable data], ... }
 *
 * Finally, we process airData into the final output.
 */

const s3 = new S3Client({});
const cloudfront = new CloudFrontClient({});

/** The HTTP headers for our Airtable API calls. */
const fetchOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
  },
};

/**
 * @typedef APISource
 * @type {object}
 * @property {string} key
 * A descriptive key that we'll use for our own organizational purposes.
 * @property {string} url
 * An Airtable endpoint URL.
 */

/**
 * Our Airtable endpoint URLs.
 * @type {APISource[]}
 */
const apiSources = [
  {
    key: "targets",
    url: "https://api.airtable.com/v0/app2OnBmhVD4GZ68L/Targets",
  },
  {
    key: "translations",
    url: "https://api.airtable.com/v0/app2OnBmhVD4GZ68L/Target%20Translations",
  },
  {
    key: "throttles",
    url: "https://api.airtable.com/v0/app2OnBmhVD4GZ68L/Target%20Throttles",
  },
  {
    key: "hosts",
    url: "https://api.airtable.com/v0/app2OnBmhVD4GZ68L/Hosts",
  },
];

/**
 * Grabs data from the Airtable API.
 * @param {APISource} apiSource
 * @returns An object consisting of { apiSource.key: [Airtable data] }
 */
const fetchSource = (apiSource) =>
  fetch(apiSource.url, fetchOptions)
    .then((response) => response.json())
    .then((data) => ({ [apiSource.key]: data }));

exports.handler = async (req) => {
  // Let's only run this in production.
  // There's no staging Airtable (yet).
  // And we don't want to duplicate file writes across environments.
  if (process.env.ARC_ENV !== "production") return;

  // Grab the Airtable data and put it all into one big airData object.
  const fetches = apiSources.map((source) => fetchSource(source));
  const airtableObjects = await Promise.all(fetches);
  const airData = Object.assign({}, ...airtableObjects);

  // Reformat the throttles for downstream usage.
  const throttles = airData.throttles.records.map((throttle) => {
    const { id, targets, urls_rollup, ...rest } = throttle.fields;
    return {
      id,
      ...rest,
      urls: urls_rollup,
    };
  });

  // Reformat the hosts for downstream usage.
  const hosts = airData.hosts.records.map((host) => {
    const { id, urls_rollup } = host.fields;
    return {
      id,
      urls: urls_rollup,
    };
  });

  // Reformat target links for downstream usage.
  // Note: we combine the translations into the target objects here.
  const targets = airData.targets.records.map((target) => {
    const translations = airData.translations.records
      .filter((transl) => transl.fields.target.includes(target.id))
      .reduce((acc, transl) => {
        const { target, target_id_lookup, language, ...rest } = transl.fields;
        acc[language] = { ...rest };
        return acc;
      }, {});

    const targetThrottles = airData.throttles.records
      .filter((throttle) => throttle.fields.targets.includes(target.id))
      .map((throttle) => throttle.fields.id);

    return {
      id: target.fields.id,
      translations,
      throttles: targetThrottles,
    };
  });

  // Combine all of our work into a new object for delivery.
  const definitions = {
    name: "Benefits Recommender Definitions",
    description: "Defines target links, throttles, and hosts for the widget.",
    updated: new Date().toISOString(),
    targets,
    throttles,
    hosts,
  };

  const s3Command = new PutObjectCommand({
    Bucket: "cdn.innovation.ca.gov",
    Key: "br/benefits-recs-defs.json",
    Body: JSON.stringify(definitions, null, 2),
  });

  // Send the definitions JSON file to S3.
  await s3
    .send(s3Command)
    .then(() => console.log("Definitions successfully updated."))
    .catch((error) => {
      console.log("Error writing definitions to S3.");
      throw error;
    });

  const cloudfrontCommand = new CreateInvalidationCommand({
    DistributionId: "EAQBFZOLKQ2AZ",
    InvalidationBatch: {
      Paths: {
        Quantity: 1,
        Items: ["/br/*"],
      },
      CallerReference: Date.now().toString(),
    },
  });

  // Send a cache invalidation to CloudFront.
  await cloudfront
    .send(cloudfrontCommand)
    .then(() => console.log("Cache invalidation sent to Cloudfront."))
    .catch((error) => {
      console.log("Error invalidating CloudFront cache.");
      throw error;
    });
};
