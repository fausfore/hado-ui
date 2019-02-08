import { Component, Prop, Element, Event, EventEmitter, Method } from '@stencil/core';

@Component({
  tag: 'hado-input-form'
})

export class InputFormComponent {

    @Prop() value: any
    @Prop() iconClass: string;
    @Prop() placeholder: string;
    @Prop() readonly: boolean;
    @Element() Component: HTMLElement;
    @Event() inputReady$: EventEmitter;
    @Event() keyUp$: EventEmitter;

    componentDidLoad () {
        this.inputReady$.emit()
        const group = this.Component.querySelector('.input-group');
        const input = this.Component.querySelector('input[type]');
        input.addEventListener('focus', () => {
            group.className = `input-group on-enter ${this.iconClass ? 'icons': ''}`
        })

        input.addEventListener('blur', () => {
            group.className = `input-group on-leave ${this.iconClass ? 'icons': ''}`
        })
    }

    @Method()
    changeValue (props?) {
        if (props) {
            this.iconClass = props
        }
    }


    render() {

    return (
        <div class={`input-group ${this.iconClass ? 'icons': ''}`}>
            <input
                readOnly={this.readonly}
                onKeyUp={(event$ : any) => {
                    const response = event$.target.value.length > 0 ? event$.target.value : undefined;
                    this.keyUp$.emit(response)
                }}
                class="input"
                type="text"
                value={this.value}
                placeholder={this.placeholder}/>
                { this.iconClass ?
                    <i class={this.iconClass}/>
                : null }
        </div>
    );
  }
}
