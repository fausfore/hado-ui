import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { DatePickerState, OptionsState, RangePickerState, Inputs } from '../../models/datepicker.interface';
export declare class StDatepicker {
    config: Inputs;
    datepickerModel: DatePickerState;
    rangepickerModel: RangePickerState;
    optionsModel: OptionsState;
    componentWillLoad(): void;
    initAppState(config?: Inputs): void;
    render(): JSX.Element;
}
