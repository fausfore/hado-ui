import moment from 'moment';
export class StTimepicker {
    constructor() {
        this.current = moment();
        this.start = moment().startOf('day');
        this.end = moment().endOf('day');
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
        this.showModal = false;
        this.hourList = [];
        this.config = this.defaultState;
    }
    initialWithProps() {
        this.config ? this.initialize(this.config) : null;
    }
    initialize(props) {
        this.config = Object.assign({}, this.defaultState, this.config);
        if (props && props.value) {
            Number.isInteger(this.minutesOfDay(this.config.value) / 30)
                ? console.log('YYESS', this.isValid(this.minutesOfDay(this.config.value)))
                : console.log('NNNO', this.isValid(this.minutesOfDay(this.config.value)));
        }
        this.selected = this.config.value;
        const differ = this.start.diff(this.end, 'hour');
        let iterable = this.start;
        const currentHour = this.isValid(this.minutesOfDay(this.current));
        for (let i = 0; i <= Math.abs(differ) * 2 + 1; i++) {
            let isCurrent = false;
            this.minutesOfDay(iterable) === currentHour
                ? isCurrent = true
                : null;
            iterable = i === 0 ? moment(iterable) : moment(iterable.add(30, 'minute'));
            this.hourList = [
                ...this.hourList,
                {
                    value: iterable.format('HH:mm'),
                    current: isCurrent,
                    selected: false
                }
            ];
        }
    }
    componentWillLoad() {
        this.isLoaded$.emit();
    }
    minutesOfDay(m) {
        return m.minutes() + m.hours() * 60;
    }
    selectHour(value) {
        const payload = moment();
        this.selected = value;
        this.hourList = this.hourList.map((hour) => {
            hour.selected = hour.value === value;
            return hour;
        });
        const parse = this.selected.split(':');
        payload.set({
            hour: Number(parse[0]),
            minutes: Number(parse[1])
        });
        this.dateSelected$.emit(payload);
        this.closeModal();
    }
    isValid(value) {
        let numb = value;
        for (let i = 30; 0 <= i; i--) {
            numb = numb + 1;
            if (Number.isInteger(numb / 30)) {
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
        const { labels: { closeIcon, timeIcon, title } } = this.config;
        const hourList = this.hourList.map((hour) => h("li", { onClick: () => this.selectHour(hour.value), class: `hour-item ${hour.current ? 'current' : ''} ${hour.selected ? 'selected' : ''}` }, hour.value));
        return (h("div", { class: "timepicker-container" },
            h("button", { class: "btn circle", onClick: () => this.openModal() },
                h("i", { class: timeIcon })),
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
    static get is() { return "hado-timepicker"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config", "watchCallbacks": ["initialWithProps"] }, "hourList": { "state": true }, "initialize": { "method": true }, "showModal": { "state": true } }; }
    static get events() { return [{ "name": "dateSelected$", "method": "dateSelected$", "bubbles": true, "cancelable": true, "composed": true }, { "name": "isLoaded$", "method": "isLoaded$", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "/**style-placeholder:hado-timepicker:**/"; }
}
