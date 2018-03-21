import * as d from './index';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../util/constants';
export interface ComponentWillLoad {
    /**
     * componentWillLoad
     */
    componentWillLoad: () => Promise<void> | void;
}
export interface ComponentDidLoad {
    /**
     * componentDidLoad
     */
    componentDidLoad: () => void;
}
export interface ComponentWillUpdate {
    /**
     * componentWillUpdate
     */
    componentWillUpdate: () => Promise<void> | void;
}
export interface ComponentDidUpdate {
    /**
     * componentDidUpdate
     */
    componentDidUpdate: () => void;
}
export interface ComponentDidUnload {
    /**
     * componentDidUnload
     */
    componentDidUnload: () => void;
}
export interface ComponentConstructor {
    is?: string;
    properties?: ComponentConstructorProperties;
    events?: ComponentConstructorEvent[];
    host?: any;
    style?: string;
    styleMode?: string;
    encapsulation?: Encapsulation;
}
export interface ComponentMeta {
    tagNameMeta?: string;
    bundleIds?: string | BundleIds;
    stylesMeta?: d.StylesMeta;
    membersMeta?: MembersMeta;
    eventsMeta?: EventMeta[];
    listenersMeta?: ListenMeta[];
    hostMeta?: HostMeta;
    encapsulation?: ENCAPSULATION;
    assetsDirsMeta?: AssetsMeta[];
    componentConstructor?: ComponentConstructor;
    componentClass?: string;
    dependencies?: ComponentDependencies;
    jsdoc?: JSDoc;
}
export interface BundleIds {
    [modeName: string]: string;
}
export interface MembersMeta {
    [memberName: string]: MemberMeta;
}
export interface MemberMeta {
    memberType?: MEMBER_TYPE;
    propType?: PROP_TYPE;
    attribName?: string;
    attribType?: AttributeTypeInfo;
    ctrlId?: string;
    jsdoc?: JSDoc;
    watchCallbacks?: string[];
}
export interface AttributeTypeReference {
    referenceLocation: 'local' | 'global' | 'import';
    importReferenceLocation?: string;
}
export interface AttributeTypeInfo {
    text: string;
    typeReferences?: {
        [key: string]: AttributeTypeReference;
    };
}
export interface AssetsMeta {
    absolutePath?: string;
    cmpRelativePath?: string;
    originalComponentPath?: string;
    originalCollectionPath?: string;
}
export interface HostMeta {
    [key: string]: any;
}
export declare type Encapsulation = 'shadow' | 'scoped' | 'none';
export interface ComponentConstructorProperties {
    [propName: string]: ComponentConstructorProperty;
}
export interface ComponentConstructorProperty {
    attr?: string;
    connect?: string;
    context?: string;
    elementRef?: boolean;
    method?: boolean;
    mutable?: boolean;
    state?: boolean;
    type?: PropertyType;
    watchCallbacks?: string[];
}
export declare type PropertyType = StringConstructor | BooleanConstructor | NumberConstructor | 'Any';
export interface ComponentConstructorEvent {
    name: string;
    method: string;
    bubbles: boolean;
    cancelable: boolean;
    composed: boolean;
}
export interface EventMeta {
    eventName: string;
    eventMethodName?: string;
    eventBubbles?: boolean;
    eventCancelable?: boolean;
    eventComposed?: boolean;
    jsdoc?: JSDoc;
}
export interface ListenMeta {
    eventMethodName?: string;
    eventName?: string;
    eventCapture?: boolean;
    eventPassive?: boolean;
    eventDisabled?: boolean;
    jsdoc?: JSDoc;
}
export interface JSDoc {
    name: string;
    documentation: string;
    type: string;
}
export declare type ComponentDependencies = string[];
export interface ComponentInstance {
    componentWillLoad?: () => Promise<void>;
    componentDidLoad?: () => void;
    componentWillUpdate?: () => Promise<void>;
    componentDidUpdate?: () => void;
    componentDidUnload?: () => void;
    render?: () => any;
    hostData?: () => d.VNodeData;
    mode?: string;
    color?: string;
    [memberName: string]: any;
}
export declare abstract class ComponentModule {
    abstract componentWillLoad?: () => Promise<void>;
    abstract componentDidLoad?: () => void;
    abstract componentWillUpdate?: () => Promise<void>;
    abstract componentDidUpdate?: () => void;
    abstract componentDidUnload?: () => void;
    abstract render?: () => any;
    abstract hostData?: () => d.VNodeData;
    abstract mode?: string;
    abstract color?: string;
    abstract __el?: HostElement;
    [memberName: string]: any;
    readonly abstract is: string;
    readonly abstract properties: string;
}
export interface ComponentInternalValues {
    [propName: string]: any;
}
export interface ComponentModule {
    new (): ComponentInstance;
}
export interface ComponentRegistry {
    [tagName: string]: ComponentMeta;
}
export interface HostElement extends HTMLElement {
    connectedCallback: () => void;
    attributeChangedCallback?: (attribName: string, oldVal: string, newVal: string, namespace: string) => void;
    disconnectedCallback?: () => void;
    host: Element;
    forceUpdate: () => void;
    $activeLoading?: HostElement[];
    $defaultHolder?: Comment;
    $initLoad: () => void;
    $rendered?: boolean;
    $onRender: (() => void)[];
    componentOnReady?: (cb?: (elm: HostElement) => void) => Promise<void>;
    color?: string;
    mode?: string;
}
export interface ComponentAppliedStyles {
    [tagNameForStyles: string]: boolean;
}
export declare type OnReadyCallback = ((elm: HostElement) => void);
export interface LoadComponentRegistry {
    /**
     * tag name (ion-badge)
     */
    [0]: string;
    /**
     * map of bundle ids
     */
    [1]: {
        [modeName: string]: any[];
    };
    /**
     * has styles
     */
    [2]: boolean;
    /**
     * members
     */
    [3]: ComponentMemberData[];
    /**
     * encapsulated
     */
    [4]: ENCAPSULATION;
    /**
     * listeners
     */
    [5]: ComponentListenersData[];
}
export interface ComponentMemberData {
    /**
     * member name
     */
    [0]: string;
    /**
     * member type
     */
    [1]: number;
    /**
     * is attribute name to observe
     */
    [2]: string | number;
    /**
     * prop type
     */
    [3]: number;
    /**
     * controller id
     */
    [4]: string;
}
export interface ComponentListenersData {
    /**
     * methodName
     */
    [0]: string;
    /**
     * eventName
     */
    [1]: string;
    /**
     * capture
     */
    [2]: number;
    /**
     * passive
     */
    [3]: number;
    /**
     * enabled
     */
    [4]: number;
}
export interface ComponentEventData {
    /**
     * eventName
     */
    [0]: string;
    /**
     * instanceMethodName
     */
    [1]: string;
    /**
     * eventBubbles
     */
    [2]: number;
    /**
     * eventCancelable
     */
    [3]: number;
    /**
     * eventComposed
     */
    [4]: number;
}
