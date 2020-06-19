import * as winston from 'winston';
import { IIntegratedOptions } from '../declarations/options';
import { IBuildRunnerOptions } from '../declarations/buildRunnerOptions';
import { IntegratedBuilder } from './builder';

// noinspection JSUnusedGlobalSymbols
/**
 * Helper function to initiate build just by calling one functions providing all options in one object
 * Returns exit code
 */
export async function startBuild(options: IBuildRunnerOptions)
{
    const logger = winston.createLogger({
        level: 'debug',
        format: winston.format.combine(
            winston.format.splat(),
            winston.format.cli()
        ),
        transports: [new winston.transports.Console()]
    });

    if (options.substituteEnvVariables === undefined || options.substituteEnvVariables) {
        substituteEnvVariables(options, logger);
    }

    const integratedOptions: IIntegratedOptions = {
        ...(options.zipFile && { zipOptions: options.zipFile.options }),
        ...(options.chromeCrx && { chromeCrx: options.chromeCrx.options }),
        ...(options.chromeWebstore && { chromeWebstore: options.chromeWebstore.options }),
        ...(options.firefoxAddons && { firefoxAddons: options.firefoxAddons.options })
    };

    const builder = new IntegratedBuilder(
        integratedOptions,
        logger.log.bind(logger),
        options.stopOnWarning !== undefined ? options.stopOnWarning : false,
        options.stopOnError !== undefined ? options.stopOnError : true
    );

    builder.setInputDirPath(options.extensionDirPath);

    if (options.zipFile) {
        builder.requireZip();
    }
    if (options.chromeCrx) {
        builder.requireSignedCrx()
    }
    if (options.chromeWebstore) {
        const actions = options.chromeWebstore.actions;
        const publish = actions.publish !== undefined ? actions.publish : false;
        const downloadCrx = publish && (actions.downloadPublishedCrx !== undefined ? actions.downloadPublishedCrx : false);

        builder.requireChromeWebstoreDeploy(true, publish);
        if (downloadCrx) {
            builder.requireChromeWebstorePublishedCrx();
        }
    }
    if (options.firefoxAddons) {
        builder.requireFirefoxAddonsDeploy();
        if (options.firefoxAddons.getSignedXpi) {
            builder.requireFirefoxAddonsSignedXpi();
        }
    }

    const result = await builder.build();

    if (result.errors.length > 0) {
        const message = `Build finished with ${result.errors.length} errors`;
        logger.error(message);
        for (const errItem of result.errors) {
            logger.error(`${errItem.error} in ${errItem.targetName} builder`);
        }
        throw new Error(message);
    } else {
        logger.info('Build successfully finished: %o', result);
    }
}

function substituteEnvVariables(object: any, logger: winston.Logger)
{
    const isIterable = (obj: any): boolean => Array.isArray(obj) || typeof obj === 'object';
    const envVariableSubstRegexp = /\$\((\w*?)\)/;
    const processed = new WeakSet();

    const iterateOver = (obj: any) => {
        if (processed.has(obj)) {
            return;
        }
        processed.add(obj);

        for (const index in obj) {
            if (!obj.hasOwnProperty(index)) {
                continue;
            }
            if (isIterable(obj[index])) {
                substituteEnvVariables(obj[index], logger);
            } else if (typeof obj[index] === 'string') {
                envVariableSubstRegexp.lastIndex = 0;
                const result = envVariableSubstRegexp.exec(obj[index]);
                if (result !== null) {
                    const envVarName = result[1];
                    const envValue = process.env[envVarName];
                    if (envValue !== undefined) {
                        obj[index] = envValue;
                    } else {
                        obj[index] = '';
                        logger.warn(`Environment variable ${envVarName} not set`);
                    }
                }
            }
        }

    };

    if (isIterable(object)) {
        iterateOver(object);
    }
}