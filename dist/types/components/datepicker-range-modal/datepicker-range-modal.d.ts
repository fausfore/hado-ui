import '../../stencil.core';
/// <reference types="moment" />
import { EventEmitter } from '../../stencil.core';
import { Moment } from 'moment';
import { DatePickerItem } from '../../models/datepicker.interface';
import { OptionsState, RangePickerState } from '../../models/datepicker.interface';
export declare class DatePickerRangeModal {
    private _datepickerService;
    closeModalEvent: EventEmitter;
    startDateSelectedEvent: EventEmitter;
    endDateSelectedEvent: EventEmitter;
    navigationChange: EventEmitter;
    rangepickerModel: RangePickerState;
    optionsModel: OptionsState;
    monthLeft: string;
    yearLeft: string;
    monthRight: string;
    yearRight: string;
    datePickerConfig: {
        year: any;
        month: any;
    };
    localDateSelected: DatePickerItem;
    formType: string;
    animationMode: string;
    dataItemLeftConfig: {
        animation: string;
        itemList: DatePickerItem[];
    };
    dataItemRightConfig: {
        animation: string;
        itemList: DatePickerItem[];
    };
    days: Array<string>;
    current_date: Moment;
    componentWillLoad(): void;
    componentDidLoad(): void;
    initCalendarDateValue(): void;
    updateDatepickerLabel(): void;
    buildCalendar(firstDay: Date, lastDay: Date): DatePickerItem[];
    changeDateParmaValue(): void;
    nextMonth(): void;
    prevMonth(): void;
    nextInputForm(type: any): void;
    chooseDate(event: CustomEvent<DatePickerItem>): void;
    closeModal(): void;
    render(): JSX.Element;
}
