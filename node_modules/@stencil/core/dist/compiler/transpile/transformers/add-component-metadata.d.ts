import { ComponentMeta, ModuleFiles } from '../../../util/interfaces';
import * as ts from 'typescript';
export default function addComponentMetadata(moduleFiles: ModuleFiles): ts.TransformerFactory<ts.SourceFile>;
export declare function addStaticMeta(cmpMeta: ComponentMeta): ConstructorComponentMeta;
export interface ConstructorComponentMeta {
    is?: ts.Expression;
    encapsulation?: ts.Expression;
    host?: ts.Expression;
    properties?: ts.Expression;
    didChange?: ts.Expression;
    willChange?: ts.Expression;
    events?: ts.Expression;
    style?: ts.Expression;
    styleMode?: ts.Expression;
}
