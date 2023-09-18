const arc = require("@architect/functions");
const hostDefs = require("@architect/shared/hosts.json");

/** Core function for get-benefits. */
exports.handler = arc.http.async(async (req) => {
  return {
    cors: true,
    json: JSON.stringify(hostDefs),
  };
});
