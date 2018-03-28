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
    activePreviousDate: boolean;
    startWeek: number;
    mode: string;
    labels: {
        title: string;
        title_2: string;
        datepickerBtnValue: string;
        rangeNextBtnValue: string;
        months: string[];
        days: string[];
    };
}
export interface RangePickerState {
    datesArray: Array<DatePickerItem>;
    openDatePicker: boolean;
    rangeStartValue: Moment;
    rangeEndValue: Moment;
    InputType: string;
}
export interface Inputs {
    mode: string;
    singleValue?: string;
    rangeStartValue?: string;
    rangeEndValue?: string;
    calendarIcon: string;
    angleRightIcon: string;
    angleLeftIcon: string;
    closeIcon: string;
    activePreviousDate: boolean;
    startWeek: number;
    labels: {
        datepickerBtnValue: string;
        rangeNextBtnValue: string;
        title: string;
        title_2: string;
        months: string[];
        days: string[];
    };
}
