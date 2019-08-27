'use strict';

const fs = require('fs');
const openpgp = require('openpgp');

// reads PGP public key from source files
const PUBKEY = fs.readFileSync('./pub.key');

/**
 * Encrypts data using a PGP public key.
 * @param {Buffer} data File content.
 * @param {boolean} returnAsBinary Flag to indicate response is binary or string base64 encoded (default: true).
 */
const encrypt = async (data, returnAsBinary = true) => {
  const pubkeys = await openpgp.key.readArmored(PUBKEY);
  if (!Buffer.isBuffer(data)) {
    data = Buffer.from(data);
  }

  const cipher = await openpgp.encrypt({
    message: openpgp.message.fromBinary(data),
    publicKeys: pubkeys.keys,
    armor: !returnAsBinary
  });

  if (returnAsBinary) {
    // converts response to binary
    const encrypted = cipher.message.packets.write();
    const reader = openpgp.stream.getReader(encrypted);
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return Buffer.concat(chunks);
      }
      chunks.push(value);
    }
  }

  return cipher.data || cipher; // string base64
};

module.exports = { encrypt };
