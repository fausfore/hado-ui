import { Config, ServiceWorkerConfig } from '../../declarations';
export declare function injectRegisterServiceWorker(config: Config, swConfig: ServiceWorkerConfig, indexHtml: string): Promise<string>;
export declare function injectUnregisterServiceWorker(indexHtml: string): string;
