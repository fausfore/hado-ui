import moment from 'moment';
import { defaultDatepickerState, defaultOptionsState, defaultRangepickerState, ModeOptions, } from '../../models/datepicker.constant';
export class OuiDatepicker {
    componentWillLoad() {
        this.initAppState();
    }
    initAppState() {
        let initStartDate;
        let initEndDate;
        let initSingleDate;
        if (this.rangeStartValue) {
            initStartDate = moment(this.rangeStartValue);
        }
        else if (this.rangeEndValue) {
            initStartDate = moment(this.rangeEndValue);
        }
        else if (this.singleValue) {
            initSingleDate = moment(this.singleValue);
        }
        this.datepickerModel = Object.assign({}, defaultDatepickerState, { dateSelected: initSingleDate });
        this.rangepickerModel = Object.assign({}, defaultRangepickerState, { StartDateSelected: initStartDate, EndDateSelected: initEndDate });
        this.optionsModel = Object.assign({}, defaultOptionsState, { calendarIconClass: this.calendarIcon, angleRightIconClass: this.angleRightIcon, angleLeftIconClass: this.angleLeftIcon, closeIconClass: this.closeIcon, labels: this.labels.split(';'), activePreviousDate: this.activePreviousDate });
    }
    render() {
        const rangePicker = this.mode === ModeOptions.RANGE
            ? h("datepicker-range-input", { rangepickerModel: this.rangepickerModel, optionsModel: this.optionsModel })
            : null;
        const singlePicker = this.mode === ModeOptions.SINGLE
            ? h("datepicker-single-input", { datepickerModel: this.datepickerModel, optionsModel: this.optionsModel })
            : null;
        return (h("main", { class: 'oui-datepicker' },
            rangePicker,
            singlePicker));
    }
    static get is() { return "oui-datepicker"; }
    static get properties() { return { "activePreviousDate": { "type": Boolean, "attr": "active-previous-date" }, "angleLeftIcon": { "type": String, "attr": "angle-left-icon" }, "angleRightIcon": { "type": String, "attr": "angle-right-icon" }, "calendarIcon": { "type": String, "attr": "calendar-icon" }, "closeIcon": { "type": String, "attr": "close-icon" }, "datepickerModel": { "state": true }, "labels": { "type": String, "attr": "labels" }, "mode": { "type": String, "attr": "mode" }, "optionsModel": { "state": true }, "rangeEndValue": { "type": String, "attr": "range-end-value" }, "rangepickerModel": { "state": true }, "rangeStartValue": { "type": String, "attr": "range-start-value" }, "singleValue": { "type": String, "attr": "single-value" } }; }
    static get style() { return "/**style-placeholder:oui-datepicker:**/"; }
}
