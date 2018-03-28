export class InputFormComponent {
    componentDidLoad() {
        const el = this.input.querySelector('.input-group');
        el.addEventListener('mouseenter', () => {
            el.className = 'input-group on-enter';
        });
        el.addEventListener('mouseleave', () => {
            el.className = 'input-group on-leave';
        });
    }
    render() {
        return (h("div", { class: `input-group` },
            h("input", { readonly: true, class: "input", type: "text", value: this.value, placeholder: this.placeholder }),
            h("i", { class: this.iconClass })));
    }
    static get is() { return "hado-input-form"; }
    static get encapsulation() { return "scoped"; }
    static get properties() { return { "iconClass": { "type": String, "attr": "icon-class" }, "input": { "elementRef": true }, "placeholder": { "type": String, "attr": "placeholder" }, "value": { "type": "Any", "attr": "value" } }; }
    static get style() { return "/**style-placeholder:hado-input-form:**/"; }
}
