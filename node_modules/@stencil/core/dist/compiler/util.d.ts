import { CompilerCtx, Config, Diagnostic, SourceTarget } from '../declarations';
/**
 * Test if a file is a typescript source file, such as .ts or .tsx.
 * However, d.ts files and spec.ts files return false.
 * @param filePath
 */
export declare function isTsFile(filePath: string): boolean;
export declare function isDtsFile(filePath: string): boolean;
export declare function isJsFile(filePath: string): boolean;
export declare function hasFileExtension(filePath: string, extensions: string[]): boolean;
export declare function isCssFile(filePath: string): boolean;
export declare function isHtmlFile(filePath: string): boolean;
/**
 * Only web development text files, like ts, tsx,
 * js, html, css, scss, etc.
 * @param filePath
 */
export declare function isWebDevFile(filePath: string): boolean;
export declare function minifyJs(config: Config, compilerCtx: CompilerCtx, jsText: string, sourceTarget: SourceTarget, preamble: boolean): Promise<{
    output: string;
    sourceMap?: any;
    diagnostics?: Diagnostic[];
}>;
export declare function generatePreamble(config: Config): string;
export declare function buildError(diagnostics: Diagnostic[]): Diagnostic;
export declare function buildWarn(diagnostics: Diagnostic[]): Diagnostic;
export declare function catchError(diagnostics: Diagnostic[], err: Error): Diagnostic;
export declare function hasError(diagnostics: Diagnostic[]): boolean;
export declare function pathJoin(config: Config, ...paths: string[]): string;
export declare function normalizePath(str: string): string;
