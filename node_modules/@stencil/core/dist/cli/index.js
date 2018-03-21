'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * SSR Attribute Names
 */

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function normalizePath(str) {
    // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
    // https://github.com/sindresorhus/slash MIT
    // By Sindre Sorhus
    if (typeof str !== 'string') {
        throw new Error(`invalid path to normalize`);
    }
    str = str.trim();
    if (EXTENDED_PATH_REGEX.test(str) || NON_ASCII_REGEX.test(str)) {
        return str;
    }
    str = str.replace(SLASH_REGEX, '/');
    // always remove the trailing /
    // this makes our file cache look ups consistent
    if (str.charAt(str.length - 1) === '/') {
        const colonIndex = str.indexOf(':');
        if (colonIndex > -1) {
            if (colonIndex < str.length - 2) {
                str = str.substring(0, str.length - 1);
            }
        }
        else if (str.length > 1) {
            str = str.substring(0, str.length - 1);
        }
    }
    return str;
}
const EXTENDED_PATH_REGEX = /^\\\\\?\\/;
const NON_ASCII_REGEX = /[^\x00-\x80]+/;
const SLASH_REGEX = /\\/g;

function overrideConfigFromArgv(config, argv) {
    if (argv.prod) {
        config.devMode = false;
    }
    else if (argv.dev) {
        config.devMode = true;
    }
    if (argv.stats) {
        config.writeStats = true;
    }
    if (argv.log) {
        config.writeLog = true;
    }
    if (argv.noCache) {
        config.enableCache = false;
    }
    if (argv.watch) {
        config.watch = true;
    }
    if (argv.debug) {
        config.logLevel = 'debug';
    }
    else if (argv.logLevel) {
        config.logLevel = argv.logLevel;
    }
    if (!argv.prerender) {
        config.prerender = false;
    }
    else if (!config.prerender) {
        config.prerender = true;
    }
    if (config.devMode) {
        if (argv.serviceWorker && config.serviceWorker) {
            // dev mode, but forcing service worker
            // and they provided a sw config
            // so generate a service worker with their config
            config.serviceWorker = true;
        }
        else if (argv.serviceWorker && config.serviceWorker === undefined) {
            // dev mode, but forcing service worker
            // but they didn't provide a sw config
            // so still force it to generate w/ our defaults
            config.serviceWorker = true;
        }
        else {
            // service worker is off by default in dev mode
            config.serviceWorker = false;
        }
    }
    else if (config.serviceWorker === undefined) {
        // prod mode, and they didn't provide a sw config
        // so force it generate with our defaults
        config.serviceWorker = true;
    }
    if (argv.es5) {
        config.buildEs5 = true;
    }
    if (argv.docs) {
        config.generateDocs = true;
    }
}
function getConfigFilePath(process, sys, configArg) {
    if (configArg) {
        if (!sys.path.isAbsolute(configArg)) {
            // passed in a custom stencil config location
            // but it's relative, so prefix the cwd
            return normalizePath(sys.path.join(process.cwd(), configArg));
        }
        // config path already an absolute path, we're good here
        return normalizePath(configArg);
    }
    // nothing was passed in, use the current working directory
    return normalizePath(process.cwd());
}
function parseArgv(process, sys) {
    const cmdArgs = getCmdArgs(process);
    const argv = sys.parseArgv(cmdArgs, ARG_OPTS);
    argv.logLevel = argv['log-level'];
    argv.serviceWorker = argv['service-worker'];
    argv.noCache = cmdArgs.includes('--no-cache');
    return argv;
}
const ARG_OPTS = {
    boolean: [
        'debug',
        'dev',
        'docs',
        'es5',
        'help',
        'log',
        'no-cache',
        'prod',
        'prerender',
        'service-worker',
        'skip-node-check',
        'stats',
        'version',
        'watch'
    ],
    string: [
        'config',
        'log-level'
    ],
    alias: {
        'c': 'config',
        'h': 'help',
        'v': 'version'
    }
};
function getCmdArgs(process) {
    let cmdArgs = process.argv.slice(2);
    try {
        const npmRunArgs = process.env.npm_config_argv;
        if (npmRunArgs) {
            cmdArgs = cmdArgs.concat(JSON.parse(npmRunArgs).original);
        }
    }
    catch (e) { }
    return cmdArgs;
}
function hasError$1(diagnostics) {
    if (!diagnostics) {
        return false;
    }
    return diagnostics.some(d => d.level === 'error' && d.type !== 'runtime');
}

