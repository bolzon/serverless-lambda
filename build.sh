#!/bin/bash

npm run lint

if [ $? -ne 0 ]; then
  echo
  echo "Lint error."
  echo
  exit
fi

origin_path=$(pwd)
dist_zip=$origin_path/dist.zip

rm -rf $dist_zip dist/
mkdir -p dist/
cp -r src/* dist/
cp package.json dist/
cp package-lock.json dist/

cd $origin_path/dist/
npm install --production
rm package*
zip -rq $dist_zip .

cd $origin_path
rm -rf dist/
unset origin_path

echo
echo "File '$dist_zip' was created."
echo
