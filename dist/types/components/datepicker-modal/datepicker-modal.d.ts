import '../../stencil.core';
/// <reference types="moment" />
import { EventEmitter } from '../../stencil.core';
import { Moment } from 'moment';
import { DatePickerItem, DatePickerState, OptionsState } from '../../models/datepicker.interface';
export declare class DatepickerModal {
    private _datepickerService;
    dateSelectedEvent: EventEmitter;
    closedModalEvent: EventEmitter;
    datepickerModel: DatePickerState;
    optionsModel: OptionsState;
    DOMElement: HTMLElement;
    month: string;
    year: string;
    datePickerConfig: {
        year: any;
        month: any;
    };
    localDateSelected: Moment;
    dataItemConfig: {
        animation: string;
        itemList: DatePickerItem[];
    };
    days: Array<string>;
    componentDidLoad(): void;
    componentDidUnload(): void;
    test(newProp: any): void;
    initCalendarDateValue(): void;
    updateDatepickerLabel(config: any): void;
    activeTouchArea(): void;
    nextMonth(): void;
    prevMonth(): void;
    chooseDate(event: CustomEvent<DatePickerItem>): void;
    selectDate(): void;
    closeModal(): void;
    render(): JSX.Element;
}
