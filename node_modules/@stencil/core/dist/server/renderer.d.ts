import { CompilerCtx, ComponentRegistry, Config, HydrateOptions, HydrateResults } from '../declarations';
import { InMemoryFileSystem } from '../util/in-memory-fs';
export declare class Renderer {
    config: Config;
    private ctx;
    private cmpRegistry;
    constructor(config: Config, registry?: ComponentRegistry, ctx?: CompilerCtx);
    hydrate(hydrateOpts: HydrateOptions): Promise<HydrateResults>;
    readonly fs: InMemoryFileSystem;
}
/**
 * Deprecated
 * Please use "const renderer = new Renderer(config);" instead.
 */
export declare function createRenderer(config: Config): {
    hydrateToString: any;
};
