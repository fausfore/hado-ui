'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var os = require('os');
var url = require('url');

class NodeLogger {
    constructor() {
        this._level = 'info';
        this.writeLogQueue = [];
        this.buildLogFilePath = null;
        this.graphLogFilePath = null;
        const sysUtil = require(path.join(__dirname, './sys-util.js'));
        this.chalk = sysUtil.chalk;
    }
    get level() {
        return this._level;
    }
    set level(l) {
        if (typeof l === 'string') {
            l = l.toLowerCase().trim();
            if (LOG_LEVELS.indexOf(l) === -1) {
                this.error(`Invalid log level '${this.chalk.bold(l)}' (choose from: ${LOG_LEVELS.map(l => this.chalk.bold(l)).join(', ')})`);
            }
            else {
                this._level = l;
            }
        }
    }
    info(...msg) {
        if (this.shouldLog('info')) {
            const lines = wordWrap(msg, getColumns());
            this.infoPrefix(lines);
            console.log(lines.join('\n'));
        }
        this.queueWriteLog('I', msg);
    }
    infoPrefix(lines) {
        if (lines.length) {
            const d = new Date();
            const prefix = '[' +
                ('0' + d.getMinutes()).slice(-2) + ':' +
                ('0' + d.getSeconds()).slice(-2) + '.' +
                Math.floor((d.getMilliseconds() / 1000) * 10) + ']';
            lines[0] = this.dim(prefix) + lines[0].substr(prefix.length);
        }
    }
    warn(...msg) {
        if (this.shouldLog('warn')) {
            const lines = wordWrap(msg, getColumns());
            this.warnPrefix(lines);
            console.warn('\n' + lines.join('\n') + '\n');
        }
        this.queueWriteLog('W', msg);
    }
    warnPrefix(lines) {
        if (lines.length) {
            const prefix = '[ WARN  ]';
            lines[0] = this.bold(this.chalk.yellow(prefix)) + lines[0].substr(prefix.length);
        }
    }
    error(...msg) {
        for (let i = 0; i < msg.length; i++) {
            if (msg[i] instanceof Error) {
                const err = msg[i];
                msg[i] = err.message;
                if (err.stack) {
                    msg[i] += '\n' + err.stack;
                }
            }
        }
        if (this.shouldLog('error')) {
            const lines = wordWrap(msg, getColumns());
            this.errorPrefix(lines);
            console.error('\n' + lines.join('\n') + '\n');
        }
        this.queueWriteLog('E', msg);
    }
    errorPrefix(lines) {
        if (lines.length) {
            const prefix = '[ ERROR ]';
            lines[0] = this.bold(this.chalk.red(prefix)) + lines[0].substr(prefix.length);
        }
    }
    debug(...msg) {
        if (this.shouldLog('debug')) {
            msg.push(this.dim(` MEM: ${(process.memoryUsage().rss / 1000000).toFixed(1)}MB`));
            const lines = wordWrap(msg, getColumns());
            this.debugPrefix(lines);
            console.log(lines.join('\n'));
        }
        this.queueWriteLog('D', msg);
    }
    debugPrefix(lines) {
        if (lines.length) {
            const d = new Date();
            const prefix = '[' +
                ('0' + d.getMinutes()).slice(-2) + ':' +
                ('0' + d.getSeconds()).slice(-2) + '.' +
                Math.floor((d.getMilliseconds() / 1000) * 10) + ']';
            lines[0] = this.chalk.cyan(prefix) + lines[0].substr(prefix.length);
        }
    }
    timespanStart(startMsg, debug) {
        const msg = [`${startMsg} ${this.dim('...')}`];
        if (debug) {
            if (this.shouldLog('debug')) {
                const lines = wordWrap(msg, getColumns());
                this.debugPrefix(lines);
                console.log(lines.join('\n'));
                this.queueWriteLog('D', [`${startMsg} ...`]);
            }
        }
        else {
            const lines = wordWrap(msg, getColumns());
            this.infoPrefix(lines);
            console.log(lines.join('\n'));
            this.queueWriteLog('I', [`${startMsg} ...`]);
        }
    }
    timespanFinish(finishMsg, timeSuffix, color, bold, newLineSuffix, debug) {
        let msg = finishMsg;
        if (color) {
            msg = this.color(finishMsg, color);
        }
        if (bold) {
            msg = this.bold(msg);
        }
        msg += ' ' + this.dim(timeSuffix);
        if (debug) {
            if (this.shouldLog('debug')) {
                const lines = wordWrap([msg], getColumns());
                this.debugPrefix(lines);
                console.log(lines.join('\n'));
            }
            this.queueWriteLog('D', [`${finishMsg} ${timeSuffix}`]);
        }
        else {
            const lines = wordWrap([msg], getColumns());
            this.infoPrefix(lines);
            console.log(lines.join('\n'));
            this.queueWriteLog('I', [`${finishMsg} ${timeSuffix}`]);
        }
        if (newLineSuffix) {
            console.log('');
        }
    }
    queueWriteLog(prefix, msg) {
        if (this.buildLogFilePath) {
            const d = new Date();
            const log = '' +
                ('0' + d.getHours()).slice(-2) + ':' +
                ('0' + d.getMinutes()).slice(-2) + ':' +
                ('0' + d.getSeconds()).slice(-2) + '.' +
                ('0' + Math.floor((d.getMilliseconds() / 1000) * 10)) +
                '  ' +
                ('000' + (process.memoryUsage().rss / 1000000).toFixed(1)).slice(-6) + 'MB' +
                '  ' + prefix +
                '  ' +
                msg.join(', ');
            this.writeLogQueue.push(log);
        }
    }
    writeLogs(append) {
        if (this.buildLogFilePath) {
            try {
                this.queueWriteLog('F', ['--------------------------------------']);
                const log = this.writeLogQueue.join('\n');
                if (append) {
                    try {
                        fs.accessSync(this.buildLogFilePath);
                    }
                    catch (e) {
                        append = false;
                    }
                }
                if (append) {
                    fs.appendFileSync(this.buildLogFilePath, log);
                }
                else {
                    fs.writeFileSync(this.buildLogFilePath, log);
                }
            }
            catch (e) { }
        }
        this.writeLogQueue.length = 0;
    }
    color(msg, color) {
        return this.chalk[color](msg);
    }
    red(msg) {
        return this.chalk.red(msg);
    }
    green(msg) {
        return this.chalk.green(msg);
    }
    yellow(msg) {
        return this.chalk.yellow(msg);
    }
    blue(msg) {
        return this.chalk.blue(msg);
    }
    magenta(msg) {
        return this.chalk.magenta(msg);
    }
    cyan(msg) {
        return this.chalk.cyan(msg);
    }
    gray(msg) {
        return this.chalk.gray(msg);
    }
    bold(msg) {
        return this.chalk.bold(msg);
    }
    dim(msg) {
        return this.chalk.dim(msg);
    }
    shouldLog(level) {
        return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(this.level);
    }
    createTimeSpan(startMsg, debug = false) {
        return new CmdTimeSpan(this, startMsg, debug);
    }
    printDiagnostics(diagnostics) {
        if (!diagnostics || !diagnostics.length)
            return;
        let outputLines = [''];
        diagnostics.forEach(d => {
            outputLines = outputLines.concat(this.printDiagnostic(d));
        });
        console.log(outputLines.join('\n'));
    }
    printDiagnostic(d) {
        const outputLines = wordWrap([d.messageText], getColumns());
        if (d.header && d.header !== 'build error' && d.header !== 'build warn') {
            outputLines.unshift(INDENT + d.header);
        }
        outputLines.push('');
        if (d.lines && d.lines.length) {
            const lines = prepareLines(d.lines, 'text');
            lines.forEach(l => {
                if (!isMeaningfulLine(l.text)) {
                    return;
                }
                let msg = `L${l.lineNumber}:  `;
                while (msg.length < INDENT.length) {
                    msg = ' ' + msg;
                }
                let text = l.text;
                if (l.errorCharStart > -1) {
                    text = this.highlightError(text, l.errorCharStart, l.errorLength);
                }
                msg = this.dim(msg);
                if (d.language === 'javascript') {
                    msg += this.jsSyntaxHighlight(text);
                }
                else if (d.language === 'scss' || d.language === 'css') {
                    msg += this.cssSyntaxHighlight(text);
                }
                else {
                    msg += text;
                }
                outputLines.push(msg);
            });
            outputLines.push('');
        }
        if (d.level === 'error') {
            this.errorPrefix(outputLines);
        }
        else if (d.level === 'warn') {
            this.warnPrefix(outputLines);
        }
        else if (d.level === 'debug') {
            this.debugPrefix(outputLines);
        }
        else {
            this.infoPrefix(outputLines);
        }
        return outputLines;
    }
    highlightError(errorLine, errorCharStart, errorLength) {
        let rightSideChars = errorLine.length - errorCharStart + errorLength - 1;
        while (errorLine.length + INDENT.length > MAX_COLUMNS) {
            if (errorCharStart > (errorLine.length - errorCharStart + errorLength) && errorCharStart > 5) {
                // larger on left side
                errorLine = errorLine.substr(1);
                errorCharStart--;
            }
            else if (rightSideChars > 1) {
                // larger on right side
                errorLine = errorLine.substr(0, errorLine.length - 1);
                rightSideChars--;
            }
            else {
                break;
            }
        }
        const lineChars = [];
        const lineLength = Math.max(errorLine.length, errorCharStart + errorLength);
        for (var i = 0; i < lineLength; i++) {
            var chr = errorLine.charAt(i);
            if (i >= errorCharStart && i < errorCharStart + errorLength) {
                chr = this.chalk.bgRed(chr === '' ? ' ' : chr);
            }
            lineChars.push(chr);
        }
        return lineChars.join('');
    }
    jsSyntaxHighlight(text) {
        if (text.trim().startsWith('//')) {
            return this.dim(text);
        }
        const words = text.split(' ').map(word => {
            if (JS_KEYWORDS.indexOf(word) > -1) {
                return this.chalk.cyan(word);
            }
            return word;
        });
        return words.join(' ');
    }
    cssSyntaxHighlight(text) {
        let cssProp = true;
        const safeChars = 'abcdefghijklmnopqrstuvwxyz-_';
        const notProp = '.#,:}@$[]/*';
        const chars = [];
        for (var i = 0; i < text.length; i++) {
            const c = text.charAt(i);
            if (c === ';' || c === '{') {
                cssProp = true;
            }
            else if (notProp.indexOf(c) > -1) {
                cssProp = false;
            }
            if (cssProp && safeChars.indexOf(c.toLowerCase()) > -1) {
                chars.push(this.chalk.cyan(c));
                continue;
            }
            chars.push(c);
        }
        return chars.join('');
    }
}
class CmdTimeSpan {
    constructor(logger, startMsg, debug) {
        this.debug = debug;
        this.logger = logger;
        this.start = Date.now();
        this.logger.timespanStart(startMsg, debug);
    }
    finish(msg, color, bold, newLineSuffix) {
        const duration = Date.now() - this.start;
        let time;
        if (duration > 1000) {
            time = 'in ' + (duration / 1000).toFixed(2) + ' s';
        }
        else {
            const ms = parseFloat((duration).toFixed(3));
            if (ms > 0) {
                time = 'in ' + duration + ' ms';
            }
            else {
                time = 'in less than 1 ms';
            }
        }
        this.logger.timespanFinish(msg, time, color, bold, newLineSuffix, this.debug);
    }
}
const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];
function getColumns() {
    const terminalWidth = (process.stdout && process.stdout.columns) || 80;
    return Math.max(Math.min(MAX_COLUMNS, terminalWidth), MIN_COLUMNS);
}
function wordWrap(msg, columns) {
    const lines = [];
    const words = [];
    msg.forEach(m => {
        if (m === null) {
            words.push('null');
        }
        else if (typeof m === 'undefined') {
            words.push('undefined');
        }
        else if (typeof m === 'string') {
            m.replace(/\s/gm, ' ').split(' ').forEach(strWord => {
                if (strWord.trim().length) {
                    words.push(strWord.trim());
                }
            });
        }
        else if (typeof m === 'number' || typeof m === 'boolean' || typeof m === 'function') {
            words.push(m.toString());
        }
        else if (Array.isArray(m)) {
            words.push(() => {
                return m.toString();
            });
        }
        else if (Object(m) === m) {
            words.push(() => {
                return m.toString();
            });
        }
        else {
            words.push(m.toString());
        }
    });
    let line = INDENT;
    words.forEach(word => {
        if (lines.length > 25) {
            return;
        }
        if (typeof word === 'function') {
            if (line.trim().length) {
                lines.push(line);
            }
            lines.push(word());
            line = INDENT;
        }
        else if (INDENT.length + word.length > columns - 1) {
            // word is too long to play nice, just give it its own line
            if (line.trim().length) {
                lines.push(line);
            }
            lines.push(INDENT + word);
            line = INDENT;
        }
        else if ((word.length + line.length) > columns - 1) {
            // this word would make the line too long
            // print the line now, then start a new one
            lines.push(line);
            line = INDENT + word + ' ';
        }
        else {
            line += word + ' ';
        }
    });
    if (line.trim().length) {
        lines.push(line);
    }
    return lines.map(line => {
        return line.trimRight();
    });
}
function prepareLines(orgLines, code) {
    const lines = JSON.parse(JSON.stringify(orgLines));
    for (let i = 0; i < 100; i++) {
        if (!eachLineHasLeadingWhitespace(lines, code)) {
            return lines;
        }
        for (let i = 0; i < lines.length; i++) {
            lines[i][code] = lines[i][code].substr(1);
            lines[i].errorCharStart--;
            if (!lines[i][code].length) {
                return lines;
            }
        }
    }
    return lines;
}
function eachLineHasLeadingWhitespace(lines, code) {
    if (!lines.length) {
        return false;
    }
    for (var i = 0; i < lines.length; i++) {
        if (!lines[i][code] || lines[i][code].length < 1) {
            return false;
        }
        const firstChar = lines[i][code].charAt(0);
        if (firstChar !== ' ' && firstChar !== '\t') {
            return false;
        }
    }
    return true;
}
function isMeaningfulLine(line) {
    if (line) {
        line = line.trim();
        if (line.length) {
            return (MEH_LINES.indexOf(line) < 0);
        }
    }
    return false;
}
const MEH_LINES = [';', ':', '{', '}', '(', ')', '/**', '/*', '*/', '*', '({', '})'];
const JS_KEYWORDS = [
    'abstract', 'any', 'as', 'break', 'boolean', 'case', 'catch', 'class',
    'console', 'const', 'continue', 'debugger', 'declare', 'default', 'delete',
    'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'from',
    'function', 'get', 'if', 'import', 'in', 'implements', 'Infinity',
    'instanceof', 'let', 'module', 'namespace', 'NaN', 'new', 'number', 'null',
    'public', 'private', 'protected', 'require', 'return', 'static', 'set',
    'string', 'super', 'switch', 'this', 'throw', 'try', 'true', 'type',
    'typeof', 'undefined', 'var', 'void', 'with', 'while', 'yield',
];
const INDENT = '           ';
const MIN_COLUMNS = 60;
const MAX_COLUMNS = 120;

