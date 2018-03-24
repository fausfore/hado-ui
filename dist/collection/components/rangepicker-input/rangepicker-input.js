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
        const { calendarIconClass } = this.optionsModel;
        return (h("div", { class: 'oui-datepicker' },
            h("h1", null, "Range datepicker"),
            h("p", null, "Choisir une date : "),
            h("div", { class: "datepicker-range-input" },
                h("div", { class: "datepicker-input-group", onClick: () => this.toggleRangePickerModal('start') },
                    h("input", { readOnly: true, type: "text", placeholder: "s\u00E9l\u00E9ctionnez votre date de d\u00E9part", value: this.getLabel(rangeStartValue), class: `datepicker-input ${this.activeFormType === 'start' ? 'active' : ''}` }),
                    h("i", { class: calendarIconClass })),
                h("div", { class: "datepicker-input-group", onClick: () => this.toggleRangePickerModal('end') },
                    h("input", { readOnly: true, type: "text", placeholder: "s\u00E9l\u00E9ctionnez votre date d'arriv\u00E9", value: this.getLabel(rangeEndValue), class: `datepicker-input ${this.activeFormType === 'end' ? 'active' : ''}` }),
                    h("i", { class: calendarIconClass })),
                this.openDatePicker
                    ? h("rangepicker-modal", { rangepickerModel: this.rangepickerModel, optionsModel: this.optionsModel })
                    : null)));
    }
    static get is() { return "rangepicker-input"; }
    static get properties() { return { "activeFormType": { "state": true }, "EndDateSelected": { "state": true }, "openDatePicker": { "state": true }, "optionsModel": { "type": "Any", "attr": "options-model" }, "rangepickerModel": { "type": "Any", "attr": "rangepicker-model" }, "StartDateSelected": { "state": true } }; }
    static get style() { return "/**style-placeholder:rangepicker-input:**/"; }
}
