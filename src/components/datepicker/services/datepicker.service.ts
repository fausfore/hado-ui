import moment, { Moment } from 'moment';
import { DatePickerItem, OptionsState } from '@Datepicker/models/datepicker.interface';


export function filterDayLabel (label: string) {
  return `${label[0]}${label[1]}`;
}

export function  validNewDateParam (year: number, month: number, operator: string) : {
  year: number, month: number
} {

  switch (operator) {
    case 'INCREMENT':
      month === 11
        ? (year =  year + 1) && (month = 0)
        : month = month + 1;
      
      return {
        year: year,
        month: month
      };

    case 'DECREMENT':
      month === 0
        ? (year = year - 1) && (month = 11)
        : month = month - 1;
      
      return {
        year: year,
        month: month
      };
    default:
      return undefined;
    
  }

}

export function buildCalendar (
  // firstDay: Date, lastDay: Date
  config: { year: number, month: number },
  options: OptionsState,
  selected?: Moment,
  range?: {rangeStartValue: Moment, rangeEndValue: Moment }
) : Array<DatePickerItem> {
  let calendarBuilding: Array<DatePickerItem> = [];

  const NextMonthValue = config.month === 11 ? 0 : config.month + 1;
  const NextYearValue = config.month === 11 ? config.year + 1 : config.year;

  const firstDay = new Date(config.year, config.month, 1);
  const lastDay = new Date(NextYearValue, NextMonthValue, 0);

  const month_config_date = {
    start: moment(firstDay),
    end: moment(lastDay)
  }

  let dateIteration = month_config_date.start;
  const differ = dateIteration.diff(month_config_date.end, 'days');
  const current_date = moment();

  for (let i = 0; i < Math.abs(differ); i ++) {
      const iterableDateFormat = dateIteration.format('YYYY-MM-DD');
      const currentDateFormat = current_date.format('YYYY-MM-DD');
      let isCurrentDate: boolean = false;
      let isSelectDate: boolean = false;
      let isDisable: boolean = false;
      let isBetween: boolean = false;

      if (options.mode === 'range') {
        const selectedDateStartFormat = range
            ? range.rangeStartValue.format('YYYY-MM-DD')
            : null;
        const selectedDateEndFormat = range
            ? range.rangeEndValue.format('YYYY-MM-DD')
            : null;

        if (selectedDateEndFormat && selectedDateStartFormat) {
          moment(iterableDateFormat)
            .isBetween(selectedDateStartFormat,selectedDateEndFormat)
              ? isBetween = true
              : null;
        }

        moment(iterableDateFormat).isSame(selectedDateStartFormat)
            ? isSelectDate = true
            : null;

        moment(iterableDateFormat).isSame(selectedDateEndFormat)
            ? isSelectDate = true
            : null;
        
      } else if (options.mode === 'single') {
        const selectedDateFormat = selected 
            ? selected.format('YYYY-MM-DD')
            : null;

        moment(iterableDateFormat).isSame(selectedDateFormat)
          ? isSelectDate = true
          : null;
            
      } else {
        moment(iterableDateFormat).isSame(currentDateFormat)
        ? isCurrentDate = true
        : null;
        
        if (this.optionsModel.activePreviousDate)  {
            moment(iterableDateFormat).isBefore(currentDateFormat)
              ? isDisable = true
              : null
        }
      }


    calendarBuilding.push({
      date: dateIteration,
      disable: isDisable,
      current: isCurrentDate,
      isBetween: isBetween,
      selected: isSelectDate
    })

    dateIteration = moment(dateIteration).add(1, 'days');
  }


  for(let i = 1; i <= month_config_date.start.day() - options.startWeek; i ++) {
    let beforeValue = moment(month_config_date.start).subtract(i,'days')
    calendarBuilding.length <= 35 ? calendarBuilding = [{
      date: beforeValue,
      disable: true,
      selected: false,
      isBetween: false,
      current: false

    },...calendarBuilding ] : null
  }


  if (calendarBuilding.length / 7 > 5) {
    let start = moment(month_config_date.end).day() - 1;
    for(let i = start + 1; i <= 6; i++) {
      let afterValue = month_config_date.end.add(i,'days');

      calendarBuilding = [
        ...calendarBuilding,
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
    if (calendarBuilding.length < 35) {
      let count: number = 0;
      for (let i = calendarBuilding.length; i < 35; i++) {
        count += 1;
        let afterValue = moment(month_config_date.end).add(count,'days')

        calendarBuilding = [
          ...calendarBuilding,
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
  return calendarBuilding
}
