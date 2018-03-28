import moment from 'moment';
export class DatepickerInput {
    componentWillLoad() {
        console.log('[DatepickerInput] - componentWillLoad');
        this.openDatePicker = this.datepickerModel.openDatePicker;
    }
    getLabel() {
        return this.datepickerModel.dateSelected
            ? moment(this.datepickerModel.dateSelected).format('DD/MM/YYYY')
            : undefined;
    }
    listenCloseEvent() {
        this.toggleDatepickerModal();
    }
    toggleDatepickerModal() {
        this.openDatePicker = !this.openDatePicker;
    }
    render() {
        const { calendarIconClass, labels: { placeholder } } = this.optionsModel;
        return (h("div", { class: 'datepicker-single-input' },
            h("input-form", { onClick: () => this.toggleDatepickerModal(), value: this.getLabel(), placeholder: placeholder, iconClass: calendarIconClass }),
            this.openDatePicker
                ? h("datepicker-modal", { datepickerModel: this.datepickerModel, optionsModel: this.optionsModel })
                : null));
    }
    static get is() { return "datepicker-input"; }
    static get properties() { return { "datepickerModel": { "type": "Any", "attr": "datepicker-model" }, "openDatePicker": { "state": true }, "optionsModel": { "type": "Any", "attr": "options-model" } }; }
    static get style() { return "/**style-placeholder:datepicker-input:**/"; }
}
