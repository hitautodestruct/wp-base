# wp-base started scripts

## What
wp-base is a nodejs index file that pulls wordpress and sets up base directories and node modules for running a basic wordpress and gulp setup.

## Why
wp-base is used mainly for setting up our starter projects when working with wordpress. It's easy to just clone the repo and have the script setup most of what you need.

## How
NOTE: **This requires node 8+**

1. Git clone the repo
```
git clone https://github.com/hitautodestruct/wp-base.git
```
2. Set the `PROJECT_NAME` to the name of the  wordpress theme you want to create inside of index.js
```
// Inside index.js
const PROJECT_NAME = 'newproject'
```
3. Run the command `npm run create`
4. Start gulping with `gulp`

## Notes
- This project does not install global node or gulp
- This project has been tested with macOS only
