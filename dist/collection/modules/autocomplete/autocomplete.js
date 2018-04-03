export class Autocomplete {
    componentWillLoad() {
        this.initialize();
    }
    componentDidLoad() {
        this.isLoaded$.emit();
    }
    initialize(props) {
        console.log('[AUTO_COMPLETE] initialize', props);
        this.ElementList = props ? props.values : this.values;
        this.ObjProperty = props ? props.property : this.ObjProperty;
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
        console.log(array, wording, this.property);
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
    renderList() {
        // Send the final result 
        this.NewValueList$.emit(this.ElementListFilter || this.ElementList);
        let parseElement = this.ElementListFilter ? this.ElementListFilter : this.ElementList;
        return parseElement ? parseElement.map((element) => {
            console.log('parseElement => ', this.ObjProperty);
            if (this.ObjProperty) {
                return h("li", null, element[this.ObjProperty]);
            }
            return h("li", null, element);
        }) : null;
    }
    render() {
        return (h("div", { class: "autocomplete" },
            h("hado-input-form", { readonly: false }),
            h("ul", { class: "hado-item-list" }, this.renderList())));
    }
    static get is() { return "hado-autocomplete"; }
    static get properties() { return { "ElementList": { "state": true }, "ElementListFilter": { "state": true }, "initialize": { "method": true }, "ObjProperty": { "state": true }, "property": { "type": String, "attr": "property" }, "values": { "type": "Any", "attr": "values" } }; }
    static get events() { return [{ "name": "NewValueList$", "method": "NewValueList$", "bubbles": true, "cancelable": true, "composed": true }, { "name": "isLoaded$", "method": "isLoaded$", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "/**style-placeholder:hado-autocomplete:**/"; }
}
