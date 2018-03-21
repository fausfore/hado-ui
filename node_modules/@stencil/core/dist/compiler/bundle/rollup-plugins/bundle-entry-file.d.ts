import { Config, EntryModule } from '../../../declarations';
export default function bundleEntryFile(config: Config, entryModules: EntryModule[]): {
    name: string;
    resolveId(importee: string): string;
    load(id: string): string;
};
export declare function createEntryPointString(config: Config, entryModule: EntryModule): string;
