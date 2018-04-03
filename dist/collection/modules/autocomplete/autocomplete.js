export class Autocomplete {
    constructor() {
        this.ShowList = false;
    }
    componentWillLoad() {
        this.initialize();
    }
    componentDidLoad() {
        this.isLoaded$.emit();
        const input = this.Component.getElementsByTagName('input')[0];
        const list = this.Component.querySelector('#test');
        input.addEventListener('focus', () => {
            this.ShowList = true;
            list.className = 'hado-item-list on-slide-up';
        });
    }
    closeListBlock() {
        this.Component.querySelector('#test').className = 'hado-item-list on-slide-down';
        setTimeout(() => {
            this.ShowList = false;
        }, 300);
    }
    initialize(props) {
        if (props) {
            this.ElementList = props.values;
            this.ObjProperty = props.property;
            this.text = props.placeholder;
        }
        this.pipeFilter(this.ElementList, undefined);
    }
    update({ detail }) {
        if (detail) {
            this.pipeFilter(this.ElementList, detail);
        }
        else {
            this.ElementListFilter = detail;
        }
    }
    pipeFilter(array, wording) {
        if (!array)
            return [];
        if (!wording)
            return array;
        let subject = wording.toLowerCase();
        if (this.ObjProperty) {
            this.ElementListFilter = array.filter((item) => {
                return item[this.ObjProperty].toLowerCase().includes(subject);
            });
        }
        else {
            this.ElementListFilter = array.filter((item) => {
                return item.toLowerCase().includes(subject);
            });
        }
    }
    selectItem(item) {
        console.log(item);
        this.selectedItem$.emit(item);
        this.inputValue = item;
        this.closeListBlock();
    }
    renderList() {
        // Send the final result 
        this.NewValueList$.emit(this.ElementListFilter || this.ElementList);
        let parseElement = this.ElementListFilter ? this.ElementListFilter : this.ElementList;
        return parseElement ? parseElement.map((element) => {
            if (this.ObjProperty) {
                return h("li", { onClick: () => this.selectItem(element[this.ObjProperty]) }, element[this.ObjProperty]);
            }
            return h("li", { onClick: () => this.selectItem(element) }, element);
        }) : null;
    }
    render() {
        return (h("div", { class: "autocomplete" },
            this.ShowList ?
                h("div", { class: "overlay", onClick: () => { this.closeListBlock(); } })
                : null,
            h("hado-input-form", { value: this.inputValue, readonly: false, placeholder: this.text }),
            h("ul", { id: "test", class: "hado-item-list" }, this.ShowList ? this.renderList() : null)));
    }
    static get is() { return "hado-autocomplete"; }
    static get properties() { return { "Component": { "elementRef": true }, "ElementList": { "state": true }, "ElementListFilter": { "state": true }, "initialize": { "method": true }, "inputValue": { "state": true }, "ObjProperty": { "state": true }, "placeholder": { "type": String, "attr": "placeholder" }, "property": { "type": String, "attr": "property" }, "ShowList": { "state": true }, "text": { "state": true }, "values": { "type": "Any", "attr": "values" } }; }
    static get events() { return [{ "name": "NewValueList$", "method": "NewValueList$", "bubbles": true, "cancelable": true, "composed": true }, { "name": "isLoaded$", "method": "isLoaded$", "bubbles": true, "cancelable": true, "composed": true }, { "name": "selectedItem$", "method": "selectedItem$", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "/**style-placeholder:hado-autocomplete:**/"; }
}
