import moment from 'moment';
import { defaultDatepickerState, defaultOptionsState, defaultRangepickerState, ModeOptions, } from '../../models/datepicker.constant';
export class StDatepicker {
    get props() {
        return this.DpElement;
    }
    initAppState(config) {
        let value;
        if (config) {
            value = config;
        }
        else {
            value = {
                mode: 'range',
                singleValue: '2018-03-23',
                calendarIcon: 'far fa-calendar-alt',
                angleRightIcon: 'fas fa-angle-right',
                angleLeftIcon: 'fas fa-angle-left',
                closeIcon: 'fas fa-times',
                activePreviousDate: true,
                rangeStartValue: '2018-03-23',
                rangeEndValue: '2018-03-30',
                startWeek: 1,
                labels: {
                    title: 'Date de début',
                    title_2: 'Date de Fin',
                    datepickerBtnValue: 'Validé',
                    rangeNextBtnValue: 'Suivant',
                    months: [
                        'Janvier',
                        'Février',
                        'Mars',
                        'Avril',
                        'Mai',
                        'Juin',
                        'Juillet',
                        'Aout',
                        'Septembre',
                        'Octobre',
                        'Novembre',
                        'Décembre'
                    ],
                    days: [
                        'lundi',
                        'mardi',
                        'mercredi',
                        'jeudi',
                        'vendredi',
                        'samedi',
                        'dimanche'
                    ]
                }
            };
        }
        if (!value) {
            return;
        }
        let initStartDate;
        let initEndDate;
        let initSingleDate;
        if (value.rangeStartValue) {
            initStartDate = moment(value.rangeStartValue);
        }
        if (value.rangeEndValue) {
            initEndDate = moment(value.rangeEndValue);
        }
        if (value.singleValue) {
            initSingleDate = moment(value.singleValue);
        }
        this.datepickerModel = Object.assign({}, defaultDatepickerState, { dateSelected: initSingleDate });
        this.rangepickerModel = Object.assign({}, defaultRangepickerState, { rangeStartValue: initStartDate, rangeEndValue: initEndDate });
        this.optionsModel = Object.assign({}, defaultOptionsState, { calendarIconClass: value.calendarIcon, angleRightIconClass: value.angleRightIcon, angleLeftIconClass: value.angleLeftIcon, closeIconClass: value.closeIcon, activePreviousDate: value.activePreviousDate, mode: value.mode, labels: value.labels, startWeek: value.startWeek });
    }
    componentDidLoad() {
        this.datepickerIsLoaded.emit(true);
    }
    componentWillLoad() {
        console.log('componentWillLoad');
        console.log(this.config);
        if (this.config) {
            this.initAppState(this.config);
        }
        else {
            this.buildPropsValue();
        }
    }
    buildPropsValue() {
        this.config = {
            mode: this.mode,
            singleValue: this.singleValue,
            calendarIcon: this.calendarIcon,
            angleRightIcon: this.angleRightIcon,
            angleLeftIcon: this.angleLeftIcon,
            closeIcon: this.closeIcon,
            activePreviousDate: this.activePreviousDate,
            rangeStartValue: this.rangeStartValue,
            rangeEndValue: this.rangeEndValue,
            startWeek: this.startWeek,
            labels: {
                title: this.title,
                title_2: this.title2,
                datepickerBtnValue: this.datepickerBtnValue,
                rangeNextBtnValue: this.rangeNextBtnValue,
                months: this.months,
                days: this.days
            }
        };
        console.log('buildPropsValue', this.config);
        this.initAppState(this.config);
    }
    render() {
        const rangePicker = this.optionsModel.mode === ModeOptions.RANGE
            ? h("rangepicker-input", { rangepickerModel: this.rangepickerModel, optionsModel: this.optionsModel })
            : null;
        const singlePicker = this.optionsModel.mode === ModeOptions.SINGLE
            ? h("datepicker-input", { datepickerModel: this.datepickerModel, optionsModel: this.optionsModel })
            : null;
        return (h("div", { class: 'oui-datepicker' },
            rangePicker,
            singlePicker));
    }
    static get is() { return "st-datepicker"; }
    static get properties() { return { "activePreviousDate": { "type": Boolean, "attr": "active-previous-date" }, "angleLeftIcon": { "type": String, "attr": "angle-left-icon" }, "angleRightIcon": { "type": String, "attr": "angle-right-icon" }, "calendarIcon": { "type": String, "attr": "calendar-icon" }, "closeIcon": { "type": String, "attr": "close-icon" }, "config": { "type": "Any", "attr": "config" }, "datepickerBtnValue": { "type": String, "attr": "datepicker-btn-value" }, "datepickerModel": { "state": true }, "days": { "type": "Any", "attr": "days" }, "DpElement": { "elementRef": true }, "initAppState": { "method": true }, "mode": { "type": String, "attr": "mode" }, "months": { "type": "Any", "attr": "months" }, "optionsModel": { "state": true }, "rangeEndValue": { "type": String, "attr": "range-end-value" }, "rangeNextBtnValue": { "type": String, "attr": "range-next-btn-value" }, "rangepickerModel": { "state": true }, "rangeStartValue": { "type": String, "attr": "range-start-value" }, "singleValue": { "type": String, "attr": "single-value" }, "startWeek": { "type": Number, "attr": "start-week" }, "title": { "type": String, "attr": "title" }, "title2": { "type": String, "attr": "title2" } }; }
    static get events() { return [{ "name": "datepickerIsLoaded", "method": "datepickerIsLoaded", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "/**style-placeholder:st-datepicker:**/"; }
}
