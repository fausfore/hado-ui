import { CompilerCtx, Config, HydrateResults } from '../../declarations';
export declare function minifyInlineScripts(config: Config, compilerCtx: CompilerCtx, doc: Document, results: HydrateResults): Promise<void>;
export declare function minifyInlineStyle(config: Config, compilerCtx: CompilerCtx, results: HydrateResults, script: HTMLScriptElement): Promise<void>;
