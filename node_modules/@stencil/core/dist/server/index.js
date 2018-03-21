'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function loadConfig(sys, config) {
    if (!config || Array.isArray(config) || typeof config === 'function' || typeof config === 'number' || typeof config === 'boolean') {
        throw new Error(`Invalid config: ${config}. Config must be either a file path or a config object.`);
    }
    if (typeof config === 'string') {
        return sys.loadConfigFile(config);
    }
    // looks like it's already a build config object
    if (!config.sys) {
        config.sys = sys;
    }
    return config;
}

/**
 * SSR Attribute Names
 */
const SSR_VNODE_ID = 'data-ssrv';
const SSR_CHILD_ID = 'data-ssrc';
/**
 * Default style mode id
 */
const DEFAULT_STYLE_MODE = '$';
/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
/**
 * Key Name to Key Code Map
 */
const KEY_CODE_MAP = {
    'enter': 13,
    'escape': 27,
    'space': 32,
    'tab': 9,
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40
};
/**
 * File names and value
 */
const BANNER = `Built with http://stenciljs.com`;

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function hasFileExtension(filePath, extensions) {
    filePath = filePath.toLowerCase();
    return extensions.some(ext => filePath.endsWith('.' + ext));
}
function minifyJs(config, compilerCtx, jsText, sourceTarget, preamble) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = { output: {}, compress: {}, mangle: true };
        if (sourceTarget === 'es5') {
            opts.ecma = 5;
            opts.output.ecma = 5;
            opts.compress.ecma = 5;
            opts.compress.arrows = false;
            opts.output.beautify = false;
        }
        else {
            opts.ecma = 6;
            opts.output.ecma = 6;
            opts.compress.ecma = 6;
            opts.toplevel = true;
            opts.compress.arrows = true;
            opts.output.beautify = false;
        }
        if (config.logLevel === 'debug') {
            opts.mangle = {};
            opts.mangle.keep_fnames = true;
            opts.compress.drop_console = false;
            opts.compress.drop_debugger = false;
            opts.output.beautify = true;
            opts.output.bracketize = true;
            opts.output.indent_level = 2;
            opts.output.comments = 'all';
            opts.output.preserve_line = true;
        }
        else {
            opts.compress.pure_funcs = ['assert', 'console.debug'];
        }
        opts.compress.passes = 2;
        if (preamble) {
            opts.output.preamble = generatePreamble(config);
        }
        const cacheKey = compilerCtx.cache.createKey('minifyJs', opts, jsText);
        const cachedContent = yield compilerCtx.cache.get(cacheKey);
        if (cachedContent != null) {
            return {
                output: cachedContent,
                diagnostics: []
            };
        }
        const r = config.sys.minifyJs(jsText, opts);
        if (r && r.diagnostics.length === 0 && typeof r.output === 'string') {
            yield compilerCtx.cache.put(cacheKey, r.output);
        }
        return r;
    });
}
function generatePreamble(config) {
    let preamble = [];
    if (config.preamble) {
        preamble = config.preamble.split('\n');
    }
    preamble.push(BANNER);
    if (preamble.length > 1) {
        preamble = preamble.map(l => ` * ${l}`);
        preamble.unshift(`/*!`);
        preamble.push(` */`);
        return preamble.join('\n');
    }
    return `/*! ${BANNER} */`;
}
function catchError(diagnostics, err) {
    const d = {
        level: 'error',
        type: 'build',
        header: 'build error',
        messageText: 'build error',
        relFilePath: null,
        absFilePath: null,
        lines: []
    };
    if (err) {
        if (err.stack) {
            d.messageText = err.stack.toString();
        }
        else {
            if (err.message) {
                d.messageText = err.message.toString();
            }
            else {
                d.messageText = err.toString();
            }
        }
    }
    diagnostics.push(d);
    return d;
}
function pathJoin(config, ...paths) {
    return normalizePath(config.sys.path.join.apply(config.sys.path, paths));
}
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

class BuildEvents {
    constructor(config) {
        this.config = config;
        this.evCallbacks = {};
    }
    subscribe(eventName, cb) {
        const evName = getEventName(eventName);
        if (eventName === 'rebuild' && !this.config.watch) {
            throw new Error(`config must set "watch" to "true" in order to enable "rebuild" events`);
        }
        if (!this.evCallbacks[evName]) {
            this.evCallbacks[evName] = [];
        }
        this.evCallbacks[evName].push(cb);
        return () => {
            this.unsubscribe(evName, cb);
        };
    }
    unsubscribe(eventName, cb) {
        const evName = getEventName(eventName);
        if (this.evCallbacks[evName]) {
            const index = this.evCallbacks[evName].indexOf(cb);
            if (index > -1) {
                this.evCallbacks[evName].splice(index, 1);
            }
        }
    }
    unsubscribeAll() {
        this.evCallbacks = {};
    }
    emit(eventName, ...args) {
        const evName = getEventName(eventName);
        const evCallbacks = this.evCallbacks[evName];
        if (evCallbacks) {
            evCallbacks.forEach(cb => {
                try {
                    cb.apply(this, args);
                }
                catch (e) {
                    console.log(e);
                }
            });
        }
    }
}
function getEventName(evName) {
    return evName.trim().toLowerCase();
}

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Cache {
    constructor(config, cacheFs, tmpDir) {
        this.config = config;
        this.cacheFs = cacheFs;
        this.tmpDir = tmpDir;
        this.failed = 0;
        this.skip = false;
        if (config.enableCache) {
            config.logger.debug(`cache enabled, tmpdir: ${tmpDir}`);
        }
        else {
            config.logger.debug(`cache disabled, empty tmpdir: ${tmpDir}`);
            this.clearDiskCache();
        }
    }
    get(key) {
        return __awaiter$1(this, void 0, void 0, function* () {
            if (!this.config.enableCache || this.skip) {
                return null;
            }
            if (this.failed >= MAX_FAILED) {
                if (!this.skip) {
                    this.skip = true;
                    this.config.logger.debug(`cache had ${this.failed} failed ops, skip disk ops for remander of build`);
                }
                return null;
            }
            let result;
            try {
                result = yield this.cacheFs.readFile(this.getCacheFilePath(key));
                this.failed = 0;
                this.skip = false;
            }
            catch (e) {
                this.failed++;
                result = null;
            }
            return result;
        });
    }
    put(key, value) {
        return __awaiter$1(this, void 0, void 0, function* () {
            if (!this.config.enableCache) {
                return false;
            }
            let result;
            try {
                yield this.cacheFs.writeFile(this.getCacheFilePath(key), value);
                result = true;
            }
            catch (e) {
                this.failed++;
                result = false;
            }
            return result;
        });
    }
    createKey(domain, ...args) {
        if (!this.config.enableCache) {
            return '';
        }
        return domain + '_' + this.config.sys.generateContentHash(JSON.stringify(args), 32);
    }
    commit() {
        return __awaiter$1(this, void 0, void 0, function* () {
            if (this.config.enableCache) {
                this.skip = false;
                this.failed = 0;
                yield this.cacheFs.commit();
            }
        });
    }
    clear() {
        this.cacheFs.clearCache();
    }
    clearDiskCache() {
        return __awaiter$1(this, void 0, void 0, function* () {
            yield this.cacheFs.emptyDir(this.tmpDir);
            yield this.cacheFs.commit();
        });
    }
    getCacheFilePath(key) {
        return this.config.sys.path.join(this.tmpDir, key);
    }
    getMemoryStats() {
        return this.cacheFs.getMemoryStats();
    }
}
const MAX_FAILED = 20;

var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class InMemoryFileSystem {
    constructor(disk, path) {
        this.disk = disk;
        this.path = path;
        this.d = {};
    }
    access(filePath) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const item = this.getItem(filePath);
            if (typeof item.exists === 'boolean') {
                return item.exists;
            }
            let hasAccess = false;
            try {
                const s = yield this.stat(filePath);
                item.exists = true;
                item.isDirectory = s.isDirectory;
                item.isFile = s.isFile;
                hasAccess = true;
            }
            catch (e) {
                item.exists = false;
            }
            return hasAccess;
        });
    }
    /**
     * Synchronous!!! Do not use!!!
     * (Only typescript transpiling is allowed to use)
     * @param filePath
     */
    accessSync(filePath) {
        const item = this.getItem(filePath);
        if (typeof item.exists === 'boolean') {
            return item.exists;
        }
        let hasAccess = false;
        try {
            const s = this.statSync(filePath);
            item.exists = true;
            item.isDirectory = s.isDirectory;
            item.isFile = s.isFile;
            hasAccess = true;
        }
        catch (e) {
            item.exists = false;
        }
        return hasAccess;
    }
    copy(src, dest, opts) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const stats = yield this.stat(src);
            if (stats.isDirectory) {
                yield this.copyDir(src, dest, opts);
            }
            else if (stats.isFile) {
                yield this.copyFile(src, dest, opts);
            }
        });
    }
    copyDir(src, dest, opts) {
        return __awaiter$2(this, void 0, void 0, function* () {
            src = normalizePath(src);
            dest = normalizePath(dest);
            const dirItems = yield this.readdir(src, { recursive: true });
            yield Promise.all(dirItems.map((dirItem) => __awaiter$2(this, void 0, void 0, function* () {
                const srcPath = dirItem.absPath;
                const destPath = normalizePath(this.path.join(dest, dirItem.relPath));
                if (dirItem.isDirectory) {
                    yield this.copyDir(srcPath, destPath, opts);
                }
                else if (dirItem.isFile) {
                    yield this.copyFile(srcPath, destPath, opts);
                }
            })));
        });
    }
    copyFile(src, dest, opts) {
        return __awaiter$2(this, void 0, void 0, function* () {
            src = normalizePath(src);
            dest = normalizePath(dest);
            if (opts && typeof opts.filter === 'function' && !opts.filter(src, dest)) {
                return;
            }
            if (shouldIgnore(src)) {
                return;
            }
            const srcItem = this.getItem(src);
            srcItem.isFile = true;
            srcItem.isDirectory = false;
            const destItem = this.getItem(dest);
            destItem.isFile = true;
            destItem.isDirectory = false;
            destItem.queueDeleteFromDisk = false;
            if (isTextFile(src)) {
                const srcFileText = yield this.readFile(src);
                if (srcFileText !== destItem.fileText) {
                    destItem.fileText = srcFileText;
                    destItem.queueWriteToDisk = true;
                }
            }
            else {
                destItem.fileSrc = src;
                destItem.queueWriteToDisk = true;
            }
        });
    }
    emptyDir(dirPath) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const item = this.getItem(dirPath);
            yield this.removeDir(dirPath);
            item.isFile = false;
            item.isDirectory = true;
            item.queueWriteToDisk = true;
            item.queueDeleteFromDisk = false;
        });
    }
    readdir(dirPath, opts = {}) {
        return __awaiter$2(this, void 0, void 0, function* () {
            dirPath = normalizePath(dirPath);
            const collectedPaths = [];
            if (opts.inMemoryOnly) {
                let inMemoryDir = dirPath;
                if (!inMemoryDir.endsWith('/')) {
                    inMemoryDir += '/';
                }
                const inMemoryDirs = dirPath.split('/');
                const filePaths = Object.keys(this.d);
                filePaths.forEach(filePath => {
                    if (!filePath.startsWith(dirPath)) {
                        return;
                    }
                    const parts = filePath.split('/');
                    if (parts.length === inMemoryDirs.length + 1 || (opts.recursive && parts.length > inMemoryDirs.length)) {
                        const d = this.d[filePath];
                        if (d.exists) {
                            // console.log(filePath, d)
                            const item = {
                                absPath: filePath,
                                relPath: parts[inMemoryDirs.length],
                                isDirectory: d.isDirectory,
                                isFile: d.isFile
                            };
                            collectedPaths.push(item);
                        }
                    }
                });
            }
            else {
                // always a disk read
                yield this.readDirectory(dirPath, dirPath, opts, collectedPaths);
            }
            return collectedPaths.sort((a, b) => {
                if (a.absPath < b.absPath)
                    return -1;
                if (a.absPath > b.absPath)
                    return 1;
                return 0;
            });
        });
    }
    readDirectory(initPath, dirPath, opts, collectedPaths) {
        return __awaiter$2(this, void 0, void 0, function* () {
            // used internally only so we could easily recursively drill down
            // loop through this directory and sub directories
            // always a disk read!!
            const dirItems = yield this.disk.readdir(dirPath);
            // cache some facts about this path
            const item = this.getItem(dirPath);
            item.exists = true;
            item.isFile = false;
            item.isDirectory = true;
            yield Promise.all(dirItems.map((dirItem) => __awaiter$2(this, void 0, void 0, function* () {
                // let's loop through each of the files we've found so far
                // create an absolute path of the item inside of this directory
                const absPath = normalizePath(this.path.join(dirPath, dirItem));
                const relPath = normalizePath(this.path.relative(initPath, absPath));
                // get the fs stats for the item, could be either a file or directory
                const stats = yield this.stat(absPath);
                // cache some stats about this path
                const subItem = this.getItem(absPath);
                subItem.exists = true;
                subItem.isDirectory = stats.isDirectory;
                subItem.isFile = stats.isFile;
                collectedPaths.push({
                    absPath: absPath,
                    relPath: relPath,
                    isDirectory: stats.isDirectory,
                    isFile: stats.isFile
                });
                if (opts.recursive && stats.isDirectory) {
                    // looks like it's yet another directory
                    // let's keep drilling down
                    yield this.readDirectory(initPath, absPath, opts, collectedPaths);
                }
            })));
        });
    }
    readFile(filePath, opts) {
        return __awaiter$2(this, void 0, void 0, function* () {
            if (!opts || (opts.useCache === true || opts.useCache === undefined)) {
                const item = this.getItem(filePath);
                if (item.exists && typeof item.fileText === 'string') {
                    return item.fileText;
                }
            }
            const fileContent = yield this.disk.readFile(filePath, 'utf-8');
            if (fileContent.length < MAX_TEXT_CACHE) {
                const item = this.getItem(filePath);
                item.exists = true;
                item.isFile = true;
                item.isDirectory = false;
                item.fileText = fileContent;
            }
            return fileContent;
        });
    }
    /**
     * Synchronous!!! Do not use!!!
     * (Only typescript transpiling is allowed to use)
     * @param filePath
     */
    readFileSync(filePath) {
        const item = this.getItem(filePath);
        if (item.exists && typeof item.fileText === 'string') {
            return item.fileText;
        }
        const fileContent = this.disk.readFileSync(filePath, 'utf-8');
        if (fileContent.length < MAX_TEXT_CACHE) {
            item.exists = true;
            item.isFile = true;
            item.isDirectory = false;
            item.fileText = fileContent;
        }
        return fileContent;
    }
    remove(itemPath) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const stats = yield this.stat(itemPath);
            if (stats.isDirectory) {
                yield this.removeDir(itemPath);
            }
            else if (stats.isFile) {
                yield this.removeItem(itemPath);
            }
        });
    }
    removeDir(dirPath) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const item = this.getItem(dirPath);
            item.isFile = false;
            item.isDirectory = true;
            if (!item.queueWriteToDisk) {
                item.queueDeleteFromDisk = true;
            }
            try {
                const dirItems = yield this.readdir(dirPath, { recursive: true });
                yield Promise.all(dirItems.map((item) => __awaiter$2(this, void 0, void 0, function* () {
                    yield this.removeItem(item.absPath);
                })));
            }
            catch (e) {
                // do not throw error if the directory never existed
            }
        });
    }
    removeItem(filePath) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const item = this.getItem(filePath);
            if (!item.queueWriteToDisk) {
                item.queueDeleteFromDisk = true;
            }
        });
    }
    stat(itemPath) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const item = this.getItem(itemPath);
            if (typeof item.isDirectory !== 'boolean' || typeof item.isFile !== 'boolean') {
                const s = yield this.disk.stat(itemPath);
                item.exists = true;
                item.isDirectory = s.isDirectory();
                item.isFile = s.isFile();
            }
            return {
                isFile: item.isFile,
                isDirectory: item.isDirectory
            };
        });
    }
    /**
     * Synchronous!!! Do not use!!!
     * (Only typescript transpiling is allowed to use)
     * @param itemPath
     */
    statSync(itemPath) {
        const item = this.getItem(itemPath);
        if (typeof item.isDirectory !== 'boolean' || typeof item.isFile !== 'boolean') {
            const s = this.disk.statSync(itemPath);
            item.exists = true;
            item.isDirectory = s.isDirectory();
            item.isFile = s.isFile();
        }
        return {
            isFile: item.isFile,
            isDirectory: item.isDirectory
        };
    }
    writeFile(filePath, content, opts) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const results = {};
            if (typeof filePath !== 'string') {
                throw new Error(`writeFile, invalid filePath: ${filePath}`);
            }
            if (typeof content !== 'string') {
                throw new Error(`writeFile, invalid content: ${filePath}`);
            }
            if (shouldIgnore(filePath)) {
                results.ignored = true;
                return results;
            }
            const item = this.getItem(filePath);
            item.exists = true;
            item.isFile = true;
            item.isDirectory = false;
            item.queueDeleteFromDisk = false;
            results.changedContent = item.fileText !== content;
            results.queuedWrite = false;
            item.fileText = content;
            if (opts && opts.inMemoryOnly) {
                // we don't want to actually write this to disk
                // just keep it in memory
                if (item.queueWriteToDisk) {
                    // we already queued this file to write to disk
                    // in that case we still need to do it
                    results.queuedWrite = true;
                }
                else {
                    // we only want this in memory and
                    // it wasn't already queued to be written
                    item.queueWriteToDisk = false;
                }
            }
            else {
                // we want to write this to disk (eventually)
                // but only if the content is different
                // from our existing cached content
                if (!item.queueWriteToDisk && results.changedContent) {
                    // not already queued to be written
                    // and the content is different
                    item.queueWriteToDisk = true;
                    results.queuedWrite = true;
                }
            }
            return results;
        });
    }
    writeFiles(files, opts) {
        return Promise.all(Object.keys(files).map(filePath => {
            return this.writeFile(filePath, files[filePath], opts);
        }));
    }
    commit() {
        return __awaiter$2(this, void 0, void 0, function* () {
            const instructions = getCommitInstructions(this.path, this.d);
            // ensure directories we need exist
            const dirsAdded = yield this.commitEnsureDirs(instructions.dirsToEnsure);
            // write all queued the files
            const filesWritten = yield this.commitWriteFiles(instructions.filesToWrite);
            // remove all the queued files to be deleted
            const filesDeleted = yield this.commitDeleteFiles(instructions.filesToDelete);
            // remove all the queued dirs to be deleted
            const dirsDeleted = yield this.commitDeleteDirs(instructions.dirsToDelete);
            instructions.filesToDelete.forEach(fileToDelete => {
                this.clearFileCache(fileToDelete);
            });
            instructions.dirsToDelete.forEach(dirToDelete => {
                this.clearDirCache(dirToDelete);
            });
            // return only the files that were
            return {
                filesWritten: filesWritten,
                filesDeleted: filesDeleted,
                dirsDeleted: dirsDeleted,
                dirsAdded: dirsAdded
            };
        });
    }
    commitEnsureDirs(dirsToEnsure) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const dirsAdded = [];
            for (const dirPath of dirsToEnsure) {
                const item = this.getItem(dirPath);
                if (item.exists && item.isDirectory) {
                    // already cached that this path is indeed an existing directory
                    continue;
                }
                try {
                    // cache that we know this is a directory on disk
                    item.exists = true;
                    item.isDirectory = true;
                    item.isFile = false;
                    yield this.disk.mkdir(dirPath);
                    dirsAdded.push(dirPath);
                }
                catch (e) { }
            }
            return dirsAdded;
        });
    }
    commitWriteFiles(filesToWrite) {
        return Promise.all(filesToWrite.map((filePath) => __awaiter$2(this, void 0, void 0, function* () {
            if (typeof filePath !== 'string') {
                throw new Error(`unable to writeFile without filePath`);
            }
            return this.commitWriteFile(filePath);
        })));
    }
    commitWriteFile(filePath) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const item = this.getItem(filePath);
            if (typeof item.fileSrc === 'string') {
                yield this.disk.copyFile(item.fileSrc, filePath);
                return filePath;
            }
            if (item.fileText == null) {
                throw new Error(`unable to find item fileText to write: ${filePath}`);
            }
            yield this.disk.writeFile(filePath, item.fileText);
            return filePath;
        });
    }
    commitDeleteFiles(filesToDelete) {
        return Promise.all(filesToDelete.map((filePath) => __awaiter$2(this, void 0, void 0, function* () {
            if (typeof filePath !== 'string') {
                throw new Error(`unable to unlink without filePath`);
            }
            yield this.disk.unlink(filePath);
            return filePath;
        })));
    }
    commitDeleteDirs(dirsToDelete) {
        return __awaiter$2(this, void 0, void 0, function* () {
            const dirsDeleted = [];
            for (const dirPath of dirsToDelete) {
                try {
                    yield this.disk.rmdir(dirPath);
                }
                catch (e) { }
                dirsDeleted.push(dirPath);
            }
            return dirsDeleted;
        });
    }
    clearDirCache(dirPath) {
        dirPath = normalizePath(dirPath);
        const filePaths = Object.keys(this.d);
        filePaths.forEach(f => {
            const filePath = this.path.relative(dirPath, f).split('/')[0];
            if (!filePath.startsWith('.') && !filePath.startsWith('/')) {
                this.clearFileCache(f);
            }
        });
    }
    clearFileCache(filePath) {
        filePath = normalizePath(filePath);
        const item = this.d[filePath];
        if (item && !item.queueWriteToDisk) {
            delete this.d[filePath];
        }
    }
    getItem(itemPath) {
        itemPath = normalizePath(itemPath);
        const item = this.d[itemPath];
        if (item) {
            return item;
        }
        return this.d[itemPath] = {};
    }
    clearCache() {
        this.d = {};
    }
    getMemoryStats() {
        return `data length: ${Object.keys(this.d).length}`;
    }
}
function getCommitInstructions(path, d) {
    const instructions = {
        filesToDelete: [],
        filesToWrite: [],
        dirsToDelete: [],
        dirsToEnsure: []
    };
    Object.keys(d).forEach(itemPath => {
        const item = d[itemPath];
        if (item.queueWriteToDisk) {
            if (item.isFile) {
                instructions.filesToWrite.push(itemPath);
                const dir = normalizePath(path.dirname(itemPath));
                if (!instructions.dirsToEnsure.includes(dir)) {
                    instructions.dirsToEnsure.push(dir);
                }
                const dirDeleteIndex = instructions.dirsToDelete.indexOf(dir);
                if (dirDeleteIndex > -1) {
                    instructions.dirsToDelete.splice(dirDeleteIndex, 1);
                }
                const fileDeleteIndex = instructions.filesToDelete.indexOf(itemPath);
                if (fileDeleteIndex > -1) {
                    instructions.filesToDelete.splice(fileDeleteIndex, 1);
                }
            }
            else if (item.isDirectory) {
                if (!instructions.dirsToEnsure.includes(itemPath)) {
                    instructions.dirsToEnsure.push(itemPath);
                }
                const dirDeleteIndex = instructions.dirsToDelete.indexOf(itemPath);
                if (dirDeleteIndex > -1) {
                    instructions.dirsToDelete.splice(dirDeleteIndex, 1);
                }
            }
        }
        else if (item.queueDeleteFromDisk) {
            if (item.isDirectory && !instructions.dirsToEnsure.includes(itemPath)) {
                instructions.dirsToDelete.push(itemPath);
            }
            else if (item.isFile && !instructions.filesToWrite.includes(itemPath)) {
                instructions.filesToDelete.push(itemPath);
            }
        }
        item.queueDeleteFromDisk = false;
        item.queueWriteToDisk = false;
    });
    // add all the ancestor directories for each directory too
    for (let i = 0, ilen = instructions.dirsToEnsure.length; i < ilen; i++) {
        const segments = instructions.dirsToEnsure[i].split('/');
        for (let j = 2; j < segments.length; j++) {
            const dir = segments.slice(0, j).join('/');
            if (!instructions.dirsToEnsure.includes(dir)) {
                instructions.dirsToEnsure.push(dir);
            }
        }
    }
    // sort directories so shortest paths are ensured first
    instructions.dirsToEnsure.sort((a, b) => {
        const segmentsA = a.split('/').length;
        const segmentsB = b.split('/').length;
        if (segmentsA < segmentsB)
            return -1;
        if (segmentsA > segmentsB)
            return 1;
        if (a.length < b.length)
            return -1;
        if (a.length > b.length)
            return 1;
        return 0;
    });
    // sort directories so longest paths are removed first
    instructions.dirsToDelete.sort((a, b) => {
        const segmentsA = a.split('/').length;
        const segmentsB = b.split('/').length;
        if (segmentsA < segmentsB)
            return 1;
        if (segmentsA > segmentsB)
            return -1;
        if (a.length < b.length)
            return 1;
        if (a.length > b.length)
            return -1;
        return 0;
    });
    instructions.dirsToEnsure.forEach(dirToEnsure => {
        const i = instructions.dirsToDelete.indexOf(dirToEnsure);
        if (i > -1) {
            instructions.dirsToDelete.splice(i, 1);
        }
    });
    instructions.dirsToDelete = instructions.dirsToDelete.filter(dir => {
        if (dir === '/' || dir.endsWith(':/')) {
            return false;
        }
        return true;
    });
    instructions.dirsToEnsure = instructions.dirsToEnsure.filter(dir => {
        if (d[dir] && d[dir].exists && d[dir].isDirectory) {
            return false;
        }
        if (dir === '/' || dir.endsWith(':/')) {
            return false;
        }
        return true;
    });
    return instructions;
}
function isTextFile(filePath) {
    filePath = filePath.toLowerCase().trim();
    return TXT_EXT.some(ext => filePath.endsWith(ext));
}
const TXT_EXT = [
    '.ts', '.tsx', '.js', '.jsx', '.svg',
    '.html', '.txt', '.md', '.markdown', '.json',
    '.css', '.scss', '.sass', '.less', '.styl'
];
function shouldIgnore(filePath) {
    filePath = filePath.trim().toLowerCase();
    return IGNORE.some(ignoreFile => filePath.endsWith(ignoreFile));
}
const IGNORE = [
    '.ds_store',
    '.gitignore',
    'desktop.ini',
    'thumbs.db'
];
// only cache if it's less than 5MB-ish (using .length as a rough guess)
// why 5MB? idk, seems like a good number for source text
// it's pretty darn large to cover almost ALL legitimate source files
// and anything larger is probably a REALLY large file and a rare case
// which we don't need to eat up memory for
const MAX_TEXT_CACHE = 5242880;

