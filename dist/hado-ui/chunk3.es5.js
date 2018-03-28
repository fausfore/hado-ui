/*! Built with http://stenciljs.com */
HadoUi.loadBundle("./chunk3.js", ["exports"], function (e) { var t = window.HadoUi.h; e.InputFormComponent = /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype.componentDidLoad = function () { var e = this.input.querySelector(".input-group"); e.addEventListener("mouseenter", function () { e.className = "input-group on-enter"; }), e.addEventListener("mouseleave", function () { e.className = "input-group on-leave"; }); };
    class_1.prototype.render = function () { return t("div", { class: "input-group" }, t("input", { readonly: !0, class: "input", type: "text", value: this.value, placeholder: this.placeholder }), t("i", { class: this.iconClass })); };
    Object.defineProperty(class_1, "is", {
        get: function () { return "hado-input-form"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1, "properties", {
        get: function () { return { iconClass: { type: String, attr: "icon-class" }, input: { elementRef: !0 }, placeholder: { type: String, attr: "placeholder" }, value: { type: "Any", attr: "value" } }; },
        enumerable: true,
        configurable: true
    });
    return class_1;
}()); });
