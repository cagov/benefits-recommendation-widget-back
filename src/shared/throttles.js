const arc = require("@architect/functions");
const throttleDefs = require("./throttles.json");

/** Retrieve throttles. */
exports.getThrottles = async () => {
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

    return throttles;
  } catch (e) {
    console.log("Error retrieving throttles.", e);
    return [];
  }
};
