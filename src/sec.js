'use strict';

const fs = require('fs');
const openpgp = require('openpgp');
const pubkey = fs.readFileSync('./pub.key');

let pubkeys = null;

const encrypt = async (data, isBinary = true) => {
  if (!pubkeys) {
    pubkeys = await openpgp.key.readArmored(pubkey);
  }
  if (!Buffer.isBuffer(data)) {
    data = Buffer.from(data);
  }

  const cipher = await openpgp.encrypt({
    message: openpgp.message.fromBinary(data),
    publicKeys: pubkeys.keys,
    armor: !isBinary
  });

  if (isBinary) {
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

  return cipher.data || cipher;
};

module.exports = { encrypt };
