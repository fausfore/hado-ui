import '../../../stencil.core';
import { EventEmitter } from '../../../stencil.core';
export declare class InputFormComponent {
    value: any;
    iconClass: string;
    placeholder: string;
    input: HTMLElement;
    inputReady$: EventEmitter;
    componentDidLoad(): void;
    changeValue(props?: any): void;
    render(): JSX.Element;
}
