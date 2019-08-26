# Serverless Lambda Demo

Code for serverless presentation demo using AWS Lambda.

## Before starting

Generate a PGP key.

Environment variables configuration (optional):

| Variable | Description | Default value |
| -------- | ----------- | ------------- |
| S3_ENCRYPTED_PREFIX | Prefix for encrypted files. | `'encrypted/'` |
| S3_API_VERSION | S3 API version. | `'2006-03-01'` |

## PGP

Generate a PGP key.

```
$ gpg --gen-key
```

Use info below:

```
Real name: Serverless Demo
Email address: serverless@demo
```

Export the PGP pub key.

```
$ gpg --armor --export serverless@demo > pub.key
```

You can also delete the secret/pub keys if it's not used anymore.

```
$ gpg --delete-secret-key serverless@demo # secret
$ gpg --delete-key serverless@demo # pub
```
