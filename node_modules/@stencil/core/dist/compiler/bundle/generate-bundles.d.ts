import { BuildCtx, CompilerCtx, ComponentMeta, ComponentRegistry, Config, EntryModule, JSModuleMap, ModuleFile } from '../../declarations';
export declare function generateBundles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[], jsModules: JSModuleMap): Promise<ComponentRegistry>;
export declare function injectComponentStyleMode(cmpMeta: ComponentMeta, modeName: string, jsText: string, isScopedStyles: boolean): string;
export declare function setBundleModeIds(moduleFiles: ModuleFile[], modeName: string, bundleId: string): void;
export declare function getBundleId(config: Config, entryModule: EntryModule, modeName: string, jsText: string): string;
export declare function getBundleIdHashed(config: Config, jsText: string): string;
export declare function getBundleIdDev(entryModule: EntryModule, modeName: string): string;
