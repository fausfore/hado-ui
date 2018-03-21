import { CompilerCtx, Config, FsWriteResults } from '../../declarations';
import * as ts from 'typescript';
export declare function getTsHost(config: Config, ctx: CompilerCtx, writeQueue: Promise<FsWriteResults>[], tsCompilerOptions: ts.CompilerOptions): ts.CompilerHost;
