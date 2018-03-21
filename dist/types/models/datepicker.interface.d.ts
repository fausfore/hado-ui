/// <reference types="moment" />
import { Moment } from "moment";
export interface DatePickerItem {
    date: Moment;
    disable: boolean;
    current: boolean;
    isBetween?: boolean;
    selected: boolean;
}
export interface DatePickerState {
    datesArray: Array<DatePickerItem>;
    openDatePicker: boolean;
    dateSelected: Moment;
    id: string;
}
export interface OptionsState {
    calendarIconClass: string;
    angleRightIconClass: string;
    angleLeftIconClass: string;
    closeIconClass: string;
    labels: string | string[];
    activePreviousDate: boolean;
}
export interface RangePickerState {
    datesArray: Array<DatePickerItem>;
    openDatePicker: boolean;
    StartDateSelected: Moment;
    EndDateSelected: Moment;
    InputType: string;
}
