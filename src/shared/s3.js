const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({});

/** Grab the definitions file from S3. */
exports.getDefinitions = async () => {
  const command = new GetObjectCommand({
    Bucket: "cdn.innovation.ca.gov",
    Key: "br/benefits-recs-defs.json",
  });

  return await s3
    .send(command)
    .then((res) => res.Body.transformToString())
    .then((json) => JSON.parse(json))
    .catch((error) => {
      console.log("Error fetching definitions from S3.");
      throw error;
    });
};
