import { BuildCtx, BuildResults, CompilerCtx, Config } from '../../declarations';
export declare function generateBuildResults(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx): BuildResults;
export declare function generateBuildStats(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, buildResults: BuildResults): Promise<void>;
