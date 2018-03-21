import { BuildConditionals, BuildCtx, CompilerCtx, Config } from '../../declarations';
export declare function buildCoreContent(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, coreBuild: BuildConditionals, coreContent: string): Promise<string>;
