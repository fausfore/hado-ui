import { FileSystem, FsItem, FsItems, FsReadOptions, FsReaddirItem, FsReaddirOptions, FsWriteOptions, FsWriteResults, Path } from '../declarations';
export declare class InMemoryFileSystem {
    disk: FileSystem;
    private path;
    private d;
    constructor(disk: FileSystem, path: Path);
    access(filePath: string): Promise<boolean>;
    /**
     * Synchronous!!! Do not use!!!
     * (Only typescript transpiling is allowed to use)
     * @param filePath
     */
    accessSync(filePath: string): boolean;
    copy(src: string, dest: string, opts?: {
        filter?: (src: string, dest?: string) => boolean;
    }): Promise<void>;
    private copyDir(src, dest, opts?);
    private copyFile(src, dest, opts?);
    emptyDir(dirPath: string): Promise<void>;
    readdir(dirPath: string, opts?: FsReaddirOptions): Promise<FsReaddirItem[]>;
    private readDirectory(initPath, dirPath, opts, collectedPaths);
    readFile(filePath: string, opts?: FsReadOptions): Promise<string>;
    /**
     * Synchronous!!! Do not use!!!
     * (Only typescript transpiling is allowed to use)
     * @param filePath
     */
    readFileSync(filePath: string): string;
    remove(itemPath: string): Promise<void>;
    private removeDir(dirPath);
    private removeItem(filePath);
    stat(itemPath: string): Promise<{
        isFile: boolean;
        isDirectory: boolean;
    }>;
    /**
     * Synchronous!!! Do not use!!!
     * (Only typescript transpiling is allowed to use)
     * @param itemPath
     */
    statSync(itemPath: string): {
        isFile: boolean;
        isDirectory: boolean;
    };
    writeFile(filePath: string, content: string, opts?: FsWriteOptions): Promise<FsWriteResults>;
    writeFiles(files: {
        [filePath: string]: string;
    }, opts?: FsWriteOptions): Promise<FsWriteResults[]>;
    commit(): Promise<{
        filesWritten: string[];
        filesDeleted: string[];
        dirsDeleted: string[];
        dirsAdded: string[];
    }>;
    private commitEnsureDirs(dirsToEnsure);
    private commitWriteFiles(filesToWrite);
    private commitWriteFile(filePath);
    private commitDeleteFiles(filesToDelete);
    private commitDeleteDirs(dirsToDelete);
    clearDirCache(dirPath: string): void;
    clearFileCache(filePath: string): void;
    getItem(itemPath: string): FsItem;
    clearCache(): void;
    getMemoryStats(): string;
}
export declare function getCommitInstructions(path: Path, d: FsItems): {
    filesToDelete: string[];
    filesToWrite: string[];
    dirsToDelete: string[];
    dirsToEnsure: string[];
};
export declare function isTextFile(filePath: string): boolean;
export declare function shouldIgnore(filePath: string): boolean;
