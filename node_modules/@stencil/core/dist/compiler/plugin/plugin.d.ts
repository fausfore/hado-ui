import { BuildCtx, CompilerCtx, Config } from '../../declarations';
import { PluginCtx, PluginTransformResults } from '../../declarations/plugin';
export declare function runPluginResolveId(pluginCtx: PluginCtx, importee: string): Promise<string>;
export declare function runPluginLoad(pluginCtx: PluginCtx, id: string): Promise<string>;
export declare function runPluginTransforms(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, id: string): Promise<PluginTransformResults>;
