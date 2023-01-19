//@ts-check
let arc = require('@architect/functions');
const fs = require("fs");

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
exports.handler = async function http (req) {
  let client = await arc.tables();
  let events = client.events;

  let incomingString = req.body;
  if(req.body.indexOf('userAgent') === -1) {
    let buff = Buffer.from(req.body, 'base64');
    incomingString = buff.toString('ascii');
  }
  let postData = incomingString;
  if(typeof(req.body) === 'string') {
    postData = JSON.parse(incomingString);
  }

  try {
    if (!postData.event)
      throw ReferenceError('missing event type');

    if (!postData.displayURL)
      throw ReferenceError('missing displayUrl');

    postData.timestamp = new Date().getTime().toString();
    // in DynamoDB the eventKey is the partition key. It needs to be a fully reproducible string required in queries
    postData.eventKey = `${postData.event}`;
    if(postData.link) {
      postData.eventKey += `-${postData.link}`;
    }
    postData.pageUrl = postData.displayURL
    // in DynamoDB the displayUrl is the sort key, the combination of the partition key and sort key needs to be unique or records are overwritten
    postData.displayURL += `---${postData.timestamp}-${Math.random()}`; 

    // store the event object in DynamoDB
    let event = await events.put(postData);

    console.log('event data recorded')
    console.log(postData)

    if(postData.event === 'click') { // record a click to the throttle table
      console.log('recording a click event to throttles table');

      // read throttles.json
      let allThrottles = JSON.parse(fs.readFileSync('../get-benefits/throttles.json','utf8'));
      let name = 'CALFRESH';
      // find relevant throttle
      allThrottles.experimentsToThrottle.forEach(exp => {
        if(exp.name === name) {
          // if url clicked matches record event
          exp.urls.forEach(async url => {
            if(url === postData.link) {
              let name = 'CALFRESH';
              let day = new Date().toISOString().split('T')[0].toString();
              // increment counter, if record not there create it
              let throttleUpdate = await client.throttleclicks.update({
                Key: { name, day },
                UpdateExpression: 'SET hits = if_not_exists(hits, :start) + :inc',
                ExpressionAttributeValues: {
                  ':inc': 1,
                  ':start': 0
                }
              })
              console.log(throttleUpdate);
            }
          })
        }
      })
    }

    return {
      cors: true,
      status: 201,
      json: event
    }
  }
  catch(e) {
    return {      
      cors: true,
      status: 500,
      json: {
        name: e.name,
        message: e.message,
        stack:e.stack
      }
    }
  }
}