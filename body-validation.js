'use strict';

const joi = require('joi');

const RequestBodySchema = joi.object({
  keyName: joi.string.required(),
  bucketName: joi.string().required(),
  fileContent: joi.string().required()
});

const validate = requestBody => joi.validate(requestBody, RequestBodySchema);

module.exports = { validate };
