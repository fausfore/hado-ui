import { Component, Prop, State, Event, EventEmitter, Listen } from '@stencil/core';
import moment, { Moment } from 'moment';
import { DatePickerItem } from '../../models/datepicker.interface';
import { datepickerService } from '../../services/datepicker.service';

import { OptionsState, RangePickerState } from '../../models/datepicker.interface';

@Component({
  tag: 'datepicker-range-modal',
  styleUrl: 'datepicker-range-modal.scss'
})

export class DatePickerRangeModal {
  private _datepickerService = new datepickerService();

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
      baseDate = this.rangepickerModel.StartDateSelected || moment();
    } else {
      baseDate = this.rangepickerModel.EndDateSelected || moment()
    }

    this.datePickerConfig.year = Number(baseDate.format('YYYY'));
    this.datePickerConfig.month = Number(baseDate.format('MM')) - 1;

    this.updateDatepickerLabel();
    this.changeDateParmaValue();
  }

  updateDatepickerLabel () {
    this.yearLeft = moment().year(this.datePickerConfig.year).format('YYYY');
    this.monthLeft = moment().month(this.datePickerConfig.month).format('MMMM');

    this.yearRight = moment().year(this.datePickerConfig.year).format('YYYY');
    this.monthRight = moment().month(this.datePickerConfig.month + 1).format('MMMM');
  }

  buildCalendar (firstDay: Date, lastDay: Date) {
    let Dates: Array<DatePickerItem> = [];

    const month_config_date = {
      start: moment(firstDay),
      end: moment(lastDay)
    }

    this.days = this._datepickerService.createWeeKLabel();
    this.yearLeft = month_config_date.start.format('YYYY');
    this.yearRight = month_config_date.start.format('YYYY');

    let dateIteration = month_config_date.start;
    const differ = dateIteration.diff(month_config_date.end, 'days')

    for (let i = 0; i < Math.abs(differ); i ++) {
      const iterableDateFormat = dateIteration.format('YYYY-MM-DD');
      const currentDateFormat = this.current_date.format('YYYY-MM-DD');
      const selectedDateStartFormat = this.rangepickerModel.StartDateSelected
        ? this.rangepickerModel.StartDateSelected.format('YYYY-MM-DD')
        : null;
      const selectedDateEndFormat = this.rangepickerModel.EndDateSelected
        ? this.rangepickerModel.EndDateSelected.format('YYYY-MM-DD')
        : null;

      let isCurrentDate: boolean = false;
      let isSelectDate: boolean = false;
      let isDisable: boolean = false;
      let isBetween: boolean = false;

      if (moment(iterableDateFormat).isSame(currentDateFormat)) {
        isCurrentDate = true;
      }

      if (moment(iterableDateFormat).isSame(selectedDateStartFormat)) {
        isSelectDate = true;
      }

      if (moment(iterableDateFormat).isSame(selectedDateEndFormat)) {
        isSelectDate = true;
      }

      if (this.optionsModel.activePreviousDate)  {
        moment(iterableDateFormat).isBefore(currentDateFormat)
          ? isDisable = true
          : null
      }
      if (selectedDateEndFormat && selectedDateStartFormat) {
        if (moment(iterableDateFormat)
          .isBetween(
            selectedDateStartFormat,
            selectedDateEndFormat)
          ) {
          isBetween = true;
        }
      }

      Dates.push({
        date: dateIteration,
        disable: isDisable,
        current: isCurrentDate,
        isBetween: isBetween,
        selected: isSelectDate
      })

      dateIteration = moment(dateIteration).add(1, 'days');
    }


    for(let i = 1; i <= month_config_date.start.day() - 1; i ++) {
      let beforeValue = moment(month_config_date.start).subtract(i,'days')
      Dates.length <= 35 ? Dates = [{
        date: beforeValue,
        disable: true,
        selected: false,
        isBetween: false,
        current: false

      },...Dates ] : null
    }


    if (Dates.length / 7 > 5) {
      let start = moment(month_config_date.end).day() - 1;
      for(let i = start + 1; i <= 6; i++) {
        let afterValue = month_config_date.end.add(i,'days');

        Dates = [
          ...Dates,
          {
            date: afterValue,
            disable: true,
            selected: false,
            isBetween: false,
            current: false
          }
        ]
      }
    } else {
      if (Dates.length < 35) {
        let count: number = 0;
        for (let i = Dates.length; i < 35; i++) {
          count += 1;
          let afterValue = moment(month_config_date.end).add(count,'days')

          Dates = [
            ...Dates,
            {
              date: afterValue,
              disable: true,
              selected: false,
              isBetween: false,
              current: false
            }
          ]
        }
      }
    }
    return Dates
  }

  changeDateParmaValue () {
    this.dataItemLeftConfig = {
      animation: undefined,
      itemList: this.buildCalendar(
        new Date(this.datePickerConfig.year, this.datePickerConfig.month, 1),
        new Date(this.datePickerConfig.year, this.datePickerConfig.month + 1, 0)
      )
    };

    this.dataItemRightConfig = {
      animation: undefined,
      itemList: this.buildCalendar(
        new Date(this.datePickerConfig.year, this.datePickerConfig.month + 1, 1),
        new Date(this.datePickerConfig.year, this.datePickerConfig.month + 2, 0)
      )
    };
  }

  nextMonth () {
    this.datePickerConfig.month = this.datePickerConfig.month  + 1;
    this.updateDatepickerLabel();
    this.changeDateParmaValue();
  }

  prevMonth () {
    this.datePickerConfig.month = this.datePickerConfig.month  - 1;
    this.updateDatepickerLabel();
    this.changeDateParmaValue();
  }
 
  nextInputForm (type) {
    this.navigationChange.emit(type)
    this.formType = type;
  }
  @Listen('DateItemListEvent')
  chooseDate (event: CustomEvent) {
    const screen: any = window.matchMedia("(max-width: 780px");

      if (this.formType === 'start') {
        this.rangepickerModel.StartDateSelected = event.detail;
        if (!screen.matches) {
          this.nextInputForm('end')
        }
        this.startDateSelectedEvent.emit(event.detail)
      } else {
        this.rangepickerModel.EndDateSelected = event.detail;
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

    const days = this.days.map((d) => (
      <li>{d}</li>
    ))

    return (
      <div class="rangepicker-container">
        <div class="rangepicker-overlay" onClick={() => this.closeModal()}></div>
        <div id="range-container" class="range-container on-modal-enter">

          <div class={
            `rangepicker-modal previous-date ${this.formType === 'start'? 'active' : ''}`}>
            <header class="modal-header">
              <h2 class="title">{labels[0]}</h2>
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
            <h2 class="title">{labels[1]}</h2>
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
              <button onClick={ () => this.closeModal() }>Fermer</button>
            </footer>
          </div>

        </div>
      </div>
    );
  }
}
