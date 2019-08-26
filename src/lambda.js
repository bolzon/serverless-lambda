'use strict';

const { encrypt } = require('./sec');
const { Storage } = require('./storage');
const { validate } = require('./body-validation');

const S3_ENCRYPTED_PREFIX = process.env.S3_ENCRYPTED_DIR || 'encrypted/';
const reS3EncryptedPrefix = new RegExp(`^${S3_ENCRYPTED_PREFIX}`, 'i');

/**
 * This function is called when an S3
 * object is put into the S3 bucket.
 */
exports.encryptS3File = async event => {
  const body = event.body || event;
  console.log(JSON.stringify({ timestamp: Date.now(), body }, null, 2));
  for (const record of body.Records || []) {
    const objectSize = record.s3.object.size;
    const objectKey = record.s3.object.key;
    if (reS3EncryptedPrefix.test(objectKey) || objectSize === 0) {
      console.log(`Skipping ${objectKey}`);
      continue; // skip this record
    }
    const bucketName = record.s3.bucket.name;
    const file = await Storage.getFile(bucketName, objectKey);
    const fileBuffer = await encrypt(file.content);
    const destObjectKey = `${S3_ENCRYPTED_PREFIX}${objectKey.replace(/.*\/([^/]+)$/, '$1')}`;
    console.log(`destObjectKey = ${destObjectKey}`);
    const url = await Storage.putFile(bucketName, destObjectKey, fileBuffer);
    console.log(`url = ${url}`);
    await Storage.deleteFile(bucketName, objectKey);
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
  const { bucketName, fileName } = body;
  const fileContent = Buffer.from(body.fileContent, 'base64');
  const fileUrl = await Storage.putFile(bucketName, fileContent);
  return ok({
    bucketName,
    fileName,
    fileUrl
  });
};

/**
 * Create OK response payload.
 */
const ok = (body = null) => ({
  statusCode: 200,
  body: typeof body === 'string' ? body : JSON.stringify(body || {}),
  headers: { 'content-type': 'application/json' }
});

/**
 * Create error response payload (bad request = 400).
 */
const nok = error => ({
  statusCode: 400,
  body: JSON.stringify({ error }),
  headers: { 'content-type': 'application/json' }
});
