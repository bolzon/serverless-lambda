'use strict';

const AWS = require('aws-sdk');
const S3_API_VERSION = process.env.S3_API_VERSION || '2006-03-01';

let s3instance = null; // single instance by runtime

/**
 * Class to manage storage (S3).
 */
class Storage {
  /**
   * Puts file into S3.
   * @returns URL of S3 file location.
   */
  static putFile (bucketName, objectKey, objectBody) {
    const s3 = Storage._getS3Instance();
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: objectBody
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => err ? reject(err) : resolve(data.Location));
    });
  }

  /**
   * Gets file from S3.
   * @returns Object containing file info (content, type, encoding and size).
   */
  static getFile (bucketName, objectKey) {
    const s3 = Storage._getS3Instance();
    const params = {
      Bucket: bucketName,
      Key: objectKey
    };
    return new Promise((resolve, reject) => {
      s3.getObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            content: data.Body,
            type: data.ContentType,
            encoding: data.ContentEncoding,
            size: data.ContentLength
          });
        }
      });
    });
  }

  /**
   * Deletes file from S3.
   */
  static deleteFile (bucketName, objectKey) {
    const s3 = Storage._getS3Instance();
    const params = {
      Bucket: bucketName,
      Key: objectKey
    };
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => err ? reject(err) : resolve());
    });
  }

  /**
   * Gets the single S3 instance.
   * @private
   */
  static _getS3Instance () {
    s3instance = s3instance || new AWS.S3({ apiVersion: S3_API_VERSION });
    return s3instance;
  }
}

module.exports = { Storage };
