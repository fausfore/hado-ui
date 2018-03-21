export interface Hyperscript {
    (sel: any): VNode;
    (sel: Node, data: VNodeData): VNode;
    (sel: any, data: VNodeData): VNode;
    (sel: any, text: string): VNode;
    (sel: any, children: Array<VNode | undefined | null>): VNode;
    (sel: any, data: VNodeData, text: string): VNode;
    (sel: any, data: VNodeData, children: Array<VNode | undefined | null>): VNode;
    (sel: any, data: VNodeData, children: VNode): VNode;
}
declare global  {
    var h: Hyperscript;
}
export interface VNode {
    vtag?: string | number | Function;
    vkey?: string | number;
    vtext?: string;
    vchildren?: VNode[];
    vattrs?: any;
    vref?: (elm: any) => void;
    elm?: Element | Node;
}
export interface VNodeData {
    props?: any;
    attrs?: any;
    class?: {
        [className: string]: boolean;
    };
    style?: any;
    on?: any;
    key?: Key;
    ns?: any;
}
/**
 * used by production compiler
 */
export interface VNodeProdData {
    key?: Key;
    class?: {
        [className: string]: boolean;
    } | string;
    className?: {
        [className: string]: boolean;
    } | string;
    style?: any;
    [key: string]: any;
}
export declare type Key = string | number;
export declare type DefaultSlot = Node[];
export interface NamedSlots {
    [slotName: string]: Node[];
}
