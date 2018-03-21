import { JSDoc } from '../../../util/interfaces';
import * as ts from 'typescript';
export declare function evalText(text: string): any;
export interface GetDeclarationParameters {
    <T>(decorator: ts.Decorator): [T];
    <T, T1>(decorator: ts.Decorator): [T, T1];
    <T, T1, T2>(decorator: ts.Decorator): [T, T1, T2];
}
export declare const getDeclarationParameters: GetDeclarationParameters;
export declare function isDecoratorNamed(name: string): (dec: ts.Decorator) => boolean;
export declare function isPropertyWithDecorators(member: ts.ClassElement): boolean;
export declare function isMethodWithDecorators(member: ts.ClassElement): boolean;
export declare function serializeSymbol(checker: ts.TypeChecker, symbol: ts.Symbol): JSDoc;
export declare function isMethod(member: ts.ClassElement, methodName: string): boolean;
