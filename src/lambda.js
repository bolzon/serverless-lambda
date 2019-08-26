'use strict';

const { encrypt } = require('./sec');
const { Storage } = require('./storage');

const S3_ENCRYPTED_PREFIX = process.env.S3_ENCRYPTED_DIR || 'encrypted/';
const reS3EncryptedPrefix = new RegExp(`^${S3_ENCRYPTED_PREFIX}`, 'i');

/**
 * This function is called when an S3
 * object is put into the S3 bucket.
 */
exports.encryptS3File = async event => {
  const startTime = Date.now();
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
    console.log(`Total time: ${Date.now() - startTime}ms`);
  }
};
