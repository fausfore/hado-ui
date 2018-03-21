import { BuildCtx, CompilerCtx, Config } from '../../declarations';
export declare function copyComponentAssets(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx): Promise<void>;
export declare function canSkipAssetsCopy(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx): boolean;
