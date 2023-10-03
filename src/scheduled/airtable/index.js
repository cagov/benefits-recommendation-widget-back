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
  if (process.env.ARC_ENV !== "production") {
    console.log(
      `Environment is ${process.env.ARC_ENV}.`,
      "This function only runs in production.",
      "Skipping."
    );

    return;
  }

  // Grab the Airtable data and put it all into one big airData object.
  const fetches = apiSources.map((source) => fetchSource(source));
  const airtableObjects = await Promise.all(fetches);
  const airData = Object.assign({}, ...airtableObjects);

  // Reformat the throttles for downstream usage.
  const throttles = airData.throttles.records
    .filter((throttle) => {
      const { id } = throttle.fields;
      return id && id.trim() !== "";
    })
    .map((throttle) => {
      const { id, targets, urls_rollup, ...rest } = throttle.fields;
      return {
        id,
        ...rest,
        urls: urls_rollup,
      };
    });

  // Reformat the hosts for downstream usage.
  const hosts = airData.hosts.records
    .filter((host) => {
      const { id } = host.fields;
      return id && id.trim() !== "";
    })
    .map((host) => {
      const { id, urls_rollup } = host.fields;
      return {
        id,
        urls: urls_rollup,
      };
    });

  // Reformat target links for downstream usage.
  // Note: we combine the translations into the target objects here.
  const targets = airData.targets.records
    .filter((target) => {
      // Ensure the target has an ID.
      const { id } = target.fields;
      return id && id.trim() !== "";
    })
    .map((target) => {
      // Get the translations for the target.
      const translations = airData.translations.records
        .filter((translation) => {
          const {
            target: trTarget,
            language,
            lead,
            catalyst,
            icon,
            url,
          } = translation.fields;

          // Filter out translations that are incomplete.
          const checks = [
            // Check for target.
            trTarget && trTarget.includes(target.id),
            // Check for language.
            language && language.trim() !== "",
            // Check for the following English defaults. Otherwise pass.
            language === "en" ? lead && lead.trim() !== "" : true,
            language === "en" ? catalyst && catalyst.trim() !== "" : true,
            language === "en" ? icon && icon.trim() !== "" : true,
            language === "en" ? url && url.trim() !== "" : true,
          ];

          return checks.every((check) => check === true);
        })
        .reduce((acc, transl) => {
          const { target, target_id_lookup, language, ...rest } = transl.fields;
          acc[language] = { ...rest };
          return acc;
        }, {});

      // Get throttle IDs for the target.
      const targetThrottles = airData.throttles.records
        .filter((throttle) => throttle.fields?.targets?.includes(target.id))
        .map((throttle) => throttle.fields.id);

      // Bring it all together for the target.
      return {
        id: target.fields.id,
        translations,
        throttle_ids: targetThrottles,
      };
    })
    .filter((target) => {
      // Ensure there's at least one translation.
      return Object.keys(target.translations).length > 0;
    });

  const now = new Date();

  // Combine all of our work into a new object for delivery.
  const definitions = {
    name: "Benefits Recommender Definitions",
    description: "Defines target links, throttles, and hosts for the widget.",
    updated: now.toISOString(),
    targets,
    throttles,
    hosts,
  };

  const s3LiveCommand = new PutObjectCommand({
    Bucket: "cdn.innovation.ca.gov",
    Key: "br/benefits-recs-defs.json",
    Body: JSON.stringify(definitions, null, 2),
  });

  // Send the definitions JSON file to S3.
  await s3
    .send(s3LiveCommand)
    .then(() => console.log("Definitions successfully updated."))
    .catch((error) => {
      console.log("Error writing live definitions to S3.");
      throw error;
    });

  const year = now.getFullYear();
  const month = now.getMonth().toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const version = `${year}${month}${day}${hours}${minutes}${seconds}`;

  const s3HistoryCommand = new PutObjectCommand({
    Bucket: "cdn.innovation.ca.gov",
    Key: `br/defs/benefits-recs-defs-${version}.json`,
    Body: JSON.stringify(definitions, null, 2),
  });

  // Send the definitions JSON file to S3 as a historic version.
  await s3
    .send(s3HistoryCommand)
    .then(() => console.log("Definitions successfully added to history."))
    .catch((error) => {
      console.log("Error writing definitions version to S3.");
      throw error;
    });

  const cloudfrontCommand = new CreateInvalidationCommand({
    DistributionId: "EAQBFZOLKQ2AZ",
    InvalidationBatch: {
      Paths: {
        Quantity: 1,
        Items: ["/*"],
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
