import { IBuildResult } from 'webext-buildtools-builder-types';
import { ChromeWebstoreUploadedExtAsset } from 'webext-buildtools-chrome-webstore-builder';
import { ChromeWebstorePublishedExtAsset } from 'webext-buildtools-chrome-webstore-builder';
import { ManifestBuildAsset } from 'webext-buildtools-dir-reader-mw';
import { FirefoxAddonsExtIdAsset } from 'webext-buildtools-firefox-addons-builder';
import { BasicTypeBuildAsset, BufferBuildAsset, CompositeBuildResult, FileBuildAsset, ICompositeBuildResult } from 'webext-buildtools-utils';

export class IntegratedBuildResult extends CompositeBuildResult<{
    zipBuffer?: BufferBuildAsset;
    zipFile?: FileBuildAsset;
    manifest?: ManifestBuildAsset;

    signedCrxFile?: FileBuildAsset;
    signedCrxBuffer?: BufferBuildAsset;
    signedCrxUpdateXmlFile?: FileBuildAsset;
    signedCrxUpdateXmlBuffer?: BufferBuildAsset;

    chromeWebstoreUploadedExt?: ChromeWebstoreUploadedExtAsset;
    chromeWebstorePublishedExt?: ChromeWebstorePublishedExtAsset;
    chromeWebstorePublishedCrxBuffer?: BufferBuildAsset;
    chromeWebstorePublishedCrxFile?: FileBuildAsset;

    firefoxAddonsDeployedExtStoreId: FirefoxAddonsExtIdAsset,
    firefoxAddonsSignedExtStoreId?: FirefoxAddonsExtIdAsset;
    firefoxAddonsSignedXpiFile?: FileBuildAsset;
    firefoxAddonsSignedXpiBuffer?: BufferBuildAsset;
}>
    implements ICompositeBuildResult, IBuildResult
{    
}
