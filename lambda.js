'use strict';

const { encrypt } = require('./sec');
const { Storage } = require('./storage');
const { validate } = require('./body-validation');

/**
 * This function is called when an S3
 * object is put into the S3 bucket.
 */
exports.encryptS3File = async event => {
  const body = event.body || event;
  for (const record of body.Records || []) {
    const bucketName = record.s3.bucket.name;
    const keyName = record.s3.bucket.object.key;
    const fileBuffer = await Storage.getFile(bucketName, keyName);
    const encryptedFile = await encrypt(fileBuffer);
    await Storage.putFile(bucketName, keyName, encryptedFile);
  }
  return ok();
};

/**
 * This function is called when the API gateway
 * is called passing a new file to be stored into S3.
 */
exports.saveS3File = async event => {
  const body = event.body || event;
  try {
    await validate(body);
  } catch (ex) {
    return nok(ex.stack || ex.message || ex);
  }
  const fileBuffer = Buffer.from(body.base64file, 'base64');
  await Storage.putFile(body.bucketName, body.keyName, fileBuffer);
  return ok();
};

/**
 * Create OK response payload.
 */
const ok = (body = null) => ({
  statusCode: 200,
  body: typeof body === 'string' ? body : JSON.stringify(body || {}),
  headers: { 'Content-type': 'application/json' }
});

/**
 * Create error response payload (bad request = 400).
 */
const nok = error => ({
  statusCode: 400,
  body: JSON.stringify({ error }),
  headers: { 'Content-type': 'application/json' }
});
