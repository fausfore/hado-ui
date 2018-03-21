import { Component, Prop, State, Listen } from '@stencil/core';
import moment from 'moment';
import { DatePickerState, OptionsState } from "../../models/datepicker.interface"


@Component({
  tag: 'datepicker-single-input',
  styleUrl: 'datepicker-single-input.scss'
})
export class DatepickerSingleInput {
  @Prop() datepickerModel: DatePickerState;
  @Prop() optionsModel: OptionsState;

  @State() openDatePicker: boolean;

  componentWillLoad () {
    this.openDatePicker = this.datepickerModel.openDatePicker;
  }

  getLabel () {
    return this.datepickerModel.dateSelected
      ? moment(this.datepickerModel.dateSelected).format('DD/MM/YYYY')
      : undefined
  }

  @Listen('closedModalEvent')
  toggleDatepickerModal () {
    this.openDatePicker = !this.openDatePicker;
  }

  render() {
    const { calendarIconClass } = this.optionsModel;
      return (
        <div class='datepicker-single-input'>
          <h1>Single datepicker</h1>
          <p>Choisir une date : </p>
          <div
            class="datepicker-input-group"
            onClick={() => this.toggleDatepickerModal()}>
            <input
              readOnly
              type="text"
              class="datepicker-input"
              placeholder="Ajoutez une date"
              value={this.getLabel()}/>
            <i class={calendarIconClass}></i>
          </div>
          {this.openDatePicker
            ? <datepicker-modal
                datepickerModel={this.datepickerModel}
                optionsModel={this.optionsModel}>
              </datepicker-modal>
            : null
          }
        </div>
      );

  }
}
