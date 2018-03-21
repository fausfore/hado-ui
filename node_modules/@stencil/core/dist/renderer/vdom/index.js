'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
const stack = [];
class VNode {
}
function h(nodeName, vnodeData, child) {
    let children;
    let lastSimple = false;
    let simple = false;
    for (var i = arguments.length; i-- > 2;) {
        stack.push(arguments[i]);
    }
    while (stack.length) {
        if ((child = stack.pop()) && child.pop !== undefined) {
            for (i = child.length; i--;) {
                stack.push(child[i]);
            }
        }
        else {
            if (typeof child === 'boolean')
                child = null;
            if ((simple = typeof nodeName !== 'function')) {
                if (child == null)
                    child = '';
                else if (typeof child === 'number')
                    child = String(child);
                else if (typeof child !== 'string')
                    simple = false;
            }
            if (simple && lastSimple) {
                children[children.length - 1].vtext += child;
            }
            else if (children === undefined) {
                children = [simple ? t(child) : child];
            }
            else {
                children.push(simple ? t(child) : child);
            }
            lastSimple = simple;
        }
    }
    const vnode = new VNode();
    vnode.vtag = nodeName;
    vnode.vchildren = children;
    if (vnodeData) {
        vnode.vattrs = vnodeData;
        vnode.vkey = vnodeData.key;
        vnode.vref = vnodeData.ref;
        // normalize class / classname attributes
        if (vnodeData['className']) {
            vnodeData['class'] = vnodeData['className'];
        }
        if (typeof vnodeData['class'] === 'object') {
            for (i in vnodeData['class']) {
                if (vnodeData['class'][i]) {
                    stack.push(i);
                }
            }
            vnodeData['class'] = stack.join(' ');
            stack.length = 0;
        }
    }
    return vnode;
}
function t(textValue) {
    const vnode = new VNode();
    vnode.vtext = textValue;
    return vnode;
}

exports.VNode = VNode;
exports.h = h;
exports.t = t;
