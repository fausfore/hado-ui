/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
import * as d from '../../declarations';
export declare type PropsType = d.VNodeProdData | number | string | null;
export declare type ChildType = VNode | number | string;
export interface ComponentProps {
    children?: any[];
    key?: string | number | any;
}
export interface FunctionalComponent<PropsType> {
    (props?: PropsType & ComponentProps): VNode;
}
export declare class VNode implements d.VNode {
    vtag: string;
    vtext: string;
    vchildren: VNode[];
    vattrs: any;
    vkey: string | number;
    vref: (elm: HTMLElement) => void;
    elm: Element | Node;
}
export declare function h(nodeName: string | FunctionalComponent<PropsType>, vnodeData: PropsType, child?: ChildType): VNode;
export declare function h(nodeName: string | FunctionalComponent<PropsType>, vnodeData: PropsType, ...children: ChildType[]): VNode;
export declare function t(textValue: any): VNode;
