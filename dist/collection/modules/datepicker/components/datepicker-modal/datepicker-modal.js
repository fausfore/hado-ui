import moment from 'moment';
import * as FromDpService from '../../services/datepicker.service';
import Hammer from 'hammerjs';
export class DatepickerModal {
    constructor() {
        this.datePickerConfig = { year: undefined, month: undefined };
        // UI
        this.days = [];
    }
    componentDidLoad() {
        this.initCalendarDateValue();
        this.activeTouchArea();
    }
    initCalendarDateValue() {
        let dateParam;
        if (!this.datepickerModel.dateSelected) {
            dateParam = moment();
        }
        else {
            dateParam = this.datepickerModel.dateSelected;
        }
        this.datePickerConfig.year = Number(dateParam.format('YYYY'));
        this.datePickerConfig.month = Number(dateParam.format('MM')) - 1;
        this.days = this.optionsModel.labels.days;
        this.dataItemConfig = {
            animation: 'enter',
            itemList: FromDpService.buildCalendar(this.datePickerConfig, this.optionsModel, this.datepickerModel.dateSelected)
        };
        this.updateDatepickerLabel(this.datePickerConfig);
    }
    updateDatepickerLabel(config) {
        this.year = config.year.toString();
        this.month = this.optionsModel.labels.months[config.month];
    }
    activeTouchArea() {
        const el = document.getElementById('gesture-container');
        const hammer = new Hammer(el);
        hammer.on('swipe', (e) => {
            switch (e.direction) {
                case 2:
                    this.nextMonth();
                    break;
                case 4:
                    this.prevMonth();
                    break;
            }
        });
    }
    nextMonth() {
        this.datePickerConfig = FromDpService.validNewDateParam(this.datePickerConfig.year, this.datePickerConfig.month, 'INCREMENT');
        this.dataItemConfig = {
            animation: 'enter',
            itemList: FromDpService.buildCalendar(this.datePickerConfig, this.optionsModel, this.datepickerModel.dateSelected)
        };
        this.updateDatepickerLabel(this.datePickerConfig);
    }
    prevMonth() {
        this.datePickerConfig = FromDpService.validNewDateParam(this.datePickerConfig.year, this.datePickerConfig.month, 'DECREMENT');
        this.dataItemConfig = {
            animation: 'leave',
            itemList: FromDpService.buildCalendar(this.datePickerConfig, this.optionsModel, this.datepickerModel.dateSelected)
        };
        this.updateDatepickerLabel(this.datePickerConfig);
    }
    chooseDate(event) {
        this.localDateSelected = event.detail;
    }
    selectDate() {
        if (this.localDateSelected) {
            this.selectSingleDate.emit(this.localDateSelected);
            // Update selected date
            this.datepickerModel.dateSelected = this.localDateSelected;
            // close modal
            this.closeModal();
        }
    }
    closeModal() {
        const el = document.getElementById('datepicker-modal');
        el.className = 'datepicker-modal on-modal-leave';
        setTimeout(() => {
            this.closedModalEvent.emit();
        }, 300);
    }
    render() {
        const { closeIconClass, angleLeftIconClass, angleRightIconClass, labels } = this.optionsModel;
        const days = this.days.map((d) => (h("li", null, FromDpService.filterDayLabel(d))));
        return (h("div", { class: "datepicker-container" },
            h("div", { class: "datepicker-overlay", onClick: () => this.closeModal() }),
            h("div", { id: "datepicker-modal", class: "datepicker-modal on-modal-enter" },
                h("header", { class: "modal-header" },
                    h("h2", { class: "title" }, labels.title),
                    h("i", { class: closeIconClass, onClick: () => this.closeModal() })),
                h("article", { id: "gesture-container", class: "modal-content" },
                    h("header", { class: "content-header" },
                        h("i", { class: angleLeftIconClass, onClick: () => this.prevMonth() }),
                        h("label", null,
                            this.month,
                            " ",
                            this.year),
                        h("i", { class: angleRightIconClass, onClick: () => this.nextMonth() })),
                    h("article", null,
                        h("ul", { class: "day-list" }, days),
                        h("date-item-list", { dataItemConfig: this.dataItemConfig }))),
                h("footer", { class: "modal-footer" },
                    h("button", { onClick: () => this.selectDate() }, labels.datepickerBtnValue)))));
    }
    static get is() { return "datepicker-modal"; }
    static get properties() { return { "dataItemConfig": { "state": true }, "datePickerConfig": { "state": true }, "datepickerModel": { "type": "Any", "attr": "datepicker-model" }, "DOMElement": { "elementRef": true }, "localDateSelected": { "state": true }, "month": { "state": true }, "optionsModel": { "type": "Any", "attr": "options-model" }, "year": { "state": true } }; }
    static get events() { return [{ "name": "closedModalEvent", "method": "closedModalEvent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "selectSingleDate", "method": "selectSingleDate", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "/**style-placeholder:datepicker-modal:**/"; }
}
