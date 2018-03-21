import { AppRegistry, AppRegistryComponents, CompilerCtx, ComponentRegistry, Config } from '../../declarations';
export declare function createAppRegistry(config: Config): AppRegistry;
export declare function getAppRegistry(config: Config, ctx: CompilerCtx): AppRegistry;
export declare function serializeComponentRegistry(cmpRegistry: ComponentRegistry): AppRegistryComponents;
export declare function writeAppRegistry(config: Config, ctx: CompilerCtx, appRegistry: AppRegistry, cmpRegistry: ComponentRegistry): Promise<void>;
