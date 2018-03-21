import { BuildCtx, Config } from '../../../declarations/index';
import * as ts from 'typescript';
export declare function moduleGraph(config: Config, buildCtx: BuildCtx): ts.TransformerFactory<ts.SourceFile>;
