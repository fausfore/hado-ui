import { Config, ComponentMeta } from '../../../util/interfaces';
import * as ts from 'typescript';
export declare function validateComponentClass(config: Config, cmpMeta: ComponentMeta, classNode: ts.ClassDeclaration): void;
