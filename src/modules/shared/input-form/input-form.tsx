import { Component, Prop, Element, Event, EventEmitter, Method } from '@stencil/core';

@Component({
  tag: 'hado-input-form'
})

export class InputFormComponent {

    @Prop() value: any
    @Prop() iconClass: string;
    @Prop() placeholder: string;
    @Element() input: HTMLElement;
    @Event() inputReady$: EventEmitter;

    componentDidLoad () {
        this.inputReady$.emit()
        const input = this.input.querySelector('.input-group');
        input.addEventListener('mouseenter', () => {
            input.className = `input-group on-enter ${this.iconClass ? 'icons': ''}`
        })

        input.addEventListener('mouseleave', () => {
            input.className = `input-group on-leave ${this.iconClass ? 'icons': ''}`
        })
    }

    @Method()
    changeValue (props?) {
        if (props) {
            this.iconClass = props
        }
    }

    render() {
        console.log(this.iconClass)

    return (
        <div class={`input-group ${this.iconClass ? 'icons': ''}`}>
            <input readOnly
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
