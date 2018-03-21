import { MembersMeta } from '../../../util/interfaces';
import * as ts from 'typescript';
export declare function getMethodDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration): MembersMeta;