function help(process, logger) {
    const p = logger.dim((process.platform === 'win32') ? '>' : '$');
    console.log(`
  ${logger.bold('Build:')} ${logger.dim('Build components for development or production.')}

    ${p} ${logger.green('stencil build [--dev] [--watch] [--prerender] [--debug]')}

      ${logger.green('--dev')} ${logger.dim('..................')} Execute a development build
      ${logger.green('--watch')} ${logger.dim('................')} Execute a build in watch mode
      ${logger.green('--prerender')} ${logger.dim('............')} Prerender URLs
      ${logger.green('--stats')} ${logger.dim('................')} Write stencil-stats.json file
      ${logger.green('--log')} ${logger.dim('..................')} Write stencil-build.log file
      ${logger.green('--config')} ${logger.dim('...............')} Set stencil config file
      ${logger.green('--docs')} ${logger.dim('.................')} Generate readme.md docs for each component
      ${logger.green('--debug')} ${logger.dim('................')} Set the log level to debug

  ${logger.bold('Examples:')}

    ${p} ${logger.green('stencil build --dev --watch')}
    ${p} ${logger.green('stencil build --prerender')}
    ${p} ${logger.green('stencil init')}

`);
}

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function initApp(process, sys, logger) {
    return __awaiter$1(this, void 0, void 0, function* () {
        const configPath = sys.path.join(process.cwd(), 'stencil.config.js');
        try {
            const fs = require('fs');
            fs.writeFileSync(configPath, DEFAULT_CONFIG);
            logger.info(`Created config: ${configPath}`);
        }
        catch (e) {
            logger.error(e);
        }
    });
}
const DEFAULT_CONFIG = `
exports.config = {
  namespace: 'App',
  collections: []
};

exports.devServer = {
  root: 'www'
};
`;

var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function run(process, sys, logger) {
    return __awaiter$2(this, void 0, void 0, function* () {
        const task = process.argv[2];
        const argv = parseArgv(process, sys);
        process.on('unhandledRejection', (r) => logger.error(r));
        if (argv.help) {
            help(process, logger);
            process.exit(0);
        }
        if (task === 'init') {
            initApp(process, sys, logger);
            process.exit(0);
        }
        if (argv.version) {
            console.log(sys.compiler.version);
            process.exit(0);
        }
        // load the config file
        let config;
        try {
            const configPath = getConfigFilePath(process, sys, argv.config);
            config = sys.loadConfigFile(configPath);
        }
        catch (e) {
            logger.error(e);
            process.exit(1);
        }
        try {
            // override the config values with any cli arguments
            overrideConfigFromArgv(config, argv);
            if (!config.logger) {
                // if a logger was not provided then use the
                // default stencil command line logger
                config.logger = logger;
            }
            if (config.logLevel) {
                config.logger.level = config.logLevel;
            }
            if (!config.sys) {
                // if the config was not provided then use the default node sys
                config.sys = sys;
            }
            const { Compiler } = require('../compiler/index.js');
            const compiler = new Compiler(config);
            if (!compiler.isValid) {
                process.exit(1);
            }
            process.title = `Stencil: ${config.namespace}`;
            switch (task) {
                case 'build':
                    const results = yield compiler.build();
                    if (!config.watch && hasError$1(results && results.diagnostics)) {
                        process.exit(1);
                    }
                    if (config.watch) {
                        process.once('SIGINT', () => {
                            process.exit(0);
                        });
                    }
                    break;
                case 'docs':
                    yield compiler.docs();
                    break;
                default:
                    config.logger.error(`Invalid stencil command, please see the options below:`);
                    help(process, logger);
                    process.exit(1);
            }
        }
        catch (e) {
            config.logger.error('uncaught cli error', e);
            process.exit(1);
        }
    });
}

exports.run = run;
