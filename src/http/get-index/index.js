const fs = require("fs");

exports.handler = async function http (req) {
  const jsonResponse = fs.readFileSync('./links.json','utf8');
  //Todo: create translated versions of link content, send translaterd version based on passed in language

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'application/json'
    },
    body: jsonResponse
  }
}