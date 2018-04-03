import { Component, Prop, State, Listen, Event, EventEmitter, Method } from '@stencil/core';
import { IState } from './autocomplete.interface';

@Component({
  tag: 'hado-autocomplete',
  styleUrl: './autocomplete.scss'
})

export class Autocomplete {

    @Prop() values : any[];
    @Prop() property: string;

    @State() ElementList: any[];
    @State() ElementListFilter: any[];
    @State() ObjProperty: string

    @Event() NewValueList$: EventEmitter;
    @Event() isLoaded$: EventEmitter;

    componentWillLoad () {
        this.initialize();        
    }

    componentDidLoad () {
        this.isLoaded$.emit();
    }

    @Method()
    initialize(props?: IState) {
        this.ElementList = props ? props.values : this.values;
        this.ObjProperty = props ? props.property : this.ObjProperty;
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

    renderList () {
        // Send the final result 
        this.NewValueList$.emit(this.ElementListFilter || this.ElementList);

        let parseElement = this.ElementListFilter ? this.ElementListFilter : this.ElementList;
        return parseElement ? parseElement.map((element) => {
            if (this.ObjProperty) {
                return <li>{element[this.ObjProperty]}</li>
            }
            return <li>{element}</li>
        }) : null;
    }


    render() {

        return (
            <div class="autocomplete">
                <hado-input-form readonly={false}></hado-input-form>
                <ul class="hado-item-list">
                    {this.renderList()}
                </ul>
            </div>

        );
  }
}
