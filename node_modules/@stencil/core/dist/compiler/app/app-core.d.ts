import { BuildConditionals, BuildCtx, CompilerCtx, Config } from '../../declarations';
export declare function generateCore(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, globalJsContent: string, buildConditionals: BuildConditionals): Promise<string>;
export declare function wrapCoreJs(config: Config, jsContent: string): string;
export declare const APP_NAMESPACE_PLACEHOLDER = "__APPNAMESPACE__";
