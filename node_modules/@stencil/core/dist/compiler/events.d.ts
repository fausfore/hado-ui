import { BuildResults, CompilerEventName, Config } from '../util/interfaces';
export declare class BuildEvents {
    private config;
    private evCallbacks;
    constructor(config: Config);
    subscribe(eventName: 'fileUpdate', cb: (path: string) => void): Function;
    subscribe(eventName: 'fileAdd', cb: (path: string) => void): Function;
    subscribe(eventName: 'fileDelete', cb: (path: string) => void): Function;
    subscribe(eventName: 'dirAdd', cb: (path: string) => void): Function;
    subscribe(eventName: 'dirDelete', cb: (path: string) => void): Function;
    subscribe(eventName: 'build', cb: (buildResults: BuildResults) => void): Function;
    subscribe(eventName: 'rebuild', cb: (buildResults: BuildResults) => void): Function;
    unsubscribe(eventName: string, cb: Function): void;
    unsubscribeAll(): void;
    emit(eventName: CompilerEventName, ...args: any[]): void;
}
