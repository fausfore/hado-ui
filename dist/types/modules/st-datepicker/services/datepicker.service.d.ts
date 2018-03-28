import { Moment } from 'moment';
import { DatePickerItem, OptionsState } from '@Datepicker/models/datepicker.interface';
export declare function filterDayLabel(label: string): string;
export declare function validNewDateParam(year: number, month: number, operator: string): {
    year: number;
    month: number;
};
export declare function buildCalendar(config: {
    year: number;
    month: number;
}, options: OptionsState, selected?: Moment, range?: {
    rangeStartValue: Moment;
    rangeEndValue: Moment;
}): Array<DatePickerItem>;
