import { BuildCtx, ComponentMeta } from '../../declarations';
export declare function scopeComponentCss(buildCtx: BuildCtx, cmpMeta: ComponentMeta, cssText: string): string;
export declare function scopeCss(cssText: string, scopeAttribute: string, hostScopeAttr: string, slotScopeAttr: string): string;
export declare function getScopeAttribute(cmpMeta: ComponentMeta): string;
export declare function getHostScopeAttribute(cmpMeta: ComponentMeta): string;
export declare function getSlotScopeAttribute(cmpMeta: ComponentMeta): string;
