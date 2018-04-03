import { Component, Prop, State, Listen, Event, EventEmitter, Method, Element } from '@stencil/core';
import { IState } from './autocomplete.interface';

@Component({
  tag: 'hado-autocomplete',
  styleUrl: './autocomplete.scss'
})

export class Autocomplete {

    @Prop() values : any[];
    @Prop() property: string;
    @Prop() placeholder: string;

    @State() ElementList: any[];
    @State() ElementListFilter: any[];
    @State() ObjProperty: string
    @State() ShowList: boolean = false;
    @State() inputValue: string;
    @State() text: string;

    @Event() NewValueList$: EventEmitter;
    @Event() isLoaded$: EventEmitter;
    @Event() selectedItem$: EventEmitter;

    @Element() Component : HTMLElement;

    componentWillLoad () {
        this.initialize();        
    }

    componentDidLoad () {
        this.isLoaded$.emit();
        const input = this.Component.getElementsByTagName('input')[0];
        const list = this.Component.querySelector('#test');

        input.addEventListener('focus', () => {
            this.ShowList = true;
            list.className = 'hado-item-list on-slide-up' 
        })
    }

    closeListBlock () {
        this.Component.querySelector('#test').className = 'hado-item-list on-slide-down'
        setTimeout(() => {
            this.ShowList = false;
        }, 300);
    }

    @Method()
    initialize(props?: IState) {
        if (props) {
            this.ElementList = props.values;
            this.ObjProperty = props.property;
            this.text = props.placeholder
        }

        this.pipeFilter(this.ElementList, undefined)
    }

    @Listen('keyUp$')
    update ({detail}) {
        if (detail) {
            this.pipeFilter(this.ElementList, detail)
        } else {
            this.ElementListFilter = detail;
        }
    }

    pipeFilter (array : any[], wording: string) {
        if (!array) return [];
        if (!wording) return array;
        let subject = wording.toLowerCase();
        if (this.ObjProperty) {
            this.ElementListFilter = array.filter((item: any) => {
                return item[this.ObjProperty].toLowerCase().includes(subject);
            });
        } else {
            this.ElementListFilter = array.filter((item: any) => {
                return item.toLowerCase().includes(subject);
            });
        }

    }

    selectItem (item) {
        console.log(item)
        this.selectedItem$.emit(item);
        this.inputValue = item;
        this.closeListBlock();

    }

    renderList () {
        // Send the final result 
        this.NewValueList$.emit(this.ElementListFilter || this.ElementList);

        let parseElement = this.ElementListFilter ? this.ElementListFilter : this.ElementList;
        return parseElement ? parseElement.map((element) => {
            if (this.ObjProperty) {
                return <li onClick={() => this.selectItem(element[this.ObjProperty])}>{element[this.ObjProperty]}</li>
            }
            return <li onClick={() => this.selectItem(element)}>{element}</li>
        }) : null;
    }


    render() {

        return (
            <div class="autocomplete">
                {this.ShowList ?
                    <div class="overlay" onClick={() => { this.closeListBlock() }}></div>
                : null}
                <hado-input-form value={this.inputValue} readonly={false} placeholder={this.text}></hado-input-form>
                <ul id="test" class="hado-item-list">
                    {this.ShowList ? this.renderList() : null}
                </ul>
            </div>

        );
  }
}
