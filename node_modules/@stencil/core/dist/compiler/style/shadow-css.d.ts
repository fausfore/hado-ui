/**
 * This file is a port of shadow_css.ts from Angular,
 * which is a port of shadowCSS from webcomponents.js to TypeScript.
 * https://github.com/angular/angular/blob/master/packages/compiler/src/shadow_css.ts
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * This file is a port of shadowCSS from webcomponents.js to TypeScript.
 *
 * Please make sure to keep to edits in sync with the source file.
 *
 * Source:
 * https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js
 *
 * The original file level comment is reproduced below
 */
export declare class ShadowCss {
    strictStyling: boolean;
    shimCssText(cssText: string, selector: string, hostSelector?: string, slotSelector?: string): string;
    private _insertDirectives(cssText);
    private _insertPolyfillDirectivesInCssText(cssText);
    private _insertPolyfillRulesInCssText(cssText);
    private _scopeCssText(cssText, scopeSelector, hostSelector, slotSelector);
    private _extractUnscopedRulesFromCssText(cssText);
    private _convertColonHost(cssText);
    private _convertColonSlotted(cssText, slotAttr);
    private _convertColonHostContext(cssText);
    private _convertColonRule(cssText, regExp, partReplacer);
    private _colonHostContextPartReplacer(host, part, suffix);
    private _colonHostPartReplacer(host, part, suffix);
    private _convertShadowDOMSelectors(cssText);
    private _scopeSelectors(cssText, scopeSelector, hostSelector, slotSelector);
    private _scopeSelector(selector, scopeSelector, hostSelector, slotSelector, strict);
    private _selectorNeedsScoping(selector, scopeSelector);
    private _makeScopeMatcher(scopeSelector);
    private _applySelectorScope(selector, scopeSelector, hostSelector);
    private _applySimpleSelectorScope(selector, scopeSelector, hostSelector);
    private _applyStrictSelectorScope(selector, scopeSelector, hostSelector);
    private _insertPolyfillHostInCssText(selector);
}
export declare class CssRule {
    selector: string;
    content: string;
    constructor(selector: string, content: string);
}
export declare function processRules(input: string, ruleCallback: (rule: CssRule) => CssRule): string;
