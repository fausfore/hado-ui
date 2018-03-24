import { Component, Prop, State, Method } from '@stencil/core';
import moment from 'moment';

import {
  defaultDatepickerState,
  defaultOptionsState,
  defaultRangepickerState,
  ModeOptions,
} from '../../models/datepicker.constant';
import { DatePickerState, OptionsState, RangePickerState, Inputs } from '../../models/datepicker.interface';

@Component({
  tag: 'st-datepicker',
  styleUrl: 'st-datepicker.scss'
})

export class StDatepicker {
  @Prop() config: Inputs

  @State() datepickerModel: DatePickerState;
  @State() rangepickerModel: RangePickerState;
  @State() optionsModel: OptionsState;

  componentWillLoad () {
    this.initAppState(this.config);
  }

  @Method()
  initAppState (config?: Inputs) {
    let value: Inputs;

    if (config) {
      value = config
    } else {
      value = {
        mode: 'single',
        singleValue: '2018-03-23',
        calendarIcon: 'far fa-calendar-alt',
        angleRightIcon: 'fas fa-angle-right',
        angleLeftIcon: 'fas fa-angle-left',
        closeIcon: 'fas fa-times',
        activePreviousDate: true,
        rangeStartValue: '2018-03-23',
        rangeEndValue: '2018-03-30',
        startWeek: 1,
        labels: {
          title: 'Date de début',
          title_2: 'Date de Fin',
          datepickerBtnValue: 'Validé',
          rangeNextBtnValue: 'Suivant',
          months: [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Aout',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre'
          ],
          days: [
            'lundi',
            'mardi',
            'mercredi',
            'jeudi',
            'vendredi',
            'samedi',
            'dimanche'
          ]
        }
      };
    }

    if (!value) {
      return;
    }

    let initStartDate;
    let initEndDate;
    let initSingleDate;

    if (value.rangeStartValue) {
      initStartDate = moment(value.rangeStartValue);
    }

    if (value.rangeEndValue) {
      initEndDate = moment(value.rangeEndValue);
    }

    if (value.singleValue) {
      initSingleDate = moment(value.singleValue);
    }
    this.datepickerModel = {
      ...defaultDatepickerState,
      dateSelected: initSingleDate,
    };

    this.rangepickerModel = {
      ...defaultRangepickerState,
      rangeStartValue: initStartDate,
      rangeEndValue: initEndDate
    };

    this.optionsModel = {
      ...defaultOptionsState,
      calendarIconClass: value.calendarIcon,
      angleRightIconClass: value.angleRightIcon,
      angleLeftIconClass: value.angleLeftIcon,
      closeIconClass: value.closeIcon,
      activePreviousDate: value.activePreviousDate,
      mode: value.mode,
      labels: value.labels,
      startWeek: value.startWeek
    };
  }

  render() { 
    const rangePicker = this.optionsModel.mode === ModeOptions.RANGE
      ? <rangepicker-input
          rangepickerModel={this.rangepickerModel}
          optionsModel={this.optionsModel}>
        </rangepicker-input>
      : null
    const singlePicker = this.optionsModel.mode === ModeOptions.SINGLE
      ? <datepicker-input
          datepickerModel={this.datepickerModel}
          optionsModel={this.optionsModel}>
        </datepicker-input>
      : null
    return (
      <main class='oui-datepicker'>
        {rangePicker}
        {singlePicker}
      </main>
    );
  }
}
