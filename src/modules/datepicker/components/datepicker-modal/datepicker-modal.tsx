import { Component, Event, EventEmitter, Prop, State, Listen, Element } from '@stencil/core';
import moment, { Moment } from 'moment';

import { DatePickerItem, DatePickerState, OptionsState } from '../../models/datepicker.interface';
import * as FromDpService from '../../services/datepicker.service';
import Hammer from 'hammerjs';

@Component({
  tag: 'datepicker-modal',
  styleUrl: 'datepicker-modal.scss'
})

export class DatepickerModal {

  @Prop() datepickerModel : DatePickerState;
  @Prop() optionsModel: OptionsState;

  @Event() closedModalEvent: EventEmitter;
  @Event() selectSingleDate: EventEmitter;

  @Element() DOMElement: HTMLElement;

  @State() month: string;
  @State() year: string;
  @State() datePickerConfig = { year: undefined, month: undefined };
  @State() localDateSelected: Moment;
  @State() dataItemConfig : {
    animation: string,
    itemList: DatePickerItem[]
  }

  // UI
  public days: Array<string> = [];

  componentDidLoad () {
    this.initCalendarDateValue();
    this.activeTouchArea();
  }

  initCalendarDateValue(){
    let dateParam;

    if (!this.datepickerModel.dateSelected) {
      dateParam = moment();
    } else {
      dateParam = this.datepickerModel.dateSelected
    }

    this.datePickerConfig.year = Number(dateParam.format('YYYY'));
    this.datePickerConfig.month = Number(dateParam.format('MM')) - 1;

    this.days = this.optionsModel.labels.days;

    this.dataItemConfig = {
      animation: 'enter',
      itemList: FromDpService.buildCalendar(
        this.datePickerConfig,
        this.optionsModel,
        this.datepickerModel.dateSelected
      )
    };

    this.updateDatepickerLabel(this.datePickerConfig);
    
  }

  updateDatepickerLabel (config: { year: number, month: string }) {
    this.year = config.year.toString();
    this.month = this.optionsModel.labels.months[config.month]
  }

  activeTouchArea () {
    const el = document.getElementById('gesture-container');
    const hammer = new Hammer(el);
    hammer.on('swipe', (e) => {
      switch (e.direction) {

        case 2:
          this.nextMonth();
        break;

        case 4:
          this.prevMonth();
        break;
        
      }
    })
  }

  nextMonth () {
    this.datePickerConfig = FromDpService.validNewDateParam(
      this.datePickerConfig.year,
      this.datePickerConfig.month,
      'INCREMENT'
    );
    this.dataItemConfig = {
      animation: 'enter',
      itemList: FromDpService.buildCalendar(
        this.datePickerConfig,
        this.optionsModel,
        this.datepickerModel.dateSelected
      )
    };
    this.updateDatepickerLabel(this.datePickerConfig);
  }

  prevMonth () {
    this.datePickerConfig = FromDpService.validNewDateParam(
      this.datePickerConfig.year,
      this.datePickerConfig.month,
      'DECREMENT'
    );
    this.dataItemConfig = {
      animation: 'leave',
      itemList: FromDpService.buildCalendar(
        this.datePickerConfig,
        this.optionsModel,
        this.datepickerModel.dateSelected
      )
    };
    this.updateDatepickerLabel(this.datePickerConfig);
  }

  @Listen('DateItemListEvent')
  chooseDate (event: CustomEvent) {
    this.localDateSelected = event.detail;
  }

  selectDate () {
    if (this.localDateSelected) {
      this.selectSingleDate.emit(this.localDateSelected);
      // Update selected date
      this.datepickerModel.dateSelected = this.localDateSelected;
      // close modal
      this.closeModal();
    }
  }

  closeModal () {

    const el = document.getElementById('datepicker-modal');
    el.className = 'datepicker-modal on-modal-leave';
    setTimeout(() => {
      this.closedModalEvent.emit();
    }, 300);
    
  }

  render() {
    const {
      closeIconClass,
      angleLeftIconClass,
      angleRightIconClass,
      labels
    } = this.optionsModel;

    const days = this.days.map((d) => (
      <li>{FromDpService.filterDayLabel(d)}</li>
    ))
    return (
      <div class="datepicker-container">
        <div class="datepicker-overlay" onClick={() => this.closeModal()}></div>
        <div id="datepicker-modal" class="datepicker-modal on-modal-enter">
          <header class="modal-header">
            <h2 class="title">{labels.title}</h2>
            <i class={closeIconClass} onClick={() => this.closeModal()}></i>
          </header>
          <article id="gesture-container" class="modal-content">
            <header class="content-header">
              <i class={angleLeftIconClass} onClick={ () => this.prevMonth() }></i>
              <label>{this.month} {this.year}</label>
              <i class={angleRightIconClass} onClick={ () => this.nextMonth() }></i>
            </header>
            <article>
              <ul class="day-list">{days}</ul>
              <date-item-list
                dataItemConfig={this.dataItemConfig}>
              </date-item-list>
            </article>
          </article>
          <footer class="modal-footer">
            <button onClick={ () => this.selectDate() }>{labels.datepickerBtnValue}</button>
          </footer>
        </div>
      </div>
    );
  }
}
