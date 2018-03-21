import { ComponentMeta } from '../../../declarations';
import * as ts from 'typescript';
export declare function getComponentDecoratorMeta(checker: ts.TypeChecker, node: ts.ClassDeclaration): ComponentMeta | undefined;
