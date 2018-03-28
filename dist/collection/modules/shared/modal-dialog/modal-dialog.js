export class ModalDialogComponent {
    closeModal() {
        this.modalEvent$.emit();
    }
    render() {
        const { iconClass, title } = this;
        return (h("div", { class: "modal-container" },
            h("div", { id: "modalComponent", class: "modal has-header on-enter" },
                h("header", { class: "modal-header" },
                    h("h2", null, title),
                    h("i", { class: iconClass, onClick: () => this.closeModal() })),
                h("article", { class: "modal-content" },
                    h("slot", null))),
            h("div", { class: "overlay", onClick: () => this.closeModal() })));
    }
    static get is() { return "hado-modal-dialog"; }
    static get properties() { return { "iconClass": { "type": String, "attr": "icon-class" }, "title": { "type": String, "attr": "title" } }; }
    static get events() { return [{ "name": "modalEvent$", "method": "modalEvent$", "bubbles": true, "cancelable": true, "composed": true }]; }
}
