/*! Built with http://stenciljs.com */
HadoUi.loadBundle("aqs0mcv7",["exports"],function(e){var t=window.HadoUi.h,n=function(){function e(){}return e.prototype.componentDidLoad=function(){var e=this.input.querySelector(".input-group");e.addEventListener("mouseenter",function(){e.className="input-group on-enter"}),e.addEventListener("mouseleave",function(){e.className="input-group on-leave"})},e.prototype.render=function(){return t("div",{class:"input-group"},t("input",{readonly:!0,class:"input",type:"text",value:this.value,placeholder:this.placeholder}),t("i",{class:this.iconClass}))},Object.defineProperty(e,"is",{get:function(){return"hado-input-form"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"encapsulation",{get:function(){return"scoped"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{iconClass:{type:String,attr:"icon-class"},input:{elementRef:!0},placeholder:{type:String,attr:"placeholder"},value:{type:"Any",attr:"value"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return".input-group{position:relative;display:flex;background:#0088ce;border-radius:6px;margin:5px 0}.input-group:before{position:absolute;top:calc(100% - 2px);height:2px;background:#0088ce;content:'';left:50%;transform:translateX(-50%);animation-duration:.3s;animation-fill-mode:forwards}.input-group.on-enter:before{animation-name:Expand}.input-group.on-leave:before{animation-name:Minimize}.input-group input{padding:13px 20px;width:calc(80% - 40px);background:#efeeee;color:#0088ce;border:none;border-radius:6px 0 0 6px;font-size:14px}.input-group i{position:absolute;top:50%;right:10%;transform:translateY(-50%) translateX(50%);color:#fff;font-size:22px}\@keyframes Expand{0%{width:0%}100%{width:98%}}\@keyframes Minimize{0%{width:98%}100%{width:0%}}"},enumerable:!0,configurable:!0}),e}();e.HadoInputForm=n,Object.defineProperty(e,"__esModule",{value:!0})});