import '../../stencil.core';
import { DatePickerState, OptionsState, RangePickerState } from '../../models/datepicker.interface';
export declare class OuiDatepicker {
    singleValue: string;
    rangeStartValue: string;
    rangeEndValue: string;
    calendarIcon: string;
    angleRightIcon: string;
    angleLeftIcon: string;
    closeIcon: string;
    labels: string;
    activePreviousDate: boolean;
    mode: string;
    datepickerModel: DatePickerState;
    rangepickerModel: RangePickerState;
    optionsModel: OptionsState;
    componentDidLoad(): void;
    componentWillUpdate(): void;
    initAppState(): void;
    render(): JSX.Element;
}
