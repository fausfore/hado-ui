import '../../../stencil.core';
import { EventEmitter } from '../../../stencil.core';
export declare class InputFormComponent {
    value: any;
    iconClass: string;
    placeholder: string;
    isSelectEvent: EventEmitter;
    input: HTMLElement;
    componentDidLoad(): void;
    onSelect(): void;
    render(): JSX.Element;
}
