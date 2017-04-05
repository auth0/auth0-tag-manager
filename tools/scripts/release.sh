#!/bin/bash -e
#
# Release script

# Export RELEASE env var
export RELEASE=1

# Verifies that is running from the right directory
if ! [ -e tools/scripts/release.sh ]; then
  echo >&2 "Please run tools/scripts/release.sh from the repo root"
  exit 1
fi

# Func to update or create json fields
update_json() {
  echo "$(node -p "p=require('./${1}');p['${2}']='${3}';JSON.stringify(p,null,2)")" > $1
  echo "Updated ${1} ${2} to ${3}"
}

# Func to delete json fields
delete_json() {
  echo "$(node -p "p=require('./${1}');delete p['${2}'];JSON.stringify(p,null,2)")" > $1
  echo "Deleted ${2} from ${1}"
}

# Func to validate semver
validate_semver() {
  if ! [[ $1 =~ ^[0-9]\.[0-9]+\.[0-9](-.+)? ]]; then
    echo >&2 "Version $1 is not valid! It must be a valid semver string like 1.0.2 or 2.3.0-beta.1"
    exit 1
  fi
}


LAST_COMMIT=$(git log -1 --pretty=%B) # Save last commit name
REMOTE_DEST="origin"                  # git remote destination of commits and tags


# Bump package.json version
## Get actual version
CURRENT_VERSION=$(node -p "require('./package').version")

## Ask for the new version
printf "Next version (current is $CURRENT_VERSION)? "
read NEXT_VERSION

if [ "$NEXT_VERSION" == "$CURRENT_VERSION" ]; then
  echo "There is already a version $NEXT_VERSION. Skipping release"
  exit 1
else
  echo "Deploying $NEXT_VERSION package.json version"

  ## Validate it
  validate_semver $NEXT_VERSION

  ## Update package.json with the new version
  update_json 'package.json' 'version' $NEXT_VERSION

  ## Add to stage version change
  git add package.json

  # Add changelog entry
  CHANGELOG_ENTRY="## $NEXT_VERSION ("
  CHANGELOG_EXISTS=$(cat CHANGELOG.md | grep "$CHANGELOG_ENTRY")

  if [ ! -z "$CHANGELOG_EXISTS" ]; then
    echo "There is already a changelog entry $CHANGELOG_EXISTS in CHANGELOG.md. Skiping changelog entry publish."
  else
    echo "Deploying $NEXT_VERSION changelog entry to CHANGELOG.md"

    ## Update CHANGELOG.md
    $(npm bin)/conventional-changelog -i CHANGELOG.md -s

    ## Commit and push version change
    git add CHANGELOG.md
  fi

  ## Commit and push changes
  git commit -m "Release $NEXT_VERSION"
  git push $REMOTE_DEST master
fi


# Create and push normal git tag
NEXT_TAG_NAME="$NEXT_VERSION"
NEXT_TAG_NAME_EXISTS=$(git tag -l "$NEXT_TAG_NAME")

if [ ! -z "$NEXT_TAG_NAME_EXISTS" ]; then
  echo "There is already a tag $NEXT_TAG_NAME_EXISTS in git. Skiping git deploy."
else
  echo "Deploying $NEXT_TAG_NAME git tag"

  ## Name of the transitory branch for the npm package
  TEMP_TAG_BRANCH="lib"

  ## Change to the transitory branch
  git branch -D "$TEMP_TAG_BRANCH"
  git checkout -b "$TEMP_TAG_BRANCH"

  ## Build university as a node module
  NODE_ENV=production npm run build

  ## Add changes to stage and commit
  grep -v '^build$' .gitignore > /tmp/.gitignore
  mv /tmp/.gitignore .gitignore
  git add --force build/*
  rm -rf src tools .babelrc .editorconfig .eslintrc
  git add .
  git commit -m "Build $NEXT_TAG_NAME"

  ## Create git tag and push it
  git tag $NEXT_TAG_NAME -m "Last commit: $LAST_COMMIT"
  git push $REMOTE_DEST $NEXT_TAG_NAME

  ## Change to branch master and remove temp branch
  git checkout master
  git branch -D "$TEMP_TAG_BRANCH"
  # Create and push normal git tag
  git tag "v$NEXT_TAG_NAME"
  git push $REMOTE_DEST "v$NEXT_TAG_NAME"
fi

echo "Release: SUCCESS!"
