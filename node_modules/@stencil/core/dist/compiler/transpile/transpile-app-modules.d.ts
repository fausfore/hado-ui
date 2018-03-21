import { BuildCtx, CompilerCtx, Config } from '../../declarations';
export declare function transpileAppModules(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx): Promise<void>;
export declare function isFileIncludePath(config: Config, readPath: string): boolean;
