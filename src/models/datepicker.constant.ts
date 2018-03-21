import { DatePickerState, RangePickerState, OptionsState } from "./datepicker.interface";

export const ModeOptions = {
  RANGE: 'range',
  SINGLE: 'single'
};

export const defaultDatepickerState: DatePickerState = {
  datesArray: [],
  openDatePicker: false,
  dateSelected: undefined,
  id: undefined
};

export const defaultRangepickerState: RangePickerState = {
  datesArray: [],
  openDatePicker: false,
  StartDateSelected: undefined,
  EndDateSelected: undefined,
  InputType: undefined
};

export const defaultOptionsState: OptionsState = {
  calendarIconClass: undefined,
  angleRightIconClass: undefined,
  angleLeftIconClass: undefined,
  closeIconClass: undefined,
  labels: undefined,
  activePreviousDate: false
};
