import '../../stencil.core';
import { DatePickerState, OptionsState, RangePickerState, Inputs } from '../../models/datepicker.interface';
export declare class StDatepicker {
    config: Inputs;
    mode: string;
    singleValue: string;
    calendarIcon: string;
    angleRightIcon: string;
    angleLeftIcon: string;
    closeIcon: string;
    activePreviousDate: boolean;
    rangeStartValue: string;
    rangeEndValue: string;
    startWeek: number;
    title: string;
    title2: string;
    datepickerBtnValue: string;
    rangeNextBtnValue: string;
    months: Array<string>;
    days: Array<string>;
    datepickerModel: DatePickerState;
    rangepickerModel: RangePickerState;
    optionsModel: OptionsState;
    componentWillLoad(): void;
    buildPropsValue(): void;
    initAppState(config?: Inputs): void;
    render(): JSX.Element;
}
