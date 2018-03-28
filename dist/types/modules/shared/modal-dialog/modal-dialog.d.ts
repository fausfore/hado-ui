import '../../../stencil.core';
import { EventEmitter } from '../../../stencil.core';
export declare class ModalDialogComponent {
    title: string;
    iconClass: string;
    modalEvent$: EventEmitter;
    closeModal(): void;
    render(): JSX.Element;
}
