import { IChromeWebstoreOptions } from 'webext-buildtools-chrome-webstore-builder';
import { IChromeCrxOptions } from 'webext-buildtools-chrome-crx-builder';
import { IFirefoxAddonsOptions } from 'webext-buildtools-firefox-addons-builder';
import { IDirReaderOptions } from 'webext-buildtools-dir-reader-mw';

export interface IBuildRunnerOptions
{
    /**
     * If true, all string values looking like $(BLABLA) will be substituted by
     * corresponding BLABLA env variable
     * @default true
     */
    substituteEnvVariables: boolean;
    /**
     * Path to extension directory
     */
    extensionDirPath: string,
    /**
     * Stop if any build step failed
     * @default true
     */
    stopOnError: boolean;
    /**
     * Stop if any build step finished with warning
     * @default false
     */
    stopOnWarning: boolean;
    /**
     * Build zip file
     */
    zipFile?: {
        options: IDirReaderOptions;
    },
    /**
     * Upload extension to Chrome Webstore
     */
    chromeWebstore?: {
        /**
         * Additional actions after uploading extension to webstore
         */
        actions: {
            /**
             * Perform publishing after uploading. Set to false, if you want to publish it manually
             * @default true
             */
            publish: boolean;
            /**
             * Download published crx file from Chrome Webstore to use it as artifact
             * If true, you have to specify options.downloadCrx.outCrxFilePath.
             * Makes sense only if publish is true
             * @default false
             */
            downloadPublishedCrx: boolean;
        },
        options: IChromeWebstoreOptions;
    },
    /**
     * Build crx locally using your private key for offline distribution
     */
    chromeCrx?: {
        /**
         * Specify if build is true
         */
        options: IChromeCrxOptions;
    }
    /**
     * Deploy to Firefox Addons
     */
    firefoxAddons?: {
        /**
         * Prepare signed xpi file. If true, options.signXpi.extensionId should contain id of extension
         * uploaded to Firefox Addons especially for offline distribution. If not specified, new extension will
         * be added for every build (not recommended). Also you should specify options.apiAccess
         * @default false
         */
        getSignedXpi: boolean;
        options: IFirefoxAddonsOptions;
    }
}