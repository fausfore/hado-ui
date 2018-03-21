import { BuildCtx, CompilerCtx, ComponentMeta, ComponentRegistry, Config, Diagnostic } from '../../../declarations';
import * as ts from 'typescript';
export declare function gatherMetadata(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, typechecker: ts.TypeChecker, sourceFileList: ReadonlyArray<ts.SourceFile>): ComponentRegistry;
export declare function visitClass(config: Config, checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile, diagnostics: Diagnostic[]): ComponentMeta | undefined;
