const fs = require("fs");

exports.handler = async function http (req) {
  const jsonResponse = fs.readFileSync('./links.json','utf8');
  //Todo: create translated versions of link content, send translaterd version based on passed in language

  return {
    cors: true,
    statusCode: 200,
    type: 'application/javascript',
    body: jsonResponse
  }
}