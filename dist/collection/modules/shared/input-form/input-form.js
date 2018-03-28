export class InputFormComponent {
    componentDidLoad() {
        const el = this.input.querySelector('.input-group');
        console.log(this.input);
        el.addEventListener('mouseenter', () => {
            console.log('focus');
            el.className = 'input-group on-enter';
        });
        el.addEventListener('focusin', () => {
            console.log('focus');
            el.className = 'input-group on-enter';
        });
        el.addEventListener('mouseleave', () => {
            console.log('blur');
            el.className = 'input-group on-leave';
        });
    }
    onSelect() {
    }
    render() {
        return (h("div", { class: `input-group` },
            h("input", { readonly: true, class: "input", type: "text", value: this.value, placeholder: this.placeholder }),
            h("i", { class: this.iconClass })));
    }
    static get is() { return "input-form"; }
    static get properties() { return { "iconClass": { "type": String, "attr": "icon-class" }, "input": { "elementRef": true }, "placeholder": { "type": String, "attr": "placeholder" }, "value": { "type": "Any", "attr": "value" } }; }
    static get events() { return [{ "name": "isSelectEvent", "method": "isSelectEvent", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "/**style-placeholder:input-form:**/"; }
}
