# Serverless Lambda Demo

Code for serverless presentation demo using AWS Lambda.

## Before starting

1) Install the modules.

    ```
    $ npm install
    ```

2) Generate a PGP key (see [PGP section](#PGP)).

3) Configure environment variables (optional).

    | Variable | Description | Default value |
    | -------- | ----------- | ------------- |
    | S3_ENCRYPTED_PREFIX | Prefix for encrypted files. | `'encrypted/'` |
    | S3_API_VERSION | S3 API version. | `'2006-03-01'` |

## Deploy package

Create a deploy package to upload to AWS Lambda by running the command below:

```
$ npm run build
```

A `dist.zip` file will be created and may be uploaded to AWS Lambda.

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
