import { Component, Prop, Element } from '@stencil/core';

@Component({
  tag: 'hado-input-form',
  styleUrl: 'hado-input-form.scss',
  scoped: true
})

export class InputFormComponent {

    @Prop() value: any
    @Prop() iconClass: string;
    @Prop() placeholder: string;
    @Element() input: HTMLElement;

    componentDidLoad () {
        const el = this.input.querySelector('.input-group')
        el.addEventListener('mouseenter', () => {
            el.className = 'input-group on-enter'
        })

        el.addEventListener('mouseleave', () => {
            el.className = 'input-group on-leave'
        })
    }

    render() {
    return (
        <div class={`input-group`}>
            <input readonly
                class="input"
                type="text"
                value={this.value}
                placeholder={this.placeholder}/>
            <i class={this.iconClass}/>
        </div>
    );
  }
}
