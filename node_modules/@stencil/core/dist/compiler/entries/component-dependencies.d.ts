import { CompilerCtx, ModuleFiles, ModuleGraph, PotentialComponentRef } from '../../declarations';
export declare function calcModuleGraphImportPaths(compilerCtx: CompilerCtx, moduleGraphs: ModuleGraph[]): void;
export declare function calcComponentDependencies(allModuleFiles: ModuleFiles, moduleGraphs: ModuleGraph[], sourceStrings: PotentialComponentRef[]): void;
