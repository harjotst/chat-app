const AWS = require('aws-sdk');

const config = require('./config');

AWS.config.update({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_KEY,
  region: config.AWS_REGION,
});

const s3 = new AWS.S3();

module.exports = s3;
