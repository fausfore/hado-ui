import { BuildCtx, CompilerCtx, Config } from '../../declarations';
export declare function writeBuildFiles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx): Promise<void>;
export declare function emptyDestDir(config: Config, compilerCtx: CompilerCtx): Promise<void>;
