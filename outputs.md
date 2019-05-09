## Outputs
To ask builder to produce needed build results (files or deploy actions) also 
called *outputs* you should call corresponding `builder.requireXXX()` methods.

After the build you can find info about produced *outputs* in build result assets:
```js
const builder = new new IntegratedBuilder(options, ...);
builder.setInputDirPath('...');

... // require methods calls

const result = await builder.build();
const assets = result.getAssets();
```

The following doc describes *require* methods and produced outputs.

To read about required options for each output please go [options.md](options.md).

### builder.requireZip(...)
Extension dir packed to zip
##### Arguments:
1. **`file: boolean = true`**. 
Save to `options.zipOptions.zipOutPath` file
2. **`buffer: boolean = false`**.
Save zip buffer to asset
##### Corresponding options key:
*zipOptions*
##### Assets
```js
const zipBuffer = assets.zipBuffer.getValue();
const zipFilePath = assets.zipFile.getValue();
```

### builder.requireManifest()
Parsed manifest object
##### Assets
```js
const manifestObject = assets.manifest.getValue();
```

### builder.requireSignedCrx(...)
Packed and signed *crx* file for offline distribution.
Read more details at [Alternative Extension Distribution Options](https://developer.chrome.com/apps/external_extensions). 
##### Arguments:
1. **`file: boolean = true`**. 
Save crx to `options.chromeCrx.crxFilePath` file
2. **`buffer: boolean = false`**.
Save crx buffer to asset
##### Corresponding options key:
*chromeCrx*
##### Assets
```js
const crxFilePath = assets.signedCrxFile.getValue();
const crxBuffer = assets.crxBuffer.getValue();
```

### builder.requireSignedCrxUpdateXml(...)
updateXML for extensions hosted not on Chrome Web Store. This xml is used as response 
at url, specified in manifest's `update_url` key. 
See [https://developer.chrome.com/apps/autoupdateBuffer](https://developer.chrome.com/apps/autoupdateBuffer) 
for details.    
##### Arguments:
1. **`file: boolean = true`**. 
Save xml to `options.chromeCrx.updateXml.outFilePath` file
2. **`buffer: boolean = false`**.
Save xml buffer to asset
##### Corresponding options key:
*chromeCrx.updateXml*
##### Assets
```js
const updateXmlFilePath = assets.signedCrxUpdateXmlFile.getValue();
const updateXmlBuffer = assets.signedCrxUpdateXmlBuffer.getValue();
```

### builder.requireChromeWebstoreDeploy(...)
Upload/publish extension to Chrome Web Store.    
##### Arguments:
1. **`upload: boolean = true`**. 
upload extension to Chrome Web Store (first step before publish)
2. **`publish: boolean = true`**.
publish extension to Chrome Web Store (second step). 
Normally is used with `upload`, but also can be used to only publish already uploaded version
##### Corresponding options key:
*chromeWebstore*
##### Assets
```js
const webstoreUploadInfo = assets.chromeWebstoreUploadedExt.getValue();
```
[Chrome Webstore upload info definition](https://github.com/cardinalby/webext-buildtools-chrome-webstore-builder/blob/master/declarations/uploadedExtInfo.d.ts)
```js
const webstorePublishInfo = assets.chromeWebstorePublishedExt.getValue();
```
[Chrome Webstore publish info definition](https://github.com/cardinalby/webext-buildtools-chrome-webstore-builder/blob/master/declarations/publishedExtInfo.d.ts)

### builder.requireChromeWebstorePublishedCrx(...)
Download published crx file from Chrome Web Store (undocumented feature).
Normally is used together with `requireChromeWebstoreDeploy()` and  `requirePublishedExt()`,
but can be used separately to download crx file for `extensionId` specified in options.     
##### Arguments:
1. **`file: boolean = true`**. 
Save crx to `options.chromeWebstore.downloadCrx.outCrxFilePath` file
2. **`buffer: boolean = false`**.
Save crx buffer to asset
##### Corresponding options key:
*chromeWebstore*
##### Assets
```js
const publishedCrxBuffer = assets.chromeWebstorePublishedCrxBuffer.getValue();
const publishedCrxFilePath = assets.chromeWebstorePublishedCrxFile.getValue();
```

### builder.requireFirefoxAddonsDeploy()
Deploy extension to Firefox Addons     
##### Corresponding options key:
*firefoxAddons*
##### Assets
```js
const deployedFirefoxExtId = assets.firefoxAddonsDeployedExtStoreId.getValue();
```

### builder.requireFirefoxAddonsSignedXpi(...)
Pack and sign xpi file for offline distribution. 
This output is independent from deployed extension.
`options.firefoxAddons.signXpi.extensionId` should contain id of extension uploaded to Firefox Addons 
especially for offline distribution. If not specified, new extension will be added 
for every build (not recommended)     
##### Arguments:
1. **`file: boolean = true`**. 
Save xpi to `options.firefoxAddons.signXpi.xpiOutPath` file
2. **`buffer: boolean = false`**.
Save xpi buffer to asset
##### Corresponding options key:
*firefoxAddons*
##### Assets
```js
// Could be useful to obtain created extension id if you didn't 
// specify options.firefoxAddons.signXpi.extensionId 
const signedExtId = assets.firefoxAddonsSignedExtStoreId.getValue();

const signedXpiFilePath = assets.firefoxAddonsSignedXpiFile.getValue();
const signedXpiFileBuffer = assets.firefoxAddonsSignedXpiBuffer.getValue();
```