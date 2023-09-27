let arc = require("@architect/functions");
const url = require("@architect/shared/url");
const { getDefinitions } = require("@architect/shared/s3");

// Definitions will be loaded from benefits-recs-defs.json in S3.
// We keep it outside the handler to cache it between Lambda runs.
let definitions = {};

/**
 * @description Event receiving endpoint for benefits recommendation widget
 * @param {object} req
 * @typedef {object} req.body
 * @property {string} event could be 'render' or 'view' or 'click'
 * @property {string} displayUrl url string of page where widget is being viewed
 * @property {string} userAgent vistor browser identifier
 * @property {string} language language the visitor prefers based on browser or widget attribute
 * @property {string} link URL of link clicked in the widget
 * @property {string} linkText Text of link clicked in the widget
 * @property {string} experimentName Name of current experiment being run on this widget display
 * @property {string} experimentVariation Name of the variation of this experiment, could be the order of links being displayed
 */
exports.handler = arc.http(async (req) => {
  // If definitions is empty, fetch it from S3.
  if (Object.keys(definitions).length === 0) {
    definitions = await getDefinitions();
  }

  const dynamo = await arc.tables();
  const events = dynamo.events;
  const postData =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  try {
    if (!postData.event) throw ReferenceError("missing event type");

    if (!postData.displayURL) throw ReferenceError("missing displayUrl");

    postData.timestamp = new Date().getTime().toString();
    // in DynamoDB the eventKey is the partition key. It needs to be a fully reproducible string required in queries
    postData.eventKey = `${postData.event}`;
    if (postData.link) {
      postData.eventKey += `-${postData.link}`;
    }
    postData.pageUrl = postData.displayURL;
    // in DynamoDB the displayUrl is the sort key, the combination of the partition key and sort key needs to be unique or records are overwritten
    postData.displayURL += `---${postData.timestamp}-${Math.random()}`;

    // store the event object in DynamoDB
    const event = await events.put(postData);

    console.log("event data recorded");
    console.log(postData);

    if (postData.event === "click") {
      // record a click to the throttle table
      console.log("Recording a click; checking for throttles");

      // find relevant throttle
      const activeThrottles = definitions.throttles.filter((throttle) =>
        url.findMatch(throttle.urls, postData.link)
      );

      if (activeThrottles.length < 1) {
        console.log(`No throttles found for URL: ${postData.link}`);
      }

      activeThrottles.forEach(async (throttle) => {
        console.log(`Throttle match: ${throttle.id}`);

        const name = throttle.id;
        const day = new Date().toISOString().split("T")[0].toString();

        // increment counter, if record not there create it
        await dynamo.throttleclicks.update({
          Key: { name, day },
          UpdateExpression: "SET hits = if_not_exists(hits, :start) + :inc",
          ExpressionAttributeValues: {
            ":inc": 1,
            ":start": 0,
          },
        });
      });
    }

    return {
      status: 204,
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      json: {
        name: e.name,
        message: e.message,
        stack: e.stack,
      },
    };
  }
});
