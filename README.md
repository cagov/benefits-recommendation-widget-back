# Benefits recommendation widget API

The benefits recommendation widget is an embeddable web component that presents links to apply for California benefits available to individudals.

## Function

This widget receives requests for benefit links when widgets load on pages. It accepts available information about the current site, user info like language preference. This API will return the set of benefits links to present as json.

The frontend widget records user activity events like: widget render, clicks on links and posts this interaction data to the API as well

This widget will be placed on different sites which aren't currently using google analytics or don't have the state GA tag available so we don't have a client side way to report to GA. It isn't desirable to embed a GA tag inside the widget because of client side weight. We can explore reporting events to the GA API though.

<img src="benefits_recommend_API.png">


## Built with

### FAAS & DynamoDB

This API is based on the AWS Function As A Service (FAAS) offering: AWS Lambda. This is the most mature FAAS option available from all cloud providers and gets you all the FAAS benefits of managed scalability, resilience and low cost as well as quick(sub second when the total code payload is under 5MB) cold starts.

The AWS Lambda functions will be storing event data in DynamoDB. This managed NoSQL database option from AWS is designed to handle FAAS interactions which can quickly horizontally scale and temporarily spike the inbound data connections.

### The Architect project 

This application is built with the <a href="https://openjsf.org/projects/">JS Foundation backed</a> project <a href="https://arc.codes/">Architect</a>.

The Architect project helps with creating and managing AWS infrastructure for AWS Lambda based applications.

AWS Lambda can be utilized without any framework or with alternate frameworks like <a href="https://www.serverless.com/">the serverless framework</a>.

Architect is helpful for starting out because:
- You get a local development environment immediately that is equivalent to the cloud setup including FAAS endpoints and DynamoDB tables
- You get your infrastructure completely modeled in code from the beginning. 
  - There is no manual setup or configuration of AWS services like S3, API Gateway, Lambda, DynamoDB. 
  - All infrastructure assets are created based on directions coded in the app.arc file. 
  - The setup command can be run in a new region or entirely new AWS account to reproduce the same set of AWS services
  - The app.arc manifest file provides a shorthand for infrastructure setup that is translated into AWS CloudFormation by Architect
- You have built in commands to deploy to multiple versions of your application so there is a staging and production instance including all infrastructure pieces by default.

#### No lockin

This framework speeds up initial development but the code for the individual lambdas is written in the same node.js code you could paste directly into the AWS Lambda online code editor. If you want to abandon the architect framework you can still use all the code you have written.

## Event tracking

This widget also accepts information about widget placement and user interactions like:
- Counts of when widget is rendered on a page
- URL of page it is included on
- Whether it reached the user's viewport area. It may have been rendered near the bottom of a page and never gotten scrolled to. In that case it wouldn't report reaching user's viewport.
- User browser information:
  - user agent string
  - any user defined language preference
- Clicks on any links presented inside the widget

### Sample data sructure

| event      | timestamp      | displayUrl | userAgent      | language | link |
| ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |
| render | 1658256582717 | https://edd.ca.gov/status | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36 | en-US | |
| entered viewport | 1658256582717 | https://edd.ca.gov/status | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36 | en-US | |
| click | 1658256627366 | https://edd.ca.gov/status | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36 | en-US | https://www.caliheapapply.com/ |

### Expected queries

- Count of widget renders on each domain
- Count of widget renders on each unique url
- Count of widget entering viewport on each domain
- Count of widget entering viewport on each unique url
- Count of clicks on widget on each domain
- Count of clicks on widget on each unique url
- Count of clicks on each presented widget link
- Language breakdown overall
- Language breakdown per display domain
- Count of clicks overall
- Count of clicks to each destination overall

In order to support the expected queries the following partition and sort key fields will be created in DynamoDB:

| Partition key     | sort key    | GSI         | results     |
| -----------       | ----------- | ----------- | ----------- |
| event             | displayUrl  | time        | { "render", 1658256627366, "https://edd.ca.gov/status", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36", "en-US", "" }
| event_clickurl    | displayUrl  | time        | { "click", 1658256627366, "https://edd.ca.gov/status", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36", "en-US", "https://www.caliheapapply.com/" }
| event_domain    | displayUrl  | time        | { "click", 1658256627366, "https://edd.ca.gov/status", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36", "en-US", "https://www.caliheapapply.com/" }
| event_language    | displayUrl  | time        | { "click", 1658256627366, "https://edd.ca.gov/status", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36", "en-US", "https://www.caliheapapply.com/" }
