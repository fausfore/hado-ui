import { FileSystem } from '../declarations';
export declare class TestingFs implements FileSystem {
    data: {
        [filePath: string]: {
            isFile: boolean;
            isDirectory: boolean;
            content?: string;
        };
    };
    diskWrites: number;
    diskReads: number;
    copyFile(srcPath: string, destPath: string): Promise<void>;
    mkdir(dirPath: string): Promise<void>;
    readdir(dirPath: string): Promise<string[]>;
    readFile(filePath: string): Promise<string>;
    readFileSync(filePath: string): string;
    rmdir(dirPath: string): Promise<void>;
    stat(itemPath: string): Promise<{
        isFile: () => boolean;
        isDirectory: () => boolean;
    }>;
    statSync(itemPath: string): {
        isDirectory: () => boolean;
        isFile: () => boolean;
    };
    unlink(filePath: string): Promise<void>;
    writeFile(filePath: string, content: string): Promise<void>;
    readonly resolveTime: number;
}
