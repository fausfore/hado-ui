import moment from 'moment';
import { datepickerService } from '../../services/datepicker.service';
export class DatePickerRangeModal {
    constructor() {
        this._datepickerService = new datepickerService();
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
            baseDate = this.rangepickerModel.StartDateSelected || moment();
        }
        else {
            baseDate = this.rangepickerModel.EndDateSelected || moment();
        }
        this.datePickerConfig.year = Number(baseDate.format('YYYY'));
        this.datePickerConfig.month = Number(baseDate.format('MM')) - 1;
        this.updateDatepickerLabel();
        this.changeDateParmaValue();
    }
    updateDatepickerLabel() {
        this.yearLeft = moment().year(this.datePickerConfig.year).format('YYYY');
        this.monthLeft = moment().month(this.datePickerConfig.month).format('MMMM');
        this.yearRight = moment().year(this.datePickerConfig.year).format('YYYY');
        this.monthRight = moment().month(this.datePickerConfig.month + 1).format('MMMM');
    }
    buildCalendar(firstDay, lastDay) {
        let Dates = [];
        const month_config_date = {
            start: moment(firstDay),
            end: moment(lastDay)
        };
        this.days = this._datepickerService.createWeeKLabel();
        this.yearLeft = month_config_date.start.format('YYYY');
        this.yearRight = month_config_date.start.format('YYYY');
        let dateIteration = month_config_date.start;
        const differ = dateIteration.diff(month_config_date.end, 'days');
        for (let i = 0; i < Math.abs(differ); i++) {
            const iterableDateFormat = dateIteration.format('YYYY-MM-DD');
            const currentDateFormat = this.current_date.format('YYYY-MM-DD');
            const selectedDateStartFormat = this.rangepickerModel.StartDateSelected
                ? this.rangepickerModel.StartDateSelected.format('YYYY-MM-DD')
                : null;
            const selectedDateEndFormat = this.rangepickerModel.EndDateSelected
                ? this.rangepickerModel.EndDateSelected.format('YYYY-MM-DD')
                : null;
            let isCurrentDate = false;
            let isSelectDate = false;
            let isDisable = false;
            let isBetween = false;
            if (moment(iterableDateFormat).isSame(currentDateFormat)) {
                isCurrentDate = true;
            }
            if (moment(iterableDateFormat).isSame(selectedDateStartFormat)) {
                isSelectDate = true;
            }
            if (moment(iterableDateFormat).isSame(selectedDateEndFormat)) {
                isSelectDate = true;
            }
            if (this.optionsModel.activePreviousDate) {
                moment(iterableDateFormat).isBefore(currentDateFormat)
                    ? isDisable = true
                    : null;
            }
            if (selectedDateEndFormat && selectedDateStartFormat) {
                if (moment(iterableDateFormat)
                    .isBetween(selectedDateStartFormat, selectedDateEndFormat)) {
                    isBetween = true;
                }
            }
            Dates.push({
                date: dateIteration,
                disable: isDisable,
                current: isCurrentDate,
                isBetween: isBetween,
                selected: isSelectDate
            });
            dateIteration = moment(dateIteration).add(1, 'days');
        }
        for (let i = 1; i <= month_config_date.start.day() - 1; i++) {
            let beforeValue = moment(month_config_date.start).subtract(i, 'days');
            Dates.length <= 35 ? Dates = [{
                    date: beforeValue,
                    disable: true,
                    selected: false,
                    isBetween: false,
                    current: false
                }, ...Dates] : null;
        }
        if (Dates.length / 7 > 5) {
            let start = moment(month_config_date.end).day() - 1;
            for (let i = start + 1; i <= 6; i++) {
                let afterValue = month_config_date.end.add(i, 'days');
                Dates = [
                    ...Dates,
                    {
                        date: afterValue,
                        disable: true,
                        selected: false,
                        isBetween: false,
                        current: false
                    }
                ];
            }
        }
        else {
            if (Dates.length < 35) {
                let count = 0;
                for (let i = Dates.length; i < 35; i++) {
                    count += 1;
                    let afterValue = moment(month_config_date.end).add(count, 'days');
                    Dates = [
                        ...Dates,
                        {
                            date: afterValue,
                            disable: true,
                            selected: false,
                            isBetween: false,
                            current: false
                        }
                    ];
                }
            }
        }
        return Dates;
    }
    changeDateParmaValue() {
        this.dataItemLeftConfig = {
            animation: undefined,
            itemList: this.buildCalendar(new Date(this.datePickerConfig.year, this.datePickerConfig.month, 1), new Date(this.datePickerConfig.year, this.datePickerConfig.month + 1, 0))
        };
        this.dataItemRightConfig = {
            animation: undefined,
            itemList: this.buildCalendar(new Date(this.datePickerConfig.year, this.datePickerConfig.month + 1, 1), new Date(this.datePickerConfig.year, this.datePickerConfig.month + 2, 0))
        };
    }
    nextMonth() {
        this.datePickerConfig.month = this.datePickerConfig.month + 1;
        this.updateDatepickerLabel();
        this.changeDateParmaValue();
    }
    prevMonth() {
        this.datePickerConfig.month = this.datePickerConfig.month - 1;
        this.updateDatepickerLabel();
        this.changeDateParmaValue();
    }
    nextInputForm(type) {
        this.navigationChange.emit(type);
        this.formType = type;
    }
    chooseDate(event) {
        const screen = window.matchMedia("(max-width: 780px");
        if (this.formType === 'start') {
            this.rangepickerModel.StartDateSelected = event.detail;
            if (!screen.matches) {
                this.nextInputForm('end');
            }
            this.startDateSelectedEvent.emit(event.detail);
        }
        else {
            this.rangepickerModel.EndDateSelected = event.detail;
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
        const days = this.days.map((d) => (h("li", null, d)));
        return (h("div", { class: "rangepicker-container" },
            h("div", { class: "rangepicker-overlay", onClick: () => this.closeModal() }),
            h("div", { id: "range-container", class: "range-container on-modal-enter" },
                h("div", { class: `rangepicker-modal previous-date ${this.formType === 'start' ? 'active' : ''}` },
                    h("header", { class: "modal-header" },
                        h("h2", { class: "title" }, labels[0]),
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
                        h("button", { onClick: () => this.nextInputForm('end') }, "Valider"))),
                h("div", { class: `rangepicker-modal next-date ${this.formType === 'end' ? 'active' : ''}` },
                    h("header", { class: "modal-header" },
                        h("h2", { class: "title" }, labels[1]),
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
                        h("button", { onClick: () => this.closeModal() }, "Fermer"))))));
    }
    static get is() { return "datepicker-range-modal"; }
    static get properties() { return { "animationMode": { "state": true }, "dataItemLeftConfig": { "state": true }, "dataItemRightConfig": { "state": true }, "datePickerConfig": { "state": true }, "formType": { "state": true }, "localDateSelected": { "state": true }, "monthLeft": { "state": true }, "monthRight": { "state": true }, "optionsModel": { "type": "Any", "attr": "options-model" }, "rangepickerModel": { "type": "Any", "attr": "rangepicker-model" }, "yearLeft": { "state": true }, "yearRight": { "state": true } }; }
    static get events() { return [{ "name": "closeModalEvent", "method": "closeModalEvent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "startDateSelectedEvent", "method": "startDateSelectedEvent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "endDateSelectedEvent", "method": "endDateSelectedEvent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "navigationChange", "method": "navigationChange", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "/**style-placeholder:datepicker-range-modal:**/"; }
}
