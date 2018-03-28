import '../../../../stencil.core';
import { DatePickerState, OptionsState } from "@Datepicker/models/datepicker.interface";
export declare class DatepickerInput {
    datepickerModel: DatePickerState;
    optionsModel: OptionsState;
    openDatePicker: boolean;
    componentWillLoad(): void;
    getLabel(): string;
    listenCloseEvent(): void;
    toggleDatepickerModal(): void;
    render(): JSX.Element;
}
