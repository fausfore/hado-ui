import moment from 'moment';
import { defaultDatepickerState, defaultOptionsState, defaultRangepickerState, ModeOptions, } from '../../models/datepicker.constant';
export class StDatepicker {
    componentWillLoad() {
        console.log('componentWillLoad');
        console.log(this.config);
        this.initAppState(this.config);
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
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "datepickerModel": { "state": true }, "initAppState": { "method": true }, "optionsModel": { "state": true }, "rangepickerModel": { "state": true } }; }
    static get style() { return "/**style-placeholder:st-datepicker:**/"; }
}
