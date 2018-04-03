export class InputFormComponent {
    componentDidLoad() {
        this.inputReady$.emit();
        const group = this.Component.querySelector('.input-group');
        const input = this.Component.querySelector('input[type]');
        input.addEventListener('focus', () => {
            group.className = `input-group on-enter ${this.iconClass ? 'icons' : ''}`;
        });
        input.addEventListener('blur', () => {
            group.className = `input-group on-leave ${this.iconClass ? 'icons' : ''}`;
        });
    }
    changeValue(props) {
        if (props) {
            this.iconClass = props;
        }
    }
    render() {
        return (h("div", { class: `input-group ${this.iconClass ? 'icons' : ''}` },
            h("input", { readOnly: this.readonly, onKeyUp: (event$) => {
                    const response = event$.target.value.length > 0 ? event$.target.value : undefined;
                    this.keyUp$.emit(response);
                }, class: "input", type: "text", value: this.value, placeholder: this.placeholder }),
            this.iconClass ?
                h("i", { class: this.iconClass })
                : null));
    }
    static get is() { return "hado-input-form"; }
    static get properties() { return { "changeValue": { "method": true }, "Component": { "elementRef": true }, "iconClass": { "type": String, "attr": "icon-class" }, "placeholder": { "type": String, "attr": "placeholder" }, "readonly": { "type": Boolean, "attr": "readonly" }, "value": { "type": "Any", "attr": "value" } }; }
    static get events() { return [{ "name": "inputReady$", "method": "inputReady$", "bubbles": true, "cancelable": true, "composed": true }, { "name": "keyUp$", "method": "keyUp$", "bubbles": true, "cancelable": true, "composed": true }]; }
}
