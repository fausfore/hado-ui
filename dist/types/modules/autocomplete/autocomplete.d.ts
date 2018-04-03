import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { IState } from './autocomplete.interface';
export declare class Autocomplete {
    values: any[];
    property: string;
    placeholder: string;
    ElementList: any[];
    ElementListFilter: any[];
    ObjProperty: string;
    ShowList: boolean;
    inputValue: string;
    text: string;
    NewValueList$: EventEmitter;
    isLoaded$: EventEmitter;
    selectedItem$: EventEmitter;
    Component: HTMLElement;
    componentWillLoad(): void;
    componentDidLoad(): void;
    closeListBlock(): void;
    initialize(props?: IState): void;
    update({detail}: {
        detail: any;
    }): void;
    pipeFilter(array: any[], wording: string): any[];
    selectItem(item: any): void;
    renderList(): JSX.Element[];
    render(): JSX.Element;
}
