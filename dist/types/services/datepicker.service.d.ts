/// <reference types="moment" />
import { Moment } from 'moment';
import { DatePickerItem } from '../models/datepicker.interface';
import 'moment/src/locale/fr';
export declare class datepickerService {
    private _moment;
    constructor();
    createWeeKLabel(): Array<string>;
    SetYearLabels(config: {
        year: number;
        month: number;
    }): string;
    SetMonthLabels(config: {
        year: number;
        month: number;
    }): string;
}
export declare function createWeeKLabel(): Array<string>;
export declare function SetYearLabels(config: {
    year: number;
    month: number;
}): string;
export declare function SetMonthLabels(config: {
    year: number;
    month: number;
}): string;
export declare function buildCalendar(config: {
    year: number;
    month: number;
}, options: any, selected?: Moment): Array<DatePickerItem>;
