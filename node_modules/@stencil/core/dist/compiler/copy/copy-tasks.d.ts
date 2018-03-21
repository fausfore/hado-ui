import { CompilerCtx, Config, CopyTask, Diagnostic } from '../../declarations';
export declare function copyTasks(config: Config, compilerCtx: CompilerCtx, diagnostics: Diagnostic[], commit: boolean): Promise<void>;
export declare function processCopyTasks(config: Config, compilerCtx: CompilerCtx, allCopyTasks: CopyTask[], copyTask: CopyTask): Promise<any>;
export declare function createGlobCopyTask(config: Config, copyTask: CopyTask, destDir: string, globRelPath: string): CopyTask;
export declare function processCopyTask(config: Config, copyTask: CopyTask, destAbsPath: string): CopyTask;
export declare function getSrcAbsPath(config: Config, src: string): string;
export declare function getDestAbsPath(config: Config, src: string, destAbsPath: string, destRelPath: string): string;
export declare function isCopyTaskFile(config: Config, filePath: string): boolean;
