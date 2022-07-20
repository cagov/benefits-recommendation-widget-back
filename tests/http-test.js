const test = require('tape')
const tiny = require('tiny-json-http')
const sandbox = require('@architect/sandbox')

/**
 * first we need to start the local http server
 */
test('sandbox.start', async t=> {
  t.plan(1)
  await sandbox.start({ quiet: true })
  t.ok(true, 'sandbox started on http://localhost:3333')
})

/**
 * then we can make a request to it and check the result
 */
test('get /', async t=> {
  t.plan(1)
  let result = await tiny.get({ url: 'http://localhost:3333' })
  t.ok(result, 'got 200 response')
  console.log(result)
})

test('post /event', async t=> {
  t.plan(1)
  let result = await tiny.post({
    url: 'http://localhost:3333/event',
    data: {
      event: 'render',
      displayURL: 'https://awebsite.ca.gov',
      userAgent: 'Lynx text only browser',
      language: 'en-US',
      link: 'https://wic.ca.gov',
      linkText: 'Apply to WIC',
    }
  })
  t.ok(result.body.json.hasOwnProperty('event'), 'got event response back')
  console.log(result.body)
})

/**
 * finally close the server so we cleanly exit the test
 */
test('sandbox.end', async t=> {
  t.plan(1)
  await sandbox.end()
  t.ok(true, 'sandbox ended')
})