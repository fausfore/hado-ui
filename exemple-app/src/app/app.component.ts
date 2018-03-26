import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'app';
  public config = {
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

  get datepickerConfig () {
    return this.config;
  }

  showOutput (event, label) {
    console.log(`${label} ${moment(event.detail).format('DD/MM/YYYY')}`);
  }

  switchMode (type) {
    this.config.mode = type;
  }
}
