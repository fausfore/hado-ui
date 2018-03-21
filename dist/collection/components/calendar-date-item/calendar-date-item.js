import moment from 'moment';
export class DateItemList {
    checkStyle(newProp) {
        if (newProp.animation) {
            this.DateItemListHTML.className = `hydrated on-${newProp.animation}`;
            setTimeout(() => {
                this.DateItemListHTML.classList.remove(`on-${newProp.animation}`);
            }, 300);
        }
        this.dateItemListHost = newProp.itemList;
    }
    chooseDate(element) {
        if (element.disable)
            return;
        this.dateItemListHost = this.dateItemListHost.map((item) => {
            item.selected = item.date === element.date;
            return item;
        });
        this.DateItemListEvent.emit(element);
    }
    getStyleClass(item) {
        if (!item) {
            return;
        }
        const classArray = [];
        if (item.disable) {
            classArray.push('inactive');
        }
        if (item.selected) {
            classArray.push('selected');
        }
        if (item.current) {
            classArray.push('current');
        }
        if (item.isBetween) {
            classArray.push('isBetween');
        }
        return classArray.join(' ');
    }
    getLabel(item) {
        return moment(item).format('DD');
    }
    render() {
        const listItem = this.dateItemListHost ? this.dateItemListHost.map((i) => (h("li", { onClick: () => this.chooseDate(i), class: this.getStyleClass(i) },
            this.getLabel(i.date),
            h("span", { class: "circle" }, this.getLabel(i.date))))) : null;
        return (h("ul", { class: "date-list" }, listItem));
    }
    static get is() { return "date-item-list"; }
    static get properties() { return { "dataItemConfig": { "type": "Any", "attr": "data-item-config", "watchCallbacks": ["checkStyle"] }, "dateItemList": { "type": "Any", "attr": "date-item-list" }, "dateItemListHost": { "state": true }, "DateItemListHTML": { "elementRef": true } }; }
    static get events() { return [{ "name": "startDateSelectedEvent", "method": "startDateSelectedEvent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "endDateSelectedEvent", "method": "endDateSelectedEvent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "DateItemListEvent", "method": "DateItemListEvent", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "/**style-placeholder:date-item-list:**/"; }
}
