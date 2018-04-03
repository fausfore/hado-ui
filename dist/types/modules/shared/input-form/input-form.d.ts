import '../../../stencil.core';
import { EventEmitter } from '../../../stencil.core';
export declare class InputFormComponent {
    value: any;
    iconClass: string;
    placeholder: string;
    readonly: boolean;
    Component: HTMLElement;
    inputReady$: EventEmitter;
    keyUp$: EventEmitter;
    componentDidLoad(): void;
    changeValue(props?: any): void;
    render(): JSX.Element;
}
