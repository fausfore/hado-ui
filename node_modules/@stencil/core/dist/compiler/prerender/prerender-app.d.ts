import { BuildCtx, CompilerCtx, Config, EntryModule, HydrateResults } from '../../declarations';
export declare function prerenderApp(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]): Promise<HydrateResults[]>;
