import '../../../../stencil.core';
import { EventEmitter } from '../../../../stencil.core';
import { DatePickerItem } from '@Datepicker/models/datepicker.interface';
export declare class DateItemList {
    startDateSelectedEvent: EventEmitter;
    endDateSelectedEvent: EventEmitter;
    DateItemListEvent: EventEmitter;
    dateItemList: DatePickerItem[];
    dateItemListHost: DatePickerItem[];
    dataItemConfig: {
        animation: string;
        itemList: DatePickerItem[];
    };
    DateItemListHTML: HTMLElement;
    checkStyle(newProp: {
        animation: string;
        itemList: DatePickerItem[];
    }): void;
    chooseDate(element: DatePickerItem): void;
    getStyleClass(item: DatePickerItem): string;
    getLabel(item: any): string;
    render(): JSX.Element;
}
