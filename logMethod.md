## Logging
*IntegratedBuilder* (and other webext-buildtools builders) allows user to 
specify preferred log method by passing *log function* to constructor:

```ts
public constructor(
    ...
    options: TOptions,       // depends on builder
    logMethod?: ILogMethod,  // no logging by default
    ...
    );
```

Where (from the declaration in [webext-buildtools-builder-types](https://www.npmjs.com/package/webext-buildtools-builder-types)):

```ts
type ILogMethod = (level: string, message: string, ...meta: any[]) => any;
```

#### console.log
The easiest way, which doesn't require any additional dependencies is:
```ts
const logMethod = console.log;
```

#### winston
Example of `ILogMethod` implementation using 
[winston](https://www.npmjs.com/package/winston) package to get pretty console output:
```js
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.cli()
    ),
    prettyPrint: JSON.stringify,
    transports: [new winston.transports.Console()]
});

const logMethod = logger.log.bind(logger);