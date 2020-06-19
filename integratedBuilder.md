## IntegratedBuilder guide
You can use `IntegratedBuilder` class directly if you want to get more control over build process

#### Create builder instance
 
```js
const IntegratedBuilder = require('webext-buildtools-integrated-builder').default;

const options = { ... };  // see description below
const logMethod = console.log;
const builder = new IntegratedBuilder(
    options, 
    logMethod,
    false, // stopOnWarning
    true   // stopOnError
    );
``` 

Options keys are described in [options.md](options.md). Not all options are required, depending on required outputs. 

[See](https://github.com/cardinalby/webext-buildtools-integrated-builder/blob/master/logMethod.md) how to get `logMethod` for pretty output. 

#### Set input dir path
```js
builder.setInputDirPath('./path/to/extension_dir');
```

#### Require needed outputs
Read details in [outputs.md](outputs.md). All available *require* methods:
```js
// corresponding options key: zipOptions
builder.requireZip(
    true,  // is file required
    false   // is buffer required 
);

builder.requireManifest();

// corresponding options key: chromeCrx 
builder.requireSignedCrx(
    true,  // is file required 
    false   // is buffer required
);
builder.requireSignedCrxUpdateXml(
    true,  // is file required 
    false   // is buffer required
);

// corresponding options key: chromeWebstore
builder.requireChromeWebstoreDeploy(
    true,  // upload 
    true   // publish
);
builder.requireChromeWebstorePublishedCrx(
    true,  // is file required 
    false  // is buffer required
);

// corresponding options key: firefoxAddons
builder.requireFirefoxAddonsDeploy();
builder.requireFirefoxAddonsSignedXpi(
    true,  // is file required 
    false  // is buffer required
);
```

#### Start build and get results Promise
```js
const result = await builder.build();

// result.errors is Array<{targetName: string, error: Error}>();
for (const errItem in result.errors) {  
    console.log(`${errItem.error} in ${errItem.targetName} builder`);    
}

const assets = result.getAssets();
```

You can access all output assets (which you have required) if you need:
```js
const zipBuffer = assets.zipBuffer.getValue();
const zipFilePath = assets.zipFile.getValue();
const manifestObject = assets.manifest.getValue();
```
```js
const crxFilePath = assets.signedCrxFile.getValue();
const crxBuffer = assets.crxBuffer.getValue();
const updateXmlFilePath = assets.signedCrxUpdateXmlFile.getValue();
const updateXmlBuffer = assets.signedCrxUpdateXmlBuffer.getValue();
```
```js
const webstoreUploadInfo = assets.chromeWebstoreUploadedExt.getValue();
```
[Chrome Webstore upload info definition](https://github.com/cardinalby/webext-buildtools-chrome-webstore-builder/blob/master/declarations/uploadedExtInfo.d.ts)
```js
const webstorePublishInfo = assets.chromeWebstorePublishedExt.getValue();
```
[Chrome Webstore publish info definition](https://github.com/cardinalby/webext-buildtools-chrome-webstore-builder/blob/master/declarations/publishedExtInfo.d.ts)
```js
const publishedCrxBuffer = assets.chromeWebstorePublishedCrxBuffer.getValue();
const publishedCrxFilePath = assets.chromeWebstorePublishedCrxFile.getValue();
```
```js
const deployedFirefoxExtId = assets.firefoxAddonsDeployedExtStoreId.getValue();
const signedExtId = assets.firefoxAddonsSignedExtStoreId.getValue();
const signedXpiFilePath = assets.firefoxAddonsSignedXpiFile.getValue();
const signedXpiFileBuffer = assets.firefoxAddonsSignedXpiBuffer.getValue();
``` 