let arc = require('@architect/functions')
const fs = require("fs");

exports.handler = arc.http.async(handler)

async function handler (req) {
  console.log('calling /benefits get')
  const jsonResponse = fs.readFileSync('./links.json','utf8');
  const jsonData = JSON.parse(jsonResponse);

  if(jsonData.links.length > 2){
    // mutate link set to be the shuffled top 3
    let chosenLinks = shuffle(jsonData.links).slice(0,3);
    jsonData.links = chosenLinks;
    // identify this set of links by a variation key composed of all the keys of the items in order
    jsonData.experimentVariation = '';
    chosenLinks.forEach((item, index) => { 
      jsonData.experimentVariation += `${item.key}`;
      if(index < 2) {
        jsonData.experimentVariation += '-';
      }
    })
  }

  return {
    cors: true,
    json: JSON.stringify(jsonData)
  }
}

function shuffle(o){ for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x); return o; };