import { Config, Diagnostic, HydrateOptions, HydrateResults } from '../declarations';
export declare function normalizeHydrateOptions(inputOpts: HydrateOptions): HydrateOptions;
export declare function generateHydrateResults(config: Config, opts: HydrateOptions): HydrateResults;
export declare function normalizeDirection(doc: Document, opts: HydrateOptions): void;
export declare function normalizeLanguage(doc: Document, opts: HydrateOptions): void;
export declare function collectAnchors(config: Config, doc: Document, results: HydrateResults): void;
export declare function generateFailureDiagnostic(d: Diagnostic): string;
