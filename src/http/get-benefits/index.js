let arc = require('@architect/functions')
const fs = require("fs");

exports.handler = arc.http.async(handler)

async function handler (req) {
  console.log('calling /benefits get')
  const jsonResponse = fs.readFileSync('./links.json','utf8');
  //Todo: create translated versions of link content, send translaterd version based on passed in language

  return {
    cors: true,
    json: jsonResponse
  }
}