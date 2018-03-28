import { Component, Prop, Event, EventEmitter, State, Element, Watch } from '@stencil/core';
import moment from 'moment';
import { DatePickerItem } from '@Datepicker/models/datepicker.interface';

@Component({
  tag: 'date-item-list',
  styleUrl: 'calendar-date-item.scss'
})

export class DateItemList {

  // Send to window
  @Event() startDateSelectedEvent: EventEmitter;
  @Event() endDateSelectedEvent: EventEmitter;
  @Event() DateItemListEvent: EventEmitter;

  @Prop() dateItemList: DatePickerItem[];
  @State() dateItemListHost:  DatePickerItem[];
  @Prop() dataItemConfig : {
    animation: string,
    itemList: DatePickerItem[]
  }

  @Element() DateItemListHTML: HTMLElement;

  @Watch('dataItemConfig')
  checkStyle (newProp: { animation: string, itemList: DatePickerItem[] }) {

    if (newProp.animation) {
      this.DateItemListHTML.className = `hydrated on-${newProp.animation}`;
      setTimeout(() => {
        this.DateItemListHTML.classList.remove(`on-${newProp.animation}`)
      }, 300);
    }
    this.dateItemListHost = newProp.itemList;

  }

  chooseDate (element: DatePickerItem) {
    if (element.disable) return;
    this.dateItemListHost =this.dateItemListHost.map((item) => {
      item.selected = item.date === element.date;
      return item;
    })
    this.DateItemListEvent.emit(element.date);
  }

  getStyleClass (item: DatePickerItem) {
    if (!item) {
      return;
    }
    const classArray: Array<string> = [];
    if(item.disable) {
      classArray.push('inactive');
    }

    if(item.selected) {
      classArray.push('selected');
    }

    if(item.current) {
      classArray.push('current');
    }

    if(item.isBetween) {
      classArray.push('isBetween');
    }
    return classArray.join(' ')
  }

  getLabel (item) {
    return moment(item).format('DD');
  }

  render() {
    const listItem = this.dateItemListHost ? this.dateItemListHost.map((i) => (
        <li
          onClick={ () => this.chooseDate(i) }
          class={this.getStyleClass(i)}>
          {this.getLabel(i.date)}
          <span class="circle">{this.getLabel(i.date)}</span>
        </li>
      )) : null
    return (
        <ul class="date-list">
            {listItem}
        </ul>
    );
  }
}
