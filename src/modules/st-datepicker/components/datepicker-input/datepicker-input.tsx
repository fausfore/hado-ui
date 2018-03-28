import { Component, Prop, State, Listen } from '@stencil/core';
import moment from 'moment';
import { DatePickerState, OptionsState } from "@Datepicker/models/datepicker.interface"


@Component({
  tag: 'datepicker-input',
  styleUrl: 'datepicker-input.scss'
})
export class DatepickerInput {
  @Prop() datepickerModel: DatePickerState;
  @Prop() optionsModel: OptionsState;

  @State() openDatePicker: boolean;

  componentWillLoad () {
    console.log('[DatepickerInput] - componentWillLoad')
    this.openDatePicker = this.datepickerModel.openDatePicker;
  }

  getLabel () {
    return this.datepickerModel.dateSelected
      ? moment(this.datepickerModel.dateSelected).format('DD/MM/YYYY')
      : undefined
  }

  @Listen('closedModalEvent')
  listenCloseEvent () {
    this.toggleDatepickerModal();
  }

  toggleDatepickerModal () {
    this.openDatePicker = !this.openDatePicker;
  }

  render() {
    const { calendarIconClass ,labels: { placeholder } } = this.optionsModel;
      return (
        <div class='datepicker-single-input'>
          <input-form
            onClick={() => this.toggleDatepickerModal()}
            value={this.getLabel()}
            placeholder={placeholder}
            iconClass={calendarIconClass}>
          </input-form>
          {this.openDatePicker
            ? <datepicker-modal
                datepickerModel={this.datepickerModel}
                optionsModel={this.optionsModel}>
              </datepicker-modal>
            : null }
        </div>
      );

  }
}