function getCompilerCtx(config, compilerCtx) {
    // reusable data between builds
    compilerCtx = compilerCtx || {};
    compilerCtx.fs = compilerCtx.fs || new InMemoryFileSystem(config.sys.fs, config.sys.path);
    compilerCtx.cache = compilerCtx.cache || new Cache(config, new InMemoryFileSystem(config.sys.fs, config.sys.path), config.sys.tmpdir());
    compilerCtx.events = compilerCtx.events || new BuildEvents(config);
    compilerCtx.appFiles = compilerCtx.appFiles || {};
    compilerCtx.moduleFiles = compilerCtx.moduleFiles || {};
    compilerCtx.collections = compilerCtx.collections || [];
    compilerCtx.resolvedCollections = compilerCtx.resolvedCollections || [];
    compilerCtx.compiledModuleJsText = compilerCtx.compiledModuleJsText || {};
    compilerCtx.compiledModuleLegacyJsText = compilerCtx.compiledModuleLegacyJsText || {};
    if (typeof compilerCtx.activeBuildId !== 'number') {
        compilerCtx.activeBuildId = -1;
    }
    return compilerCtx;
}

function getAppWWWBuildDir(config) {
    return pathJoin(config, config.buildDir, config.fsNamespace);
}
function getRegistryFileName(config) {
    return `${config.fsNamespace}.registry.json`;
}
function getRegistryJsonWWW(config) {
    return pathJoin(config, getAppWWWBuildDir(config), getRegistryFileName(config));
}
function getLoaderFileName(config) {
    return `${config.fsNamespace}.js`;
}
function getLoaderWWW(config) {
    return pathJoin(config, config.buildDir, getLoaderFileName(config));
}
function getGlobalFileName(config) {
    return `${config.fsNamespace}.global.js`;
}
function getGlobalWWW(config) {
    return pathJoin(config, getAppWWWBuildDir(config), getGlobalFileName(config));
}

const DEFAULT_SSR_CONFIG = {
    collapseWhitespace: true,
    inlineLoaderScript: true,
    inlineStyles: true,
    inlineAssetsMaxSize: 5000,
    removeUnusedStyles: true
};
const DEFAULT_PRERENDER_HOST = 'prerender.stenciljs.com';

function normalizeHydrateOptions(inputOpts) {
    const opts = Object.assign({}, DEFAULT_SSR_CONFIG, inputOpts);
    const req = opts.req;
    if (req && typeof req.get === 'function') {
        // assuming node express request object
        // https://expressjs.com/
        if (!opts.url)
            opts.url = req.protocol + '://' + req.get('host') + req.originalUrl;
        if (!opts.referrer)
            opts.referrer = req.get('referrer');
        if (!opts.userAgent)
            opts.userAgent = req.get('user-agent');
        if (!opts.cookie)
            opts.cookie = req.get('cookie');
    }
    return opts;
}
function generateHydrateResults(config, opts) {
    if (!opts.url) {
        opts.url = `https://${DEFAULT_PRERENDER_HOST}/`;
    }
    // https://nodejs.org/api/url.html
    const urlParse = config.sys.url.parse(opts.url);
    const hydrateResults = {
        diagnostics: [],
        url: opts.url,
        host: urlParse.host,
        hostname: urlParse.hostname,
        port: urlParse.port,
        path: urlParse.path,
        pathname: urlParse.pathname,
        search: urlParse.search,
        query: urlParse.query,
        hash: urlParse.hash,
        html: opts.html,
        styles: null,
        anchors: [],
        components: [],
        styleUrls: [],
        scriptUrls: [],
        imgUrls: [],
        opts: opts
    };
    createConsole(config, opts, hydrateResults);
    return hydrateResults;
}
function createConsole(config, opts, results) {
    const pathname = results.pathname;
    opts.console = opts.console || {};
    if (typeof opts.console.error !== 'function') {
        opts.console.error = function (...args) {
            results.diagnostics.push({
                level: `error`,
                type: `hydrate`,
                header: `runtime console.error: ${pathname}`,
                messageText: args.join(', ')
            });
        };
    }
    if (config.logger.level === 'debug') {
        ['debug', 'info', 'log', 'warn'].forEach(level => {
            if (typeof opts.console[level] !== 'function') {
                opts.console[level] = function (...args) {
                    results.diagnostics.push({
                        level: level,
                        type: 'hydrate',
                        header: `runtime console.${level}: ${pathname}`,
                        messageText: args.join(', ')
                    });
                };
            }
        });
    }
}
function normalizeDirection(doc, opts) {
    let dir = doc.body.getAttribute('dir');
    if (dir) {
        dir = dir.trim().toLowerCase();
        if (dir.trim().length > 0) {
            console.warn(`dir="${dir}" should be placed on the <html> instead of <body>`);
        }
    }
    if (opts.dir) {
        dir = opts.dir;
    }
    else {
        dir = doc.documentElement.getAttribute('dir');
    }
    if (dir) {
        dir = dir.trim().toLowerCase();
        if (dir !== 'ltr' && dir !== 'rtl') {
            console.warn(`only "ltr" and "rtl" are valid "dir" values on the <html> element`);
        }
    }
    if (dir !== 'ltr' && dir !== 'rtl') {
        dir = 'ltr';
    }
    doc.documentElement.dir = dir;
}
function normalizeLanguage(doc, opts) {
    let lang = doc.body.getAttribute('lang');
    if (lang) {
        lang = lang.trim().toLowerCase();
        if (lang.trim().length > 0) {
            console.warn(`lang="${lang}" should be placed on <html> instead of <body>`);
        }
    }
    if (opts.lang) {
        lang = opts.lang;
    }
    else {
        lang = doc.documentElement.getAttribute('lang');
    }
    if (lang) {
        lang = lang.trim().toLowerCase();
        if (lang.length > 0) {
            doc.documentElement.lang = lang;
        }
    }
}
function collectAnchors(config, doc, results) {
    const anchorElements = doc.querySelectorAll('a');
    for (var i = 0; i < anchorElements.length; i++) {
        const attrs = {};
        const anchorAttrs = anchorElements[i].attributes;
        for (var j = 0; j < anchorAttrs.length; j++) {
            attrs[anchorAttrs[j].nodeName.toLowerCase()] = anchorAttrs[j].nodeValue;
        }
        results.anchors.push(attrs);
    }
    config.logger.debug(`optimize ${results.pathname}, collected anchors: ${results.anchors.length}`);
}
function generateFailureDiagnostic(d) {
    return `
    <div style="padding: 20px;">
      <div style="font-weight: bold;">${d.header}</div>
      <div>${d.messageText}</div>
    </div>
  `;
}

const Build = {
    verboseError: true,
    cssVarShim: true,
    shadowDom: true,
    ssrServerSide: true,
    styles: true,
    hostData: true,
    hostTheme: true,
    svg: true,
    observeAttr: true,
    isDev: true,
    // decorators
    element: true,
    event: true,
    listener: true,
    method: true,
    propConnect: true,
    propContext: true,
    watchCallback: true,
    // lifecycle events
    cmpDidLoad: true,
    cmpWillLoad: true,
    cmpDidUpdate: true,
    cmpWillUpdate: true,
    cmpDidUnload: true,
};

function initElementListeners(plt, elm) {
    // so the element was just connected, which means it's in the DOM
    // however, the component instance hasn't been created yet
    // but what if an event it should be listening to get emitted right now??
    // let's add our listeners right now to our element, and if it happens
    // to receive events between now and the instance being created let's
    // queue up all of the event data and fire it off on the instance when it's ready
    const cmpMeta = plt.getComponentMeta(elm);
    if (cmpMeta.listenersMeta) {
        // we've got listens
        cmpMeta.listenersMeta.forEach(listenMeta => {
            // go through each listener
            if (!listenMeta.eventDisabled) {
                // only add ones that are not already disabled
                plt.domApi.$addEventListener(elm, listenMeta.eventName, createListenerCallback(plt, elm, listenMeta.eventMethodName), listenMeta.eventCapture, listenMeta.eventPassive);
            }
        });
    }
}
function createListenerCallback(plt, elm, eventMethodName, val) {
    // create the function that gets called when the element receives
    // an event which it should be listening for
    return (ev) => {
        // get the instance if it exists
        val = plt.instanceMap.get(elm);
        if (val) {
            // instance is ready, let's call it's member method for this event
            val[eventMethodName](ev);
        }
        else {
            // instance is not ready!!
            // let's queue up this event data and replay it later
            // when the instance is ready
            val = (plt.queuedEvents.get(elm) || []);
            val.push(eventMethodName, ev);
            plt.queuedEvents.set(elm, val);
        }
    };
}

const isDef = (v) => v !== undefined && v !== null;
const isUndef = (v) => v === undefined || v === null;
const toLowerCase = (str) => str.toLowerCase();
const toDashCase = (str) => toLowerCase(str.replace(/([A-Z])/g, g => ' ' + g[0]).trim().replace(/ /g, '-'));
const dashToPascalCase = (str) => toLowerCase(str).split('-').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');
const noop = () => { };

function parsePropertyValue(propType, propValue) {
    // ensure this value is of the correct prop type
    // we're testing both formats of the "propType" value because
    // we could have either gotten the data from the attribute changed callback,
    // which wouldn't have Constructor data yet, and because this method is reused
    // within proxy where we don't have meta data, but only constructor data
    if (isDef(propValue)) {
        if (propType === Boolean || propType === 3 /* Boolean */) {
            // per the HTML spec, any string value means it is a boolean true value
            // but we'll cheat here and say that the string "false" is the boolean false
            return (propValue === 'false' ? false : propValue === '' || !!propValue);
        }
        if (propType === Number || propType === 4 /* Number */) {
            // force it to be a number
            return parseFloat(propValue);
        }
    }
    // not sure exactly what type we want
    // so no need to change to a different type
    return propValue;
}

