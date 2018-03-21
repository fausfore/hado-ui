import { CompilerCtx, Config, HydrateResults } from '../../declarations';
export declare function minifyInlineStyles(config: Config, compilerCtx: CompilerCtx, doc: Document, results: HydrateResults): Promise<void>;
export declare function minifyInlineStyle(config: Config, compilerCtx: CompilerCtx, results: HydrateResults, style: HTMLStyleElement): Promise<void>;
