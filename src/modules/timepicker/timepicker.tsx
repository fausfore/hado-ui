import { Component, State, EventEmitter, Event, Prop, Method, Watch } from '@stencil/core';
import moment, { Moment } from 'moment';
import { TimepickerState } from './models/timepicker.interface';

@Component({
    tag: `hado-timepicker`,
    styleUrl: './timepicker.scss',
})

export class StTimepicker {

    public current = moment();
    public selected = undefined;
    public start = moment().startOf('day');
    public end = moment().endOf('day');
    @Event() dateSelected$ : EventEmitter;
    @Event() isLoaded$ : EventEmitter;
    @State() showModal: boolean = false;
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
    @Prop() config : TimepickerState = this.defaultState
    @State() hourList = [
       {
            value: this.start,
            current: false,
            selected: false
        }
    ];
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

        console.log('LALAL',this.config)

        if (props && props.value) {

            if (Number.isInteger(this.minutesOfDay(this.config.value) / 30)) {
                console.log('YYESS', this.isValid(this.minutesOfDay(this.config.value)))
            } else {
                console.log('NNNO',this.isValid(this.minutesOfDay(this.config.value)));
            }

        }



        this.selected = this.config.value;
        const differ = this.start.diff(this.end, 'hour');
        let iterable = this.start;
        const currentHour = this.isValid(this.minutesOfDay(this.current));

        for(let i = 0; i <= Math.abs(differ) * 2; i++) {
            let isCurrent = false;
            this.minutesOfDay(iterable) === currentHour
                ? isCurrent = true
                : null
            iterable = moment(iterable.add(30, 'minute'));
            
            this.hourList.push({
                value: iterable,
                current: isCurrent,
                selected: false
            })

        }
    }

    componentWillLoad () {
        this.isLoaded$.emit()
    }

    minutesOfDay (m: Moment) : number {
        return m.minutes() + m.hours() * 60;
    }

    selectHour (value) {
        this.selected = value;
        this.hourList = this.hourList.map((hour) => {
            hour.selected = hour.value === value
            return hour;
        });
        this.dateSelected$.emit(this.selected);
        this.closeModal();
    }

    isValid (value: number) {
        let numb = value;
        for (let i = 30; 0 <= i ; i-- ) {
            numb = numb + 1
            if (Number.isInteger(numb / 30)) {
                console.log('numb', numb)
                return numb;
            }
        }
    }

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
        const { format, labels : {
            closeIcon, timeIcon, title, placeholder
        } } = this.config;
        const hourList =
            this.hourList.map((hour) => <li
                onClick={() => this.selectHour(hour.value)}
                class={`hour-item ${hour.current ? 'current': ''} ${hour.selected ? 'selected': ''}`}>
                    {hour.value.format(format)}
                </li>)
        return (
            <div class="timepicker-container">
            <hado-input-form
                onClick={() => this.openModal()}
                value={this.selected ? this.selected.format(format) : undefined}
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
                </div> : null }
            </div>
        );
    }
}
