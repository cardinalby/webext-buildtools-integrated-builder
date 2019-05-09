## Options
*IntegratedBuilder* needs *options* object to be passed to constructor.
Not all options keys are required, depending on required outputs.
Definition from [declarations/options.d.ts](declarations/options.d.ts):

```ts
interface IIntegratedOptions {
    zipOptions?: IDirReaderOptions;
    chromeCrx?: IChromeCrxOptions;
    chromeWebstore?: IChromeWebstoreOptions;
    firefoxAddons?: IFirefoxAddonsOptions;
}
```

### zipOptions
```ts
interface IDirReaderOptions {
    /** Target path for built unsigned zip file */
    zipOutPath?: string;
    zipOptions?: IZipOptions;
}
```
* **zipOutPath** is required to specify output path for zip file if you need one. 
To require it call `builder.requireZip(true, ...)`
* **zipOptions** is optional, use to specify which files will be included to the 
*archive* and pass options to *archiver*. 
[Details](https://github.com/cardinalby/webext-buildtools-dir-reader-mw/blob/master/options.md).

**Even if you don't require zip file output**, specified *zipOptions* has impact on temporary 
zip file which will be used in further build process for Chrome Webstore, Chrome Crx and Firefox Addons.  

### chromeCrx
Object with keys for corresponding [sub-builder](https://github.com/cardinalby/webext-buildtools-chrome-crx-builder). 
The following description omits some not mandatory keys, read 
[options definition](https://github.com/cardinalby/webext-buildtools-chrome-crx-builder/blob/master/declarations/options.d.ts)
for details.

Required if you will call `builder.requireSignedCrx(...)` or `builder.requireSignedCrxUpdateXml(...)`.
##### For signed crx file:
```js
{    
    ...
    // You can use 'privateKey' with Buffer instead
    privateKeyFilePath: '/path/to/key.pem',     
    crxFilePath: '/output/file/path.crx'
    ...
}
```
##### For update.xml file:
```js
{      
    ...
    updateXml: {
        // URL to the .crx file
        codebaseUrl: 'https://.../extension.crx',
        outFilePath: '/output/file/path.xml',
        // if not specified it will be generated from privateKey
        appId: '...'
    }     
    ...
}
```

### chromeWebstore
Object with keys for corresponding [sub-builder](https://github.com/cardinalby/webext-buildtools-chrome-webstore-builder). 
The following description omits some not mandatory keys, read 
[options definition](https://github.com/cardinalby/webext-buildtools-chrome-webstore-builder/blob/master/declarations/options.d.ts)
for details.

Required if you will call `builder.requireChromeWebstoreDeploy(...)` or `builder.requireChromeWebstorePublishedCrx(...)`.
 
Mandatory field for any actions with Crome Web Store is **extensionId** key (your extension id in Chrome Web Store).

##### for ChromeWebstoreDeploy:
```js
{
    ...
    extensionId: '...',    
    apiAccess: {        
        clientId: '...';        
        clientSecret: '...';    
        refreshToken: '...';
    },
    publish: {
        // Another option is 'trustedTesters'
        target: 'default'
    },
    ...
}
```
To setup API access you need to specify `clientId`, `clientSecret` and `refreshToken` in `options.apiAccess`.
To find out how to obtain them you can read:
* [Using the Chrome Web Store Publish API](https://developer.chrome.com/webstore/using_webstore_api) 
* [How to generate Google API keys](https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md)

##### for ChromeWebstorePublishedCrx:
```js
{
    ...
    extensionId: '...',    
    downloadCrx: {
        outCrxFilePath: '/path/to/output/file.crx'        
    },
    ...
}
```

### firefoxAddons
Object with keys for corresponding [sub-builder](https://github.com/cardinalby/webext-buildtools-firefox-addons-builder). 
The following description omits some not mandatory keys, read 
[options definition](https://github.com/cardinalby/webext-buildtools-firefox-addons-builder/blob/master/declarations/options.d.ts)
for details.

Required if you will call `builder.requireFirefoxAddonsDeploy(...)` or `builder.requireFirefoxAddonsSignedXpi(...)`.

##### Api access
To setup API access you need to generate and specify `jwtIssuer`, `jwtSecret`.
You can create them at [https://addons.mozilla.org/en-US/developers/addon/api/key/](https://addons.mozilla.org/en-US/developers/addon/api/key/)

You have to specify obtained values in `api` key: 
```js
{
    ...
    api: {
        jwtIssuer: '...',        
        jwtSecret: '...'
    },
    ...
}
```

##### For FirefoxAddonsDeploy:
```js
{    
    ...
    deploy: {        
         // Id of extension which was already uploaded to Firefox Addons
        extensionId: '...'
    },
    ...
}
```

##### For FirefoxAddonsSignedXpi:
```js
{    
    ...
    signXpi: {        
        
        // Id of extension uploaded to Firefox Addons especially for offline distribution
        // If not specified, new extension will be added for every build (not recommended)        
        extensionId: '...',
        
        // Target path for built and signed xpi file
        xpiOutPath: '/path/to/output/file.xpi'
    },
    ...
}
```