import { CompilerCtx, Config, WatcherResults } from '../../declarations';
export declare class WatcherListener {
    private config;
    private compilerCtx;
    private dirsAdded;
    private dirsDeleted;
    private filesAdded;
    private filesDeleted;
    private filesUpdated;
    private configUpdated;
    private recentChanges;
    private watchTmr;
    private copyTaskTmr;
    constructor(config: Config, compilerCtx: CompilerCtx);
    subscribe(): void;
    fileUpdate(path: string): Promise<void>;
    fileAdd(path: string): Promise<void>;
    fileDelete(path: string): void;
    dirAdd(path: string): Promise<void>;
    dirDelete(path: string): Promise<void>;
    startRebuild(): void;
    generateWatcherResults(): WatcherResults;
    queue(path: string): void;
    queueCopyTasks(): void;
    resetWatcher(): void;
}
