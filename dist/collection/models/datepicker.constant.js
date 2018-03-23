export const ModeOptions = {
    RANGE: 'range',
    SINGLE: 'single'
};
export const defaultDatepickerState = {
    datesArray: [],
    openDatePicker: false,
    dateSelected: undefined,
    id: undefined
};
export const defaultRangepickerState = {
    datesArray: [],
    openDatePicker: false,
    rangeStartValue: undefined,
    rangeEndValue: undefined,
    InputType: undefined
};
export const defaultOptionsState = {
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
        datepickerBtnValue: 'Validate',
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
