import { BuildResults, CompilerCtx, Config, WatcherResults } from '../../util/interfaces';
export declare function rebuild(config: Config, compilerCtx: CompilerCtx, watcher: WatcherResults): Promise<BuildResults>;
