@app
benefits-recommendation-api

@cors
@http
get /benefits
options /benefits
post /event

@macros
arc-macro-cors

@shared

@tables
events
  eventKey *String
  displayURL **String
throttleclicks
  name *String
  day **String

@tables-indexes
events
  timestamp *String

@aws
region us-west-1
bucket cagov-deployment-artifacts