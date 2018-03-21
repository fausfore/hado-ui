import { BuildResults, CompilerCtx, Config, WatcherResults } from '../../declarations';
export declare function build(config: Config, compilerCtx?: CompilerCtx, watcher?: WatcherResults): Promise<BuildResults>;
