import { CompilerCtx, Config } from '../../../declarations';
import * as ts from 'typescript';
export default function pathsResolver(config: Config, compilerCtx: CompilerCtx, testTsconfig?: ts.CompilerOptions): Promise<{
    name: string;
    resolveId(importee: string, importer: string): string;
}>;
