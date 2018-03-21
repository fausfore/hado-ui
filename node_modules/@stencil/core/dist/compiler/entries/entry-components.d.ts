import { EntryComponent, EntryPoint, ModuleFile } from '../../declarations';
export declare function generateComponentEntries(allModules: ModuleFile[], userConfigEntryTags: string[][], appEntryTags: string[]): EntryComponent[][];
export declare function processAppComponentEntryTags(allModules: ModuleFile[], entryPoints: EntryPoint[], appEntryTags: string[]): EntryComponent[][];
export declare function processUserConfigBundles(userConfigEntryTags: string[][]): EntryComponent[][];
export declare function getDeepDependencies(allModules: ModuleFile[], tag: string, depencencyOf: string): EntryComponent[];
