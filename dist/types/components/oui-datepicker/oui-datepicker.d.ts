import '../../stencil.core';
import { DatePickerState, OptionsState, RangePickerState } from '../../models/datepicker.interface';
export declare class OuiDatepicker {
    config: {
        mode: string;
        singleValue?: string;
        rangeStartValue?: string;
        rangeEndValue?: string;
        calendarIcon: string;
        angleRightIcon: string;
        angleLeftIcon: string;
        closeIcon: string;
        labels: string;
        activePreviousDate: boolean;
    };
    datepickerModel: DatePickerState;
    rangepickerModel: RangePickerState;
    optionsModel: OptionsState;
    IsDetect(next: any, before: any): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentWillUpdate(): void;
    componentDidUpdate(): void;
    componentDidUnload(): void;
    initAppState(config: any): void;
    render(): JSX.Element;
}
