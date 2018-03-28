import moment from 'moment';
export class StTimepicker {
    constructor() {
        this.current = moment();
        this.selected = undefined;
        this.start = moment().startOf('day');
        this.end = moment().endOf('day');
        this.showModal = false;
        this.defaultState = {
            value: undefined,
            format: 'HH:mm',
            labels: {
                title: 'title 1',
                btnValue: 'submit',
                closeIcon: 'fas fa-times',
                timeIcon: 'far fa-clock',
                placeholder: '...'
            }
        };
        this.config = this.defaultState;
        this.hourList = [
            {
                value: this.start,
                current: false,
                selected: false
            }
        ];
    }
    initialWithProps() {
        console.log('FROM initialWithProps');
        this.config ? this.initialize(this.config) : null;
    }
    initialize(props) {
        console.log('defaultState', this.defaultState);
        console.log('props', props);
        this.config = Object.assign({}, this.defaultState, this.config);
        console.log('LALAL', this.config);
        if (props && props.value) {
            if (Number.isInteger(this.minutesOfDay(this.config.value) / 30)) {
                console.log('YYESS', this.isValid(this.minutesOfDay(this.config.value)));
            }
            else {
                console.log('NNNO', this.isValid(this.minutesOfDay(this.config.value)));
            }
        }
        this.selected = this.config.value;
        const differ = this.start.diff(this.end, 'hour');
        let iterable = this.start;
        const currentHour = this.isValid(this.minutesOfDay(this.current));
        for (let i = 0; i <= Math.abs(differ) * 2; i++) {
            let isCurrent = false;
            this.minutesOfDay(iterable) === currentHour
                ? isCurrent = true
                : null;
            iterable = moment(iterable.add(30, 'minute'));
            this.hourList.push({
                value: iterable,
                current: isCurrent,
                selected: false
            });
        }
    }
    componentWillLoad() {
        this.isLoaded$.emit();
    }
    minutesOfDay(m) {
        return m.minutes() + m.hours() * 60;
    }
    selectHour(value) {
        this.selected = value;
        this.hourList = this.hourList.map((hour) => {
            hour.selected = hour.value === value;
            return hour;
        });
        this.dateSelected$.emit(this.selected);
        this.closeModal();
    }
    isValid(value) {
        let numb = value;
        for (let i = 30; 0 <= i; i--) {
            numb = numb + 1;
            if (Number.isInteger(numb / 30)) {
                console.log('numb', numb);
                return numb;
            }
        }
    }
    closeModal() {
        const el = document.getElementById('modalComponent');
        el.className = 'modal has-header on-leave';
        setTimeout(() => {
            this.showModal ? this.showModal = false : null;
        }, 300);
    }
    openModal() {
        !this.showModal ? this.showModal = true : null;
    }
    render() {
        const { format, labels: { closeIcon, timeIcon, title, placeholder } } = this.config;
        const hourList = this.hourList.map((hour) => h("li", { onClick: () => this.selectHour(hour.value), class: `hour-item ${hour.current ? 'current' : ''} ${hour.selected ? 'selected' : ''}` }, hour.value.format(format)));
        return (h("div", { class: "timepicker-container" },
            h("input-form", { onClick: () => this.openModal(), value: this.selected ? this.selected.format(format) : undefined, placeholder: placeholder, iconClass: timeIcon }),
            this.showModal ?
                h("div", { class: "modal-container" },
                    h("div", { id: "modalComponent", class: "modal has-header on-enter" },
                        h("header", { class: "modal-header" },
                            h("h2", null, title),
                            h("i", { class: closeIcon, onClick: () => this.closeModal() })),
                        h("article", { class: "modal-content" },
                            h("ul", { class: "hour-list" }, hourList))),
                    h("div", { class: "overlay", onClick: () => this.closeModal() })) : null));
    }
    static get is() { return "st-timepicker"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config", "watchCallbacks": ["initialWithProps"] }, "hourList": { "state": true }, "initialize": { "method": true }, "showModal": { "state": true } }; }
    static get events() { return [{ "name": "dateSelected$", "method": "dateSelected$", "bubbles": true, "cancelable": true, "composed": true }, { "name": "isLoaded$", "method": "isLoaded$", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "/**style-placeholder:st-timepicker:**/"; }
}
