import { Cache } from '../compiler/cache';
import { CompilerCtx, ComponentInstance, ComponentMeta, Config, DomApi, HostElement, PlatformApi, RendererApi, StencilSystem } from '../declarations';
import { TestingFs } from './testing-fs';
import { TestingLogger } from './index';
export declare function mockPlatform(win?: any, domApi?: DomApi): MockedPlatform;
export interface MockedPlatform extends PlatformApi {
    $flushQueue?: () => Promise<any>;
    $flushLoadBundle?: () => Promise<any>;
}
export declare function mockConfig(opts?: {
    enableLogger: boolean;
}): Config;
export declare function mockCompilerCtx(): CompilerCtx;
export declare function mockStencilSystem(): StencilSystem;
export declare function mockFs(): TestingFs;
export declare function mockLogger(): TestingLogger;
export declare function mockCache(): Cache;
export declare function mockWindow(): Window;
export declare function mockDocument(window?: Window): Document;
export declare function mockDomApi(win?: any, doc?: any): DomApi;
export declare function mockRenderer(plt?: MockedPlatform, domApi?: DomApi): RendererApi;
export declare function mockQueue(): {
    add: (cb: Function) => void;
    flush: (cb?: Function) => void;
    clear: () => void;
};
export declare function mockHtml(html: string): Element;
export declare function mockSVGElement(): Element;
export declare function mockElement(tag?: string): Element;
export declare function mockComponentInstance(plt: PlatformApi, domApi: DomApi, cmpMeta?: ComponentMeta): ComponentInstance;
export declare function mockTextNode(text: string): Element;
export declare function mockDefine(plt: MockedPlatform, cmpMeta: ComponentMeta): ComponentMeta;
export declare function mockEvent(domApi: DomApi, name: string, detail?: any): CustomEvent;
export declare function mockDispatchEvent(domApi: DomApi, el: HTMLElement, name: string, detail?: any): boolean;
export declare function mockConnect(plt: MockedPlatform, html: string): any;
export declare function waitForLoad(plt: MockedPlatform, rootNode: any, tag: string): Promise<HostElement>;
export declare function compareHtml(input: string): string;
export declare function removeWhitespaceFromNodes(node: Node): any;
