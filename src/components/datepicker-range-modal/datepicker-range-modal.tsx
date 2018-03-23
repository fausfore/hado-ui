import { Component, Prop, State, Event, EventEmitter, Listen } from '@stencil/core';
import moment, { Moment } from 'moment';
import { DatePickerItem } from '../../models/datepicker.interface';

import { OptionsState, RangePickerState } from '../../models/datepicker.interface';
import * as FromDpService from '../../services/datepicker.service';

@Component({
  tag: 'datepicker-range-modal',
  styleUrl: 'datepicker-range-modal.scss'
})

export class DatePickerRangeModal {

  // Send to window
  @Event() closeModalEvent: EventEmitter;
  @Event() startDateSelectedEvent: EventEmitter;
  @Event() endDateSelectedEvent: EventEmitter;
  @Event() navigationChange: EventEmitter;

  @Prop() rangepickerModel: RangePickerState;
  @Prop() optionsModel: OptionsState;

  // other
  @State() monthLeft: string;
  @State() yearLeft: string;
  @State() monthRight: string;
  @State() yearRight: string;
  @State() datePickerConfig = { year: undefined, month: undefined };
  @State() localDateSelected: DatePickerItem;
  @State() formType: string;
  @State() animationMode: string;

  @State() dataItemLeftConfig : {
    animation: string,
    itemList: DatePickerItem[]
  }

  @State() dataItemRightConfig : {
    animation: string,
    itemList: DatePickerItem[]
  }

  // UI
  public days: Array<string> = [];
  public current_date: Moment;  

  componentWillLoad() {
    this.current_date = moment();
    this.formType = this.rangepickerModel.InputType;
  }

  componentDidLoad () {
    this.initCalendarDateValue();
  }

  initCalendarDateValue(){

    let baseDate: Moment

    if (this.rangepickerModel.InputType === 'start') {
      baseDate = this.rangepickerModel.rangeStartValue || moment();
    } else {
      baseDate = this.rangepickerModel.rangeEndValue || moment()
    }

    this.datePickerConfig.year = Number(baseDate.format('YYYY'));
    this.datePickerConfig.month = Number(baseDate.format('MM')) - 1;

    this.changeDateParmaValue();
  }

  updateDatepickerLabel () {
    // Left picker
    this.yearLeft = this.datePickerConfig.year;
    this.monthLeft = this.optionsModel.labels.months[this.datePickerConfig.month];
    
    // Increment one month
    const nextMonth : { year: number, month: number } = FromDpService.validNewDateParam(
      this.datePickerConfig.year,
      this.datePickerConfig.month,
      'INCREMENT'
    )
    // Right picker
    this.yearRight = nextMonth.year.toString();
    this.monthRight = this.optionsModel.labels.months[nextMonth.month];
  }


  changeDateParmaValue () {
    // Left picker Data
    this.dataItemLeftConfig = {
      animation: undefined,
      itemList: FromDpService.buildCalendar(
        {
          year: this.datePickerConfig.year,
          month: this.datePickerConfig.month
        },
        this.optionsModel,
        this.rangepickerModel.rangeStartValue,
        {
          rangeStartValue: this.rangepickerModel.rangeStartValue,
          rangeEndValue: this.rangepickerModel.rangeEndValue
        }
      )
    };
    // Right picker Data
    this.dataItemRightConfig = {
      animation: undefined,
      itemList: FromDpService.buildCalendar(
        FromDpService.validNewDateParam(
          this.datePickerConfig.year,
          this.datePickerConfig.month,
          'INCREMENT'
        ),
        this.optionsModel,
        this.rangepickerModel.rangeStartValue,
        {
          rangeStartValue: this.rangepickerModel.rangeStartValue,
          rangeEndValue: this.rangepickerModel.rangeEndValue
        }
      )
    };
    // Update labels
    this.updateDatepickerLabel();
  }

  nextMonth () {
    this.datePickerConfig = FromDpService.validNewDateParam(
      this.datePickerConfig.year,
      this.datePickerConfig.month,
      'INCREMENT'
    )
    // Update labels
    this.changeDateParmaValue();
  }

  prevMonth () {
    this.datePickerConfig = FromDpService.validNewDateParam(
      this.datePickerConfig.year,
      this.datePickerConfig.month,
      'DECREMENT'
    );
    // Update labels
    this.changeDateParmaValue();
  }
 
  nextInputForm (type) {
    // Switch the focus of the parent input
    this.navigationChange.emit(type)
    this.formType = type;
  }

  @Listen('DateItemListEvent')
  chooseDate (event: CustomEvent) {
    const screen: any = window.matchMedia("(max-width: 780px");

      if (this.formType === 'start') {
        this.rangepickerModel.rangeStartValue = event.detail;
        if (!screen.matches) {
          this.nextInputForm('end')
        }
        this.startDateSelectedEvent.emit(event.detail)
      } else {
        this.rangepickerModel.rangeEndValue = event.detail;
        this.endDateSelectedEvent.emit(event.detail)
      }
      this.changeDateParmaValue();
    
  }

  closeModal () {
    const el = document.getElementById('range-container');
    el.className = 'range-container on-modal-leave';
    setTimeout(() => {
      this.closeModalEvent.emit();
    }, 300);  
  }

  render() {
    const {
      angleLeftIconClass,
      angleRightIconClass,
      closeIconClass,
      labels
    } = this.optionsModel;

    const days = labels.days.map((d) => (
      <li>{FromDpService.filterDayLabel(d)}</li>
    ))

    return (
      <div class="rangepicker-container">
        <div class="rangepicker-overlay" onClick={() => this.closeModal()}></div>
        <div id="range-container" class="range-container on-modal-enter">

          <div class={
            `rangepicker-modal previous-date ${this.formType === 'start'? 'active' : ''}`}>
            <header class="modal-header">
              <h2 class="title">{labels.title}</h2>
              <i class={closeIconClass} onClick={() => this.closeModal()}></i>
            </header>
            <article class="modal-content">
              <header class="content-header">
                <i class={`icon-prev ${angleLeftIconClass}`} onClick={ () => this.prevMonth() }></i>
                <label>{this.monthLeft} {this.yearLeft}</label>
                <i class={`icon-next ${angleRightIconClass}`} onClick={ () => this.nextMonth() }></i>
              </header>
              <article>
                <ul class="day-list">{days}</ul>
                <date-item-list dataItemConfig={this.dataItemLeftConfig}></date-item-list>
              </article>
            </article>
            <footer class="modal-footer">
            <button onClick={ () => this.nextInputForm('end') }>Valider</button>
          </footer>
          </div>

          <div class={
            `rangepicker-modal next-date ${this.formType === 'end' ? 'active' : ''}`}>
          <header class="modal-header">
            <h2 class="title">{labels.title_2}</h2>
            <i class={closeIconClass} onClick={() => this.closeModal()}></i>
          </header>
            <article class="modal-content">
              <header class="content-header">
                <i class={`icon-prev ${angleLeftIconClass}`} onClick={ () => this.prevMonth() }></i>
                <label>{this.monthRight} {this.yearRight}</label>
                <i class={`icon-next ${angleRightIconClass}`} onClick={ () => this.nextMonth() }></i>
              </header>
              <article>
                <ul class="day-list">{days}</ul>
                <date-item-list dataItemConfig={this.dataItemRightConfig}></date-item-list>
              </article>
            </article>
            <footer class="modal-footer">
              <button onClick={ () => this.closeModal() }>{labels.datepickerBtnValue}</button>
            </footer>
          </div>

        </div>
      </div>
    );
  }
}
