import { CompilerCtx, Config, EntryModule, HostConfig, HostRule, HostRuleHeader, HydrateComponent, HydrateResults } from '../../declarations';
export declare function generateHostConfig(config: Config, ctx: CompilerCtx, entryModules: EntryModule[], hydrateResultss: HydrateResults[]): Promise<void>;
export declare function generateHostRule(config: Config, ctx: CompilerCtx, entryModules: EntryModule[], hydrateResults: HydrateResults): HostRule;
export declare function generateHostRuleHeaders(config: Config, ctx: CompilerCtx, entryModules: EntryModule[], hydrateResults: HydrateResults): HostRuleHeader[];
export declare function addBundles(config: Config, entryModules: EntryModule[], hostRuleHeaders: HostRuleHeader[], components: HydrateComponent[]): void;
export declare function getBundleIds(entryModules: EntryModule[], components: HydrateComponent[]): string[];
export declare function sortComponents(components: HydrateComponent[]): HydrateComponent[];
export declare function formatLinkRelPreloadHeader(url: string): HostRuleHeader;
export declare function mergeUserHostConfig(userHostConfig: HostConfig, hostConfig: HostConfig): void;
