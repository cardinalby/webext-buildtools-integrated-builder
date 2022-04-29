[![npm-publish](https://github.com/cardinalby/webext-buildtools-integrated-builder/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/cardinalby/webext-buildtools-integrated-builder/actions/workflows/npm-publish.yml)

## Introduction
This package for **Node.js** provides complete solution to build and deploy your 
[Web Extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions).

It includes several builders for building/deploying Web Extension for 
different targets/platforms:
1. Pack to **zip** file 
([DirReaderBuilder](https://www.npmjs.com/package/webext-buildtools-dir-reader-mw))
2. Pack to signed **crx** file and generate **update.xml** file for 
offline distribution of Chrome extension
([ChromeCrxBuilder](https://www.npmjs.com/package/webext-buildtools-chrome-crx-builder))
3. Upload and publish on **Chrome Web Store**, save published **crx**
([ChromeWebstoreBuilder](https://www.npmjs.com/package/webext-buildtools-chrome-webstore-builder)) 
4. Deploy to **Firefox Add-ons**, sign **xpi** for offline distribution
([FirefoxAddonsBuilder](https://www.npmjs.com/package/webext-buildtools-firefox-addons-builder))

## GitHub Actions

If you are interested in building CI/CD solution for Web Extension using GitHub Actions it's better
to use the dedicated actions for it instead.

Please read the ["Releasing WebExtension using GitHub Actions"](https://cardinalby.github.io/blog/post/github-actions/webext/1-introduction/) article to learn the details.

## Installation
`npm install webext-buildtools-integrated-builder`

## Usage
The most simple way to start build is to call `startBuild` function and pass all required params as 
one object:
```js
const startBuild = require('webext-buildtools-integrated-builder').startBuild;
const options = {...}; // you can retrieve json object here
startBuild(options);
```
To easily make `options` object you can use:
* It's [JSON Schema](https://cardinalby.github.io/webext-buildtools-options-editor/buildRunnerOptions.schema.json)
* It's [Typescript interface](declarations/buildRunnerOptions.d.ts)  
* [Online JSON editor](https://cardinalby.github.io/webext-buildtools-options-editor/)

## Secrets
`options` object has `substituteEnvVariables` flag which enables substitution of `$(ENV_NAME)` 
strings inside config to corresponding environment variables (for usage in CI pipelines)

## Advanced usage
Main class of this package is `IntegratedBuilder`, you can use it directly to customize your build and 
get more control over build process. Read [integratedBuilder.md](integratedBuilder.md) for details.

If you interested in details or in developing your own builder, please go to 
[webext-buildtools-builder-types](https://github.com/cardinalby/webext-buildtools-builder-types) repo.