import { BuildCtx, CompilerCtx, Config, TranspileResults } from '../../declarations';
import * as ts from 'typescript';
export declare function transpileModules(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, tsFilePaths: string[]): Promise<void>;
/**
 * This is only used during TESTING
 */
export declare function transpileModule(config: Config, compilerOptions: ts.CompilerOptions, path: string, input: string): TranspileResults;
