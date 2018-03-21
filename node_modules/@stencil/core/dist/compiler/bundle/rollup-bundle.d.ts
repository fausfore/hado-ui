import { BuildCtx, CompilerCtx, Config, EntryModule, JSModuleList } from '../../declarations';
import { OutputChunk } from 'rollup';
export declare function createBundle(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]): Promise<OutputChunk>;
export declare function writeEsModules(config: Config, rollupBundle: OutputChunk): Promise<JSModuleList>;
export declare function writeLegacyModules(config: Config, rollupBundle: OutputChunk, entryModules: EntryModule[]): Promise<JSModuleList>;
