import { Component, Prop, Event, EventEmitter, Element } from '@stencil/core';

@Component({
  tag: 'input-form',
  styleUrl: 'input-form.scss'
})

export class InputFormComponent {

    @Prop() value: any
    @Prop() iconClass: string;
    @Prop() placeholder: string;
    @Event() isSelectEvent: EventEmitter;
    @Element() input: HTMLElement;

    componentDidLoad () {
        const el = this.input.querySelector('.input-group')
        console.log(this.input)
        el.addEventListener('mouseenter', () => {
            console.log('focus')
            el.className = 'input-group on-enter'
        })
        el.addEventListener('focusin', () => {
            console.log('focus')
            el.className = 'input-group on-enter'
        })
        el.addEventListener('mouseleave', () => {
            console.log('blur')
            el.className = 'input-group on-leave'
        })
    }

    onSelect () {

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
