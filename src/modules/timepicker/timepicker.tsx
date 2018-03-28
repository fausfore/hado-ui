import { Component, State, EventEmitter, Event, Prop, Method, Watch, Listen } from '@stencil/core';
import moment, { Moment } from 'moment';
import { TimepickerState } from './models/timepicker.interface';

@Component({
    tag: `hado-timepicker`,
    styleUrl: './timepicker.scss',
})

export class StTimepicker {

    public current = moment();
    public selected;
    public start = moment().startOf('day');
    public end = moment().endOf('day');
    public defaultState : TimepickerState = {
        value: undefined,
        format: 'HH:mm',
        labels: {
            title: 'title 1',
            btnValue: 'submit',
            closeIcon: 'fas fa-times',
            timeIcon: 'far fa-clock',
            placeholder: '...'
        }
    }

    @Event() dateSelected$ : EventEmitter;
    @Event() isLoaded$ : EventEmitter;

    @State() showModal: boolean = false;
    @State() hourList = [];

    @Prop() config : TimepickerState = this.defaultState

    @Watch('config')
    initialWithProps () {
        this.config ? this.initialize(this.config) : null
    }

    @Method()
    initialize(props?:TimepickerState) {

        this.config = {
            ...this.defaultState,
            ...this.config
        };

        if (props && props.value) {
            Number.isInteger(this.minutesOfDay(this.config.value) / 30) 
                ? console.log('YYESS', this.isValid(this.minutesOfDay(this.config.value)))
                : console.log('NNNO',this.isValid(this.minutesOfDay(this.config.value)))
        }

        this.selected = this.config.value;
        const differ = this.start.diff(this.end, 'hour') ;
        let iterable = this.start;
        const currentHour = this.isValid(this.minutesOfDay(this.current));

        for(let i = 0; i <= Math.abs(differ) * 2 + 1; i++) {

            let isCurrent = false;
            this.minutesOfDay(iterable) === currentHour
                ? isCurrent = true
                : null
            iterable = i === 0 ? moment(iterable) : moment(iterable.add(30, 'minute')) ;

            this.hourList = [
                ...this.hourList,
                {
                    value: iterable.format('HH:mm'),
                    current: isCurrent,
                    selected: false
                }
            ]
        }
    }

    componentWillLoad () {
        this.isLoaded$.emit()
    }

    minutesOfDay (m: Moment) : number {
        return m.minutes() + m.hours() * 60;
    }

    selectHour (value) {
        const payload = moment();
        this.selected = value;
        
        this.hourList = this.hourList.map((hour) => {
            hour.selected = hour.value === value
            return hour;
        });

        const parse = this.selected.split(':')

        payload.set({
            hour: Number(parse[0]),
            minutes: Number(parse[1])
        })

        this.dateSelected$.emit(payload);
        this.closeModal();
    }

    isValid (value: number) {
        let numb = value;
        for (let i = 30; 0 <= i ; i-- ) {
            numb = numb + 1
            if (Number.isInteger(numb / 30)) {
                return numb;
            }
        }
    }

    @Listen('modalEvent$')
    closeModal () {
        const el = document.getElementById('modalComponent');
        el.className = 'modal has-header on-leave';
        setTimeout(() => {
            this.showModal ? this.showModal = false : null;
        }, 300);
    }

    openModal () {
        !this.showModal ? this.showModal = true : null;
    }

    render() {

        const { labels : {
            closeIcon, timeIcon, title, placeholder
        } } = this.config;

        const hourList =
            this.hourList.map((hour) => <li
                onClick={() => this.selectHour(hour.value)}
                class={`hour-item ${hour.current ? 'current': ''} ${hour.selected ? 'selected': ''}`}>
                    {hour.value}
                </li>)
        return (
            <div class="timepicker-container">
            <hado-input-form
                onClick={() => this.openModal()}
                value={this.selected ? this.selected: undefined}
                placeholder={placeholder}
                iconClass={timeIcon}>
            </hado-input-form>
            { this.showModal ?
                <div class="modal-container">
                    <div id="modalComponent" class="modal has-header on-enter">
                        <header class="modal-header">
                            <h2>{title}</h2>
                            <i class={closeIcon} onClick={() => this.closeModal()}/>
                        </header>
                        <article class="modal-content">
                            <ul class="hour-list">{hourList}</ul>
                        </article>
                    </div>  
                    <div class="overlay" onClick={() => this.closeModal()}></div>
                </div>: null }
            </div>
        );
    }
}
