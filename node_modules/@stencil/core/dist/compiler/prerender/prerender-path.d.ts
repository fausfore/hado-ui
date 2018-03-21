import { BuildCtx, CompilerCtx, Config, HydrateResults, PrerenderLocation } from '../../declarations';
export declare function prerenderPath(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, indexSrcHtml: string, prerenderLocation: PrerenderLocation): Promise<HydrateResults>;
