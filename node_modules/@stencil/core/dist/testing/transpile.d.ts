import { Diagnostic } from '../declarations';
export declare function transpile(input: string, opts?: TranspileOptions, path?: string): TranspileResults;
export interface TranspileOptions {
    module?: 'None' | 'CommonJS' | 'AMD' | 'System' | 'UMD' | 'ES6' | 'ES2015' | 'ESNext' | string;
    target?: 'ES5' | 'ES6' | 'ES2015' | 'ES2016' | 'ES2017' | 'ESNext' | string;
    [key: string]: any;
}
export interface TranspileResults {
    diagnostics: Diagnostic[];
    code?: string;
}
