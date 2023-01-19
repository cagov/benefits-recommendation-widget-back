let arc = require('@architect/functions')
const fs = require("fs");

exports.handler = arc.http.async(handler)

async function handler (req) {
  let jsonData;

  try {
    // query the throttles table for every url I am concerned with that matches today
    let throttleReached = false;
    let name = 'CALFRESH';

    let allThrottles = JSON.parse(fs.readFileSync('./throttles.json','utf8'));
    let allowedLimit = 1000; // get this from throttles json
    
    allThrottles.experimentsToThrottle.forEach(exp => {
      if(exp.name === name) {
        allowedLimit = exp.limit;
        console.log('set limit to '+allowedLimit);
      }
    })

    let day = new Date().toISOString().split('T')[0].toString();
    let client = await arc.tables();

    console.log(name)
    console.log(day)

    let throttleCount = await client.throttleclicks.get({ name, day })
    console.log('throttle count is')
    console.log(throttleCount); // undefined if no match which is valid if we didn't record any clicks yet today
    
    // if there is a record check against throttleCount.limit
    if(throttleCount && throttleCount.hits >= allowedLimit) {
      throttleReached = true;
    }
    // if it is below throttle levels we can return throttled data set
    if(!throttleReached) {
      jsonData = returnThrottledData();
    // if it is above throttles, display fallback content
    } else {
      jsonData = returnDefaultData();
    }
      
    return {
      cors: true,
      json: JSON.stringify(jsonData)
    }

  }
  catch(e) {
    // error occurred trying to lookup throttles
    console.log(e);

    jsonData = returnDefaultData();
    
    // return default info
    return {
      cors: true,
      json: JSON.stringify(jsonData)
    }
  }
}

function shuffle(o){ for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x); return o; };

function returnThrottledData() {
  // do random selection between links-bcf and links-gcf
  if(Math.random() < 0.5) {
    jsonResponse = fs.readFileSync('./links-gcf.json','utf8');
  } else {
    jsonResponse = fs.readFileSync('./links-bcf.json','utf8');
  }
  let jsonData = JSON.parse(jsonResponse);
  return jsonData;
}

function returnDefaultData() {
  let jsonResponse = fs.readFileSync('./links-minimal.json','utf8');

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
  } else {
    // when the above condition is not true experimentVariation hardcoded inside the json will be used
  }
  return jsonData;
}