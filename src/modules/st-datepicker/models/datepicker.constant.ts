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
  rangeStartValue: undefined,
  rangeEndValue: undefined,
  InputType: undefined
};

export const defaultOptionsState: OptionsState = {
  calendarIconClass: undefined,
  angleRightIconClass: undefined,
  angleLeftIconClass: undefined,
  closeIconClass: undefined,
  activePreviousDate: false,
  mode: ModeOptions.SINGLE,
  startWeek: 0,
  labels: {
    title: 'First date',
    title_2: 'Last date',
    placeholder: '...',
    placeholder_2: '...',
    datepickerBtnValue: 'Valid',
    rangeNextBtnValue: 'Next',
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    days: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ]
  }

};
