import { Component, Prop, State, Watch } from '@stencil/core';
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
  @Prop() config: {
    mode: string
    singleValue?: string,
    rangeStartValue?: string,
    rangeEndValue?: string,
    calendarIcon: string,
    angleRightIcon: string,
    angleLeftIcon: string,
    closeIcon: string,
    labels: string,
    activePreviousDate: boolean
  }

  @State() datepickerModel: DatePickerState;
  @State() rangepickerModel: RangePickerState;
  @State() optionsModel: OptionsState;

  @Watch('config')
  IsDetect (next, before) {
    console.log('IsDetect')
    console.log(next)
    console.log(before);
    this.initAppState(this.config);
  }

  componentWillLoad () {
    console.log('The component is about to be rendered');
    this.initAppState(this.config);
  }

  componentDidLoad() {
    console.log('The component has been rendered');
  }

  componentWillUpdate() {
    console.log('The component will update');
  }

  componentDidUpdate() {
    console.log('The component did update');
  }

  componentDidUnload() {
    console.log('The view has been removed from the DOM');
  }

  initAppState (config) {
    console.log('initAppState')
    let initStartDate;
    let initEndDate;
    let initSingleDate;

    if (config.rangeStartValue) {
      initStartDate = moment(config.rangeStartValue);
    } else if (config.rangeEndValue) {
      initStartDate = moment(config.rangeEndValue);
    } else if (config.singleValue) {
      initSingleDate = moment(config.singleValue);
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
      calendarIconClass: config.calendarIcon,
      angleRightIconClass: config.angleRightIcon,
      angleLeftIconClass: config.angleLeftIcon,
      closeIconClass: config.closeIcon,
      labels: config.labels.split(';'),
      activePreviousDate: config.activePreviousDate,
    };
  }

  render() {
    
    const rangePicker = this.config.mode === ModeOptions.RANGE
      ? <datepicker-range-input
          rangepickerModel={this.rangepickerModel}
          optionsModel={this.optionsModel}>
        </datepicker-range-input>
      : null
    const singlePicker = this.config.mode === ModeOptions.SINGLE
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