function createContext(compilerCtx, wwwDir, sandbox) {
    const vm = require('vm');
    // https://github.com/tmpvar/jsdom/issues/1724
    // manually adding a fetch polyfill until jsdom adds it
    patchFetch(compilerCtx, wwwDir, sandbox);
    patchRaf(sandbox);
    return vm.createContext(sandbox);
}
function patchFetch(compilerCtx, wwwDir, sandbox) {
    function fetch(input, init) {
        var path$$1 = require('path');
        var nf = require(path$$1.join(__dirname, './node-fetch.js'));
        createServer(compilerCtx, wwwDir);
        if (typeof input === 'string') {
            // fetch(url)
            return nf.nodeFetch(normalizeUrl(input), init);
        }
        else {
            // fetch(Request)
            input.url = normalizeUrl(input.url);
            return nf.nodeFetch(input, init);
        }
    }
    sandbox.fetch = fetch;
}
function normalizeUrl(url$$1) {
    var Url = require('url');
    var parsedUrl = Url.parse(url$$1);
    if (!parsedUrl.protocol || !parsedUrl.hostname) {
        parsedUrl.protocol = 'http:';
        parsedUrl.host = 'localhost:' + PORT;
        url$$1 = Url.format(parsedUrl);
    }
    return url$$1;
}
function patchRaf(sandbox) {
    if (!sandbox.requestAnimationFrame) {
        sandbox.requestAnimationFrame = function (callback) {
            var id = sandbox.setTimeout(function () {
                callback(Date.now());
            }, 0);
            return id;
        };
        sandbox.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}
function createServer(compilerCtx, wwwDir) {
    if (compilerCtx.localPrerenderServer)
        return;
    var fs$$1 = require('fs');
    var path$$1 = require('path');
    var http = require('http');
    var Url = require('url');
    compilerCtx.localPrerenderServer = http.createServer((request, response) => {
        var parsedUrl = Url.parse(request.url);
        var filePath = path$$1.join(wwwDir, parsedUrl.pathname);
        fs$$1.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                response.write('Error fetching: ' + parsedUrl.pathname + ' : ' + err);
            }
            else {
                response.write(data);
            }
            response.end();
        });
    });
    compilerCtx.localPrerenderServer.listen(PORT);
}
var PORT = 53536;
function runInContext(code, contextifiedSandbox, options) {
    const vm = require('vm');
    vm.runInContext(code, contextifiedSandbox, options);
}

