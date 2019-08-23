'use strict';

const { encrypt } = require('./sec');

/**
 * This function is called when an S3
 * object is put into the S3 bucket.
 */
exports.encryptS3File = async event => {
  const body = event.body || event;
  const binFile = Buffer.from(body.base64file, 'base64');
  const encrypted = await encrypt(binFile, body.isBinary);

  // TODO implement S3 retrieval, encryption and storing.
  return {
    statusCode: 200,
    body: JSON.stringify({
      isBinary,
      encrypted: Buffer.isBuffer(encrypted) ? encrypted.toString('base64') : encrypted
    }),
    headers: { 'Content-type': 'application/json' }
  };
};

/**
 * This function is called when the API gateway
 * is called passing a new file to be stored ino S3.
 */
exports.saveS3File = async event => {
  const body = event.body || event;
  // TODO implement S3 file encryption + storing
  return {
    statusCode: 200,
    body: JSON.stringify({}),
    headers: { 'Content-type': 'application/json' }
  };
};
