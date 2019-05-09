import { IChromeCrxOptions } from 'webext-buildtools-chrome-crx-builder';
import { IChromeWebstoreOptions } from 'webext-buildtools-chrome-webstore-builder';
import { IDirReaderOptions } from 'webext-buildtools-dir-reader-mw';
import { IFirefoxAddonsOptions } from 'webext-buildtools-firefox-addons-builder';

export interface IIntegratedOptions {
    zipOptions?: IDirReaderOptions;
    chromeCrx?: IChromeCrxOptions;
    chromeWebstore?: IChromeWebstoreOptions;
    firefoxAddons?: IFirefoxAddonsOptions;
}