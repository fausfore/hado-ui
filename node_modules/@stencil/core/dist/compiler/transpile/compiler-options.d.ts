import { CompilerCtx, Config } from '../../declarations';
import * as ts from 'typescript';
export declare function getUserTsConfig(config: Config, compilerCtx: CompilerCtx): Promise<ts.CompilerOptions>;
export declare const DEFAULT_COMPILER_OPTIONS: ts.CompilerOptions;
