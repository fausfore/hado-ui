export class InputFormComponent {
    componentDidLoad() {
        this.inputReady$.emit();
        const input = this.input.querySelector('.input-group');
        input.addEventListener('mouseenter', () => {
            input.className = `input-group on-enter ${this.iconClass ? 'icons' : ''}`;
        });
        input.addEventListener('mouseleave', () => {
            input.className = `input-group on-leave ${this.iconClass ? 'icons' : ''}`;
        });
    }
    changeValue(props) {
        if (props) {
            this.iconClass = props;
        }
    }
    render() {
        console.log(this.iconClass);
        return (h("div", { class: `input-group ${this.iconClass ? 'icons' : ''}` },
            h("input", { readOnly: true, class: "input", type: "text", value: this.value, placeholder: this.placeholder }),
            this.iconClass ?
                h("i", { class: this.iconClass })
                : null));
    }
    static get is() { return "hado-input-form"; }
    static get properties() { return { "changeValue": { "method": true }, "iconClass": { "type": String, "attr": "icon-class" }, "input": { "elementRef": true }, "placeholder": { "type": String, "attr": "placeholder" }, "value": { "type": "Any", "attr": "value" } }; }
    static get events() { return [{ "name": "inputReady$", "method": "inputReady$", "bubbles": true, "cancelable": true, "composed": true }]; }
}
