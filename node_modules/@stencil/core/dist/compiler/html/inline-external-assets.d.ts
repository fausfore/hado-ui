import { CompilerCtx, Config, HydrateResults, Url } from '../../declarations';
export declare function inlineExternalAssets(config: Config, ctx: CompilerCtx, results: HydrateResults, doc: Document): Promise<void>;
export declare function getFilePathFromUrl(config: Config, fromUrl: Url, toUrl: Url): string;
