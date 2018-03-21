import { CompilerCtx, Config } from '../../../declarations';
export default function inMemoryFsRead(config: Config, compilerCtx: CompilerCtx): {
    name: string;
    resolveId(importee: string, importer: string): Promise<string>;
    load(sourcePath: string): Promise<string>;
};
