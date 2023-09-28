const arc = require("@architect/functions");

/** Retrieve throttles. */
exports.getThrottles = async (definitions) => {
  const { throttles: throttleDefs } = definitions;

  try {
    const throttles = [...throttleDefs];

    const day = new Date().toISOString().split("T")[0].toString();
    const dynamo = await arc.tables();

    const promises = [];

    // Check each throttle to see if we've reached the limit.
    // Add current stats to each throttle object.
    throttles.forEach(async (throttle) => {
      const { id, limit, start, end } = throttle;

      const name = id;

      const nowTime = new Date().getTime();
      const startTime = start ? new Date(start).getTime() : null;
      const endTime = end ? new Date(end).getTime() : null;

      throttle.exceeded = false;

      if (startTime && startTime > nowTime) {
        throttle.exceeded = true;
      }

      if (endTime && endTime < nowTime) {
        throttle.exceeded = true;
      }

      if (limit === 0) {
        throttle.exceeded = true;
      }

      // If the throttle is still open, we need to check DynamoDB.
      if ((throttle.exceeded = false)) {
        const promise = dynamo.throttleclicks
          .get({ name, day })
          .then((response) => {
            const count = response?.hits || 0;
            throttle.exceeded = count >= throttle.limit;
            console.log(
              `Throttle for ${name} on ${day} is at ${count}/${limit}.`
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
