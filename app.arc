@app
benefits-recommendation-api

@cors
@http
get /benefits
options /benefits
post /event

@macros
arc-macro-cors

@tables
events
  eventKey *String
  displayURL **String

@tables-indexes
events
  timestamp *String
  name eventsByTime

@aws
# profile default
region us-west-1
