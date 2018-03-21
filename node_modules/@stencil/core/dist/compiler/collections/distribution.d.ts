import { BuildCtx, CompilerCtx, Config, Diagnostic, PackageJsonData } from '../../declarations';
export declare function generateDistribution(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx): Promise<any>;
export declare function validatePackageJson(config: Config, diagnostics: Diagnostic[], pkgData: PackageJsonData): void;
export declare function validatePackageFiles(config: Config, diagnostics: Diagnostic[], pkgData: PackageJsonData): void;
export declare function getComponentsDtsSrcFilePath(config: Config): string;
export declare function getComponentsDtsDistTypesFilePath(config: Config): string;
export declare const COMPONENTS_DTS = "components.d.ts";
