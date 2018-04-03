import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { IState } from './autocomplete.interface';
export declare class Autocomplete {
    values: any[];
    property: string;
    ElementList: any[];
    ElementListFilter: any[];
    ObjProperty: string;
    NewValueList$: EventEmitter;
    isLoaded$: EventEmitter;
    componentWillLoad(): void;
    componentDidLoad(): void;
    initialize(props?: IState): void;
    update({detail}: {
        detail: any;
    }): void;
    pipeFilter(array: any[], wording: string): any[];
    renderList(): JSX.Element[];
    render(): JSX.Element;
}
