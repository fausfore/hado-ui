import { Component, Listen, Prop, State } from '@stencil/core';
import moment, { Moment } from 'moment';

import { OptionsState, RangePickerState } from '../../models/datepicker.interface';


@Component({
  tag: 'datepicker-range-input',
  styleUrl: 'datepicker-range-input.scss'
})

export class DatepickerRangeInput {

  @Prop() rangepickerModel: RangePickerState;
  @Prop() optionsModel: OptionsState;

  @State() openDatePicker: boolean;
  @State() activeFormType: string;
  @State() StartDateSelected: Moment;
  @State() EndDateSelected: Moment;

  componentWillLoad() {
    this.openDatePicker = this.rangepickerModel.openDatePicker;
    this.activeFormType = this.rangepickerModel.InputType;
    this.StartDateSelected = this.rangepickerModel.rangeStartValue;
    this.EndDateSelected = this.rangepickerModel.rangeEndValue;
  };

  getLabel (dateValue: Moment): string {
    return dateValue ? moment(dateValue).format('DD/MM/YYYY') : null;
  }

  @Listen('navigationChange')
  updateNavigation(event: CustomEvent) {
    this.activeFormType = event.detail;
    this.rangepickerModel.InputType = event.detail;
  }

  @Listen('startDateSelectedEvent')
  updateStartDate (event: CustomEvent) {
    this.StartDateSelected = event.detail;
  }

  @Listen('endDateSelectedEvent')
  updateEndDate (event: CustomEvent)  {
    this.EndDateSelected = event.detail;
  }

  @Listen('closeModalEvent')
  toggleRangePickerModal (type?: string) {
    if(type) {
      this.activeFormType = type;
      this.rangepickerModel.InputType = type;
    }
    this.openDatePicker = !this.openDatePicker;
  }

  render() {
    const {
      rangeEndValue,
      rangeStartValue
    } = this.rangepickerModel;

    const { calendarIconClass } = this.optionsModel;


    return (
      <div class='oui-datepicker'>
        <h1>Range datepicker</h1>
        <p>Choisir une date : </p>
        <div class="datepicker-range-input">
          <div class="datepicker-input-group" onClick={() => this.toggleRangePickerModal('start')}>
            <input
              readOnly
              type="text"
              placeholder="séléctionnez votre date de départ"
              value={this.getLabel(rangeStartValue)}
              class={`datepicker-input ${this.activeFormType === 'start' ? 'active' : ''}`}/>
            <i class={calendarIconClass}></i>
          </div>
          <div class="datepicker-input-group" onClick={() => this.toggleRangePickerModal('end')}>
            <input
              readOnly
              type="text"
              placeholder="séléctionnez votre date d'arrivé"
              value={this.getLabel(rangeEndValue)}
              class={`datepicker-input ${this.activeFormType === 'end' ? 'active' : ''}`}/>
            <i class={calendarIconClass}></i>
          </div>
          {this.openDatePicker
            ? <datepicker-range-modal
                rangepickerModel={this.rangepickerModel}
                optionsModel={this.optionsModel}>
              </datepicker-range-modal>
            : null}
        </div>

      </div>
    );
  }
}
