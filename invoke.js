'use strict';

const fs = require('fs');
const { encryptS3File } = require('./lambda');

(async () => {
  const fileToEncryptBuffer = fs.readFileSync('./LICENSE');
  const event = {
    isBinary: true,
    base64file: fileToEncryptBuffer.toString('base64')
  };
  const response = await encryptS3File(event);
  console.log(JSON.stringify(response));
})();
