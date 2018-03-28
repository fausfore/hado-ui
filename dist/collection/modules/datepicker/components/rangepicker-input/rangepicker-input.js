import moment from 'moment';
export class RangepickerInput {
    componentWillLoad() {
        console.log('[RangepickerInput] - componentWillLoad');
        this.openDatePicker = this.rangepickerModel.openDatePicker;
        this.activeFormType = this.rangepickerModel.InputType;
        this.StartDateSelected = this.rangepickerModel.rangeStartValue;
        this.EndDateSelected = this.rangepickerModel.rangeEndValue;
    }
    ;
    getLabel(dateValue) {
        return dateValue ? moment(dateValue).format('DD/MM/YYYY') : null;
    }
    updateNavigation(event) {
        this.activeFormType = event.detail;
        this.rangepickerModel.InputType = event.detail;
    }
    updateStartDate(event) {
        this.StartDateSelected = event.detail;
    }
    updateEndDate(event) {
        this.EndDateSelected = event.detail;
    }
    toggleRangePickerModal(type) {
        if (type) {
            this.activeFormType = type;
            this.rangepickerModel.InputType = type;
        }
        this.openDatePicker = !this.openDatePicker;
    }
    render() {
        const { rangeEndValue, rangeStartValue } = this.rangepickerModel;
        const { calendarIconClass, labels: { placeholder, placeholder_2 } } = this.optionsModel;
        return (h("div", { class: 'oui-datepicker' },
            h("div", { class: "datepicker-range-input" },
                h("hado-input-form", { onClick: () => this.toggleRangePickerModal('start'), value: this.getLabel(rangeStartValue), placeholder: placeholder, iconClass: calendarIconClass }),
                h("hado-input-form", { onClick: () => this.toggleRangePickerModal('end'), value: this.getLabel(rangeEndValue), placeholder: placeholder_2, iconClass: calendarIconClass }),
                this.openDatePicker
                    ? h("rangepicker-modal", { rangepickerModel: this.rangepickerModel, optionsModel: this.optionsModel }) : null)));
    }
    static get is() { return "rangepicker-input"; }
    static get properties() { return { "activeFormType": { "state": true }, "EndDateSelected": { "state": true }, "openDatePicker": { "state": true }, "optionsModel": { "type": "Any", "attr": "options-model" }, "rangepickerModel": { "type": "Any", "attr": "rangepicker-model" }, "StartDateSelected": { "state": true } }; }
    static get style() { return "/**style-placeholder:rangepicker-input:**/"; }
}