function createDom() {
    let dom = null;
    return {
        parse(opts) {
            if (dom) {
                dom.window.close();
            }
            const jsdom = require('jsdom');
            const jsdomOptions = {
                url: opts.url,
                referrer: opts.referrer,
                userAgent: opts.userAgent
            };
            if (opts.console) {
                jsdomOptions.virtualConsole = new jsdom.VirtualConsole();
                jsdomOptions.virtualConsole.sendTo(opts.console);
            }
            dom = new jsdom.JSDOM(opts.html, jsdomOptions);
            polyfillJsDom(dom.window);
            return dom.window;
        },
        serialize() {
            return dom.serialize();
        },
        destroy() {
            dom && dom.window && dom.window.close();
            dom = null;
        }
    };
}
function polyfillJsDom(window) {
    if (!window.Element.prototype.closest) {
        window.Element.prototype.closest = function (selector) {
            let el = this;
            while (el) {
                if (el.matches(selector)) {
                    return el;
                }
                el = el.parentElement;
            }
        };
    }
}

class NodeFs {
    copyFile(src, dest) {
        return new Promise((resolve, reject) => {
            const rd = fs.createReadStream(src);
            rd.on('error', reject);
            const wr = fs.createWriteStream(dest);
            wr.on('error', reject);
            wr.on('close', resolve);
            rd.pipe(wr);
        });
    }
    mkdir(filePath) {
        return new Promise((resolve, reject) => {
            fs.mkdir(filePath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    readdir(dirPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(dirPath, (err, files) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(files);
                }
            });
        });
    }
    readFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf-8', (err, content) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(content);
                }
            });
        });
    }
    readFileSync(filePath) {
        return fs.readFileSync(filePath, 'utf-8');
    }
    rmdir(filePath) {
        return new Promise((resolve, reject) => {
            fs.rmdir(filePath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    stat(itemPath) {
        return new Promise((resolve, reject) => {
            fs.stat(itemPath, (err, stats) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(stats);
                }
            });
        });
    }
    statSync(itemPath) {
        return fs.statSync(itemPath);
    }
    unlink(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    writeFile(filePath, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, content, { encoding: 'utf-8' }, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    writeFileSync(filePath, content) {
        return fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
    }
}

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

class NodeSystem {
    constructor(fs$$1) {
        this.resolveModuleCache = {};
        this.fs = fs$$1 || new NodeFs();
        this.path = path;
        const rootDir = path.join(__dirname, '../../..');
        this.distDir = path.join(rootDir, 'dist');
        this.sysUtil = require(path.join(this.distDir, 'sys/node/sys-util.js'));
        this.runtime = path.join(this.distDir, 'compiler/index.js');
        try {
            this.packageJsonData = require(path.join(rootDir, 'package.json'));
        }
        catch (e) {
            throw new Error(`unable to resolve "package.json" from: ${rootDir}`);
        }
        try {
            this.typescriptPackageJson = require(this.resolveModule(rootDir, 'typescript'));
        }
        catch (e) {
            throw new Error(`unable to resolve "typescript" from: ${rootDir}`);
        }
    }
    get compiler() {
        return {
            name: this.packageJsonData.name,
            version: this.packageJsonData.version,
            runtime: this.runtime,
            typescriptVersion: this.typescriptPackageJson.version
        };
    }
    get createDom() {
        return createDom;
    }
    createWatcher(events, paths, opts) {
        const chokidar = require('chokidar');
        const watcher = chokidar.watch(paths, opts);
        watcher
            .on('change', (path$$1) => {
            events.emit('fileUpdate', path$$1);
        })
            .on('add', (path$$1) => {
            events.emit('fileAdd', path$$1);
        })
            .on('unlink', (path$$1) => {
            events.emit('fileDelete', path$$1);
        })
            .on('addDir', (path$$1) => {
            events.emit('dirAdd', path$$1);
        })
            .on('unlinkDir', (path$$1) => {
            events.emit('dirDelete', path$$1);
        })
            .on('error', (err) => {
            console.error(err);
        });
        return watcher;
    }
    generateContentHash(content, length) {
        return crypto.createHash('sha1')
            .update(content)
            .digest('base64')
            .replace(/\W/g, '')
            .substr(0, length)
            .toLowerCase();
    }
    getClientCoreFile(opts) {
        const filePath = path.join(this.distDir, 'client', opts.staticName);
        return this.fs.readFile(filePath);
    }
    glob(pattern, opts) {
        return new Promise((resolve, reject) => {
            this.sysUtil.glob(pattern, opts, (err, files) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(files);
                }
            });
        });
    }
    isGlob(str) {
        return this.sysUtil.isGlob(str);
    }
    loadConfigFile(configPath) {
        let config;
        let hasConfigFile = false;
        if (typeof configPath === 'string') {
            if (!path.isAbsolute(configPath)) {
                throw new Error(`Stencil configuration file "${configPath}" must be an absolute path.`);
            }
            try {
                let fileStat = this.fs.statSync(configPath);
                if (fileStat.isFile()) {
                    hasConfigFile = true;
                }
                else if (fileStat.isDirectory()) {
                    // this is only a directory, so let's just assume we're looking for in stencil.config.js
                    // otherwise they could pass in an absolute path if it was somewhere else
                    configPath = path.join(configPath, 'stencil.config.js');
                    fileStat = this.fs.statSync(configPath);
                    hasConfigFile = fileStat.isFile();
                }
            }
            catch (e) {
                hasConfigFile = false;
            }
        }
        if (hasConfigFile) {
            // the passed in config was a string, so it's probably a path to the config we need to load
            // first clear the require cache so we don't get the same file
            delete require.cache[path.resolve(configPath)];
            const configFileData = require(configPath);
            if (!configFileData.config) {
                throw new Error(`Invalid Stencil configuration file "${configPath}". Missing "config" property.`);
            }
            config = configFileData.config;
            config.configPath = configPath;
            if (!config.rootDir && configPath) {
                config.rootDir = path.dirname(configPath);
            }
        }
        else {
            // no stencil.config.js file, which is fine
            config = {
                rootDir: process.cwd()
            };
        }
        if (!config.sys) {
            config.sys = this;
        }
        return config;
    }
    minifyCss(input) {
        const cleanCssModule = path.join(this.distDir, 'sys/node/clean-css.js');
        const CleanCSS = require(cleanCssModule).cleanCss;
        const result = new CleanCSS().minify(input);
        const diagnostics = [];
        if (result.errors) {
            result.errors.forEach((msg) => {
                diagnostics.push({
                    header: 'Minify CSS',
                    messageText: msg,
                    level: 'error',
                    type: 'build'
                });
            });
        }
        if (result.warnings) {
            result.warnings.forEach((msg) => {
                diagnostics.push({
                    header: 'Minify CSS',
                    messageText: msg,
                    level: 'warn',
                    type: 'build'
                });
            });
        }
        return {
            output: result.styles,
            sourceMap: result.sourceMap,
            diagnostics: diagnostics
        };
    }
    minifyJs(input, opts) {
        const UglifyJS = require('uglify-es');
        const result = UglifyJS.minify(input, opts);
        const diagnostics = [];
        if (result.error) {
            diagnostics.push({
                header: 'Minify JS',
                messageText: result.error.message,
                level: 'error',
                type: 'build'
            });
        }
        return {
            output: result.code,
            sourceMap: result.sourceMap,
            diagnostics: diagnostics
        };
    }
    minimatch(filePath, pattern, opts) {
        return this.sysUtil.minimatch(filePath, pattern, opts);
    }
    parseArgv(args, opts) {
        return this.sysUtil.minimist(args, opts);
    }
    get platform() {
        return os.platform();
    }
    resolveModule(fromDir, moduleId) {
        const cacheKey = `${fromDir}:${moduleId}`;
        if (this.resolveModuleCache[cacheKey]) {
            return this.resolveModuleCache[cacheKey];
        }
        const Module = require('module');
        fromDir = path.resolve(fromDir);
        const fromFile = path.join(fromDir, 'noop.js');
        let dir = Module._resolveFilename(moduleId, {
            id: fromFile,
            filename: fromFile,
            paths: Module._nodeModulePaths(fromDir)
        });
        const root = path.parse(fromDir).root;
        let packageJsonFilePath;
        while (dir !== root) {
            dir = path.dirname(dir);
            packageJsonFilePath = path.join(dir, 'package.json');
            try {
                fs.accessSync(packageJsonFilePath);
            }
            catch (e) {
                continue;
            }
            const resolvedModulePath = normalizePath(packageJsonFilePath);
            this.resolveModuleCache[cacheKey] = resolvedModulePath;
            return resolvedModulePath;
        }
        throw new Error(`error loading "${moduleId}" from "${fromDir}"`);
    }
    get rollup() {
        const rollup = require('rollup');
        rollup.plugins = {
            commonjs: require('rollup-plugin-commonjs'),
            nodeResolve: require('rollup-plugin-node-resolve')
        };
        return rollup;
    }
    get semver() {
        return this.sysUtil.semver;
    }
    tmpdir() {
        return path.join(os.tmpdir(), `stencil-${this.packageJsonData.version}`);
    }
    get url() {
        return url;
    }
    get vm() {
        return {
            createContext,
            runInContext
        };
    }
    get workbox() {
        return require('workbox-build');
    }
}

exports.NodeLogger = NodeLogger;
exports.NodeSystem = NodeSystem;
