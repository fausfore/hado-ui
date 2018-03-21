import { Config } from '../declarations';
import { TestingLogger } from './testing-logger';
import { TestingSystem } from './testing-sys';
export declare class TestingConfig implements Config {
    logger: TestingLogger;
    sys: TestingSystem;
    rootDir: string;
    suppressTypeScriptErrors: boolean;
    devMode: boolean;
    enableCache: boolean;
    buildAppCore: boolean;
}
