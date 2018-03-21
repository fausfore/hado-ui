import { BuildCtx, CompilerCtx, Config, EntryModule, JSModuleMap } from '../../declarations';
export declare function bundle(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]): Promise<JSModuleMap>;
