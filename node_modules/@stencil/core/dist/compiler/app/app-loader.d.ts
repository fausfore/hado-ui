import { AppRegistry, CompilerCtx, ComponentRegistry, Config } from '../../declarations';
export declare function generateLoader(config: Config, compilerCtx: CompilerCtx, appRegistry: AppRegistry, cmpRegistry: ComponentRegistry): Promise<string>;
export declare function injectAppIntoLoader(config: Config, appCoreFileName: string, appCorePolyfilledFileName: string, hydratedCssClass: string, cmpRegistry: ComponentRegistry, loaderContent: string): string;
