@app
benefits-recommendation-api

@cors
@http
get /benefits
options /benefits
post /event

@scheduled
airtable cron(15 12 * * ? *)

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
runtime nodejs18.x
timeout 15
policies 
  arn:aws:iam::413306215966:policy/s3BucketSingle-benefits-recommendation.sinnovation.ca.gov 
  architect-default-policies