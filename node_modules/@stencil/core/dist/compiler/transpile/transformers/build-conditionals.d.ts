import { BuildConditionals } from '../../../util/interfaces';
import * as ts from 'typescript';
export declare function buildConditionalsTransform(coreBuild: BuildConditionals): ts.TransformerFactory<ts.SourceFile>;
