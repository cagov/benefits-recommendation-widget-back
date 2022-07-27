//@ts-check
let arc = require('@architect/functions');

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
*/
exports.handler = async function http (req) {
  let client = await arc.tables();
  let events = client.events;

  if(typeof(req.body) === 'string') {
    req.body = JSON.parse(req.body);
  }

  try {
    if (!req.body.event)
      throw ReferenceError('missing event type');

    if (!req.body.displayURL)
      throw ReferenceError('missing displayUrl');

    req.body.eventKey = req.body.event;
    req.body.timestamp = new Date().getTime().toString();

    let event = await events.put(req.body);

    return {
      status: 201,
      json: event
    }
  }
  catch(e) {
    return {
      status: 500,
      json: {
        name: e.name,
        message: e.message,
        stack:e.stack
      }
    }
  }
}