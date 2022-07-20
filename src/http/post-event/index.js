let arc = require('@architect/functions')

exports.handler = async function http (req) {
  let client = await arc.tables()
  let events = client.events
  /*
    What data is coming in?
    - event
    - displayURL
    - userAgent
    - language
    - link
    - linkText
  */

  if(typeof(req.body) === 'string') {
    req.body = JSON.parse(req.body);
  }

  try {
    if (!req.body.event)
      throw ReferenceError('missing event type')

    if (!req.body.displayURL)
      throw ReferenceError('missing displayUrl')

    req.body.eventKey = req.body.event;
    req.body.timestamp = new Date().getTime().toString();

    let event = await events.put(req.body)

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