function defineMember(plt, property, elm, instance, memberName) {
    function getComponentProp(values) {
        // component instance prop/state getter
        // get the property value directly from our internal values
        values = plt.valuesMap.get(plt.hostElementMap.get(this));
        return values && values[memberName];
    }
    function setComponentProp(newValue, elm) {
        // component instance prop/state setter (cannot be arrow fn)
        elm = plt.hostElementMap.get(this);
        if (elm) {
            if (property.state || property.mutable) {
                setValue(plt, elm, memberName, newValue);
            }
            else if (Build.verboseError) {
                console.warn(`@Prop() "${memberName}" on "${elm.tagName}" cannot be modified.`);
            }
        }
    }
    if (property.type || property.state) {
        const values = plt.valuesMap.get(elm);
        if (!property.state) {
            if (property.attr && (values[memberName] === undefined || values[memberName] === '')) {
                // check the prop value from the host element attribute
                const hostAttrValue = plt.domApi.$getAttribute(elm, property.attr);
                if (hostAttrValue != null) {
                    // looks like we've got an attribute value
                    // let's set it to our internal values
                    values[memberName] = parsePropertyValue(property.type, hostAttrValue);
                }
            }
            if (Build.clientSide) {
                // client-side
                // within the browser, the element's prototype
                // already has its getter/setter set, but on the
                // server the prototype is shared causing issues
                // so instead the server's elm has the getter/setter
                // directly on the actual element instance, not its prototype
                // so on the browser we can use "hasOwnProperty"
                if (elm.hasOwnProperty(memberName)) {
                    // @Prop or @Prop({mutable:true})
                    // property values on the host element should override
                    // any default values on the component instance
                    if (values[memberName] === undefined) {
                        values[memberName] = elm[memberName];
                    }
                    // for the client only, let's delete its "own" property
                    // this way our already assigned getter/setter on the prototype kicks in
                    delete elm[memberName];
                }
            }
            else {
                // server-side
                // server-side elm has the getter/setter
                // on the actual element instance, not its prototype
                // on the server we cannot accurately use "hasOwnProperty"
                // instead we'll do a direct lookup to see if the
                // constructor has this property
                if (elementHasProperty(plt, elm, memberName)) {
                    // @Prop or @Prop({mutable:true})
                    // property values on the host element should override
                    // any default values on the component instance
                    if (values[memberName] === undefined) {
                        values[memberName] = elm[memberName];
                    }
                }
            }
        }
        if (instance.hasOwnProperty(memberName) && values[memberName] === undefined) {
            // @Prop() or @Prop({mutable:true}) or @State()
            // we haven't yet got a value from the above checks so let's
            // read any "own" property instance values already set
            // to our internal value as the source of getter data
            // we're about to define a property and it'll overwrite this "own" property
            values[memberName] = instance[memberName];
        }
        if (property.watchCallbacks) {
            values[WATCH_CB_PREFIX + memberName] = property.watchCallbacks.slice();
        }
        // add getter/setter to the component instance
        // these will be pointed to the internal data set from the above checks
        definePropertyGetterSetter(instance, memberName, getComponentProp, setComponentProp);
    }
    else if (Build.element && property.elementRef) {
        // @Element()
        // add a getter to the element reference using
        // the member name the component meta provided
        definePropertyValue(instance, memberName, elm);
    }
    else if (Build.method && property.method) {
        // @Method()
        // add a property "value" on the host element
        // which we'll bind to the instance's method
        definePropertyValue(elm, memberName, instance[memberName].bind(instance));
    }
    else if (Build.propContext && property.context) {
        // @Prop({ context: 'config' })
        const contextObj = plt.getContextItem(property.context);
        if (contextObj !== undefined) {
            definePropertyValue(instance, memberName, (contextObj.getContext && contextObj.getContext(elm)) || contextObj);
        }
    }
    else if (Build.propConnect && property.connect) {
        // @Prop({ connect: 'ion-loading-ctrl' })
        definePropertyValue(instance, memberName, plt.propConnect(property.connect));
    }
}
function setValue(plt, elm, memberName, newVal, values, instance, watchMethods) {
    // get the internal values object, which should always come from the host element instance
    // create the _values object if it doesn't already exist
    values = plt.valuesMap.get(elm);
    if (!values) {
        plt.valuesMap.set(elm, values = {});
    }
    const oldVal = values[memberName];
    // check our new property value against our internal value
    if (newVal !== oldVal) {
        // gadzooks! the property's value has changed!!
        // set our new value!
        // https://youtu.be/dFtLONl4cNc?t=22
        values[memberName] = newVal;
        instance = plt.instanceMap.get(elm);
        if (instance) {
            // get an array of method names of watch functions to call
            watchMethods = values[WATCH_CB_PREFIX + memberName];
            if (Build.watchCallback && watchMethods) {
                // this instance is watching for when this property changed
                for (let i = 0; i < watchMethods.length; i++) {
                    try {
                        // fire off each of the watch methods that are watching this property
                        instance[watchMethods[i]].call(instance, newVal, oldVal, memberName);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
            if (!plt.activeRender && elm.$rendered) {
                // looks like this value actually changed, so we've got work to do!
                // but only if we've already created an instance, otherwise just chill out
                // queue that we need to do an update, but don't worry about queuing
                // up millions cuz this function ensures it only runs once
                queueUpdate(plt, elm);
            }
        }
    }
}
function definePropertyValue(obj, propertyKey, value) {
    // minification shortcut
    Object.defineProperty(obj, propertyKey, {
        'configurable': true,
        'value': value
    });
}
function definePropertyGetterSetter(obj, propertyKey, get, set) {
    // minification shortcut
    Object.defineProperty(obj, propertyKey, {
        'configurable': true,
        'get': get,
        'set': set
    });
}
const WATCH_CB_PREFIX = `wc-`;
function elementHasProperty(plt, elm, memberName) {
    // within the browser, the element's prototype
    // already has its getter/setter set, but on the
    // server the prototype is shared causing issues
    // so instead the server's elm has the getter/setter
    // directly on the actual element instance, not its prototype
    // so at the time of this function being called, the server
    // side element is unaware if the element has this property
    // name. So for server-side only, do this trick below
    // don't worry, this runtime code doesn't show on the client
    let hasOwnProperty = elm.hasOwnProperty(memberName);
    if (!hasOwnProperty) {
        // element doesn't
        const cmpMeta = plt.getComponentMeta(elm);
        if (cmpMeta) {
            if (cmpMeta.componentConstructor && cmpMeta.componentConstructor.properties) {
                // if we have the constructor property data, let's check that
                const member = cmpMeta.componentConstructor.properties[memberName];
                hasOwnProperty = !!(member && member.type);
            }
            if (!hasOwnProperty && cmpMeta.membersMeta) {
                // if we have the component's metadata, let's check that
                const member = cmpMeta.membersMeta[memberName];
                hasOwnProperty = !!(member && member.propType);
            }
        }
    }
    return hasOwnProperty;
}

function updateElement(plt, oldVnode, newVnode, isSvgMode, memberName) {
    // if the element passed in is a shadow root, which is a document fragment
    // then we want to be adding attrs/props to the shadow root's "host" element
    // if it's not a shadow root, then we add attrs/props to the same element
    const elm = (newVnode.elm.nodeType === 11 /* DocumentFragment */ && newVnode.elm.host) ? newVnode.elm.host : newVnode.elm;
    const oldVnodeAttrs = (oldVnode && oldVnode.vattrs) || EMPTY_OBJ;
    const newVnodeAttrs = newVnode.vattrs || EMPTY_OBJ;
    // remove attributes no longer present on the vnode by setting them to undefined
    for (memberName in oldVnodeAttrs) {
        if (!(newVnodeAttrs && newVnodeAttrs[memberName] != null) && oldVnodeAttrs[memberName] != null) {
            setAccessor(plt, elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode);
        }
    }
    // add new & update changed attributes
    for (memberName in newVnodeAttrs) {
        if (!(memberName in oldVnodeAttrs) || newVnodeAttrs[memberName] !== (memberName === 'value' || memberName === 'checked' ? elm[memberName] : oldVnodeAttrs[memberName])) {
            setAccessor(plt, elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode);
        }
    }
}
function setAccessor(plt, elm, memberName, oldValue, newValue, isSvg, i, ilen) {
    if (memberName === 'class' && !isSvg) {
        // Class
        if (oldValue !== newValue) {
            const oldList = (oldValue == null || oldValue === '') ? EMPTY_ARR : oldValue.trim().split(/\s+/);
            const newList = (newValue == null || newValue === '') ? EMPTY_ARR : newValue.trim().split(/\s+/);
            let classList = (elm.className == null || elm.className === '') ? EMPTY_ARR : elm.className.trim().split(/\s+/);
            for (i = 0, ilen = oldList.length; i < ilen; i++) {
                if (newList.indexOf(oldList[i]) === -1) {
                    classList = classList.filter((c) => c !== oldList[i]);
                }
            }
            for (i = 0, ilen = newList.length; i < ilen; i++) {
                if (oldList.indexOf(newList[i]) === -1) {
                    classList = [...classList, newList[i]];
                }
            }
            elm.className = classList.join(' ');
        }
    }
    else if (memberName === 'style') {
        // Style
        oldValue = oldValue || EMPTY_OBJ;
        newValue = newValue || EMPTY_OBJ;
        for (i in oldValue) {
            if (!newValue[i]) {
                elm.style[i] = '';
            }
        }
        for (i in newValue) {
            if (newValue[i] !== oldValue[i]) {
                elm.style[i] = newValue[i];
            }
        }
    }
    else if (memberName[0] === 'o' && memberName[1] === 'n' && (!(memberName in elm))) {
        // Event Handlers
        // adding an standard event listener, like <button onClick=...> or something
        memberName = toLowerCase(memberName.substring(2));
        if (newValue) {
            if (newValue !== oldValue) {
                // add listener
                plt.domApi.$addEventListener(elm, memberName, newValue);
            }
        }
        else {
            // remove listener
            plt.domApi.$removeEventListener(elm, memberName);
        }
    }
    else if (memberName !== 'list' && memberName !== 'type' && !isSvg &&
        (memberName in elm || (['object', 'function'].indexOf(typeof newValue) !== -1) && newValue !== null)
        || (!Build.clientSide && elementHasProperty(plt, elm, memberName))) {
        // Properties
        // - list and type are attributes that get applied as values on the element
        // - all svgs get values as attributes not props
        // - check if elm contains name or if the value is array, object, or function
        const cmpMeta = plt.getComponentMeta(elm);
        if (cmpMeta && cmpMeta.membersMeta && cmpMeta.membersMeta[memberName]) {
            // we know for a fact that this element is a known component
            // and this component has this member name as a property,
            // let's set the known @Prop on this element
            setProperty(elm, memberName, newValue);
        }
        else if (memberName !== 'ref') {
            // this member name is a property on this element, but it's not a component
            // this is a native property like "value" or something
            // also we can ignore the "ref" member name at this point
            setProperty(elm, memberName, newValue == null ? '' : newValue);
            if (newValue == null || newValue === false) {
                elm.removeAttribute(memberName);
            }
        }
    }
    else if (newValue != null) {
        // Element Attributes
        i = (memberName !== (memberName = memberName.replace(/^xlink\:?/, '')));
        if (BOOLEAN_ATTRS[memberName] === 1 && (!newValue || newValue === 'false')) {
            if (i) {
                elm.removeAttributeNS(XLINK_NS$1, toLowerCase(memberName));
            }
            else {
                elm.removeAttribute(memberName);
            }
        }
        else if (typeof newValue !== 'function') {
            if (i) {
                elm.setAttributeNS(XLINK_NS$1, toLowerCase(memberName), newValue);
            }
            else {
                elm.setAttribute(memberName, newValue);
            }
        }
    }
}
/**
 * Attempt to set a DOM property to the given value.
 * IE & FF throw for certain property-value combinations.
 */
function setProperty(elm, name, value) {
    try {
        elm[name] = value;
    }
    catch (e) { }
}
const BOOLEAN_ATTRS = {
    'allowfullscreen': 1,
    'async': 1,
    'autofocus': 1,
    'autoplay': 1,
    'checked': 1,
    'controls': 1,
    'disabled': 1,
    'enabled': 1,
    'formnovalidate': 1,
    'hidden': 1,
    'multiple': 1,
    'noresize': 1,
    'readonly': 1,
    'required': 1,
    'selected': 1,
    'spellcheck': 1,
};
const XLINK_NS$1 = 'http://www.w3.org/1999/xlink';

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */
let isSvgMode = false;
function createRendererPatch(plt, domApi) {
    // createRenderer() is only created once per app
    // the patch() function which createRenderer() returned is the function
    // which gets called numerous times by each component
    function createElm(vnode, parentElm, childIndex, i, elm, childNode, namedSlot, slotNodes, hasLightDom) {
        if (typeof vnode.vtag === 'function') {
            vnode = vnode.vtag(Object.assign({}, vnode.vattrs, { children: vnode.vchildren }));
        }
        if (!useNativeShadowDom && vnode.vtag === 'slot') {
            if (defaultSlot || namedSlots) {
                if (scopeId) {
                    domApi.$setAttribute(parentElm, scopeId + '-slot', '');
                }
                // special case for manually relocating host content nodes
                // to their new home in either a named slot or the default slot
                namedSlot = (vnode.vattrs && vnode.vattrs.name);
                if (isDef(namedSlot)) {
                    // this vnode is a named slot
                    slotNodes = namedSlots && namedSlots[namedSlot];
                }
                else {
                    // this vnode is the default slot
                    slotNodes = defaultSlot;
                }
                if (isDef(slotNodes)) {
                    // the host element has some nodes that need to be moved around
                    // we have a slot for the user's vnode to go into
                    // while we're moving nodes around, temporarily disable
                    // the disconnectCallback from working
                    plt.tmpDisconnected = true;
                    for (i = 0; i < slotNodes.length; i++) {
                        childNode = slotNodes[i];
                        // remove the host content node from it's original parent node
                        // then relocate the host content node to its new slotted home
                        domApi.$remove(childNode);
                        domApi.$appendChild(parentElm, childNode);
                        if (childNode.nodeType !== 8 /* CommentNode */) {
                            hasLightDom = true;
                        }
                    }
                    if (!hasLightDom && vnode.vchildren) {
                        // the user did not provide light-dom content
                        // and this vnode does come with it's own default content
                        updateChildren(parentElm, [], vnode.vchildren);
                    }
                    // done moving nodes around
                    // allow the disconnect callback to work again
                    plt.tmpDisconnected = false;
                }
            }
            // this was a slot node, we do not create slot elements, our work here is done
            // no need to return any element to be added to the dom
            return null;
        }
        if (isDef(vnode.vtext)) {
            // create text node
            vnode.elm = domApi.$createTextNode(vnode.vtext);
        }
        else {
            // create element
            elm = vnode.elm = ((Build.svg && (isSvgMode || vnode.vtag === 'svg')) ? domApi.$createElementNS('http://www.w3.org/2000/svg', vnode.vtag) : domApi.$createElement(vnode.vtag));
            if (Build.svg) {
                isSvgMode = vnode.vtag === 'svg' ? true : (vnode.vtag === 'foreignObject' ? false : isSvgMode);
            }
            // add css classes, attrs, props, listeners, etc.
            updateElement(plt, null, vnode, isSvgMode);
            if (scopeId !== null && elm._scopeId !== scopeId) {
                // if there is a scopeId and this is the initial render
                // then let's add the scopeId as an attribute
                domApi.$setAttribute(elm, (elm._scopeId = scopeId), '');
            }
            const children = vnode.vchildren;
            if (Build.ssrServerSide && isDef(ssrId)) {
                // SSR ONLY: this is an SSR render and this
                // logic does not run on the client
                // give this element the SSR child id that can be read by the client
                domApi.$setAttribute(elm, SSR_CHILD_ID, ssrId + '.' + childIndex + (hasChildNodes(children) ? '' : '.'));
            }
            if (children) {
                for (i = 0; i < children.length; ++i) {
                    // create the node
                    childNode = createElm(children[i], elm, i);
                    // return node could have been null
                    if (childNode) {
                        if (Build.ssrServerSide && isDef(ssrId) && childNode.nodeType === 3 /* TextNode */) {
                            // SSR ONLY: add the text node's start comment
                            domApi.$appendChild(elm, domApi.$createComment('s.' + ssrId + '.' + i));
                        }
                        // append our new node
                        domApi.$appendChild(elm, childNode);
                        if (Build.ssrServerSide && isDef(ssrId) && childNode.nodeType === 3) {
                            // SSR ONLY: add the text node's end comment
                            domApi.$appendChild(elm, domApi.$createComment('/'));
                            domApi.$appendChild(elm, domApi.$createTextNode(' '));
                        }
                    }
                }
            }
            if (Build.svg) {
                // Only reset the SVG context when we're exiting SVG element
                if (vnode.vtag === 'svg') {
                    isSvgMode = false;
                }
            }
        }
        return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, childNode, vnodeChild) {
        const containerElm = (parentElm.$defaultHolder && domApi.$parentNode(parentElm.$defaultHolder)) || parentElm;
        for (; startIdx <= endIdx; ++startIdx) {
            vnodeChild = vnodes[startIdx];
            if (isDef(vnodeChild)) {
                childNode = isDef(vnodeChild.vtext) ? domApi.$createTextNode(vnodeChild.vtext) : createElm(vnodeChild, parentElm, startIdx);
                if (isDef(childNode)) {
                    vnodeChild.elm = childNode;
                    domApi.$insertBefore(containerElm, childNode, before);
                }
            }
        }
    }
    function removeVnodes(vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            if (isDef(vnodes[startIdx])) {
                domApi.$remove(vnodes[startIdx].elm);
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh) {
        let oldStartIdx = 0, newStartIdx = 0;
        let oldEndIdx = oldCh.length - 1;
        let oldStartVnode = oldCh[0];
        let oldEndVnode = oldCh[oldEndIdx];
        let newEndIdx = newCh.length - 1;
        let newStartVnode = newCh[0];
        let newEndVnode = newCh[newEndIdx];
        let oldKeyToIdx;
        let idxInOld;
        let elmToMove;
        let node;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (isSameVnode(oldStartVnode, newStartVnode)) {
                patchVNode(oldStartVnode, newStartVnode);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (isSameVnode(oldEndVnode, newEndVnode)) {
                patchVNode(oldEndVnode, newEndVnode);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (isSameVnode(oldStartVnode, newEndVnode)) {
                patchVNode(oldStartVnode, newEndVnode);
                domApi.$insertBefore(parentElm, oldStartVnode.elm, domApi.$nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (isSameVnode(oldEndVnode, newStartVnode)) {
                patchVNode(oldEndVnode, newStartVnode);
                domApi.$insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (isUndef(oldKeyToIdx)) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.vkey];
                if (isUndef(idxInOld)) {
                    // new element
                    node = createElm(newStartVnode, parentElm, newStartIdx);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.vtag !== newStartVnode.vtag) {
                        node = createElm(newStartVnode, parentElm, idxInOld);
                    }
                    else {
                        patchVNode(elmToMove, newStartVnode);
                        oldCh[idxInOld] = undefined;
                        node = elmToMove.elm;
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
                if (node) {
                    domApi.$insertBefore((oldStartVnode.elm && oldStartVnode.elm.parentNode) || parentElm, node, oldStartVnode.elm);
                }
            }
        }
        if (oldStartIdx > oldEndIdx) {
            addVnodes(parentElm, (newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm), newCh, newStartIdx, newEndIdx);
        }
        else if (newStartIdx > newEndIdx) {
            removeVnodes(oldCh, oldStartIdx, oldEndIdx);
        }
    }
    function isSameVnode(vnode1, vnode2) {
        // compare if two vnode to see if they're "technically" the same
        // need to have the same element tag, and same key to be the same
        return vnode1.vtag === vnode2.vtag && vnode1.vkey === vnode2.vkey;
    }
    function createKeyToOldIdx(children, beginIdx, endIdx) {
        const map = {};
        let i, key, ch;
        for (i = beginIdx; i <= endIdx; ++i) {
            ch = children[i];
            if (ch != null) {
                key = ch.vkey;
                if (key !== undefined) {
                    map.k = i;
                }
            }
        }
        return map;
    }
    function patchVNode(oldVNode, newVNode) {
        const elm = newVNode.elm = oldVNode.elm;
        const oldChildren = oldVNode.vchildren;
        const newChildren = newVNode.vchildren;
        let defaultSlot;
        if (Build.svg) {
            // test if we're rendering an svg element, or still rendering nodes inside of one
            // only add this to the when the compiler sees we're using an svg somewhere
            isSvgMode = newVNode.elm && newVNode.elm.parentElement != null && newVNode.elm.ownerSVGElement !== undefined;
            isSvgMode = newVNode.vtag === 'svg' ? true : (newVNode.vtag === 'foreignObject' ? false : isSvgMode);
        }
        if (isUndef(newVNode.vtext)) {
            // element node
            if (newVNode.vtag !== 'slot') {
                // either this is the first render of an element OR it's an update
                // AND we already know it's possible it could have changed
                // this updates the element's css classes, attrs, props, listeners, etc.
                updateElement(plt, oldVNode, newVNode, isSvgMode);
            }
            if (isDef(oldChildren) && isDef(newChildren)) {
                // looks like there's child vnodes for both the old and new vnodes
                updateChildren(elm, oldChildren, newChildren);
            }
            else if (isDef(newChildren)) {
                // no old child vnodes, but there are new child vnodes to add
                if (isDef(oldVNode.vtext)) {
                    // the old vnode was text, so be sure to clear it out
                    domApi.$setTextContent(elm, '');
                }
                // add the new vnode children
                addVnodes(elm, null, newChildren, 0, newChildren.length - 1);
            }
            else if (isDef(oldChildren)) {
                // no new child vnodes, but there are old child vnodes to remove
                removeVnodes(oldChildren, 0, oldChildren.length - 1);
            }
        }
        else if (defaultSlot = plt.defaultSlotsMap.get(elm)) {
            // this element has slotted content
            const parentElement = defaultSlot[0].parentElement;
            domApi.$setTextContent(parentElement, newVNode.vtext);
            plt.defaultSlotsMap.set(elm, [parentElement.childNodes[0]]);
        }
        else if (oldVNode.vtext !== newVNode.vtext) {
            // update the text content for the text only vnode
            // and also only if the text is different than before
            domApi.$setTextContent(elm, newVNode.vtext);
        }
        if (Build.svg) {
            // reset svgMode when svg node is fully patched
            if (isSvgMode && 'svg' === newVNode.vtag) {
                isSvgMode = false;
            }
        }
    }
    // internal variables to be reused per patch() call
    let isUpdate, defaultSlot, namedSlots, useNativeShadowDom, ssrId, scopeId;
    return function patch(oldVNode, newVNode, isUpdatePatch, elmDefaultSlot, elmNamedSlots, encapsulation, ssrPatchId) {
        // patchVNode() is synchronous
        // so it is safe to set these variables and internally
        // the same patch() call will reference the same data
        isUpdate = isUpdatePatch;
        defaultSlot = elmDefaultSlot;
        namedSlots = elmNamedSlots;
        if (Build.ssrServerSide) {
            if (encapsulation !== 'shadow') {
                ssrId = ssrPatchId;
            }
            else {
                ssrId = null;
            }
        }
        scopeId = (encapsulation === 'scoped' || (encapsulation === 'shadow' && !domApi.$supportsShadowDom)) ? 'data-' + domApi.$tagName(oldVNode.elm) : null;
        if (Build.shadowDom) {
            // use native shadow dom only if the component wants to use it
            // and if this browser supports native shadow dom
            useNativeShadowDom = (encapsulation === 'shadow' && domApi.$supportsShadowDom);
        }
        if (!isUpdate) {
            if (Build.shadowDom && useNativeShadowDom) {
                // this component SHOULD use native slot/shadow dom
                // this browser DOES support native shadow dom
                // and this is the first render
                // let's create that shadow root
                oldVNode.elm = domApi.$attachShadow(oldVNode.elm, { mode: 'open' });
            }
            else if (scopeId) {
                // this host element should use scoped css
                // add the scope attribute to the host
                domApi.$setAttribute(oldVNode.elm, scopeId + '-host', '');
            }
        }
        // synchronous patch
        patchVNode(oldVNode, newVNode);
        if (Build.ssrServerSide && isDef(ssrId)) {
            // SSR ONLY: we've been given an SSR id, so the host element
            // should be given the ssr id attribute
            domApi.$setAttribute(oldVNode.elm, SSR_VNODE_ID, ssrId);
        }
        // return our new vnode
        return newVNode;
    };
}
function callNodeRefs(vNode, isDestroy) {
    if (vNode) {
        vNode.vref && vNode.vref(isDestroy ? null : vNode.elm);
        vNode.vchildren && vNode.vchildren.forEach(vChild => {
            callNodeRefs(vChild, isDestroy);
        });
    }
}
function hasChildNodes(children) {
    // SSR ONLY: check if there are any more nested child elements
    // if there aren't, this info is useful so the client runtime
    // doesn't have to climb down and check so many elements
    if (children) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].vtag !== 'slot' || hasChildNodes(children[i].vchildren)) {
                return true;
            }
        }
    }
    return false;
}

function initEventEmitters(plt, cmpEvents, instance) {
    if (cmpEvents) {
        const elm = plt.hostElementMap.get(instance);
        cmpEvents.forEach(eventMeta => {
            instance[eventMeta.method] = {
                emit: (data) => {
                    plt.emitEvent(elm, eventMeta.name, {
                        bubbles: eventMeta.bubbles,
                        composed: eventMeta.composed,
                        cancelable: eventMeta.cancelable,
                        detail: data
                    });
                }
            };
        });
    }
}

function proxyComponentInstance(plt, cmpConstructor, elm, instance, properties, memberName) {
    // at this point we've got a specific node of a host element, and created a component class instance
    // and we've already created getters/setters on both the host element and component class prototypes
    // let's upgrade any data that might have been set on the host element already
    // and let's have the getters/setters kick in and do their jobs
    // let's automatically add a reference to the host element on the instance
    plt.hostElementMap.set(instance, elm);
    // create the values object if it doesn't already exist
    // this will hold all of the internal getter/setter values
    if (!plt.valuesMap.has(elm)) {
        plt.valuesMap.set(elm, {});
    }
    // get the properties from the constructor
    // and add default "mode" and "color" properties
    properties = Object.assign({
        color: { type: String }
    }, cmpConstructor.properties);
    // always set mode
    properties.mode = { type: String };
    // define each of the members and initialize what their role is
    for (memberName in properties) {
        defineMember(plt, properties[memberName], elm, instance, memberName);
    }
}

function initComponentInstance(plt, elm, instance, componentConstructor, queuedEvents, i) {
    try {
        // using the user's component class, let's create a new instance
        componentConstructor = plt.getComponentMeta(elm).componentConstructor;
        instance = new componentConstructor();
        // ok cool, we've got an host element now, and a actual instance
        // and there were no errors creating the instance
        // let's upgrade the data on the host element
        // and let the getters/setters do their jobs
        proxyComponentInstance(plt, componentConstructor, elm, instance);
        if (Build.event) {
            // add each of the event emitters which wire up instance methods
            // to fire off dom events from the host element
            initEventEmitters(plt, componentConstructor.events, instance);
        }
        if (Build.listener) {
            try {
                // replay any event listeners on the instance that
                // were queued up between the time the element was
                // connected and before the instance was ready
                queuedEvents = plt.queuedEvents.get(elm);
                if (queuedEvents) {
                    // events may have already fired before the instance was even ready
                    // now that the instance is ready, let's replay all of the events that
                    // we queued up earlier that were originally meant for the instance
                    for (i = 0; i < queuedEvents.length; i += 2) {
                        // data was added in sets of two
                        // first item the eventMethodName
                        // second item is the event data
                        // take a look at initElementListener()
                        instance[queuedEvents[i]](queuedEvents[i + 1]);
                    }
                    plt.queuedEvents.delete(elm);
                }
            }
            catch (e) {
                plt.onError(e, 2 /* QueueEventsError */, elm);
            }
        }
    }
    catch (e) {
        // something done went wrong trying to create a component instance
        // create a dumby instance so other stuff can load
        // but chances are the app isn't fully working cuz this component has issues
        instance = {};
        plt.onError(e, 7 /* InitInstanceError */, elm, true);
    }
    plt.instanceMap.set(elm, instance);
    return instance;
}
function initComponentLoaded(plt, elm, hydratedCssClass, instance, onReadyCallbacks) {
    // all is good, this component has been told it's time to finish loading
    // it's possible that we've already decided to destroy this element
    // check if this element has any actively loading child elements
    if (!plt.hasLoadedMap.has(elm) && (instance = plt.instanceMap.get(elm)) && !plt.isDisconnectedMap.has(elm) && (!elm.$activeLoading || !elm.$activeLoading.length)) {
        // cool, so at this point this element isn't already being destroyed
        // and it does not have any child elements that are still loading
        // ensure we remove any child references cuz it doesn't matter at this point
        delete elm.$activeLoading;
        // sweet, this particular element is good to go
        // all of this element's children have loaded (if any)
        // elm._hasLoaded = true;
        plt.hasLoadedMap.set(elm, true);
        try {
            // fire off the ref if it exists
            callNodeRefs(plt.vnodeMap.get(elm));
            // fire off the user's elm.componentOnReady() callbacks that were
            // put directly on the element (well before anything was ready)
            if (onReadyCallbacks = plt.onReadyCallbacksMap.get(elm)) {
                onReadyCallbacks.forEach(cb => cb(elm));
                plt.onReadyCallbacksMap.delete(elm);
            }
            if (Build.cmpDidLoad) {
                // fire off the user's componentDidLoad method (if one was provided)
                // componentDidLoad only runs ONCE, after the instance's element has been
                // assigned as the host element, and AFTER render() has been called
                // we'll also fire this method off on the element, just to
                instance.componentDidLoad && instance.componentDidLoad();
            }
        }
        catch (e) {
            plt.onError(e, 4 /* DidLoadError */, elm);
        }
        // add the css class that this element has officially hydrated
        elm.classList.add(hydratedCssClass);
        // ( •_•)
        // ( •_•)>⌐■-■
        // (⌐■_■)
        // load events fire from bottom to top
        // the deepest elements load first then bubbles up
        propagateComponentLoaded(plt, elm);
    }
}
function propagateComponentLoaded(plt, elm, index, ancestorsActivelyLoadingChildren) {
    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    const ancestorHostElement = plt.ancestorHostElementMap.get(elm);
    if (ancestorHostElement) {
        // ok so this element already has a known ancestor host element
        // let's make sure we remove this element from its ancestor's
        // known list of child elements which are actively loading
        ancestorsActivelyLoadingChildren = ancestorHostElement.$activeLoading;
        if (ancestorsActivelyLoadingChildren) {
            index = ancestorsActivelyLoadingChildren.indexOf(elm);
            if (index > -1) {
                // yup, this element is in the list of child elements to wait on
                // remove it so we can work to get the length down to 0
                ancestorsActivelyLoadingChildren.splice(index, 1);
            }
            // the ancestor's initLoad method will do the actual checks
            // to see if the ancestor is actually loaded or not
            // then let's call the ancestor's initLoad method if there's no length
            // (which actually ends up as this method again but for the ancestor)
            !ancestorsActivelyLoadingChildren.length && ancestorHostElement.$initLoad();
        }
        plt.ancestorHostElementMap.delete(elm);
    }
}

function createThemedClasses(mode, color, classList) {
    const allClasses = {};
    return classList.split(' ')
        .reduce((classObj, classString) => {
        classObj[classString] = true;
        if (mode) {
            classObj[`${classString}-${mode}`] = true;
            if (color) {
                classObj[`${classString}-${color}`] = true;
                classObj[`${classString}-${mode}-${color}`] = true;
            }
        }
        return classObj;
    }, allClasses);
}

/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
const stack = [];
class VNode {
}
function h(nodeName, vnodeData, child) {
    let children;
    let lastSimple = false;
    let simple = false;
    for (var i = arguments.length; i-- > 2;) {
        stack.push(arguments[i]);
    }
    while (stack.length) {
        if ((child = stack.pop()) && child.pop !== undefined) {
            for (i = child.length; i--;) {
                stack.push(child[i]);
            }
        }
        else {
            if (typeof child === 'boolean')
                child = null;
            if ((simple = typeof nodeName !== 'function')) {
                if (child == null)
                    child = '';
                else if (typeof child === 'number')
                    child = String(child);
                else if (typeof child !== 'string')
                    simple = false;
            }
            if (simple && lastSimple) {
                children[children.length - 1].vtext += child;
            }
            else if (children === undefined) {
                children = [simple ? t(child) : child];
            }
            else {
                children.push(simple ? t(child) : child);
            }
            lastSimple = simple;
        }
    }
    const vnode = new VNode();
    vnode.vtag = nodeName;
    vnode.vchildren = children;
    if (vnodeData) {
        vnode.vattrs = vnodeData;
        vnode.vkey = vnodeData.key;
        vnode.vref = vnodeData.ref;
        // normalize class / classname attributes
        if (vnodeData['className']) {
            vnodeData['class'] = vnodeData['className'];
        }
        if (typeof vnodeData['class'] === 'object') {
            for (i in vnodeData['class']) {
                if (vnodeData['class'][i]) {
                    stack.push(i);
                }
            }
            vnodeData['class'] = stack.join(' ');
            stack.length = 0;
        }
    }
    return vnode;
}
function t(textValue) {
    const vnode = new VNode();
    vnode.vtext = textValue;
    return vnode;
}

function render(plt, cmpMeta, elm, instance, isUpdateRender) {
    try {
        // if this component has a render function, let's fire
        // it off and generate the child vnodes for this host element
        // note that we do not create the host element cuz it already exists
        const hostMeta = cmpMeta.componentConstructor.host;
        if (instance.render || instance.hostData || hostMeta) {
            // tell the platform we're actively rendering
            // if a value is changed within a render() then
            // this tells the platform not to queue the change
            plt.activeRender = true;
            const vnodeChildren = instance.render && instance.render();
            let vnodeHostData;
            if (Build.hostData) {
                // user component provided a "hostData()" method
                // the returned data/attributes are used on the host element
                vnodeHostData = instance.hostData && instance.hostData();
            }
            // tell the platform we're done rendering
            // now any changes will again queue
            plt.activeRender = false;
            if (Build.hostTheme && hostMeta) {
                // component meta data has a "theme"
                // use this to automatically generate a good css class
                // from the mode and color to add to the host element
                vnodeHostData = Object.keys(hostMeta).reduce((hostData, key) => {
                    switch (key) {
                        case 'theme':
                            hostData['class'] = hostData['class'] || {};
                            hostData['class'] = Object.assign(hostData['class'], createThemedClasses(instance.mode, instance.color, hostMeta['theme']));
                    }
                    return hostData;
                }, vnodeHostData || {});
            }
            // looks like we've got child nodes to render into this host element
            // or we need to update the css class/attrs on the host element
            // if we haven't already created a vnode, then we give the renderer the actual element
            // if this is a re-render, then give the renderer the last vnode we already created
            const oldVNode = plt.vnodeMap.get(elm) || new VNode();
            oldVNode.elm = elm;
            // each patch always gets a new vnode
            // the host element itself isn't patched because it already exists
            // kick off the actual render and any DOM updates
            plt.vnodeMap.set(elm, plt.render(oldVNode, h(null, vnodeHostData, vnodeChildren), isUpdateRender, plt.defaultSlotsMap.get(elm), plt.namedSlotsMap.get(elm), cmpMeta.componentConstructor.encapsulation));
        }
        if (Build.styles) {
            // attach the styles this component needs, if any
            // this fn figures out if the styles should go in a
            // shadow root or if they should be global
            plt.attachStyles(plt, plt.domApi, cmpMeta, instance.mode, elm);
        }
        // it's official, this element has rendered
        elm.$rendered = true;
        if (elm.$onRender) {
            // ok, so turns out there are some child host elements
            // waiting on this parent element to load
            // let's fire off all update callbacks waiting
            elm.$onRender.forEach(cb => cb());
            elm.$onRender = null;
        }
    }
    catch (e) {
        plt.activeRender = false;
        plt.onError(e, 8 /* RenderError */, elm, true);
    }
}

function queueUpdate(plt, elm) {
    // only run patch if it isn't queued already
    if (!plt.isQueuedForUpdate.has(elm)) {
        plt.isQueuedForUpdate.set(elm, true);
        // run the patch in the next tick
        plt.queue.add(() => {
            // vdom diff and patch the host element for differences
            update(plt, elm);
        }, plt.isAppLoaded ? 1 /* Low */ : 3 /* High */);
    }
}
function update(plt, elm, isInitialLoad, instance, ancestorHostElement) {
    // no longer queued for update
    plt.isQueuedForUpdate.delete(elm);
    // everything is async, so somehow we could have already disconnected
    // this node, so be sure to do nothing if we've already disconnected
    if (!plt.isDisconnectedMap.has(elm)) {
        instance = plt.instanceMap.get(elm);
        isInitialLoad = !instance;
        let userPromise;
        if (isInitialLoad) {
            ancestorHostElement = plt.ancestorHostElementMap.get(elm);
            if (ancestorHostElement && !ancestorHostElement.$rendered) {
                // this is the intial load
                // this element has an ancestor host element
                // but the ancestor host element has NOT rendered yet
                // so let's just cool our jets and wait for the ancestor to render
                (ancestorHostElement.$onRender = ancestorHostElement.$onRender || []).push(() => {
                    // this will get fired off when the ancestor host element
                    // finally gets around to rendering its lazy self
                    update(plt, elm);
                });
                return;
            }
            // haven't created a component instance for this host element yet!
            // create the instance from the user's component class
            // https://www.youtube.com/watch?v=olLxrojmvMg
            instance = initComponentInstance(plt, elm);
            if (Build.cmpWillLoad) {
                // fire off the user's componentWillLoad method (if one was provided)
                // componentWillLoad only runs ONCE, after instance's element has been
                // assigned as the host element, but BEFORE render() has been called
                try {
                    if (instance.componentWillLoad) {
                        userPromise = instance.componentWillLoad();
                    }
                }
                catch (e) {
                    plt.onError(e, 3 /* WillLoadError */, elm);
                }
            }
        }
        else if (Build.cmpWillUpdate) {
            // already created an instance and this is an update
            // fire off the user's componentWillUpdate method (if one was provided)
            // componentWillUpdate runs BEFORE render() has been called
            // but only BEFORE an UPDATE and not before the intial render
            // get the returned promise (if one was provided)
            try {
                if (instance.componentWillUpdate) {
                    userPromise = instance.componentWillUpdate();
                }
            }
            catch (e) {
                plt.onError(e, 5 /* WillUpdateError */, elm);
            }
        }
        if (userPromise && userPromise.then) {
            // looks like the user return a promise!
            // let's not actually kick off the render
            // until the user has resolved their promise
            userPromise.then(() => renderUpdate(plt, elm, instance, isInitialLoad));
        }
        else {
            // user never returned a promise so there's
            // no need to wait on anything, let's do the render now my friend
            renderUpdate(plt, elm, instance, isInitialLoad);
        }
    }
}
function renderUpdate(plt, elm, instance, isInitialLoad) {
    // if this component has a render function, let's fire
    // it off and generate a vnode for this
    render(plt, plt.getComponentMeta(elm), elm, instance, !isInitialLoad);
    // _hasRendered was just set
    // _onRenderCallbacks were all just fired off
    try {
        if (isInitialLoad) {
            // so this was the initial load i guess
            elm.$initLoad();
            // componentDidLoad just fired off
        }
        else {
            if (Build.cmpDidUpdate) {
                // fire off the user's componentDidUpdate method (if one was provided)
                // componentDidUpdate runs AFTER render() has been called
                // but only AFTER an UPDATE and not after the intial render
                instance.componentDidUpdate && instance.componentDidUpdate();
            }
            callNodeRefs(plt.vnodeMap.get(elm));
        }
    }
    catch (e) {
        // derp
        plt.onError(e, 6 /* DidUpdateError */, elm, true);
    }
}

function connectedCallback(plt, cmpMeta, elm) {
    if (Build.listener) {
        // initialize our event listeners on the host element
        // we do this now so that we can listening to events that may
        // have fired even before the instance is ready
        if (!plt.hasListenersMap.has(elm)) {
            // it's possible we've already connected
            // then disconnected
            // and the same element is reconnected again
            plt.hasListenersMap.set(elm, true);
            initElementListeners(plt, elm);
        }
    }
    plt.isDisconnectedMap.delete(elm);
    if (!plt.hasConnectedMap.has(elm)) {
        // first time we've connected
        plt.hasConnectedMap.set(elm, true);
        // if somehow this node was reused, ensure we've removed this property
        // elm._hasDestroyed = null;
        // register this component as an actively
        // loading child to its parent component
        registerWithParentComponent(plt, elm);
        // add to the queue to load the bundle
        // it's important to have an async tick in here so we can
        // ensure the "mode" attribute has been added to the element
        // place in high priority since it's not much work and we need
        // to know as fast as possible, but still an async tick in between
        plt.queue.add(() => {
            // only collects slot references if this component even has slots
            plt.connectHostElement(cmpMeta, elm);
            // start loading this component mode's bundle
            // if it's already loaded then the callback will be synchronous
            plt.loadBundle(cmpMeta, elm.mode, () => 
            // we've fully loaded the component mode data
            // let's queue it up to be rendered next
            queueUpdate(plt, elm));
        }, 3 /* High */);
    }
}
function registerWithParentComponent(plt, elm, ancestorHostElement) {
    // find the first ancestor host element (if there is one) and register
    // this element as one of the actively loading child elements for its ancestor
    ancestorHostElement = elm;
    while (ancestorHostElement = plt.domApi.$parentElement(ancestorHostElement)) {
        // climb up the ancestors looking for the first registered component
        if (plt.isDefinedComponent(ancestorHostElement)) {
            // we found this elements the first ancestor host element
            // if the ancestor already loaded then do nothing, it's too late
            if (!plt.hasLoadedMap.has(elm)) {
                // keep a reference to this element's ancestor host element
                // elm._ancestorHostElement = ancestorHostElement;
                plt.ancestorHostElementMap.set(elm, ancestorHostElement);
                // ensure there is an array to contain a reference to each of the child elements
                // and set this element as one of the ancestor's child elements it should wait on
                (ancestorHostElement.$activeLoading = ancestorHostElement.$activeLoading || []).push(elm);
            }
            break;
        }
    }
}

function attributeChangedCallback(membersMeta, elm, attribName, oldVal, newVal, propName) {
    // only react if the attribute values actually changed
    if (oldVal !== newVal && membersMeta) {
        // normalize the attribute name w/ lower case
        attribName = toLowerCase(attribName);
        // using the known component meta data
        // look up to see if we have a property wired up to this attribute name
        for (propName in membersMeta) {
            if (membersMeta[propName].attribName === attribName) {
                // cool we've got a prop using this attribute name the value will
                // be a string, so let's convert it to the correct type the app wants
                // below code is ugly yes, but great minification ;)
                elm[propName] = parsePropertyValue(membersMeta[propName].propType, newVal);
                break;
            }
        }
    }
}

function disconnectedCallback(plt, elm, instance) {
    // only disconnect if we're not temporarily disconnected
    // tmpDisconnected will happen when slot nodes are being relocated
    if (!plt.tmpDisconnected && isDisconnected(plt.domApi, elm)) {
        // ok, let's officially destroy this thing
        // set this to true so that any of our pending async stuff
        // doesn't continue since we already decided to destroy this node
        // elm._hasDestroyed = true;
        plt.isDisconnectedMap.set(elm, true);
        // double check that we've informed the ancestor host elements
        // that they're good to go and loaded (cuz this one is on its way out)
        propagateComponentLoaded(plt, elm);
        // since we're disconnecting, call all of the JSX ref's with null
        callNodeRefs(plt.vnodeMap.get(elm), true);
        // detatch any event listeners that may have been added
        // because we're not passing an exact event name it'll
        // remove all of this element's event, which is good
        plt.domApi.$removeEventListener(elm);
        plt.hasListenersMap.delete(elm);
        if (Build.cmpDidUnload) {
            // call instance componentDidUnload
            // if we've created an instance for this
            instance = plt.instanceMap.get(elm);
            if (instance) {
                // call the user's componentDidUnload if there is one
                instance.componentDidUnload && instance.componentDidUnload();
            }
        }
    }
}
function isDisconnected(domApi, elm) {
    while (elm) {
        if (!domApi.$parentNode(elm)) {
            return domApi.$nodeType(elm) !== 9 /* DocumentNode */;
        }
        elm = domApi.$parentNode(elm);
    }
}

function proxyHostElementPrototype(plt, membersMeta, hostPrototype) {
    // create getters/setters on the host element prototype to represent the public API
    // the setters allows us to know when data has changed so we can re-render
    membersMeta && Object.keys(membersMeta).forEach(memberName => {
        // add getters/setters
        const memberType = membersMeta[memberName].memberType;
        if (memberType === 1 /* Prop */ || memberType === 2 /* PropMutable */) {
            // @Prop() or @Prop({ mutable: true })
            definePropertyGetterSetter(hostPrototype, memberName, function getHostElementProp() {
                // host element getter (cannot be arrow fn)
                // yup, ugly, srynotsry
                // but its creating _values if it doesn't already exist
                return (plt.valuesMap.get(this) || {})[memberName];
            }, function setHostElementProp(newValue) {
                // host element setter (cannot be arrow fn)
                setValue(plt, this, memberName, newValue);
            });
        }
        else if (memberType === 6 /* Method */) {
            // @Method()
            // add a placeholder noop value on the host element's prototype
            // incase this method gets called before setup
            definePropertyValue(hostPrototype, memberName, noop);
        }
    });
}

function initHostElement(plt, cmpMeta, HostElementConstructor, hydratedCssClass) {
    // let's wire up our functions to the host element's prototype
    // we can also inject our platform into each one that needs that api
    // note: these cannot be arrow functions cuz "this" is important here hombre
    HostElementConstructor.connectedCallback = function () {
        // coolsville, our host element has just hit the DOM
        connectedCallback(plt, cmpMeta, this);
    };
    if (Build.observeAttr) {
        HostElementConstructor.attributeChangedCallback = function (attribName, oldVal, newVal) {
            // the browser has just informed us that an attribute
            // on the host element has changed
            attributeChangedCallback(cmpMeta.membersMeta, this, attribName, oldVal, newVal);
        };
    }
    HostElementConstructor.disconnectedCallback = function () {
        // the element has left the builing
        disconnectedCallback(plt, this);
    };
    HostElementConstructor.componentOnReady = function (cb, promise) {
        if (!cb) {
            promise = new Promise(resolve => cb = resolve);
        }
        componentOnReady(plt, this, cb);
        return promise;
    };
    HostElementConstructor.$initLoad = function () {
        initComponentLoaded(plt, this, hydratedCssClass);
    };
    HostElementConstructor.forceUpdate = function () {
        queueUpdate(plt, this);
    };
    // add getters/setters to the host element members
    // these would come from the @Prop and @Method decorators that
    // should create the public API to this component
    proxyHostElementPrototype(plt, cmpMeta.membersMeta, HostElementConstructor);
}
function componentOnReady(plt, elm, cb, onReadyCallbacks) {
    if (!plt.isDisconnectedMap.has(elm)) {
        if (plt.hasLoadedMap.has(elm)) {
            cb(elm);
        }
        else {
            onReadyCallbacks = plt.onReadyCallbacksMap.get(elm) || [];
            onReadyCallbacks.push(cb);
            plt.onReadyCallbacksMap.set(elm, onReadyCallbacks);
        }
    }
}

function connectChildElements(config, plt, hydrateResults, parentElm) {
    if (parentElm && parentElm.children) {
        for (var i = 0; i < parentElm.children.length; i++) {
            connectElement(config, plt, hydrateResults, parentElm.children[i]);
            connectChildElements(config, plt, hydrateResults, parentElm.children[i]);
        }
    }
}
function connectElement(config, plt, hydrateResults, elm) {
    if (!plt.hasConnectedMap.has(elm)) {
        const tagName = elm.tagName.toLowerCase();
        const cmpMeta = plt.getComponentMeta(elm);
        if (cmpMeta) {
            connectHostElement(config, plt, hydrateResults, elm, cmpMeta);
        }
        else if (tagName === 'script') {
            connectScriptElement(hydrateResults, elm);
        }
        else if (tagName === 'link') {
            connectLinkElement(hydrateResults, elm);
        }
        else if (tagName === 'img') {
            connectImgElement(hydrateResults, elm);
        }
        plt.hasConnectedMap.set(elm, true);
    }
}
function connectHostElement(config, plt, hydrateResults, elm, cmpMeta) {
    if (!cmpMeta.componentConstructor) {
        plt.connectHostElement(cmpMeta, elm);
        plt.loadBundle(cmpMeta, elm.mode, noop);
    }
    if (cmpMeta.encapsulation !== 1 /* ShadowDom */) {
        initHostElement(plt, cmpMeta, elm, config.hydratedCssClass);
        connectedCallback(plt, cmpMeta, elm);
    }
    const depth = getNodeDepth(elm);
    const cmp = hydrateResults.components.find(c => c.tag === cmpMeta.tagNameMeta);
    if (cmp) {
        cmp.count++;
        if (depth > cmp.depth) {
            cmp.depth = depth;
        }
    }
    else {
        hydrateResults.components.push({
            tag: cmpMeta.tagNameMeta,
            count: 1,
            depth: depth
        });
    }
}
function connectScriptElement(hydrateResults, elm) {
    const src = elm.src;
    if (src && hydrateResults.scriptUrls.indexOf(src) === -1) {
        hydrateResults.scriptUrls.push(src);
    }
}
function connectLinkElement(hydrateResults, elm) {
    const href = elm.href;
    const rel = (elm.rel || '').toLowerCase();
    if (rel === 'stylesheet' && href && hydrateResults.styleUrls.indexOf(href) === -1) {
        hydrateResults.styleUrls.push(href);
    }
}
function connectImgElement(hydrateResults, elm) {
    const src = elm.src;
    if (src && hydrateResults.imgUrls.indexOf(src) === -1) {
        hydrateResults.imgUrls.push(src);
    }
}
function getNodeDepth(elm) {
    let depth = 0;
    while (elm.parentNode) {
        depth++;
        elm = elm.parentNode;
    }
    return depth;
}

function assignHostContentSlots(plt, domApi, elm, childNodes, childNode, slotName, defaultSlot, namedSlots, i) {
    // so let's loop through each of the childNodes to the host element
    // and pick out the ones that have a slot attribute
    // if it doesn't have a slot attribute, than it's a default slot
    if (!elm.$defaultHolder) {
        // create a comment to represent where the original
        // content was first placed, which is useful later on
        domApi.$insertBefore(elm, (elm.$defaultHolder = domApi.$createComment('')), childNodes[0]);
    }
    for (i = 0; i < childNodes.length; i++) {
        childNode = childNodes[i];
        if (domApi.$nodeType(childNode) === 1 /* ElementNode */ && ((slotName = domApi.$getAttribute(childNode, 'slot')) != null)) {
            // is element node
            // this element has a slot name attribute
            // so this element will end up getting relocated into
            // the component's named slot once it renders
            namedSlots = namedSlots || {};
            if (namedSlots[slotName]) {
                namedSlots[slotName].push(childNode);
            }
            else {
                namedSlots[slotName] = [childNode];
            }
        }
        else {
            // this is a text node
            // or it's an element node that doesn't have a slot attribute
            // let's add this node to our collection for the default slot
            if (defaultSlot) {
                defaultSlot.push(childNode);
            }
            else {
                defaultSlot = [childNode];
            }
        }
    }
    // keep a reference to all of the initial nodes
    // found as immediate childNodes to the host element
    // elm._hostContentNodes = {
    //   defaultSlot: defaultSlot,
    //   namedSlots: namedSlots
    // };
    plt.defaultSlotsMap.set(elm, defaultSlot);
    plt.namedSlotsMap.set(elm, namedSlots);
}

function createDomApi(App, win, doc) {
    // using the $ prefix so that closure is
    // cool with property renaming each of these
    if (!App.ael) {
        App.ael = (elm, eventName, cb, opts) => elm.addEventListener(eventName, cb, opts);
        App.rel = (elm, eventName, cb, opts) => elm.removeEventListener(eventName, cb, opts);
    }
    const unregisterListenerFns = new WeakMap();
    const domApi = {
        $documentElement: doc.documentElement,
        $head: doc.head,
        $body: doc.body,
        $supportsEventOptions: false,
        $nodeType: (node) => node.nodeType,
        $createElement: (tagName) => doc.createElement(tagName),
        $createElementNS: (namespace, tagName) => doc.createElementNS(namespace, tagName),
        $createTextNode: (text) => doc.createTextNode(text),
        $createComment: (data) => doc.createComment(data),
        $insertBefore: (parentNode, childNode, referenceNode) => parentNode.insertBefore(childNode, referenceNode),
        // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
        // and it's polyfilled in es5 builds
        $remove: (node) => node.remove(),
        $appendChild: (parentNode, childNode) => parentNode.appendChild(childNode),
        $childNodes: (node) => node.childNodes,
        $parentNode: (node) => node.parentNode,
        $nextSibling: (node) => node.nextSibling,
        $tagName: (elm) => toLowerCase(elm.tagName),
        $getTextContent: (node) => node.textContent,
        $setTextContent: (node, text) => node.textContent = text,
        $getAttribute: (elm, key) => elm.getAttribute(key),
        $setAttribute: (elm, key, val) => elm.setAttribute(key, val),
        $setAttributeNS: (elm, namespaceURI, qualifiedName, val) => elm.setAttributeNS(namespaceURI, qualifiedName, val),
        $removeAttribute: (elm, key) => elm.removeAttribute(key),
        $elementRef: (elm, referenceName) => {
            if (referenceName === 'child') {
                return elm.firstElementChild;
            }
            if (referenceName === 'parent') {
                return domApi.$parentElement(elm);
            }
            if (referenceName === 'body') {
                return domApi.$body;
            }
            if (referenceName === 'document') {
                return doc;
            }
            if (referenceName === 'window') {
                return win;
            }
            return elm;
        },
        $addEventListener: (assignerElm, eventName, listenerCallback, useCapture, usePassive, attachTo, eventListenerOpts, splt) => {
            // remember the original name before we possibly change it
            const assignersEventName = eventName;
            let attachToElm = assignerElm;
            // get the existing unregister listeners for
            // this element from the unregister listeners weakmap
            let assignersUnregListeners = unregisterListenerFns.get(assignerElm);
            if (assignersUnregListeners && assignersUnregListeners[assignersEventName]) {
                // removed any existing listeners for this event for the assigner element
                // this element already has this listener, so let's unregister it now
                assignersUnregListeners[assignersEventName]();
            }
            if (typeof attachTo === 'string') {
                // attachTo is a string, and is probably something like
                // "parent", "window", or "document"
                // and the eventName would be like "mouseover" or "mousemove"
                attachToElm = domApi.$elementRef(assignerElm, attachTo);
            }
            else if (typeof attachTo === 'object') {
                // we were passed in an actual element to attach to
                attachToElm = attachTo;
            }
            else {
                // depending on the event name, we could actually be attaching
                // this element to something like the document or window
                splt = eventName.split(':');
                if (splt.length > 1) {
                    // document:mousemove
                    // parent:touchend
                    // body:keyup.enter
                    attachToElm = domApi.$elementRef(assignerElm, splt[0]);
                    eventName = splt[1];
                }
            }
            if (!attachToElm) {
                // somehow we're referencing an element that doesn't exist
                // let's not continue
                return;
            }
            let eventListener = listenerCallback;
            // test to see if we're looking for an exact keycode
            splt = eventName.split('.');
            if (splt.length > 1) {
                // looks like this listener is also looking for a keycode
                // keyup.enter
                eventName = splt[0];
                eventListener = (ev) => {
                    // wrap the user's event listener with our own check to test
                    // if this keyboard event has the keycode they're looking for
                    if (ev.keyCode === KEY_CODE_MAP[splt[1]]) {
                        listenerCallback(ev);
                    }
                };
            }
            // create the actual event listener options to use
            // this browser may not support event options
            eventListenerOpts = domApi.$supportsEventOptions ? {
                capture: !!useCapture,
                passive: !!usePassive
            } : !!useCapture;
            // ok, good to go, let's add the actual listener to the dom element
            App.ael(attachToElm, eventName, eventListener, eventListenerOpts);
            if (!assignersUnregListeners) {
                // we don't already have a collection, let's create it
                unregisterListenerFns.set(assignerElm, assignersUnregListeners = {});
            }
            // add the unregister listener to this element's collection
            assignersUnregListeners[assignersEventName] = () => {
                // looks like it's time to say goodbye
                attachToElm && App.rel(attachToElm, eventName, eventListener, eventListenerOpts);
                assignersUnregListeners[assignersEventName] = null;
            };
        },
        $removeEventListener: (elm, eventName) => {
            // get the unregister listener functions for this element
            const assignersUnregListeners = unregisterListenerFns.get(elm);
            if (assignersUnregListeners) {
                // this element has unregister listeners
                if (eventName) {
                    // passed in one specific event name to remove
                    assignersUnregListeners[eventName] && assignersUnregListeners[eventName]();
                }
                else {
                    // remove all event listeners
                    Object.keys(assignersUnregListeners).forEach(assignersEventName => {
                        assignersUnregListeners[assignersEventName] && assignersUnregListeners[assignersEventName]();
                    });
                }
            }
        }
    };
    if (Build.shadowDom) {
        domApi.$attachShadow = (elm, shadowRootInit) => elm.attachShadow(shadowRootInit);
        domApi.$supportsShadowDom = !!domApi.$documentElement.attachShadow;
    }
    if (Build.es5) {
        if (typeof win.CustomEvent !== 'function') {
            // CustomEvent polyfill
            win.CustomEvent = (event, data, evt) => {
                evt = doc.createEvent('CustomEvent');
                evt.initCustomEvent(event, data.bubbles, data.cancelable, data.detail);
                return evt;
            };
            win.CustomEvent.prototype = win.Event.prototype;
        }
    }
    domApi.$dispatchEvent = (elm, eventName, data) => elm && elm.dispatchEvent(new win.CustomEvent(eventName, data));
    if (Build.event || Build.listener) {
        // test if this browser supports event options or not
        try {
            win.addEventListener('e', null, Object.defineProperty({}, 'passive', {
                get: () => domApi.$supportsEventOptions = true
            }));
        }
        catch (e) { }
    }
    domApi.$parentElement = (elm, parentNode) => {
        // if the parent node is a document fragment (shadow root)
        // then use the "host" property on it
        // otherwise use the parent node
        parentNode = domApi.$parentNode(elm);
        return (parentNode && domApi.$nodeType(parentNode) === 11 /* DocumentFragment */) ? parentNode.host : parentNode;
    };
    return domApi;
}

function createQueueServer() {
    const highCallbacks = [];
    const lowCallbacks = [];
    let queued = false;
    function flush(cb) {
        while (highCallbacks.length > 0) {
            highCallbacks.shift()();
        }
        while (lowCallbacks.length > 0) {
            lowCallbacks.shift()();
        }
        queued = (highCallbacks.length > 0) || (lowCallbacks.length > 0);
        if (queued) {
            process.nextTick(flush);
        }
        cb && cb();
    }
    function add(cb, priority) {
        if (priority === 3 /* High */) {
            highCallbacks.push(cb);
        }
        else {
            lowCallbacks.push(cb);
        }
        if (!queued) {
            queued = true;
            process.nextTick(flush);
        }
    }
    return {
        add: add,
        flush: flush
    };
}

function patchDomApi(plt, domApi) {
    const orgCreateElement = domApi.$createElement;
    domApi.$createElement = (tagName) => {
        const elm = orgCreateElement(tagName);
        const cmpMeta = plt.getComponentMeta(elm);
        if (cmpMeta && !cmpMeta.componentConstructor) {
            plt.connectHostElement(cmpMeta, elm);
            plt.loadBundle(cmpMeta, elm.mode, noop);
        }
        return elm;
    };
}

function proxyController(domApi, controllerComponents, ctrlTag) {
    return {
        'create': proxyProp(domApi, controllerComponents, ctrlTag, 'create'),
        'componentOnReady': proxyProp(domApi, controllerComponents, ctrlTag, 'componentOnReady')
    };
}
function proxyProp(domApi, controllerComponents, ctrlTag, proxyMethodName) {
    return function () {
        const args = arguments;
        return loadComponent(domApi, controllerComponents, ctrlTag)
            .then(ctrlElm => ctrlElm[proxyMethodName].apply(ctrlElm, args));
    };
}
function loadComponent(domApi, controllerComponents, ctrlTag) {
    return new Promise(resolve => {
        let ctrlElm = controllerComponents[ctrlTag];
        if (!ctrlElm) {
            ctrlElm = domApi.$body.querySelector(ctrlTag);
        }
        if (!ctrlElm) {
            ctrlElm = controllerComponents[ctrlTag] = domApi.$createElement(ctrlTag);
            domApi.$appendChild(domApi.$body, ctrlElm);
        }
        ctrlElm.componentOnReady(resolve);
    });
}

function createPlatformServer(config, win, doc, cmpRegistry, hydrateResults, isPrerender, compilerCtx) {
    const loadedBundles = {};
    const styles = [];
    const controllerComponents = {};
    // create the app global
    const App = {};
    const domApi = createDomApi(App, win, doc);
    // init build context
    compilerCtx = compilerCtx || {};
    // the root <html> element is always the top level registered component
    cmpRegistry = Object.assign({ 'html': {} }, cmpRegistry);
    // initialize Core global object
    const Context = {};
    Context.addListener = noop;
    Context.enableListener = noop;
    Context.emit = noop;
    Context.isClient = false;
    Context.isServer = true;
    Context.isPrerender = isPrerender;
    Context.window = win;
    Context.location = win.location;
    Context.document = doc;
    // add the Core global to the window context
    // Note: "Core" is not on the window context on the client-side
    win.Context = Context;
    // add the h() fn to the app's global namespace
    App.h = h;
    App.Context = Context;
    // add the app's global to the window context
    win[config.namespace] = App;
    const appWwwDir = config.wwwDir;
    const appBuildDir = getAppWWWBuildDir(config);
    Context.publicPath = appBuildDir;
    // create the sandboxed context with a new instance of a V8 Context
    // V8 Context provides an isolated global environment
    config.sys.vm.createContext(compilerCtx, appWwwDir, win);
    // execute the global scripts (if there are any)
    runGlobalScripts();
    // create the platform api which is used throughout common core code
    const plt = {
        attachStyles: noop,
        connectHostElement,
        defineComponent,
        domApi,
        emitEvent: noop,
        getComponentMeta,
        getContextItem,
        isDefinedComponent,
        loadBundle: loadComponent$$1,
        onError,
        propConnect,
        queue: createQueueServer(),
        tmpDisconnected: false,
        ancestorHostElementMap: new WeakMap(),
        componentAppliedStyles: new WeakMap(),
        defaultSlotsMap: new WeakMap(),
        hasConnectedMap: new WeakMap(),
        hasListenersMap: new WeakMap(),
        hasLoadedMap: new WeakMap(),
        hostElementMap: new WeakMap(),
        instanceMap: new WeakMap(),
        isDisconnectedMap: new WeakMap(),
        isQueuedForUpdate: new WeakMap(),
        namedSlotsMap: new WeakMap(),
        onReadyCallbacksMap: new WeakMap(),
        queuedEvents: new WeakMap(),
        vnodeMap: new WeakMap(),
        valuesMap: new WeakMap()
    };
    // patch dom api like createElement()
    patchDomApi(plt, domApi);
    // create the renderer which will be used to patch the vdom
    plt.render = createRendererPatch(plt, domApi);
    // setup the root node of all things
    // which is the mighty <html> tag
    const rootElm = domApi.$documentElement;
    rootElm.$rendered = true;
    rootElm.$activeLoading = [];
    rootElm.$initLoad = function appLoadedCallback() {
        plt.hasLoadedMap.set(rootElm, true);
        appLoaded();
    };
    function appLoaded(failureDiagnostic) {
        if (plt.hasLoadedMap.has(rootElm) || failureDiagnostic) {
            // the root node has loaded
            // and there are no css files still loading
            plt.onAppLoad && plt.onAppLoad(rootElm, styles, failureDiagnostic);
        }
    }
    function connectHostElement(_cmpMeta, elm) {
        // set the "mode" property
        if (!elm.mode) {
            // looks like mode wasn't set as a property directly yet
            // first check if there's an attribute
            // next check the app's global
            elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode;
        }
        // pick out all of the light dom nodes from the host element
        assignHostContentSlots(plt, domApi, elm, elm.childNodes);
    }
    function getComponentMeta(elm) {
        // registry tags are always lower-case
        return cmpRegistry[elm.tagName.toLowerCase()];
    }
    function defineComponent(cmpMeta) {
        // default mode and color props
        cmpRegistry[cmpMeta.tagNameMeta] = cmpMeta;
    }
    /**
     * Execute a bundle queue item
     * @param name
     * @param deps
     * @param callback
     */
    function execBundleCallback(name, deps, callback) {
        const bundleExports = {};
        try {
            callback(bundleExports, ...deps.map(d => loadedBundles[d]));
        }
        catch (e) {
            onError(e, 1 /* LoadBundleError */, null, true);
        }
        // If name is undefined then this callback was fired by component callback
        if (name === undefined) {
            return;
        }
        loadedBundles[name] = bundleExports;
        // If name contains chunk then this callback was associated with a dependent bundle loading
        // let's add a reference to the constructors on each components metadata
        // each key in moduleImports is a PascalCased tag name
        if (!name.startsWith('./chunk')) {
            Object.keys(bundleExports).forEach(pascalCasedTagName => {
                const cmpMeta = cmpRegistry[toDashCase(pascalCasedTagName)];
                if (cmpMeta) {
                    // connect the component's constructor to its metadata
                    const componentConstructor = bundleExports[pascalCasedTagName];
                    if (!cmpMeta.componentConstructor) {
                        // init component constructor
                        cmpMeta.componentConstructor = componentConstructor;
                        cmpMeta.membersMeta = {
                            'color': {}
                        };
                        if (cmpMeta.componentConstructor.properties) {
                            Object.keys(cmpMeta.componentConstructor.properties).forEach(memberName => {
                                const constructorProperty = cmpMeta.componentConstructor.properties[memberName];
                                if (constructorProperty.type) {
                                    cmpMeta.membersMeta[memberName] = {
                                        propType: 1 /* Any */
                                    };
                                }
                            });
                        }
                    }
                    if (componentConstructor.style) {
                        styles.push(componentConstructor.style);
                    }
                }
            });
        }
    }
    /**
     * This function is called anytime a JS file is loaded
     */
    App.loadBundle = function loadBundle(bundleId, [, ...dependentsList], importer) {
        const missingDependents = dependentsList.filter(d => !loadedBundles[d]);
        missingDependents.forEach(d => {
            const fileName = d.replace('.js', '.es5.js');
            loadFile(fileName);
        });
        execBundleCallback(bundleId, dependentsList, importer);
    };
    function isDefinedComponent(elm) {
        return !!(cmpRegistry[elm.tagName.toLowerCase()]);
    }
    plt.attachStyles = function attachStyles(_domApi, _cmpMeta, _modeName, _elm) { };
    // This is executed by the component's connected callback.
    function loadComponent$$1(cmpMeta, modeName, cb, bundleId) {
        bundleId = (typeof cmpMeta.bundleIds === 'string') ?
            cmpMeta.bundleIds :
            cmpMeta.bundleIds[modeName];
        // It is possible the data was loaded from an outside source like tests
        if (cmpRegistry[cmpMeta.tagNameMeta].componentConstructor) {
            cb();
        }
        else if (loadedBundles[bundleId]) {
            // sweet, we've already loaded this bundle
            cb();
        }
        else {
            const fileName = getComponentBundleFilename(cmpMeta, modeName);
            loadFile(fileName);
        }
    }
    function loadFile(fileName) {
        const jsFilePath = config.sys.path.join(appBuildDir, fileName);
        const jsCode = compilerCtx.fs.readFileSync(jsFilePath);
        config.sys.vm.runInContext(jsCode, win);
    }
    function runGlobalScripts() {
        if (!compilerCtx || !compilerCtx.appFiles || !compilerCtx.appFiles.global) {
            return;
        }
        config.sys.vm.runInContext(compilerCtx.appFiles.global, win);
    }
    function onError(err, type, elm, appFailure) {
        const d = {
            type: 'runtime',
            header: 'Runtime error detected',
            level: 'error',
            messageText: err ? err.message ? err.message : err.toString() : ''
        };
        if (err && err.stack) {
            d.messageText += '\n' + err.stack;
            d.messageText = d.messageText.trim();
        }
        switch (type) {
            case 1 /* LoadBundleError */:
                d.header += ' while loading bundle';
                break;
            case 2 /* QueueEventsError */:
                d.header += ' while running initial events';
                break;
            case 3 /* WillLoadError */:
                d.header += ' during componentWillLoad()';
                break;
            case 4 /* DidLoadError */:
                d.header += ' during componentDidLoad()';
                break;
            case 7 /* InitInstanceError */:
                d.header += ' while initializing instance';
                break;
            case 8 /* RenderError */:
                d.header += ' while rendering';
                break;
            case 6 /* DidUpdateError */:
                d.header += ' while updating';
                break;
        }
        if (elm && elm.tagName) {
            d.header += ': ' + elm.tagName.toLowerCase();
        }
        hydrateResults.diagnostics.push(d);
        if (appFailure) {
            appLoaded(d);
        }
    }
    function propConnect(ctrlTag) {
        return proxyController(domApi, controllerComponents, ctrlTag);
    }
    function getContextItem(contextKey) {
        return Context[contextKey];
    }
    return plt;
}
function getComponentBundleFilename(cmpMeta, modeName) {
    let bundleId = (typeof cmpMeta.bundleIds === 'string') ?
        cmpMeta.bundleIds :
        (cmpMeta.bundleIds[modeName] || cmpMeta.bundleIds[DEFAULT_STYLE_MODE]);
    if (cmpMeta.encapsulation === 2 /* ScopedCss */ || cmpMeta.encapsulation === 1 /* ShadowDom */) {
        bundleId += '.sc';
    }
    // server-side always uses es5 and jsonp callback modules
    bundleId += '.es5.js';
    return bundleId;
}

function normalizePrerenderLocation(config, windowLocationHref, href) {
    const prerenderConfig = config && config.prerender;
    let prerenderLocation = null;
    try {
        if (typeof href !== 'string') {
            return null;
        }
        // remove any quotes that somehow got in the href
        href = href.replace(/\'|\"/g, '');
        // parse the <a href> passed in
        const hrefParseUrl = config.sys.url.parse(href);
        // don't bother for basically empty <a> tags
        if (!hrefParseUrl.pathname) {
            return null;
        }
        // parse the window.location
        const windowLocationUrl = config.sys.url.parse(windowLocationHref);
        // urls must be on the same host
        // but only check they're the same host when the href has a host
        if (hrefParseUrl.hostname && hrefParseUrl.hostname !== windowLocationUrl.hostname) {
            return null;
        }
        // convert it back to a nice in pretty path
        prerenderLocation = {
            url: config.sys.url.resolve(windowLocationHref, href)
        };
        const normalizedUrl = config.sys.url.parse(prerenderLocation.url);
        normalizedUrl.hash = null;
        if (!prerenderConfig || !prerenderConfig.includePathQuery) {
            normalizedUrl.search = null;
        }
        prerenderLocation.url = config.sys.url.format(normalizedUrl);
        prerenderLocation.path = config.sys.url.parse(prerenderLocation.url).path;
        if (hrefParseUrl.hash && prerenderConfig && prerenderConfig.includePathHash) {
            prerenderLocation.url += hrefParseUrl.hash;
            prerenderLocation.path += hrefParseUrl.hash;
        }
    }
    catch (e) {
        config.logger.error(`normalizePrerenderLocation`, e);
        return null;
    }
    return prerenderLocation;
}

var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function assetVersioning(config, compilerCtx, windowLocationHref, doc) {
    return Promise.all([
        versionElementAssets(config, compilerCtx, windowLocationHref, doc)
    ]);
}
function versionElementAssets(config, compilerCtx, windowLocationHref, doc) {
    return __awaiter$3(this, void 0, void 0, function* () {
        if (!config.assetVersioning.versionHtml) {
            return;
        }
        yield Promise.all([
            versionElementTypeAssets(config, compilerCtx, windowLocationHref, doc, 'img[src]', 'src'),
            versionElementTypeAssets(config, compilerCtx, windowLocationHref, doc, 'link[rel="apple-touch-icon"][href]', 'href'),
            versionElementTypeAssets(config, compilerCtx, windowLocationHref, doc, 'link[rel="icon"][href]', 'href'),
            versionElementTypeAssets(config, compilerCtx, windowLocationHref, doc, 'link[rel="manifest"][href]', 'href'),
            versionElementTypeAssets(config, compilerCtx, windowLocationHref, doc, 'link[rel="stylesheet"][href]', 'href'),
            versionElementTypeAssets(config, compilerCtx, windowLocationHref, doc, 'script[src]', 'src'),
        ]);
    });
}
function versionElementTypeAssets(config, compilerCtx, windowLocationHref, doc, selector, attrName) {
    return __awaiter$3(this, void 0, void 0, function* () {
        const elements = doc.querySelectorAll(selector);
        const promises = [];
        for (let i = 0; i < elements.length; i++) {
            promises.push(versionElementTypeAsset(config, compilerCtx, windowLocationHref, elements[i], attrName));
        }
        return Promise.all(promises);
    });
}
function versionElementTypeAsset(config, compilerCtx, windowLocationHref, elm, attrName) {
    return __awaiter$3(this, void 0, void 0, function* () {
        const url = elm.getAttribute(attrName);
        const versionedUrl = yield versionAsset(config, compilerCtx, windowLocationHref, url);
        if (versionedUrl) {
            elm.setAttribute(attrName, versionedUrl);
        }
    });
}
function versionAsset(config, compilerCtx, windowLocationHref, url) {
    return __awaiter$3(this, void 0, void 0, function* () {
        try {
            const orgFilePath = getFilePathFromUrl(config, windowLocationHref, url);
            if (!orgFilePath) {
                return null;
            }
            if (hasFileExtension(orgFilePath, TXT_EXT$1)) {
                const content = yield compilerCtx.fs.readFile(orgFilePath);
                const hash = config.sys.generateContentHash(content, config.hashedFileNameLength);
                const dirName = config.sys.path.dirname(orgFilePath);
                const fileName = config.sys.path.basename(orgFilePath);
                const hashedFileName = createHashedFileName(fileName, hash);
                const hashedFilePath = config.sys.path.join(dirName, hashedFileName);
                yield compilerCtx.fs.writeFile(hashedFilePath, content);
                yield compilerCtx.fs.remove(orgFilePath);
                return hashedFileName;
            }
        }
        catch (e) { }
        return null;
    });
}
function getFilePathFromUrl(config, windowLocationHref, url) {
    if (typeof url !== 'string' || url.trim() === '') {
        return null;
    }
    const location = normalizePrerenderLocation(config, windowLocationHref, url);
    if (!location) {
        return null;
    }
    return config.sys.path.join(config.wwwDir, location.path);
}
function createHashedFileName(fileName, hash) {
    const parts = fileName.split('.');
    parts.splice(parts.length - 1, 0, hash);
    return parts.join('.');
}
const TXT_EXT$1 = ['js', 'css', 'svg', 'json'];

function collapseHtmlWhitepace(node) {
    // this isn't about reducing HTML filesize (cuz it doesn't really matter after gzip)
    // this is more about having many less nodes for the client side to
    // have to climb through while it's creating vnodes from this HTML
    if (WHITESPACE_SENSITIVE_TAGS.indexOf(node.tagName) > -1) {
        return;
    }
    var lastWhitespaceTextNode = null;
    for (var i = node.childNodes.length - 1; i >= 0; i--) {
        var childNode = node.childNodes[i];
        if (childNode.nodeType === 3 /* TextNode */ || childNode.nodeType === 8 /* CommentNode */) {
            childNode.nodeValue = childNode.nodeValue.replace(REDUCE_WHITESPACE_REGEX, ' ');
            if (childNode.nodeValue === ' ') {
                if (lastWhitespaceTextNode === null) {
                    childNode.nodeValue = ' ';
                    lastWhitespaceTextNode = childNode;
                }
                else {
                    childNode.parentNode.removeChild(childNode);
                }
                continue;
            }
        }
        else if (childNode.childNodes) {
            collapseHtmlWhitepace(childNode);
        }
        lastWhitespaceTextNode = null;
    }
}
const REDUCE_WHITESPACE_REGEX = /\s\s+/g;
const WHITESPACE_SENSITIVE_TAGS = ['PRE', 'SCRIPT', 'STYLE', 'TEXTAREA'];

function formatFileName(rootDir, fileName) {
    if (!rootDir || !fileName)
        return '';
    fileName = fileName.replace(rootDir, '');
    if (/\/|\\/.test(fileName.charAt(0))) {
        fileName = fileName.substr(1);
    }
    if (fileName.length > 80) {
        fileName = '...' + fileName.substr(fileName.length - 80);
    }
    return fileName;
}
function formatHeader(type, fileName, rootDir, startLineNumber = null, endLineNumber = null) {
    let header = `${type}: ${formatFileName(rootDir, fileName)}`;
    if (startLineNumber !== null && startLineNumber > 0) {
        if (endLineNumber !== null && endLineNumber > startLineNumber) {
            header += `, lines: ${startLineNumber} - ${endLineNumber}`;
        }
        else {
            header += `, line: ${startLineNumber}`;
        }
    }
    return header;
}

// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
const commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
function parseCss(config, css, filePath) {
    /**
     * Positional.
     */
    var lineno = 1;
    var column = 1;
    var srcLines;
    /**
     * Update lineno and column based on `str`.
     */
    function updatePosition(str) {
        const lines = str.match(/\n/g);
        if (lines)
            lineno += lines.length;
        const i = str.lastIndexOf('\n');
        column = ~i ? str.length - i : column + str.length;
    }
    /**
     * Mark position and patch `node.position`.
     */
    function position() {
        const start = { line: lineno, column: column };
        return function (node) {
            node.position = new ParsePosition(start);
            whitespace();
            return node;
        };
    }
    /**
     * Store position information for a node
     */
    class ParsePosition {
        constructor(start) {
            this.start = start;
            this.end = { line: lineno, column: column };
            this.source = filePath;
        }
    }
    /**
     * Non-enumerable source string
     */
    ParsePosition.prototype.content = css;
    /**
     * Error `msg`.
     */
    const diagnostics = [];
    function error(msg) {
        if (!srcLines) {
            srcLines = css.split('\n');
        }
        const d = {
            level: 'error',
            type: 'css',
            language: 'css',
            header: 'CSS Parse',
            messageText: msg,
            absFilePath: filePath,
            lines: [{
                    lineIndex: lineno - 1,
                    lineNumber: lineno,
                    errorCharStart: column,
                    text: css[lineno - 1],
                }]
        };
        d.header = formatHeader('CSS', filePath, config.rootDir, lineno);
        if (lineno > 1) {
            const previousLine = {
                lineIndex: lineno - 1,
                lineNumber: lineno - 1,
                text: css[lineno - 2],
                errorCharStart: -1,
                errorLength: -1
            };
            d.lines.unshift(previousLine);
        }
        if (lineno + 2 < srcLines.length) {
            const nextLine = {
                lineIndex: lineno,
                lineNumber: lineno + 1,
                text: srcLines[lineno],
                errorCharStart: -1,
                errorLength: -1
            };
            d.lines.push(nextLine);
        }
        diagnostics.push(d);
    }
    /**
     * Parse stylesheet.
     */
    function stylesheet() {
        const rulesList = rules();
        return {
            type: 'stylesheet',
            stylesheet: {
                source: filePath,
                rules: rulesList,
                diagnostics: diagnostics
            }
        };
    }
    /**
     * Opening brace.
     */
    function open() {
        return match(/^{\s*/);
    }
    /**
     * Closing brace.
     */
    function close() {
        return match(/^}/);
    }
    /**
     * Parse ruleset.
     */
    function rules() {
        var node;
        const rules = [];
        whitespace();
        comments(rules);
        while (css.length && css.charAt(0) !== '}' && (node = atrule() || rule())) {
            if (node !== false) {
                rules.push(node);
                comments(rules);
            }
        }
        return rules;
    }
    /**
     * Match `re` and return captures.
     */
    function match(re) {
        const m = re.exec(css);
        if (!m)
            return;
        const str = m[0];
        updatePosition(str);
        css = css.slice(str.length);
        return m;
    }
    /**
     * Parse whitespace.
     */
    function whitespace() {
        match(/^\s*/);
    }
    /**
     * Parse comments;
     */
    function comments(rules) {
        var c;
        rules = rules || [];
        while (c = comment()) {
            if (c !== false) {
                rules.push(c);
            }
        }
        return rules;
    }
    /**
     * Parse comment.
     */
    function comment() {
        const pos = position();
        if ('/' !== css.charAt(0) || '*' !== css.charAt(1))
            return;
        var i = 2;
        while ('' !== css.charAt(i) && ('*' !== css.charAt(i) || '/' !== css.charAt(i + 1)))
            ++i;
        i += 2;
        if ('' === css.charAt(i - 1)) {
            return error('End of comment missing');
        }
        const str = css.slice(2, i - 2);
        column += 2;
        updatePosition(str);
        css = css.slice(i);
        column += 2;
        return pos({
            type: 'comment',
            comment: str
        });
    }
    /**
     * Parse selector.
     */
    function selector() {
        const m = match(/^([^{]+)/);
        if (!m)
            return;
        /* @fix Remove all comments from selectors
         * http://ostermiller.org/findcomment.html */
        return trim(m[0])
            .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '')
            .replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function (m) {
            return m.replace(/,/g, '\u200C');
        })
            .split(/\s*(?![^(]*\)),\s*/)
            .map(function (s) {
            return s.replace(/\u200C/g, ',');
        });
    }
    /**
     * Parse declaration.
     */
    function declaration() {
        const pos = position();
        // prop
        var prop = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
        if (!prop)
            return;
        prop = trim(prop[0]);
        // :
        if (!match(/^:\s*/))
            return error(`property missing ':'`);
        // val
        const val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);
        const ret = pos({
            type: 'declaration',
            property: prop.replace(commentre, ''),
            value: val ? trim(val[0]).replace(commentre, '') : ''
        });
        // ;
        match(/^[;\s]*/);
        return ret;
    }
    /**
     * Parse declarations.
     */
    function declarations() {
        const decls = [];
        if (!open())
            return error(`missing '{'`);
        comments(decls);
        // declarations
        var decl;
        while (decl = declaration()) {
            if (decl !== false) {
                decls.push(decl);
                comments(decls);
            }
        }
        if (!close())
            return error(`missing '}'`);
        return decls;
    }
    /**
     * Parse keyframe.
     */
    function keyframe() {
        var m;
        const vals = [];
        const pos = position();
        while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
            vals.push(m[1]);
            match(/^,\s*/);
        }
        if (!vals.length)
            return;
        return pos({
            type: 'keyframe',
            values: vals,
            declarations: declarations()
        });
    }
    /**
     * Parse keyframes.
     */
    function atkeyframes() {
        const pos = position();
        var m = match(/^@([-\w]+)?keyframes\s*/);
        if (!m)
            return;
        const vendor = m[1];
        // identifier
        m = match(/^([-\w]+)\s*/);
        if (!m)
            return error(`@keyframes missing name`);
        const name = m[1];
        if (!open())
            return error(`@keyframes missing '{'`);
        var frame;
        var frames = comments();
        while (frame = keyframe()) {
            frames.push(frame);
            frames = frames.concat(comments());
        }
        if (!close())
            return error(`@keyframes missing '}'`);
        return pos({
            type: 'keyframes',
            name: name,
            vendor: vendor,
            keyframes: frames
        });
    }
    /**
     * Parse supports.
     */
    function atsupports() {
        const pos = position();
        const m = match(/^@supports *([^{]+)/);
        if (!m)
            return;
        const supports = trim(m[1]);
        if (!open())
            return error(`@supports missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@supports missing '}'`);
        return pos({
            type: 'supports',
            supports: supports,
            rules: style
        });
    }
    /**
     * Parse host.
     */
    function athost() {
        const pos = position();
        const m = match(/^@host\s*/);
        if (!m)
            return;
        if (!open())
            return error(`@host missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@host missing '}'`);
        return pos({
            type: 'host',
            rules: style
        });
    }
    /**
     * Parse media.
     */
    function atmedia() {
        const pos = position();
        const m = match(/^@media *([^{]+)/);
        if (!m)
            return;
        const media = trim(m[1]);
        if (!open())
            return error(`@media missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@media missing '}'`);
        return pos({
            type: 'media',
            media: media,
            rules: style
        });
    }
    /**
     * Parse custom-media.
     */
    function atcustommedia() {
        const pos = position();
        const m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
        if (!m)
            return;
        return pos({
            type: 'custom-media',
            name: trim(m[1]),
            media: trim(m[2])
        });
    }
    /**
     * Parse paged media.
     */
    function atpage() {
        const pos = position();
        const m = match(/^@page */);
        if (!m)
            return;
        const sel = selector() || [];
        if (!open())
            return error(`@page missing '{'`);
        var decls = comments();
        // declarations
        var decl;
        while (decl = declaration()) {
            decls.push(decl);
            decls = decls.concat(comments());
        }
        if (!close())
            return error(`@page missing '}'`);
        return pos({
            type: 'page',
            selectors: sel,
            declarations: decls
        });
    }
    /**
     * Parse document.
     */
    function atdocument() {
        const pos = position();
        const m = match(/^@([-\w]+)?document *([^{]+)/);
        if (!m)
            return;
        const vendor = trim(m[1]);
        const doc = trim(m[2]);
        if (!open())
            return error(`@document missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@document missing '}'`);
        return pos({
            type: 'document',
            document: doc,
            vendor: vendor,
            rules: style
        });
    }
    /**
     * Parse font-face.
     */
    function atfontface() {
        const pos = position();
        const m = match(/^@font-face\s*/);
        if (!m)
            return;
        if (!open())
            return error(`@font-face missing '{'`);
        var decls = comments();
        // declarations
        var decl;
        while (decl = declaration()) {
            decls.push(decl);
            decls = decls.concat(comments());
        }
        if (!close())
            return error(`@font-face missing '}'`);
        return pos({
            type: 'font-face',
            declarations: decls
        });
    }
    /**
     * Parse import
     */
    const atimport = _compileAtrule('import');
    /**
     * Parse charset
     */
    const atcharset = _compileAtrule('charset');
    /**
     * Parse namespace
     */
    const atnamespace = _compileAtrule('namespace');
    /**
     * Parse non-block at-rules
     */
    function _compileAtrule(name) {
        const re = new RegExp('^@' + name + '\\s*([^;]+);');
        return function () {
            const pos = position();
            const m = match(re);
            if (!m)
                return;
            const ret = { type: name };
            ret[name] = m[1].trim();
            return pos(ret);
        };
    }
    /**
     * Parse at rule.
     */
    function atrule() {
        if (css[0] !== '@')
            return;
        return atkeyframes()
            || atmedia()
            || atcustommedia()
            || atsupports()
            || atimport()
            || atcharset()
            || atnamespace()
            || atdocument()
            || atpage()
            || athost()
            || atfontface();
    }
    /**
     * Parse rule.
     */
    function rule() {
        const pos = position();
        const sel = selector();
        if (!sel)
            return error('selector missing');
        comments();
        return pos({
            type: 'rule',
            selectors: sel,
            declarations: declarations()
        });
    }
    return addParent(stylesheet());
}
/**
 * Trim `str`.
 */
function trim(str) {
    return str ? str.trim() : '';
}
/**
 * Adds non-enumerable parent node reference to each node.
 */
function addParent(obj, parent) {
    const isNode = obj && typeof obj.type === 'string';
    const childParent = isNode ? obj : parent;
    for (const k in obj) {
        const value = obj[k];
        if (Array.isArray(value)) {
            value.forEach(function (v) { addParent(v, childParent); });
        }
        else if (value && typeof value === 'object') {
            addParent(value, childParent);
        }
    }
    if (isNode) {
        Object.defineProperty(obj, 'parent', {
            configurable: true,
            writable: true,
            enumerable: false,
            value: parent || null
        });
    }
    return obj;
}

function getSelectors(sel) {
    // reusing global SELECTORS since this is a synchronous operation
    SELECTORS.all.length = SELECTORS.tags.length = SELECTORS.classNames.length = SELECTORS.ids.length = SELECTORS.attrs.length = 0;
    sel = sel.replace(/\./g, ' .')
        .replace(/\#/g, ' #')
        .replace(/\[/g, ' [')
        .replace(/\>/g, ' > ')
        .replace(/\+/g, ' + ')
        .replace(/\~/g, ' ~ ')
        .replace(/\*/g, ' * ')
        .replace(/\:not\((.*?)\)/g, ' ');
    const items = sel.split(' ');
    for (var i = 0; i < items.length; i++) {
        items[i] = items[i].split(':')[0];
        if (items[i].length === 0)
            continue;
        if (items[i].charAt(0) === '.') {
            SELECTORS.classNames.push(items[i].substr(1));
        }
        else if (items[i].charAt(0) === '#') {
            SELECTORS.ids.push(items[i].substr(1));
        }
        else if (items[i].charAt(0) === '[') {
            items[i] = items[i].substr(1).split('=')[0].split(']')[0].trim();
            SELECTORS.attrs.push(items[i].toLowerCase());
        }
        else if (/[a-z]/g.test(items[i].charAt(0))) {
            SELECTORS.tags.push(items[i].toLowerCase());
        }
    }
    SELECTORS.classNames = SELECTORS.classNames.sort((a, b) => {
        if (a.length < b.length)
            return -1;
        if (a.length > b.length)
            return 1;
        return 0;
    });
    return SELECTORS;
}
const SELECTORS = {
    all: [],
    tags: [],
    classNames: [],
    ids: [],
    attrs: []
};

/**
 * CSS stringify adopted from rework/css by
 * TJ Holowaychuk (@tj)
 * Licensed under the MIT License
 * https://github.com/reworkcss/css/blob/master/LICENSE
 */
class StringifyCss {
    constructor(opts) {
        this.usedSelectors = opts.usedSelectors;
    }
    /**
     * Visit `node`.
     */
    visit(node) {
        return this[node.type](node);
    }
    /**
     * Map visit over array of `nodes`, optionally using a `delim`
     */
    mapVisit(nodes, delim) {
        var buf = '';
        delim = delim || '';
        for (var i = 0, length = nodes.length; i < length; i++) {
            buf += this.visit(nodes[i]);
            if (delim && i < length - 1)
                buf += delim;
        }
        return buf;
    }
    /**
     * Compile `node`.
     */
    compile(node) {
        return node.stylesheet
            .rules.map(this.visit, this)
            .join('');
    }
    comment() {
        return '';
    }
    /**
     * Visit import node.
     */
    import(node) {
        return '@import ' + node.import + ';';
    }
    /**
     * Visit media node.
     */
    media(node) {
        const mediaCss = this.mapVisit(node.rules);
        if (mediaCss === '') {
            return '';
        }
        return '@media ' + node.media + '{' + this.mapVisit(node.rules) + '}';
    }
    /**
     * Visit document node.
     */
    document(node) {
        const documentCss = this.mapVisit(node.rules);
        if (documentCss === '') {
            return '';
        }
        const doc = '@' + (node.vendor || '') + 'document ' + node.document;
        return doc + '{' + documentCss + '}';
    }
    /**
     * Visit charset node.
     */
    charset(node) {
        return '@charset ' + node.charset + ';';
    }
    /**
     * Visit namespace node.
     */
    namespace(node) {
        return '@namespace ' + node.namespace + ';';
    }
    /**
     * Visit supports node.
     */
    supports(node) {
        const supportsCss = this.mapVisit(node.rules);
        if (supportsCss === '') {
            return '';
        }
        return '@supports ' + node.supports + '{' + supportsCss + '}';
    }
    /**
     * Visit keyframes node.
     */
    keyframes(node) {
        const keyframesCss = this.mapVisit(node.keyframes);
        if (keyframesCss === '') {
            return '';
        }
        return '@' + (node.vendor || '') + 'keyframes ' + node.name + '{' + keyframesCss + '}';
    }
    /**
     * Visit keyframe node.
     */
    keyframe(node) {
        const decls = node.declarations;
        return node.values.join(',') + '{' + this.mapVisit(decls) + '}';
    }
    /**
     * Visit page node.
     */
    page(node) {
        const sel = node.selectors.length
            ? node.selectors.join(', ')
            : '';
        return '@page ' + sel + '{' + this.mapVisit(node.declarations) + '}';
    }
    /**
     * Visit font-face node.
     */
    ['font-face'](node) {
        const fontCss = this.mapVisit(node.declarations);
        if (fontCss === '') {
            return '';
        }
        return '@font-face{' + fontCss + '}';
    }
    /**
     * Visit host node.
     */
    host(node) {
        return '@host{' + this.mapVisit(node.rules) + '}';
    }
    /**
     * Visit custom-media node.
     */
    ['custom-media'](node) {
        return '@custom-media ' + node.name + ' ' + node.media + ';';
    }
    /**
     * Visit rule node.
     */
    rule(node) {
        const decls = node.declarations;
        if (!decls.length)
            return '';
        var i, j;
        for (i = node.selectors.length - 1; i >= 0; i--) {
            const sel = getSelectors(node.selectors[i]);
            if (this.usedSelectors) {
                var include = true;
                // classes
                var jlen = sel.classNames.length;
                if (jlen > 0) {
                    for (j = 0; j < jlen; j++) {
                        if (this.usedSelectors.classNames.indexOf(sel.classNames[j]) === -1) {
                            include = false;
                            break;
                        }
                    }
                }
                // tags
                if (include) {
                    jlen = sel.tags.length;
                    if (jlen > 0) {
                        for (j = 0; j < jlen; j++) {
                            if (this.usedSelectors.tags.indexOf(sel.tags[j]) === -1) {
                                include = false;
                                break;
                            }
                        }
                    }
                }
                // attrs
                if (include) {
                    jlen = sel.attrs.length;
                    if (jlen > 0) {
                        for (j = 0; j < jlen; j++) {
                            if (this.usedSelectors.attrs.indexOf(sel.attrs[j]) === -1) {
                                include = false;
                                break;
                            }
                        }
                    }
                }
                // ids
                if (include) {
                    jlen = sel.ids.length;
                    if (jlen > 0) {
                        for (j = 0; j < jlen; j++) {
                            if (this.usedSelectors.ids.indexOf(sel.ids[j]) === -1) {
                                include = false;
                                break;
                            }
                        }
                    }
                }
                if (!include) {
                    node.selectors.splice(i, 1);
                }
            }
        }
        if (node.selectors.length === 0)
            return '';
        return `${node.selectors}{${this.mapVisit(decls)}}`;
    }
    /**
     * Visit declaration node.
     */
    declaration(node) {
        return node.property + ':' + node.value + ';';
    }
}

function removeUnusedStyles(config, usedSelectors, cssContent, diagnostics) {
    let cleanedCss = cssContent;
    try {
        // parse the css from being applied to the document
        const cssAst = parseCss(config, cssContent);
        if (cssAst.stylesheet.diagnostics.length) {
            cssAst.stylesheet.diagnostics.forEach(d => {
                diagnostics.push(d);
            });
            return cleanedCss;
        }
        try {
            // convert the parsed css back into a string
            // but only keeping what was found in our active selectors
            const stringify = new StringifyCss({ usedSelectors });
            cleanedCss = stringify.compile(cssAst);
        }
        catch (e) {
            diagnostics.push({
                level: 'error',
                type: 'css',
                header: 'CSS Stringify',
                messageText: e
            });
        }
    }
    catch (e) {
        diagnostics.push({
            level: 'error',
            type: 'css',
            header: 'CSS Parse',
            messageText: e
        });
    }
    return cleanedCss;
}

class UsedSelectors {
    constructor(elm) {
        this.tags = [];
        this.classNames = [];
        this.ids = [];
        this.attrs = [];
        this.collectSelectors(elm);
    }
    collectSelectors(elm) {
        var i;
        if (elm && elm.tagName) {
            // tags
            const tagName = elm.tagName.toLowerCase();
            if (this.tags.indexOf(tagName) === -1) {
                this.tags.push(tagName);
            }
            // classes
            const classList = elm.classList;
            for (i = 0; i < classList.length; i++) {
                const className = classList[i];
                if (this.classNames.indexOf(className) === -1) {
                    this.classNames.push(className);
                }
            }
            // attributes
            const attributes = elm.attributes;
            for (i = 0; i < attributes.length; i++) {
                const attr = attributes[i];
                const attrName = attr.name.toLowerCase();
                if (!attrName || attrName === 'class' || attrName === 'id' || attrName === 'style')
                    continue;
                if (this.attrs.indexOf(attrName) === -1) {
                    this.attrs.push(attrName);
                }
            }
            // ids
            var idValue = elm.getAttribute('id');
            if (idValue) {
                idValue = idValue.trim();
                if (idValue && this.ids.indexOf(idValue) === -1) {
                    this.ids.push(idValue);
                }
            }
            // drill down
            for (i = 0; i < elm.children.length; i++) {
                this.collectSelectors(elm.children[i]);
            }
        }
    }
}

function inlineComponentStyles(config, doc, styles, results, diagnostics) {
    if (!styles.length) {
        return;
    }
    if (results.opts.removeUnusedStyles !== false) {
        // removeUnusedStyles is the default
        try {
            // pick out all of the selectors that are actually
            // being used in the html document
            const usedSelectors = new UsedSelectors(doc.documentElement);
            styles = styles.map(styleText => {
                return removeUnusedStyles(config, usedSelectors, styleText, diagnostics);
            });
        }
        catch (e) {
            diagnostics.push({
                level: 'error',
                type: 'hydrate',
                header: 'HTML Selector Parse',
                messageText: e
            });
        }
    }
    config.logger.debug(`optimize ${results.pathname}, inline component styles`);
    // insert our styles to the head of the document
    insertStyles(doc, styles);
}
function insertStyles(doc, styles) {
    const styleElm = doc.createElement('style');
    styleElm.setAttribute('data-styles', '');
    styleElm.innerHTML = styles.join('').trim();
    if (styleElm.innerHTML.length) {
        doc.head.insertBefore(styleElm, doc.head.firstChild);
    }
}

var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function inlineExternalAssets(config, ctx, results, doc) {
    return __awaiter$4(this, void 0, void 0, function* () {
        const linkElements = doc.querySelectorAll('link[href][rel="stylesheet"]');
        for (var i = 0; i < linkElements.length; i++) {
            inlineStyle(config, ctx, results, doc, linkElements[i]);
        }
        const scriptElements = doc.querySelectorAll('script[src]');
        for (i = 0; i < scriptElements.length; i++) {
            yield inlineScript(config, ctx, results, scriptElements[i]);
        }
    });
}
function inlineStyle(config, ctx, results, doc, linkElm) {
    return __awaiter$4(this, void 0, void 0, function* () {
        const content = yield getAssetContent(config, ctx, results, linkElm.href);
        if (!content) {
            return;
        }
        config.logger.debug(`optimize ${results.pathname}, inline style: ${config.sys.url.parse(linkElm.href).pathname}`);
        const styleElm = doc.createElement('style');
        styleElm.innerHTML = content;
        linkElm.parentNode.insertBefore(styleElm, linkElm);
        linkElm.parentNode.removeChild(linkElm);
    });
}
function inlineScript(config, ctx, results, scriptElm) {
    return __awaiter$4(this, void 0, void 0, function* () {
        const content = yield getAssetContent(config, ctx, results, scriptElm.src);
        if (!content) {
            return;
        }
        config.logger.debug(`optimize ${results.pathname}, inline script: ${scriptElm.src}`);
        scriptElm.innerHTML = content;
        scriptElm.removeAttribute('src');
    });
}
function getAssetContent(config, ctx, results, assetUrl) {
    return __awaiter$4(this, void 0, void 0, function* () {
        // figure out the url's so we can check the hostnames
        const fromUrl = config.sys.url.parse(results.url);
        const toUrl = config.sys.url.parse(assetUrl);
        if (fromUrl.hostname !== toUrl.hostname) {
            // not the same hostname, so we wouldn't have the file content
            return null;
        }
        // figure out the local file path
        const filePath = getFilePathFromUrl$1(config, fromUrl, toUrl);
        // doesn't look like we've got it cached in app files
        try {
            // try looking it up directly
            const content = yield ctx.fs.readFile(filePath);
            // rough estimate of size
            const fileSize = content.length;
            if (fileSize > results.opts.inlineAssetsMaxSize) {
                // welp, considered too big, don't inline
                return null;
            }
            return content;
        }
        catch (e) {
            // never found the content for this file
            return null;
        }
    });
}
function getFilePathFromUrl$1(config, fromUrl, toUrl) {
    const resolvedUrl = '.' + config.sys.url.resolve(fromUrl.pathname, toUrl.pathname);
    return pathJoin(config, config.wwwDir, resolvedUrl);
}

var __awaiter$5 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function inlineLoaderScript(config, ctx, doc, results) {
    return __awaiter$5(this, void 0, void 0, function* () {
        // create the script url we'll be looking for
        const loaderFileName = getLoaderFileName(config);
        // find the external loader script
        // which is usually in the <head> and a pretty small external file
        // now that we're prerendering the html, and all the styles and html
        // will get hardcoded in the output, it's safe to now put the
        // loader script at the bottom of <body>
        const scriptElm = findExternalLoaderScript(config, doc, loaderFileName);
        if (scriptElm) {
            // append the loader script content to the bottom of <body>
            yield relocateInlineLoaderScript(config, ctx, doc, results, scriptElm);
        }
    });
}
function findExternalLoaderScript(config, doc, loaderFileName) {
    const scriptElements = doc.getElementsByTagName('script');
    for (let i = 0; i < scriptElements.length; i++) {
        if (isLoaderScriptSrc(config.publicPath, loaderFileName, scriptElements[i].getAttribute('src'))) {
            // this is a script element with a src attribute which is
            // pointing to the app's external loader script
            // remove the script from the document, be gone with you
            return scriptElements[i];
        }
    }
    return null;
}
function isLoaderScriptSrc(publicPath, loaderFileName, scriptSrc) {
    try {
        if (typeof scriptSrc !== 'string' || scriptSrc.trim() === '') {
            return false;
        }
        scriptSrc = scriptSrc.toLowerCase();
        if (!scriptSrc.includes(loaderFileName)) {
            return false;
        }
        if (scriptSrc.startsWith('http') || scriptSrc.startsWith('file')) {
            return false;
        }
        const pathDirs = publicPath.toLowerCase().split('/');
        const firstPublicPathDir = pathDirs.find(pathDir => pathDir.length > 0);
        const scriptSrcDirs = scriptSrc.split('/');
        const firstScriptSrcDir = scriptSrcDirs.find(scriptSrcDir => scriptSrcDir.length > 0);
        if (firstPublicPathDir !== null && firstScriptSrcDir !== null) {
            return firstPublicPathDir === firstScriptSrcDir;
        }
        return true;
    }
    catch (e) {
        return false;
    }
}
function relocateInlineLoaderScript(config, ctx, doc, results, scriptElm) {
    return __awaiter$5(this, void 0, void 0, function* () {
        // get the file path
        const appLoaderWWW = getLoaderWWW(config);
        // get the loader content
        let content = null;
        try {
            // let's look it up directly
            content = yield ctx.fs.readFile(appLoaderWWW);
        }
        catch (e) {
            config.logger.debug(`unable to inline loader: ${appLoaderWWW}`, e);
        }
        if (!content) {
            // didn't get good loader content, don't bother
            return;
        }
        config.logger.debug(`optimize ${results.pathname}, inline loader`);
        // remove the external src
        scriptElm.removeAttribute('src');
        // inline the js content
        scriptElm.innerHTML = content;
        if (results.opts.hydrateComponents) {
            // remove the script element from where it's currently at in the dom
            scriptElm.parentNode.removeChild(scriptElm);
            // place it back in the dom, but at the bottom of the body
            doc.body.appendChild(scriptElm);
        }
    });
}

function insertCanonicalLink(config, doc, results) {
    if (!results.path)
        return;
    // https://webmasters.googleblog.com/2009/02/specify-your-canonical.html
    // <link rel="canonical" href="http://www.example.com/product.php?item=swedish-fish" />
    let canonicalLink = doc.querySelector('link[rel="canonical"]');
    if (canonicalLink)
        return;
    canonicalLink = doc.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', results.path);
    config.logger.debug(`add cononical link: ${results.path}`);
    doc.head.appendChild(canonicalLink);
}

var __awaiter$6 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function minifyInlineScripts(config, compilerCtx, doc, results) {
    return __awaiter$6(this, void 0, void 0, function* () {
        const scripts = doc.querySelectorAll('script');
        const promises = [];
        for (let i = 0; i < scripts.length; i++) {
            promises.push(minifyInlineStyle(config, compilerCtx, results, scripts[i]));
        }
        yield Promise.all(promises);
    });
}
function minifyInlineStyle(config, compilerCtx, results, script) {
    return __awaiter$6(this, void 0, void 0, function* () {
        if (script.hasAttribute('src')) {
            return;
        }
        if (script.innerHTML.includes('  ') || script.innerHTML.includes('\t')) {
            const minifyResults = yield minifyJs(config, compilerCtx, script.innerHTML, 'es5', false);
            minifyResults.diagnostics.forEach(d => {
                results.diagnostics.push(d);
            });
            if (typeof minifyResults.output === 'string') {
                script.innerHTML = minifyResults.output;
            }
        }
    });
}

var __awaiter$7 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function minifyStyle(config, compilerCtx, diagnostics, styleText) {
    return __awaiter$7(this, void 0, void 0, function* () {
        const cacheKey = compilerCtx.cache.createKey('minifyStyle', styleText);
        const cachedContent = yield compilerCtx.cache.get(cacheKey);
        if (cachedContent != null) {
            return cachedContent;
        }
        const minifyResults = config.sys.minifyCss(styleText);
        minifyResults.diagnostics.forEach(d => {
            diagnostics.push(d);
        });
        if (typeof minifyResults.output === 'string') {
            yield compilerCtx.cache.put(cacheKey, minifyResults.output);
            return minifyResults.output;
        }
        return styleText;
    });
}

var __awaiter$8 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function minifyInlineStyles(config, compilerCtx, doc, results) {
    return __awaiter$8(this, void 0, void 0, function* () {
        const styles = doc.querySelectorAll('style');
        const promises = [];
        for (let i = 0; i < styles.length; i++) {
            promises.push(minifyInlineStyle$1(config, compilerCtx, results, styles[i]));
        }
        yield Promise.all(promises);
    });
}
function minifyInlineStyle$1(config, compilerCtx, results, style) {
    return __awaiter$8(this, void 0, void 0, function* () {
        if (style.innerHTML.includes('  ') || style.innerHTML.includes('\t')) {
            style.innerHTML = yield minifyStyle(config, compilerCtx, results.diagnostics, style.innerHTML);
        }
    });
}

var __awaiter$9 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function optimizeHtml(config, compilerCtx, doc, styles, opts, results) {
    return __awaiter$9(this, void 0, void 0, function* () {
        const promises = [];
        if (opts.hydrateComponents !== false) {
            doc.documentElement.setAttribute('data-ssr', '');
        }
        if (opts.canonicalLink !== false) {
            try {
                insertCanonicalLink(config, doc, results);
            }
            catch (e) {
                results.diagnostics.push({
                    level: 'error',
                    type: 'hydrate',
                    header: 'Insert Canonical Link',
                    messageText: e
                });
            }
        }
        if (opts.inlineStyles !== false) {
            try {
                inlineComponentStyles(config, doc, styles, results, results.diagnostics);
            }
            catch (e) {
                results.diagnostics.push({
                    level: 'error',
                    type: 'hydrate',
                    header: 'Inline Component Styles',
                    messageText: e
                });
            }
        }
        if (opts.inlineLoaderScript !== false) {
            // remove the script to the external loader script request
            // inline the loader script at the bottom of the html
            promises.push(inlineLoaderScript(config, compilerCtx, doc, results));
        }
        if (opts.inlineAssetsMaxSize > 0) {
            promises.push(inlineExternalAssets(config, compilerCtx, results, doc));
        }
        if (opts.collapseWhitespace !== false && !config.devMode && config.logger.level !== 'debug') {
            // collapseWhitespace is the default
            try {
                config.logger.debug(`optimize ${results.pathname}, collapse html whitespace`);
                collapseHtmlWhitepace(doc.documentElement);
            }
            catch (e) {
                results.diagnostics.push({
                    level: 'error',
                    type: 'hydrate',
                    header: 'Reduce HTML Whitespace',
                    messageText: e
                });
            }
        }
        // need to wait on to see if external files are inlined
        yield Promise.all(promises);
        // reset for new promises
        promises.length = 0;
        if (config.minifyCss) {
            promises.push(minifyInlineStyles(config, compilerCtx, doc, results));
        }
        if (config.minifyJs) {
            promises.push(minifyInlineScripts(config, compilerCtx, doc, results));
        }
        if (config.assetVersioning) {
            promises.push(assetVersioning(config, compilerCtx, results.url, doc));
        }
        yield Promise.all(promises);
    });
}

var __awaiter$10 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function hydrateHtml(config, ctx, cmpRegistry, opts) {
    return new Promise(resolve => {
        // validate the hydrate options and add any missing info
        opts = normalizeHydrateOptions(opts);
        // create the results object we're gonna return
        const hydrateResults = generateHydrateResults(config, opts);
        // create a emulated window
        // attach data the request to the window
        const dom = config.sys.createDom();
        const win = dom.parse(opts);
        const doc = win.document;
        // normalize dir and lang before connecting elements
        // so that the info is their incase they read it at runtime
        normalizeDirection(doc, opts);
        normalizeLanguage(doc, opts);
        // create the platform
        const plt = createPlatformServer(config, win, doc, cmpRegistry, hydrateResults, opts.isPrerender, ctx);
        // fire off this function when the app has finished loading
        // and all components have finished hydrating
        plt.onAppLoad = (rootElm, styles, failureDiagnostic) => __awaiter$10(this, void 0, void 0, function* () {
            if (config._isTesting) {
                hydrateResults.__testPlatform = plt;
            }
            if (failureDiagnostic) {
                hydrateResults.html = generateFailureDiagnostic(failureDiagnostic);
                dom.destroy();
                resolve(hydrateResults);
                return;
            }
            // all synchronous operations next
            if (rootElm) {
                try {
                    // optimize this document!!
                    yield optimizeHtml(config, ctx, doc, styles, opts, hydrateResults);
                    // gather up all of the <a> tag information in the doc
                    if (opts.collectAnchors !== false && opts.hydrateComponents !== false) {
                        collectAnchors(config, doc, hydrateResults);
                    }
                    // serialize this dom back into a string
                    if (opts.serializeHtml !== false) {
                        hydrateResults.html = dom.serialize();
                    }
                }
                catch (e) {
                    // gahh, something's up
                    hydrateResults.diagnostics.push({
                        level: 'error',
                        type: 'hydrate',
                        header: 'DOM Serialize',
                        messageText: e
                    });
                    // idk, some error, just use the original html
                    hydrateResults.html = opts.html;
                }
            }
            if (opts.destroyDom !== false) {
                // always destroy the dom unless told otherwise
                dom.destroy();
            }
            else {
                // we didn't destroy the dom
                // so let's return the root element
                hydrateResults.root = rootElm;
            }
            // cool, all good here, even if there are errors
            // we're passing back the result object
            resolve(hydrateResults);
        });
        if (opts.hydrateComponents === false) {
            plt.onAppLoad(win.document.body, []);
            return;
        }
        // patch the render function that we can add SSR ids
        // and to connect any elements it may have just appened to the DOM
        let ssrIds = 0;
        const pltRender = plt.render;
        plt.render = function render(oldVNode, newVNode, isUpdate, defaultSlots, namedSlotsMap, encapsulation) {
            let ssrId;
            let existingSsrId;
            if (opts.ssrIds !== false) {
                // this may have been patched more than once
                // so reuse the ssr id if it already has one
                if (oldVNode && oldVNode.elm) {
                    existingSsrId = oldVNode.elm.getAttribute(SSR_VNODE_ID);
                }
                if (existingSsrId) {
                    ssrId = parseInt(existingSsrId, 10);
                }
                else {
                    ssrId = ssrIds++;
                }
            }
            newVNode = pltRender(oldVNode, newVNode, isUpdate, defaultSlots, namedSlotsMap, encapsulation, ssrId);
            connectChildElements(config, plt, hydrateResults, newVNode.elm);
            return newVNode;
        };
        // loop through each node and start connecting/hydrating
        // any elements that are host elements to components
        // this kicks off all the async hydrating
        connectChildElements(config, plt, hydrateResults, win.document.body);
        if (hydrateResults.components.length === 0) {
            // what gives, never found ANY host elements to connect!
            // ok we're just done i guess, idk
            hydrateResults.html = opts.html;
            resolve(hydrateResults);
        }
    });
}

var __awaiter$11 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getAppRegistry(config, ctx) {
    const registryJsonFilePath = getRegistryJsonWWW(config);
    let appRegistry;
    try {
        // open up the app registry json file
        const appRegistryJson = ctx.fs.readFileSync(registryJsonFilePath);
        // parse the json into app registry data
        appRegistry = JSON.parse(appRegistryJson);
        config.logger.debug(`parsed app registry: ${registryJsonFilePath}`);
    }
    catch (e) {
        throw new Error(`Error parsing app registry, ${registryJsonFilePath}: ${e}`);
    }
    return appRegistry;
}

function loadComponentRegistry(config, ctx) {
    const appRegistry = getAppRegistry(config, ctx);
    const cmpRegistry = {};
    const tagNames = Object.keys(appRegistry.components);
    tagNames.forEach(tagName => {
        cmpRegistry[tagName] = {
            tagNameMeta: tagName,
            bundleIds: appRegistry.components[tagName]
        };
    });
    return cmpRegistry;
}

function setBooleanConfig(config, configName, defaultValue) {
    const userConfigName = getUserConfigName(config, configName);
    if (typeof config[userConfigName] === 'function') {
        config[userConfigName] = !!config[userConfigName]();
    }
    if (typeof config[userConfigName] === 'boolean') {
        config[configName] = config[userConfigName];
    }
    else {
        config[configName] = defaultValue;
    }
}
function setNumberConfig(config, configName, defaultValue) {
    const userConfigName = getUserConfigName(config, configName);
    if (typeof config[userConfigName] === 'function') {
        config[userConfigName] = config[userConfigName]();
    }
    if (typeof config[userConfigName] === 'number') {
        config[configName] = config[userConfigName];
    }
    else {
        config[configName] = defaultValue;
    }
}
function setStringConfig(config, configName, defaultValue) {
    const userConfigName = getUserConfigName(config, configName);
    if (typeof config[userConfigName] === 'function') {
        config[userConfigName] = config[userConfigName]();
    }
    if (typeof config[userConfigName] === 'string') {
        config[configName] = config[userConfigName];
    }
    else {
        config[configName] = defaultValue;
    }
}
function setArrayConfig(config, configName, defaultValue) {
    const userConfigName = getUserConfigName(config, configName);
    if (typeof config[userConfigName] === 'function') {
        config[userConfigName] = config[userConfigName]();
    }
    if (!Array.isArray(config[configName])) {
        if (Array.isArray(defaultValue)) {
            config[configName] = defaultValue.slice();
        }
        else {
            config[configName] = [];
        }
    }
}
function getUserConfigName(config, correctConfigName) {
    const userConfigNames = Object.keys(config);
    for (const userConfigName of userConfigNames) {
        if (userConfigName.toLowerCase() === correctConfigName.toLowerCase()) {
            if (userConfigName !== correctConfigName) {
                config.logger.warn(`config "${userConfigName}" should be "${correctConfigName}"`);
                return userConfigName;
            }
            break;
        }
    }
    return correctConfigName;
}

function validateAssetVerioning(config) {
    if (!config.assetVersioning) {
        config.assetVersioning = null;
        return;
    }
    if ((config.assetVersioning) === true) {
        config.assetVersioning = {};
    }
    const hashLength = config.hashedFileNameLength > 3 ? config.hashedFileNameLength : DEFAULTS.hashLength;
    setArrayConfig(config.assetVersioning, 'cssProperties', DEFAULTS.cssProperties);
    setNumberConfig(config.assetVersioning, 'hashLength', hashLength);
    setBooleanConfig(config.assetVersioning, 'queryMode', DEFAULTS.queryMode);
    setStringConfig(config.assetVersioning, 'prefix', DEFAULTS.separator);
    setStringConfig(config.assetVersioning, 'separator', DEFAULTS.separator);
    setBooleanConfig(config.assetVersioning, 'versionHtml', DEFAULTS.versionHtml);
    setBooleanConfig(config.assetVersioning, 'versionCssProperties', DEFAULTS.versionCssProperties);
}
const DEFAULTS = {
    cssProperties: ['background', 'background-url', 'url'],
    hashLength: 8,
    queryMode: false,
    pattern: '**/*.{css,js,png,jpg,jpeg,gif,svg,json,woff,woff2,ttf,eot}',
    prefix: '',
    separator: '.',
    versionHtml: true,
    versionCssProperties: true,
};

function validateCopy(config) {
    if (config.copy) {
        // merge user copy tasks into the default
        config.copy = Object.assign({}, DEFAULT_COPY_TASKS, config.copy);
    }
    else if (config.copy === null || config.copy === false) {
        // manually forcing to skip the copy task
        config.copy = null;
    }
    else {
        // use the default copy tasks
        config.copy = Object.assign({}, DEFAULT_COPY_TASKS);
    }
}
const DEFAULT_COPY_TASKS = {
    assets: { src: 'assets', warn: false },
    manifestJson: { src: 'manifest.json', warn: false }
};

function validateNamespace(config) {
    setStringConfig(config, 'namespace', DEFAULT_NAMESPACE);
    config.namespace = config.namespace.trim();
    const invalidNamespaceChars = config.namespace.replace(/(\w)|(\-)|(\$)/g, '');
    if (invalidNamespaceChars !== '') {
        throw new Error(`Namespace "${config.namespace}" contains invalid characters: ${invalidNamespaceChars}`);
    }
    if (config.namespace.length < 3) {
        throw new Error(`Namespace "${config.namespace}" must be at least 3 characters`);
    }
    if (/^\d+$/.test(config.namespace.charAt(0))) {
        throw new Error(`Namespace "${config.namespace}" cannot have a number for the first character`);
    }
    if (config.namespace.charAt(0) === '-') {
        throw new Error(`Namespace "${config.namespace}" cannot have a dash for the first character`);
    }
    if (config.namespace.charAt(config.namespace.length - 1) === '-') {
        throw new Error(`Namespace "${config.namespace}" cannot have a dash for the last character`);
    }
    // the file system namespace is the one
    // used in filenames and seen in the url
    setStringConfig(config, 'fsNamespace', config.namespace.toLowerCase());
    if (config.namespace.includes('-')) {
        // convert to PascalCase
        // this is the same namespace that gets put on "window"
        config.namespace = dashToPascalCase(config.namespace);
    }
}
const DEFAULT_NAMESPACE = 'App';

function validatePaths(config) {
    const path = config.sys.path;
    if (typeof config.global === 'string') {
        // deprecated: 2017-12-12
        config.logger.warn(`stencil config property "global" has been renamed to "globalScript"`);
        config.globalScript = config.global;
    }
    if (typeof config.globalScript === 'string' && !path.isAbsolute(config.globalScript)) {
        config.globalScript = normalizePath(path.join(config.rootDir, config.globalScript));
    }
    if (typeof config.globalStyle === 'string') {
        config.globalStyle = [config.globalStyle];
    }
    if (Array.isArray(config.globalStyle)) {
        config.globalStyle = config.globalStyle.filter(globalStyle => typeof globalStyle === 'string');
        config.globalStyle = config.globalStyle.map(globalStyle => {
            if (path.isAbsolute(globalStyle)) {
                return normalizePath(globalStyle);
            }
            return normalizePath(path.join(config.rootDir, globalStyle));
        });
    }
    if (typeof config.src === 'string') {
        // deprecated: 2017-08-14
        config.logger.warn(`stencil config property "src" has been renamed to "srcDir"`);
        config.srcDir = config.src;
    }
    setStringConfig(config, 'srcDir', DEFAULT_SRC_DIR);
    if (!path.isAbsolute(config.srcDir)) {
        config.srcDir = normalizePath(path.join(config.rootDir, config.srcDir));
    }
    setStringConfig(config, 'wwwDir', DEFAULT_WWW_DIR);
    if (!path.isAbsolute(config.wwwDir)) {
        config.wwwDir = normalizePath(path.join(config.rootDir, config.wwwDir));
    }
    setStringConfig(config, 'buildDir', DEFAULT_BUILD_DIR);
    if (!path.isAbsolute(config.buildDir)) {
        config.buildDir = normalizePath(path.join(config.wwwDir, config.buildDir));
    }
    setStringConfig(config, 'distDir', DEFAULT_DIST_DIR);
    if (!path.isAbsolute(config.distDir)) {
        config.distDir = normalizePath(path.join(config.rootDir, config.distDir));
    }
    setStringConfig(config, 'collectionDir', DEFAULT_COLLECTION_DIR);
    if (!path.isAbsolute(config.collectionDir)) {
        config.collectionDir = normalizePath(path.join(config.distDir, config.collectionDir));
    }
    setStringConfig(config, 'tsconfig', DEFAULT_TSCONFIG);
    if (!path.isAbsolute(config.tsconfig)) {
        config.tsconfig = normalizePath(path.join(config.rootDir, config.tsconfig));
    }
    setStringConfig(config, 'typesDir', DEFAULT_TYPES_DIR);
    if (!path.isAbsolute(config.typesDir)) {
        config.typesDir = normalizePath(path.join(config.distDir, config.typesDir));
    }
    setStringConfig(config, 'srcIndexHtml', normalizePath(path.join(config.srcDir, DEFAULT_INDEX_HTML)));
    if (!path.isAbsolute(config.srcIndexHtml)) {
        config.srcIndexHtml = normalizePath(path.join(config.rootDir, config.srcIndexHtml));
    }
    setStringConfig(config, 'wwwIndexHtml', normalizePath(path.join(config.wwwDir, DEFAULT_INDEX_HTML)));
    if (!path.isAbsolute(config.wwwIndexHtml)) {
        config.wwwIndexHtml = normalizePath(path.join(config.wwwDir, config.wwwIndexHtml));
    }
    if (config.writeLog) {
        setStringConfig(config, 'buildLogFilePath', DEFAULT_BUILD_LOG_FILE_NAME);
        if (!path.isAbsolute(config.buildLogFilePath)) {
            config.buildLogFilePath = normalizePath(path.join(config.rootDir, config.buildLogFilePath));
        }
        config.logger.buildLogFilePath = config.buildLogFilePath;
    }
    if (config.writeStats) {
        setStringConfig(config, 'buildStatsFilePath', DEFAULT_STATS_JSON_FILE_NAME);
        if (!path.isAbsolute(config.buildStatsFilePath)) {
            config.buildStatsFilePath = normalizePath(path.join(config.rootDir, config.buildStatsFilePath));
        }
    }
}
const DEFAULT_SRC_DIR = 'src';
const DEFAULT_WWW_DIR = 'www';
const DEFAULT_BUILD_DIR = 'build';
const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_DIST_DIR = 'dist';
const DEFAULT_COLLECTION_DIR = 'collection';
const DEFAULT_TYPES_DIR = 'types';
const DEFAULT_TSCONFIG = 'tsconfig.json';
const DEFAULT_BUILD_LOG_FILE_NAME = 'stencil-build.log';
const DEFAULT_STATS_JSON_FILE_NAME = 'stencil-stats.json';

function validatePlugins(config) {
    config.plugins = (config.plugins || []).filter(p => !!p);
}

function validatePublicPath(config) {
    if (typeof config.discoverPublicPath !== 'boolean') {
        // only do this check if the config hasn't been fully validated yet
        // if the config has a publicPath, then let's remember it was a custom one
        config.discoverPublicPath = (typeof config.publicPath !== 'string');
    }
    if (typeof config.publicPath !== 'string') {
        // CLIENT SIDE ONLY! Do not use this for server-side file read/writes
        // this is a reference to the public static directory from the index.html running from a browser
        // in most cases it's just "build", as in index page would request scripts from `/build/`
        config.publicPath = normalizePath(config.sys.path.relative(config.wwwDir, config.buildDir));
        if (config.publicPath.charAt(0) !== '/') {
            // ensure prefix / by default
            config.publicPath = '/' + config.publicPath;
        }
    }
    config.publicPath = config.publicPath.trim();
    if (config.publicPath.charAt(config.publicPath.length - 1) !== '/') {
        // ensure there's a trailing /
        config.publicPath += '/';
    }
}

/**
 * DEPRECATED "config.collections" since 0.6.0, 2018-02-13
 */
function _deprecatedValidateConfigCollections(config) {
    if (Array.isArray(config.collections)) {
        config._deprecatedCollections = config.collections;
    }
    else {
        config._deprecatedCollections = [];
    }
    config._deprecatedCollections = config._deprecatedCollections.map(_deprecatedValidateConfigCollection);
    if (config._deprecatedCollections.length > 0) {
        const warningMsg = [
            `As of v0.6.0, "config.collections" has been deprecated in favor of standard ES module imports. `,
            `Instead of listing collections within the stencil config, collections should now be `,
            `imported by the app's root component or module. The benefit of this is to not only simplify `,
            `the config by using a standards approach for imports, but to also automatically import the `,
            `collection's types to improve development. Please remove "config.collections" `,
            `from the "stencil.config.js" file, and add `,
            config._deprecatedCollections.length === 1 ? `this import ` : `these imports `,
            `to your root component or root module:  `
        ];
        config._deprecatedCollections.forEach(collection => {
            warningMsg.push(`import '${collection.name}';  `);
        });
        config.logger.warn(warningMsg.join(''));
    }
}
function _deprecatedValidateConfigCollection(userInput) {
    if (!userInput || Array.isArray(userInput) || typeof userInput === 'number' || typeof userInput === 'boolean') {
        throw new Error(`invalid collection: ${userInput}`);
    }
    let configCollection;
    if (typeof userInput === 'string') {
        configCollection = {
            name: userInput
        };
    }
    else {
        configCollection = userInput;
    }
    if (!configCollection.name || typeof configCollection.name !== 'string' || configCollection.name.trim() === '') {
        throw new Error(`missing collection name`);
    }
    configCollection.name = configCollection.name.trim();
    return configCollection;
}

function validateBuildConfig(config, setEnvVariables) {
    if (!config) {
        throw new Error(`invalid build config`);
    }
    if (config._isValidated) {
        // don't bother if we've already validated this config
        return config;
    }
    if (!config.logger) {
        throw new Error(`config.logger required`);
    }
    if (!config.rootDir) {
        throw new Error('config.rootDir required');
    }
    if (!config.sys) {
        throw new Error('config.sys required');
    }
    if (typeof config.logLevel === 'string') {
        config.logger.level = config.logLevel;
    }
    else if (typeof config.logger.level === 'string') {
        config.logLevel = config.logger.level;
    }
    setBooleanConfig(config, 'writeLog', false);
    setBooleanConfig(config, 'writeStats', false);
    setBooleanConfig(config, 'buildAppCore', true);
    // get a good namespace
    validateNamespace(config);
    // figure out all of the config paths and absolute paths
    validatePaths(config);
    // figure out the client-side public path
    validatePublicPath(config);
    // default devMode false
    config.devMode = !!config.devMode;
    // default watch false
    config.watch = !!config.watch;
    setBooleanConfig(config, 'minifyCss', !config.devMode);
    setBooleanConfig(config, 'minifyJs', !config.devMode);
    config.logger.debug(`minifyJs: ${config.minifyJs}, minifyCss: ${config.minifyCss}`);
    setBooleanConfig(config, 'buildEs5', !config.devMode);
    setBooleanConfig(config, 'hashFileNames', !(config.devMode || config.watch));
    setNumberConfig(config, 'hashedFileNameLength', DEFAULT_HASHED_FILENAME_LENTH);
    if (config.hashFileNames) {
        if (config.hashedFileNameLength < MIN_HASHED_FILENAME_LENTH) {
            throw new Error(`config.hashedFileNameLength must be at least ${MIN_HASHED_FILENAME_LENTH} characters`);
        }
        if (config.hashedFileNameLength > MAX_HASHED_FILENAME_LENTH) {
            throw new Error(`config.hashedFileNameLength cannot be more than ${MAX_HASHED_FILENAME_LENTH} characters`);
        }
    }
    config.logger.debug(`hashFileNames: ${config.hashFileNames}, hashedFileNameLength: ${config.hashedFileNameLength}`);
    config.generateDistribution = !!config.generateDistribution;
    setBooleanConfig(config, 'generateWWW', true);
    validateCopy(config);
    validatePlugins(config);
    validateAssetVerioning(config);
    if (!config.watchIgnoredRegex) {
        config.watchIgnoredRegex = DEFAULT_WATCH_IGNORED_REGEX;
    }
    setStringConfig(config, 'hydratedCssClass', DEFAULT_HYDRATED_CSS_CLASS);
    setBooleanConfig(config, 'emptyDist', true);
    setBooleanConfig(config, 'emptyWWW', true);
    setBooleanConfig(config, 'generateDocs', false);
    setBooleanConfig(config, 'enableCache', true);
    if (!Array.isArray(config.includeSrc)) {
        config.includeSrc = DEFAULT_INCLUDES.map(include => {
            return config.sys.path.join(config.srcDir, include);
        });
    }
    if (!Array.isArray(config.excludeSrc)) {
        config.excludeSrc = DEFAULT_EXCLUDES.slice();
    }
    /**
     * DEPRECATED "config.collections" since 0.6.0, 2018-02-13
     */
    _deprecatedValidateConfigCollections(config);
    setArrayConfig(config, 'plugins');
    setArrayConfig(config, 'bundles');
    // set to true so it doesn't bother going through all this again on rebuilds
    config._isValidated = true;
    config.logger.debug(`validated build config`);
    if (setEnvVariables !== false) {
        setProcessEnvironment(config);
    }
    return config;
}
function setProcessEnvironment(config) {
    process.env.NODE_ENV = config.devMode ? 'development' : 'production';
}
const DEFAULT_HASHED_FILENAME_LENTH = 8;
const MIN_HASHED_FILENAME_LENTH = 4;
const MAX_HASHED_FILENAME_LENTH = 32;
const DEFAULT_INCLUDES = ['**/*.ts', '**/*.tsx'];
const DEFAULT_EXCLUDES = ['**/test/**', '**/*.spec.*'];
const DEFAULT_WATCH_IGNORED_REGEX = /(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$/i;
const DEFAULT_HYDRATED_CSS_CLASS = 'hydrated';

var __awaiter$12 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Renderer {
    constructor(config, registry, ctx) {
        this.config = config;
        this.config = config;
        validateBuildConfig(config);
        // init the build context
        this.ctx = getCompilerCtx(config, ctx);
        // load the component registry from the registry.json file
        this.cmpRegistry = registry || loadComponentRegistry(config, this.ctx);
        if (Object.keys(this.cmpRegistry).length === 0) {
            throw new Error(`No registered components found: ${config.namespace}`);
        }
        // load the app global file into the context
        loadAppGlobal(config, this.ctx);
    }
    hydrate(hydrateOpts) {
        return __awaiter$12(this, void 0, void 0, function* () {
            let hydrateResults;
            // kick off hydrated, which is an async opertion
            try {
                hydrateResults = yield hydrateHtml(this.config, this.ctx, this.cmpRegistry, hydrateOpts);
            }
            catch (e) {
                hydrateResults = {
                    url: hydrateOpts.path,
                    diagnostics: [],
                    html: hydrateOpts.html,
                    styles: null,
                    anchors: [],
                    components: [],
                    styleUrls: [],
                    scriptUrls: [],
                    imgUrls: []
                };
                catchError(hydrateResults.diagnostics, e);
            }
            return hydrateResults;
        });
    }
    get fs() {
        return this.ctx.fs;
    }
}
/**
 * Deprecated
 * Please use "const renderer = new Renderer(config);" instead.
 */
function createRenderer(config) {
    const renderer = new Renderer(config);
    config.logger.warn(`"createRenderer(config)" is deprecated. Please use "const renderer = new Renderer(config);" instead"`);
    return {
        hydrateToString: renderer.hydrate.bind(renderer)
    };
}
function loadAppGlobal(config, ctx) {
    ctx.appFiles = ctx.appFiles || {};
    if (ctx.appFiles.global) {
        // already loaded the global js content
        return;
    }
    // let's load the app global js content
    const appGlobalPath = getGlobalWWW(config);
    try {
        ctx.appFiles.global = ctx.fs.readFileSync(appGlobalPath);
    }
    catch (e) {
        config.logger.debug(`missing app global: ${appGlobalPath}`);
    }
}

function ssrMiddleware(middlewareConfig) {
    // load up the config
    const path = require('path');
    const nodeSys = require(path.join(__dirname, '../sys/node/index.js'));
    const config = loadConfig(nodeSys.sys, middlewareConfig.config);
    // create the renderer
    const renderer = new Renderer(config);
    let srcIndexHtml;
    try {
        // load the source index.html
        srcIndexHtml = renderer.fs.readFileSync(config.srcIndexHtml);
    }
    catch (e) {
        config.logger.error(`ssrMiddleware, error loading srcIndexHtml`, e);
        process.exit(1);
    }
    // middleware fn
    return function (req, res) {
        config.logger.debug(`ssr request: ${req.url}`);
        // hydrate level 4, please!
        renderer.hydrate({
            html: srcIndexHtml,
            req: req
        }).then(results => {
            // print out any diagnostics
            config.logger.printDiagnostics(results.diagnostics);
            // respond with the hydrated html
            res.send(results.html);
        });
    };
}
/**
 * SSR Path Regex matches urls which end with index.html,
 * urls with a trailing /, and urls with no trailing slash,
 * but also do not have a file extension. The following example
 * urls would all match (with or without a querystring):
 *   /index.html
 *   /about
 *   /about/
 *   /
 *
 * The follwing example url would not match:
 *   /image.jpg
 *   /font.woff
 *
 * Please see the unit tests if any changes are required.
 */
const ssrPathRegex = /^([^.+]|.html)*(\?.*)?$/i;

function loadConfig$1(configObj) {
    const path = require('path');
    const nodeSys = require(path.join(__dirname, '../sys/node/index.js'));
    const sys = new nodeSys.NodeSystem();
    const config = loadConfig(sys, configObj);
    config.logger = new nodeSys.NodeLogger();
    return config;
}

exports.VNode = VNode;
exports.h = h;
exports.ssrMiddleware = ssrMiddleware;
exports.ssrPathRegex = ssrPathRegex;
exports.loadConfig = loadConfig$1;
exports.Renderer = Renderer;
exports.createRenderer = createRenderer;
