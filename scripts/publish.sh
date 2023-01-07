#! /bin/sh

# https://docs.npmjs.com/cli/v7/using-npm/changelog?v=true#720-2020-12-15
name=$(npm pkg get name | tr -d '"')
version=$(npm pkg get version | tr -d '"')

node $PWD/scripts/check-version-published.js $name $version

if [ $? -eq 0 ] ; then
  npm run dist:publish
else
  echo "No changes to publish"
fi
