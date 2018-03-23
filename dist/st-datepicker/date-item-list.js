/*! Built with http://stenciljs.com */
const { h } = window.StDatepicker;

import moment from './chunk1.js';

class DateItemList {
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
        this.DateItemListEvent.emit(element.date);
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
    static get style() { return "\@keyframes Next {\n  0% {\n    opacity: 0;\n    transform: translateX(25%); }\n  100% {\n    opacity: 1;\n    transform: translateX(0); } }\n\n\@keyframes Previous {\n  0% {\n    opacity: 0;\n    transform: translateX(-25%); }\n  100% {\n    opacity: 1;\n    transform: translateX(0); } }\n\n.on-enter {\n  animation-name: Next;\n  animation-duration: 0.3s;\n  display: block; }\n\n.on-leave {\n  animation-name: Previous;\n  animation-duration: 0.3s;\n  display: block; }\n\nli {\n  position: relative;\n  width: 14%;\n  text-align: center;\n  height: 46px;\n  line-height: 46px; }\n  li .circle {\n    display: none;\n    background: #0088CE;\n    color: #fff;\n    border-radius: 90px;\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    width: 46px;\n    left: 50%;\n    transform: translateX(-50%); }\n  li.inactive {\n    opacity: 0.2; }\n  li.current {\n    color: #0088CE; }\n  li.isBetween {\n    color: #ef8e36; }\n  li.selected .circle {\n    display: block; }"; }
}

export { DateItemList };
