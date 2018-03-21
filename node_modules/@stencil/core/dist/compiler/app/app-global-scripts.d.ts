import { AppRegistry, BuildCtx, CompilerCtx, Config, SourceTarget } from '../../declarations';
export declare function generateAppGlobalScript(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, appRegistry: AppRegistry, sourceTarget?: SourceTarget): Promise<string>;
export declare function generateAppGlobalContents(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, sourceTarget: SourceTarget): Promise<string[]>;
export declare function generateGlobalJs(config: Config, globalJsContents: string[]): string;
