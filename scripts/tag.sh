#! /bin/sh

# https://docs.npmjs.com/cli/v7/using-npm/changelog?v=true#720-2020-12-15
version=$(npm pkg get version | tr -d '"')
version="v${version}"

# When GH Actions checks out the repo it doesn't pull tags
echo "Fetching tags"
git fetch --tags

if git show-ref --tags $version --quiet; then
  echo "Tag ${version} exists"
else
  echo "Tagging with ${version}"
  git tag $version

  # Need to push to GH to then create a release
  git push --tags

  gh release create $version
fi
