const test = require("tape");
const tiny = require("tiny-json-http");
const sandbox = require("@architect/sandbox");
let arc = require("@architect/functions");
const targetServer = "http://localhost:3333";

/**
 * first we need to start the local http server
 */
test("sandbox.start", async (t) => {
  t.plan(1);
  await sandbox.start({ quiet: true });
  t.ok(true, `sandbox started on ${targetServer}`);
});

/**
 * then we can make a request to it and check the result
 */
test("get /benefits", async (t) => {
  t.plan(1);
  let result = await tiny.get({ url: targetServer + "/benefits" });
  t.ok(result, "got 200 response");
  // console.log(result)
});

/**
 * Ensure we don't deliver a link back to the same host.
 */
test("get /benefits?host=https://www.getcalfresh.org/s/ODIwidget", async (t) => {
  t.plan(10);

  // Repeat the test five times.
  for (i = 0; i < 5; i++) {
    let result = await tiny.get({
      url:
        targetServer + "/benefits?host=https://www.getcalfresh.org/s/ODIwidget",
    });

    t.ok(result, "got 200 response");

    let links = JSON.parse(result.body).links;
    let hostLinksFound = links.some((link) => link.id === "CALFRESH");

    if (hostLinksFound) {
      t.fail("served link back to same host");
    } else {
      t.pass("served no links back to same host");
    }
  }
});

test("post /event", async (t) => {
  t.plan(1);
  let result = await tiny.post({
    url: targetServer + "/event",
    data: {
      event: "render",
      displayURL: "https://awebsite.ca.gov",
      userAgent: "Lynx text only browser",
      language: "en-US",
      link: "https://wic.ca.gov",
      linkText: "Apply to WIC",
    },
  });
  t.ok(result.body.json.hasOwnProperty("event"), "got event response back");
  // console.log(result.body)
});

// scan and get events
test("db", async (t) => {
  t.plan(1);
  let data = await arc.tables();
  let events = await data.events.scan({});
  // console.log(events)
  t.ok(Array.isArray(events.Items), "found some items");
});

// query for events that are in a specific domain
test("dbquery", async (t) => {
  t.plan(1);
  let data = await arc.tables();
  let awebViews = await data.events.query({
    KeyConditionExpression:
      "eventKey = :eventKey AND begins_with(displayURL, :displayURL)",
    ExpressionAttributeValues: {
      ":eventKey": "render",
      ":displayURL": "https://awebsite.ca.gov",
    },
  });
  console.log(awebViews);
  t.ok(Array.isArray(awebViews.Items), "queried some items");
});

// count the events
test("dbquerycount", async (t) => {
  t.plan(1);
  let data = await arc.tables();
  let awebViews = await data.events.query({
    KeyConditionExpression:
      "eventKey = :eventKey AND begins_with(displayURL, :displayURL)",
    ExpressionAttributeValues: {
      ":eventKey": "render",
      ":displayURL": "https://awebsite.ca.gov",
    },
    Select: "COUNT",
  });
  console.log(awebViews);
  t.ok(awebViews.Count >= 0, "queried and then counted some items");
});

/**
 * finally close the server so we cleanly exit the test
 */
test("sandbox.end", async (t) => {
  t.plan(1);
  await sandbox.end();
  t.ok(true, "sandbox ended");
});
