import { BuildConditionals, CompilerCtx, TranspileResults } from '../../util/interfaces';
export declare function transpileCoreBuild(compilerCtx: CompilerCtx, coreBuild: BuildConditionals, input: string): Promise<TranspileResults>;
export declare function transpileToEs5(compilerCtx: CompilerCtx, input: string): Promise<TranspileResults>;
