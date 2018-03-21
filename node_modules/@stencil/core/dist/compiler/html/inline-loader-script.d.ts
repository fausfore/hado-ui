import { CompilerCtx, Config, HydrateResults } from '../../declarations';
export declare function inlineLoaderScript(config: Config, ctx: CompilerCtx, doc: Document, results: HydrateResults): Promise<void>;
export declare function isLoaderScriptSrc(publicPath: string, loaderFileName: string, scriptSrc: string): boolean;
