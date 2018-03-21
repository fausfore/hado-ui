import { Config } from '../declarations';
import { InMemoryFileSystem } from '../util/in-memory-fs';
export declare class Cache {
    private config;
    private cacheFs;
    private tmpDir;
    private failed;
    private skip;
    constructor(config: Config, cacheFs: InMemoryFileSystem, tmpDir: string);
    get(key: string): Promise<string>;
    put(key: string, value: string): Promise<boolean>;
    createKey(domain: string, ...args: any[]): string;
    commit(): Promise<void>;
    clear(): void;
    clearDiskCache(): Promise<void>;
    private getCacheFilePath(key);
    getMemoryStats(): string;
}
