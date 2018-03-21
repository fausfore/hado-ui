import { BuildCtx, CompilerCtx } from '../../../declarations';
import * as ts from 'typescript';
export declare function componentDependencies(compilerCtx: CompilerCtx, buildCtx: BuildCtx): ts.TransformerFactory<ts.SourceFile>;
