import { BuildCtx, CompilerCtx, Config } from '../../../declarations';
import * as ts from 'typescript';
export declare function getCollections(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, importNode: ts.ImportDeclaration): void;
