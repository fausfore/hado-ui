import { EventMeta, EventOptions } from '../../../util/interfaces';
import * as ts from 'typescript';
export declare function getEventDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration): EventMeta[];
export declare function convertOptionsToMeta(rawEventOpts: EventOptions, methodName: string): EventMeta | null;
