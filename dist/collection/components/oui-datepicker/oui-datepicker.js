import moment from 'moment';
import { defaultDatepickerState, defaultOptionsState, defaultRangepickerState, ModeOptions, } from '../../models/datepicker.constant';
export class OuiDatepicker {
    IsDetect(next, before) {
        console.log('IsDetect');
        console.log(next);
        console.log(before);
        this.initAppState(this.config);
    }
    componentWillLoad() {
        console.log('The component is about to be rendered');
        this.initAppState(this.config);
    }
    componentDidLoad() {
        console.log('The component has been rendered');
    }
    componentWillUpdate() {
        console.log('The component will update');
    }
    componentDidUpdate() {
        console.log('The component did update');
    }
    componentDidUnload() {
        console.log('The view has been removed from the DOM');
    }
    initAppState(config) {
        console.log('initAppState');
        let initStartDate;
        let initEndDate;
        let initSingleDate;
        if (config.rangeStartValue) {
            initStartDate = moment(config.rangeStartValue);
        }
        else if (config.rangeEndValue) {
            initStartDate = moment(config.rangeEndValue);
        }
        else if (config.singleValue) {
            initSingleDate = moment(config.singleValue);
        }
        this.datepickerModel = Object.assign({}, defaultDatepickerState, { dateSelected: initSingleDate });
        this.rangepickerModel = Object.assign({}, defaultRangepickerState, { StartDateSelected: initStartDate, EndDateSelected: initEndDate });
        this.optionsModel = Object.assign({}, defaultOptionsState, { calendarIconClass: config.calendarIcon, angleRightIconClass: config.angleRightIcon, angleLeftIconClass: config.angleLeftIcon, closeIconClass: config.closeIcon, labels: config.labels.split(';'), activePreviousDate: config.activePreviousDate });
    }
    render() {
        const rangePicker = this.config.mode === ModeOptions.RANGE
            ? h("datepicker-range-input", { rangepickerModel: this.rangepickerModel, optionsModel: this.optionsModel })
            : null;
        const singlePicker = this.config.mode === ModeOptions.SINGLE
            ? h("datepicker-single-input", { datepickerModel: this.datepickerModel, optionsModel: this.optionsModel })
            : null;
        return (h("main", { class: 'oui-datepicker' },
            rangePicker,
            singlePicker));
    }
    static get is() { return "oui-datepicker"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config", "watchCallbacks": ["IsDetect"] }, "datepickerModel": { "state": true }, "optionsModel": { "state": true }, "rangepickerModel": { "state": true } }; }
    static get style() { return "/**style-placeholder:oui-datepicker:**/"; }
}
