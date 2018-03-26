import { Component, Prop, State, Method, Element, EventEmitter, Event, Watch } from '@stencil/core';
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
  @Element() DpElement: HTMLElement;
  @Event() datepickerIsLoaded: EventEmitter;
  @Prop() config: Inputs

  @Prop() mode: string;
  @Prop() singleValue: string;
  @Prop() calendarIcon: string;
  @Prop() angleRightIcon: string;
  @Prop() angleLeftIcon: string;
  @Prop() closeIcon: string;
  @Prop() activePreviousDate: boolean;
  @Prop() rangeStartValue: string;
  @Prop() rangeEndValue: string;
  @Prop() startWeek: number;
  @Prop() title: string;
  @Prop() title2: string;
  @Prop() datepickerBtnValue: string;
  @Prop() rangeNextBtnValue: string;
  @Prop() months: Array<string>;
  @Prop() days: Array<string>;

  @State() datepickerModel: DatePickerState;
  @State() rangepickerModel: RangePickerState;
  @State() optionsModel: OptionsState;

  @Watch('config')
  reloadState () {
    this.initAppState();
  }


  @Method ()
  get props() {
    return this.DpElement
  }

  @Method()
  initAppState (config?: Inputs) {
    let value: Inputs;

    if (config) {
      value = config
    } else {
      value = {
        mode: 'range',
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

  componentDidLoad() {
    this.datepickerIsLoaded.emit(true)
  }


  componentWillLoad () {
    console.log('componentWillLoad')
    console.log(this.config)
    if (this.config) {
      this.initAppState(this.config);
    } else {
      this.buildPropsValue()
    }
  }
  buildPropsValue () {
    this.config = {
      mode: this.mode,
      singleValue: this.singleValue,
      calendarIcon: this.calendarIcon,
      angleRightIcon: this.angleRightIcon,
      angleLeftIcon: this.angleLeftIcon,
      closeIcon: this.closeIcon,
      activePreviousDate: this.activePreviousDate,
      rangeStartValue: this.rangeStartValue,
      rangeEndValue: this.rangeEndValue,
      startWeek: this.startWeek,
      labels: {
        title: this.title,
        title_2: this.title2,
        datepickerBtnValue: this.datepickerBtnValue,
        rangeNextBtnValue: this.rangeNextBtnValue,
        months: this.months,
        days: this.days
      }
    };
    console.log('buildPropsValue', this.config);
    this.initAppState(this.config);
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
      <div class='oui-datepicker'>
        {rangePicker}
        {singlePicker}
      </div>
    );
  }
}
