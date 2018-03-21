import { Diagnostic, MembersMeta } from '../../../declarations';
import * as ts from 'typescript';
export declare function getPropDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile, diagnostics: Diagnostic[]): MembersMeta;
