import { ComponentMemberData, ComponentMeta, ComponentRegistry, LoadComponentRegistry, PropertyType } from '../declarations';
import { PROP_TYPE } from './constants';
export declare function parseComponentLoader(cmpRegistryData: LoadComponentRegistry, cmpRegistry: ComponentRegistry, i?: number, d?: ComponentMemberData): ComponentMeta;
export declare function parsePropertyValue(propType: PropertyType | PROP_TYPE, propValue: any): any;
