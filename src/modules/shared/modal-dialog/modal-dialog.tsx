import { Component, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'hado-modal-dialog'
})

export class ModalDialogComponent {

    @Prop() title: string;
    @Prop() iconClass: string;
    @Event() modalEvent$: EventEmitter;

    closeModal () { 
        this.modalEvent$.emit()
    }

    render() {
        const { iconClass, title } = this;
        return (
            <div class="modal-container">
                <div id="modalComponent" class="modal has-header on-enter">
                    <header class="modal-header">
                        <h2>{title}</h2>
                        <i class={iconClass} onClick={() => this.closeModal()}/>
                    </header>
                    <article class="modal-content">
                        <slot/>
                    </article>
                </div>  
                <div class="overlay" onClick={() => this.closeModal()}></div>
            </div>
        );
    }
}
