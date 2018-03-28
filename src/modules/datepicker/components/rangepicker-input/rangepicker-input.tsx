import { Component, Listen, Prop, State } from '@stencil/core';
import moment, { Moment } from 'moment';

import { OptionsState, RangePickerState } from '@Datepicker/models/datepicker.interface';


@Component({
  tag: 'rangepicker-input',
  styleUrl: 'rangepicker-input.scss'
})

export class RangepickerInput {

  @Prop() rangepickerModel: RangePickerState;
  @Prop() optionsModel: OptionsState;

  @State() openDatePicker: boolean;
  @State() activeFormType: string;
  @State() StartDateSelected: Moment;
  @State() EndDateSelected: Moment;

  componentWillLoad() {
    console.log('[RangepickerInput] - componentWillLoad')
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

    const { calendarIconClass, labels: {placeholder, placeholder_2} } = this.optionsModel;


    return (
      <div class='oui-datepicker'>
        <div class="datepicker-range-input">
          <hado-input-form
            onClick={() => this.toggleRangePickerModal('start')}
            value={this.getLabel(rangeStartValue)}
            placeholder={placeholder}
            iconClass={calendarIconClass}>
          </hado-input-form>

          <hado-input-form
            onClick={() => this.toggleRangePickerModal('end')}
            value={this.getLabel(rangeEndValue)}
            placeholder={placeholder_2}
            iconClass={calendarIconClass}>
          </hado-input-form>

          {this.openDatePicker
            ? <rangepicker-modal
                rangepickerModel={this.rangepickerModel}
                optionsModel={this.optionsModel}>
              </rangepicker-modal> : null}
        </div>
      </div>
    );
  }
}
