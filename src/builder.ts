import { ILogMethod, ISimpleBuilder } from 'webext-buildtools-builder-types';
import ChromeCrxBuilder from 'webext-buildtools-chrome-crx-builder';
import ChromeWebstoreBuilder from 'webext-buildtools-chrome-webstore-builder';
import DirReaderBuilder, {DirReaderBuildResult} from 'webext-buildtools-dir-reader-mw';
import FirefoxAddonsBuilder from 'webext-buildtools-firefox-addons-builder';
import { AbstractCompositeBuilder, BufferBuildAsset, createTempDir, FileBuildAsset, IAbstractSimpleBuilderClass, logMethodProxy, passOnAsset, SubBuilderRecord } from 'webext-buildtools-utils';
import { IntegratedBuildResult } from './buildResult';
import { IIntegratedOptions } from '../declarations/options';

// noinspection JSUnusedGlobalSymbols
/**
 * ISimpleBuilder wrapper around sign-addon package
 */
export class IntegratedBuilder
    extends AbstractCompositeBuilder<IIntegratedOptions, IntegratedBuildResult>
    implements ISimpleBuilder<IntegratedBuildResult>
{
    protected readonly _dirReader: SubBuilderRecord<this, DirReaderBuilder>;
    protected readonly _firefoxAddons: SubBuilderRecord<this, FirefoxAddonsBuilder>;
    protected readonly _chromeCrx: SubBuilderRecord<this, ChromeCrxBuilder>;
    protected readonly _chromeWebstore: SubBuilderRecord<this, ChromeWebstoreBuilder>;

    public constructor(
        options: IIntegratedOptions,
        logMethod?: ILogMethod,
        stopOnWarning: boolean = true,
        stopOnError: boolean = true
    ) {
        super(options, logMethod, stopOnWarning, stopOnError);
        
        this._dirReader = this.addBuilder(
            DirReaderBuilder.TARGET_NAME,
            this._options.zipOptions
                ? this.createAbstractSimpleBuilder(DirReaderBuilder, this._options.zipOptions)
                : null,
            100);
        this.passOnDirReaderResult();

        this._chromeCrx = this.addBuilder(
            ChromeCrxBuilder.TARGET_NAME,
            this._options.chromeCrx
                ? this.createAbstractSimpleBuilder(ChromeCrxBuilder, this._options.chromeCrx)
                : null,
            200);

        this._firefoxAddons = this.addBuilder(
            FirefoxAddonsBuilder.TARGET_NAME,
            this._options.firefoxAddons
                ? this.createAbstractSimpleBuilder(FirefoxAddonsBuilder, this._options.firefoxAddons)
                : null,
            300);

        this._chromeWebstore = this.addBuilder(
            ChromeWebstoreBuilder.TARGET_NAME,
            this._options.chromeWebstore
                ? this.createAbstractSimpleBuilder(ChromeWebstoreBuilder, this._options.chromeWebstore)
                : null,
            400);
    }

    public getTargetName(): string {
        return 'integrated-builder';
    }

    public setInputDirPath(dirPath: string): this {
        if (this._dirReader.builder) {
            this._dirReader.builder.setInputDirPath(dirPath);
        }
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Packed extension dir
     * options.zipOptions.zipOutPath should be specified
     * Result asset: zipFile
     */
    public requireZip(file: boolean = true, buffer: boolean = false): this {
        if (!file && !buffer) {
            throw new Error('Nor file or buffer is required');
        }

        if (file) {
            this.requireAsset(
                this._dirReader,
                b => b.requireZipFile(),
                { zipFile: 'zipFile' }
            );
        }

        if (buffer) {
            this.requireAsset(
                this._dirReader,
                b => b.requireZipBuffer(),
                { zipBuffer: 'zipBuffer' }
            );
        }

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Manifest object read from extension dir
     * Result asset: manifest
     */
    public requireManifest(): this {
        return this.requireAsset(
            this._dirReader, 
            b => b.requireManifest(),
            { manifest: 'manifest' }
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Extension packed to crx file and signed using your private key for offline distribution
     * options.chromeCrx.crxFilePath should be specified
     * Result asset: signedCrxFile
     */
    public requireSignedCrx(file: boolean = true, buffer: boolean = false): this {
        if (!file && !buffer) {
            throw new Error('Nor file or buffer is required');
        }

        if (file) {
            this.requireAsset(
                this._chromeCrx,
                b => b.requireCrxFile(),
                { crxBuffer: 'signedCrxBuffer' }
            );
        }

        if (buffer) {
            this.requireAsset(
                this._chromeCrx,
                b => b.requireCrxBuffer(),
                { crxFile: 'signedCrxFile' }
            );
        }

        this.requireAsset(this._dirReader, b => b.requireZipBuffer());

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * generates an updateXML for extensions hosted not on Chrome Web Store
     * This xml is used as response at url, specified in manifest's 'update_url' key
     * @see https://developer.chrome.com/apps/autoupdate
     * options.chromeCrx.updateXml:
     *      codebaseUrl,
     *      privateKey or privateKeyFilePath
     * should be specified
     * Result asset: signedCrxUpdateXmlFile
     */
    public requireSignedCrxUpdateXml(file: boolean = true, buffer: boolean = false): this {
        if (!file && !buffer) {
            throw new Error('Nor file or buffer is required');
        }

        if (file) {
            this.requireAsset(
                this._chromeCrx,
                b => b.requireUpdateXmlFile(),
                { updateXmlFile: 'signedCrxUpdateXmlFile' }
            );
        }

        if (buffer) {
            this.requireAsset(
                this._chromeCrx,
                b => b.requireUpdateXmlBuffer(),
                { updateXmlBuffer: 'signedCrxUpdateXmlBuffer' }
            );
        }

        this.requireAsset(this._dirReader, b => b.requireManifest());

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Upload/publish extension to Chrome Webstore
     * options.chromeWebstore:
     *      extensionId,
     *      upload
     * should be specified
     * Result asset: chromeWebstoreUploadedExt, chromeWebstorePublishedExt
     */
    public requireChromeWebstoreDeploy(upload: boolean = true, publish: boolean = true): this {
        if (!upload && !publish) {
            throw new Error('Nor upload or publish is required');
        }

        if (upload) {
            this.requireAsset(
                this._chromeWebstore,
                b => b.requireUploadedExt(),
                { uploadedExt: 'chromeWebstoreUploadedExt' }
            );

            this.requireAsset(this._dirReader, b => b.requireZipBuffer().requireManifest());
        }

        if (publish) {
            this.requireAsset(
                this._chromeWebstore,
                b => b.requirePublishedExt(),
                { publishedExt: 'chromeWebstorePublishedExt' }
            );
        }

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Download published crx file from Chrome Webstore, normally used with requireChromeWebstoreDeploy()
     * options.chromeWebstore.downloadCrx should be specified
     * Result asset: chromeWebstorePublishedCrxFile
     */
    public requireChromeWebstorePublishedCrx(file: boolean = true, buffer: boolean = false): this {
        if (!file && !buffer) {
            throw new Error('Nor file or buffer is required');
        }

        if (file) {
            this.requireAsset(
                this._chromeWebstore,
                b => b.requirePublishedCrxFile(),
                { publishedCrxFile: 'chromeWebstorePublishedCrxFile' }
            );
        }

        if (buffer) {
            this.requireAsset(
                this._chromeWebstore,
                b => b.requirePublishedCrxBuffer(),
                { publishedCrxBuffer: 'chromeWebstorePublishedCrxBuffer' }
            );
        }

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * options.firefoxAddons.api and options.firefoxAddons.deploy should be specified
     * Result asset: firefoxAddonsDeployedExtStoreId
     */
    public requireFirefoxAddonsDeploy(): this {
        this.requireAsset(
            this._firefoxAddons, 
            b => b.requireDeployedExt(),
            { deployedExtStoreId: 'firefoxAddonsDeployedExtStoreId' }
        );

        this.requireAsset(this._dirReader, b => b.requireZipBuffer().requireManifest());

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * options.firefoxAddons.api and options.firefoxAddons.signXpi.xpiOutPath should be specified
     * Result asset: firefoxAddonsSignedExtStoreId, firefoxAddonsSignedXpiFile
     */
    public requireFirefoxAddonsSignedXpi(file: boolean = true, buffer: boolean = false): this {
        if (!file && !buffer) {
            throw new Error('Nor file or buffer is required');
        }

        if (file) {
            this.requireAsset(
                this._firefoxAddons,
                b => b.requireSignedXpiFile(),
                { signedXpiFile: 'firefoxAddonsSignedXpiFile' }
            );
        }

        if (buffer) {
            this.requireAsset(
                this._firefoxAddons,
                b => b.requireSignedXpiBuffer(),
                { signedXpiBuffer: 'firefoxAddonsSignedXpiBuffer' }
            );
        }

        this.requireAsset(this._dirReader, b => b.requireZipBuffer().requireManifest());

        return this;
    }

    protected requireAsset<TBuilder extends ISimpleBuilder<any>> (
        subBuilderRec: SubBuilderRecord<this, TBuilder>,
        doRequire: (builder: TBuilder) => any,
        /**
         * mapping for saving sub builder assets to composite builder result
         * key: sub builder asset key, value: composite builder asset key
         */
        subBuilderToCompositeMapping?: {[subBuilderAssetKey: string]: string}
    ): this {
        if (!subBuilderRec.builder) {
            throw new Error(subBuilderRec.targetName + ' sub builder is not initialized due to missed options');
        }

        doRequire(subBuilderRec.builder);
        if (subBuilderToCompositeMapping) {
            for (const subBuilderAssetKey of Object.keys(subBuilderToCompositeMapping)) {
                subBuilderRec.assetsRequiredForCompositeResult.set(
                    subBuilderAssetKey,
                    subBuilderToCompositeMapping[subBuilderAssetKey]
                );
            }
        }
        subBuilderRec.active = true;

        return this;
    }

    protected createAbstractSimpleBuilder<TBuilder extends ISimpleBuilder<any>, TOptions>(
        builderConstructor: IAbstractSimpleBuilderClass<TBuilder, TOptions>,
        options: TOptions,
    ): TBuilder {
        const logMethod = this._logWrapper.logMethod
            ? logMethodProxy(this._logWrapper.logMethod, {msgPrefix: builderConstructor.TARGET_NAME + ': '})
            : undefined;

        return new builderConstructor(options, logMethod);
    }

    // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
    protected createBuildResult(): IntegratedBuildResult {
        return new IntegratedBuildResult();
    }

    protected passOnDirReaderResult() {
        this._dirReader.onComplete((subBuilder, buildResult) => {
            const srcAssets = buildResult.getAssets();
            passOnAsset(srcAssets.manifest)
                .to(this._firefoxAddons, (b, a) => b.setInputManifest(a))
                .to(this._chromeCrx, (b, a) => b.setInputManifest(a))
                .to(this._chromeWebstore, (b, a) => b.setInputManifest(a));
            passOnAsset(srcAssets.zipBuffer)
                .to(this._firefoxAddons, (b, a) => b.setInputBuffer(a))
                .to(this._chromeCrx, (b, a) => b.setInputZipBuffer(a))
                .to(this._chromeWebstore, (b, a) => b.setInputZipBuffer(a));
        });
    }
}
