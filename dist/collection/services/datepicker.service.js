import moment from 'moment';
import 'moment/src/locale/fr';
export class datepickerService {
    constructor() {
        this._moment = moment();
        this._moment.locale('fr');
    }
    createWeeKLabel() {
        let weekArrayLabel = [];
        for (let i = 1; i < 8; i++) {
            weekArrayLabel.push(this._moment.day(i).format('dd'));
        }
        return weekArrayLabel;
    }
    SetYearLabels(config) {
        const firstDay = new Date(config.year, config.month, 1);
        return moment(firstDay).format('YYYY');
    }
    SetMonthLabels(config) {
        return this._moment.month(config.month).format('MMMM');
    }
}
export function createWeeKLabel() {
    let weekArrayLabel = [];
    for (let i = 1; i < 8; i++) {
        weekArrayLabel.push(moment().day(i).format('dd'));
    }
    return weekArrayLabel;
}
export function SetYearLabels(config) {
    const firstDay = new Date(config.year, config.month, 1);
    return moment(firstDay).format('YYYY');
}
export function SetMonthLabels(config) {
    return moment().month(config.month).format('MMMM');
}
export function buildCalendar(config, options, selected) {
    let calendarBuilding = [];
    const firstDay = new Date(config.year, config.month, 1);
    const lastDay = new Date(config.year, config.month + 1, 0);
    const current_date = moment();
    const month_config_date = {
        start: moment(firstDay),
        end: moment(lastDay)
    };
    let dateIteration = month_config_date.start;
    const differ = dateIteration.diff(month_config_date.end, 'days');
    for (let i = 0; i < Math.abs(differ); i++) {
        const iterableDateFormat = dateIteration.format('YYYY-MM-DD');
        const currentDateFormat = current_date.format('YYYY-MM-DD');
        const selectedDateFormat = selected
            ? selected.format('YYYY-MM-DD')
            : null;
        let isCurrentDate = false;
        let isSelectDate = false;
        let isDisable = false;
        if (moment(iterableDateFormat).isSame(currentDateFormat)) {
            isCurrentDate = true;
        }
        if (moment(iterableDateFormat).isSame(selectedDateFormat)) {
            isSelectDate = true;
        }
        if (options.activePreviousDate) {
            moment(iterableDateFormat).isBefore(currentDateFormat)
                ? isDisable = true
                : null;
        }
        calendarBuilding.push({
            date: dateIteration,
            disable: isDisable,
            current: isCurrentDate,
            selected: isSelectDate
        });
        dateIteration = moment(dateIteration).add(1, 'days');
    }
    for (let i = 1; i <= month_config_date.start.day() - 1; i++) {
        let beforeValue = moment(month_config_date.start).subtract(i, 'days');
        calendarBuilding.length <= 35 ? calendarBuilding = [{
                date: beforeValue,
                disable: true,
                selected: false,
                isBetween: false,
                current: false
            }, ...calendarBuilding] : null;
    }
    if (calendarBuilding.length / 7 > 5) {
        let start = moment(month_config_date.end).day() - 1;
        for (let i = start + 1; i <= 6; i++) {
            let afterValue = month_config_date.end.add(i, 'days');
            calendarBuilding = [
                ...calendarBuilding,
                {
                    date: afterValue,
                    disable: true,
                    selected: false,
                    isBetween: false,
                    current: false
                }
            ];
        }
    }
    else {
        if (calendarBuilding.length < 35) {
            let count = 0;
            for (let i = calendarBuilding.length; i < 35; i++) {
                count += 1;
                let afterValue = moment(month_config_date.end).add(count, 'days');
                calendarBuilding = [
                    ...calendarBuilding,
                    {
                        date: afterValue,
                        disable: true,
                        selected: false,
                        isBetween: false,
                        current: false
                    }
                ];
            }
        }
    }
    return calendarBuilding;
}
