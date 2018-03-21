import { Component, Prop, State } from '@stencil/core';
import moment from 'moment';

import {
  defaultDatepickerState,
  defaultOptionsState,
  defaultRangepickerState,
  ModeOptions,
} from '../../models/datepicker.constant';
import { DatePickerState, OptionsState, RangePickerState } from '../../models/datepicker.interface';

@Component({
  tag: 'oui-datepicker',
  styleUrl: 'oui-datepicker.scss'
})

export class OuiDatepicker {
  @Prop() singleValue: string;
  @Prop() rangeStartValue: string;
  @Prop() rangeEndValue: string;
  @Prop() calendarIcon: string;
  @Prop() angleRightIcon: string;
  @Prop() angleLeftIcon: string;
  @Prop() closeIcon: string;
  @Prop() labels: string;
  @Prop() activePreviousDate: boolean
  @Prop() mode: string;

  @State() datepickerModel: DatePickerState
  @State() rangepickerModel: RangePickerState
  @State() optionsModel: OptionsState

  componentWillLoad() {
    this.initAppState();
  }

  initAppState () {
    let initStartDate;
    let initEndDate;
    let initSingleDate;

    if (this.rangeStartValue) {
      initStartDate = moment(this.rangeStartValue);
    } else if (this.rangeEndValue) {
      initStartDate = moment(this.rangeEndValue);
    } else if (this.singleValue) {
      initSingleDate = moment(this.singleValue);
    }
    this.datepickerModel = {
      ...defaultDatepickerState,
      dateSelected: initSingleDate,
    };

    this.rangepickerModel = {
      ...defaultRangepickerState,
      StartDateSelected: initStartDate,
      EndDateSelected: initEndDate
    };

    this.optionsModel = {
      ...defaultOptionsState,
      calendarIconClass: this.calendarIcon,
      angleRightIconClass: this.angleRightIcon,
      angleLeftIconClass: this.angleLeftIcon,
      closeIconClass: this.closeIcon,
      labels: this.labels.split(';'),
      activePreviousDate: this.activePreviousDate,
    };
  }

  render() {
    const rangePicker = this.mode === ModeOptions.RANGE
      ? <datepicker-range-input
          rangepickerModel={this.rangepickerModel}
          optionsModel={this.optionsModel}>
        </datepicker-range-input>
      : null
    const singlePicker = this.mode === ModeOptions.SINGLE
      ? <datepicker-single-input
          datepickerModel={this.datepickerModel}
          optionsModel={this.optionsModel}>
        </datepicker-single-input>
      : null
    return (
      <main class='oui-datepicker'>
        {rangePicker}
        {singlePicker}
      </main>
    );
  }
}
