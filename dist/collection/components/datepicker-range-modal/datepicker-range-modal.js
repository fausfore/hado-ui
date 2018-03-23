import moment from 'moment';
import * as FromDpService from '../../services/datepicker.service';
export class DatePickerRangeModal {
    constructor() {
        this.datePickerConfig = { year: undefined, month: undefined };
        // UI
        this.days = [];
    }
    componentWillLoad() {
        this.current_date = moment();
        this.formType = this.rangepickerModel.InputType;
    }
    componentDidLoad() {
        this.initCalendarDateValue();
    }
    initCalendarDateValue() {
        let baseDate;
        if (this.rangepickerModel.InputType === 'start') {
            baseDate = this.rangepickerModel.rangeStartValue || moment();
        }
        else {
            baseDate = this.rangepickerModel.rangeEndValue || moment();
        }
        this.datePickerConfig.year = Number(baseDate.format('YYYY'));
        this.datePickerConfig.month = Number(baseDate.format('MM')) - 1;
        this.changeDateParmaValue();
    }
    updateDatepickerLabel() {
        // Left picker
        this.yearLeft = this.datePickerConfig.year;
        this.monthLeft = this.optionsModel.labels.months[this.datePickerConfig.month];
        // Increment one month
        const nextMonth = FromDpService.validNewDateParam(this.datePickerConfig.year, this.datePickerConfig.month, 'INCREMENT');
        // Right picker
        this.yearRight = nextMonth.year.toString();
        this.monthRight = this.optionsModel.labels.months[nextMonth.month];
    }
    changeDateParmaValue() {
        // Left picker Data
        this.dataItemLeftConfig = {
            animation: undefined,
            itemList: FromDpService.buildCalendar({
                year: this.datePickerConfig.year,
                month: this.datePickerConfig.month
            }, this.optionsModel, this.rangepickerModel.rangeStartValue, {
                rangeStartValue: this.rangepickerModel.rangeStartValue,
                rangeEndValue: this.rangepickerModel.rangeEndValue
            })
        };
        // Right picker Data
        this.dataItemRightConfig = {
            animation: undefined,
            itemList: FromDpService.buildCalendar(FromDpService.validNewDateParam(this.datePickerConfig.year, this.datePickerConfig.month, 'INCREMENT'), this.optionsModel, this.rangepickerModel.rangeStartValue, {
                rangeStartValue: this.rangepickerModel.rangeStartValue,
                rangeEndValue: this.rangepickerModel.rangeEndValue
            })
        };
        // Update labels
        this.updateDatepickerLabel();
    }
    nextMonth() {
        this.datePickerConfig = FromDpService.validNewDateParam(this.datePickerConfig.year, this.datePickerConfig.month, 'INCREMENT');
        // Update labels
        this.changeDateParmaValue();
    }
    prevMonth() {
        this.datePickerConfig = FromDpService.validNewDateParam(this.datePickerConfig.year, this.datePickerConfig.month, 'DECREMENT');
        // Update labels
        this.changeDateParmaValue();
    }
    nextInputForm(type) {
        // Switch the focus of the parent input
        this.navigationChange.emit(type);
        this.formType = type;
    }
    chooseDate(event) {
        const screen = window.matchMedia("(max-width: 780px");
        if (this.formType === 'start') {
            this.rangepickerModel.rangeStartValue = event.detail;
            if (!screen.matches) {
                this.nextInputForm('end');
            }
            this.startDateSelectedEvent.emit(event.detail);
        }
        else {
            this.rangepickerModel.rangeEndValue = event.detail;
            this.endDateSelectedEvent.emit(event.detail);
        }
        this.changeDateParmaValue();
    }
    closeModal() {
        const el = document.getElementById('range-container');
        el.className = 'range-container on-modal-leave';
        setTimeout(() => {
            this.closeModalEvent.emit();
        }, 300);
    }
    render() {
        const { angleLeftIconClass, angleRightIconClass, closeIconClass, labels } = this.optionsModel;
        const days = labels.days.map((d) => (h("li", null, FromDpService.filterDayLabel(d))));
        return (h("div", { class: "rangepicker-container" },
            h("div", { class: "rangepicker-overlay", onClick: () => this.closeModal() }),
            h("div", { id: "range-container", class: "range-container on-modal-enter" },
                h("div", { class: `rangepicker-modal previous-date ${this.formType === 'start' ? 'active' : ''}` },
                    h("header", { class: "modal-header" },
                        h("h2", { class: "title" }, labels.title),
                        h("i", { class: closeIconClass, onClick: () => this.closeModal() })),
                    h("article", { class: "modal-content" },
                        h("header", { class: "content-header" },
                            h("i", { class: `icon-prev ${angleLeftIconClass}`, onClick: () => this.prevMonth() }),
                            h("label", null,
                                this.monthLeft,
                                " ",
                                this.yearLeft),
                            h("i", { class: `icon-next ${angleRightIconClass}`, onClick: () => this.nextMonth() })),
                        h("article", null,
                            h("ul", { class: "day-list" }, days),
                            h("date-item-list", { dataItemConfig: this.dataItemLeftConfig }))),
                    h("footer", { class: "modal-footer" },
                        h("button", { onClick: () => this.nextInputForm('end') }, labels.rangeNextBtnValue))),
                h("div", { class: `rangepicker-modal next-date ${this.formType === 'end' ? 'active' : ''}` },
                    h("header", { class: "modal-header" },
                        h("h2", { class: "title" }, labels.title_2),
                        h("i", { class: closeIconClass, onClick: () => this.closeModal() })),
                    h("article", { class: "modal-content" },
                        h("header", { class: "content-header" },
                            h("i", { class: `icon-prev ${angleLeftIconClass}`, onClick: () => this.prevMonth() }),
                            h("label", null,
                                this.monthRight,
                                " ",
                                this.yearRight),
                            h("i", { class: `icon-next ${angleRightIconClass}`, onClick: () => this.nextMonth() })),
                        h("article", null,
                            h("ul", { class: "day-list" }, days),
                            h("date-item-list", { dataItemConfig: this.dataItemRightConfig }))),
                    h("footer", { class: "modal-footer" },
                        h("button", { onClick: () => this.closeModal() }, labels.datepickerBtnValue))))));
    }
    static get is() { return "datepicker-range-modal"; }
    static get properties() { return { "animationMode": { "state": true }, "dataItemLeftConfig": { "state": true }, "dataItemRightConfig": { "state": true }, "datePickerConfig": { "state": true }, "formType": { "state": true }, "localDateSelected": { "state": true }, "monthLeft": { "state": true }, "monthRight": { "state": true }, "optionsModel": { "type": "Any", "attr": "options-model" }, "rangepickerModel": { "type": "Any", "attr": "rangepicker-model" }, "yearLeft": { "state": true }, "yearRight": { "state": true } }; }
    static get events() { return [{ "name": "closeModalEvent", "method": "closeModalEvent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "startDateSelectedEvent", "method": "startDateSelectedEvent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "endDateSelectedEvent", "method": "endDateSelectedEvent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "navigationChange", "method": "navigationChange", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "/**style-placeholder:datepicker-range-modal:**/"; }
}
