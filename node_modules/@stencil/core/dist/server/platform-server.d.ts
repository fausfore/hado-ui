import { CompilerCtx, ComponentMeta, ComponentRegistry, Config, HydrateResults, PlatformApi } from '../declarations';
export declare function createPlatformServer(config: Config, win: any, doc: any, cmpRegistry: ComponentRegistry, hydrateResults: HydrateResults, isPrerender: boolean, compilerCtx?: CompilerCtx): PlatformApi;
export declare function getComponentBundleFilename(cmpMeta: ComponentMeta, modeName: string): string;
