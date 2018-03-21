import { Config, HydrateResults, PrerenderLocation } from '../../declarations';
export declare function normalizePrerenderLocation(config: Config, windowLocationHref: string, href: string): PrerenderLocation;
export declare function crawlAnchorsForNextUrls(config: Config, prerenderQueue: PrerenderLocation[], results: HydrateResults): void;
export declare function getPrerenderQueue(config: Config): PrerenderLocation[];
