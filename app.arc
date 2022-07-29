@app
benefits-recommendation-api

@cors
@http
get /
post /event

@tables
events
  eventKey *String
  displayURL **String

@tables-indexes
events
  timestamp *String

@aws
# profile default
region us-west-1
