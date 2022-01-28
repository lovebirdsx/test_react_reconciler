import ReactReconciler from 'react-reconciler';

const rootHostContext = {};
const childHostContext = {};

const hostConfig = {
    now: Date.now,
    getRootHostContext: () => {
        return rootHostContext;
    },
    prepareForCommit: () => {},
    resetAfterCommit: () => {},
    getChildHostContext: () => {
        return childHostContext;
    },
    shouldSetTextContent: (type, props) => {
        return (
            typeof props.children === 'string' ||
            typeof props.children === 'number'
        );
    },
    /**
     * This method should return a newly created node. For example, the DOM renderer would 
     * call `document.createElement(type)` here and then set the properties from `props`.
     *
     * You can use `rootContainer` to access the root container associated with that tree. 
     * For example, in the DOM renderer, this is useful to get the correct `document` reference that the root belongs to.
     *
     * The `hostContext` parameter lets you keep track of some information about your current place in the tree.
     *  To learn more about it, see `getChildHostContext` below.
     *
     * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields,
     * be aware that it may change significantly between versions. You're taking on additional maintenance risk by
     *  reading from it, and giving up all guarantees if you write something to it.
     *
     * This method happens **in the render phase**. It can (and usually should) mutate the node it has just created 
     * before returning it, but it must not modify any other nodes. It must not register any event handlers on 
     * the parent tree. This is because an instance being created doesn't guarantee it would be placed in the 
     * tree — it could be left unused and later collected by GC. If you need to do something when an instance is 
     * definitely in the tree, look at `commitMount` instead.
     */
    createInstance: (
        type,
        newProps,
        rootContainerInstance,
        _currentHostContext,
        workInProgress
    ) => {
        const domElement = document.createElement(type);
        Object.keys(newProps).forEach((propName) => {
            const propValue = newProps[propName];
            if (propName === 'children') {
                if (
                    typeof propValue === 'string' ||
                    typeof propValue === 'number'
                ) {
                    domElement.textContent = propValue;
                }
            } else if (propName === 'onClick') {
                domElement.addEventListener('click', propValue);
            } else if (propName === 'className') {
                domElement.setAttribute('class', propValue);
            } else {
                const propValue = newProps[propName];
                domElement.setAttribute(propName, propValue);
            }
        });
        return domElement;
    },

    /**
     * Same as `createInstance`, but for text nodes. If your renderer doesn't support text nodes, you can throw here.
     */
    createTextInstance: (text) => {
        return document.createTextNode(text);
    },

    /**
     * This method should mutate the `parentInstance` and add the child to its list of children. For example, 
     * in the DOM this would translate to a `parentInstance.appendChild(child)` call.
     *
     * This method happens **in the render phase**. It can mutate `parentInstance` and `child`, but it must not
     * modify any other nodes. It's called while the tree is still being built up and not connected to the actual 
     * tree on the screen.
     */
    appendInitialChild: (parent, child) => {
        parent.appendChild(child);
    },

    /**
     * This method should mutate the `parentInstance` and add the child to its list of children. For example,
     *  in the DOM this would translate to a `parentInstance.appendChild(child)` call.
     *
     * Although this method currently runs in the commit phase, you still should not mutate any other nodes in it.
     * If you need to do some additional work when a node is definitely connected to the visible tree, look at `commitMount`.
     */
    appendChild(parent, child) {
        parent.appendChild(child);
    },

    /**
     * In this method, you can perform some final mutations on the `instance`. Unlike with `createInstance`, 
     * by the time `finalizeInitialChildren` is called, all the initial children have already been added to the `instance`, 
     * but the instance itself has not yet been connected to the tree on the screen.
     *
     * This method happens **in the render phase**. It can mutate `instance`, but it must not modify any other nodes.
     *  It's called while the tree is still being built up and not connected to the actual tree on the screen.
     *
     * There is a second purpose to this method. It lets you specify whether there is some work that needs to 
     * happen when the node is connected to the tree on the screen. If you return `true`, 
     * the instance will receive a `commitMount` call later. See its documentation below.
     *
     * If you don't want to do anything here, you should return `false`.
     */
    finalizeInitialChildren: (domElement, type, props) => {},

    /**
     *
     * The reconciler has two modes: mutation mode and persistent mode. You must specify one of them.
     *
     * If your target platform is similar to the DOM and has methods similar to `appendChild`, `removeChild`,
     *  and so on, you'll want to use the **mutation mode**. This is the same mode used by React DOM, React ART, 
     * and the classic React Native renderer.
     *
     * ```js
     * const HostConfig = {
     *   // ...
     *   supportsMutation: true,
     *   // ...
     * }
     * ```
     */
    supportsMutation: true,

    /**
     * Same as `appendChild`, but for when a node is attached to the root container. This is useful if attaching 
     * to the root has a slightly different implementation, or if the root container nodes are of a different
     *  type than the rest of the tree.
     */
    appendChildToContainer: (parent, child) => {
        parent.appendChild(child);
    },

    /**
     * React calls this method so that you can compare the previous and the next props, and decide whether 
     * you need to update the underlying instance or not. If you don't need to update it, return `null`. 
     * If you need to update it, you can return an arbitrary object representing the changes that need to happen. 
     * Then in `commitUpdate` you would need to apply those changes to the instance.
     *
     * This method happens **in the render phase**. It should only *calculate* the update — but not apply it! 
     * For example, the DOM renderer returns an array that looks like `[prop1, value1, prop2, value2, ...]` 
     * for all props that have actually changed. And only in `commitUpdate` it applies those changes.
     *  You should calculate as much as you can in `prepareUpdate` so that `commitUpdate` can be very 
     * fast and straightforward.
     *
     * See the meaning of `rootContainer` and `hostContext` in the `createInstance` documentation.
     */
    prepareUpdate(domElement, oldProps, newProps) {
        return true;
    },

    /**
     * This method should mutate the `instance` according to the set of changes in `updatePayload`. 
     * Here, `updatePayload` is the object that you've returned from `prepareUpdate` and has an arbitrary 
     * structure that makes sense for your renderer. For example, the DOM renderer returns an update payload 
     * like `[prop1, value1, prop2, value2, ...]` from `prepareUpdate`, and that structure gets passed into 
     * `commitUpdate`. Ideally, all the diffing and calculation should happen inside `prepareUpdate` so that
     *  `commitUpdate` can be fast and straightforward.
     *
     * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its 
     * internal fields, be aware that it may change significantly between versions. You're taking on 
     * additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
     */
    commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
        Object.keys(newProps).forEach((propName) => {
            const propValue = newProps[propName];
            if (propName === 'children') {
                if (
                    typeof propValue === 'string' ||
                    typeof propValue === 'number'
                ) {
                    domElement.textContent = propValue;
                }
            } else {
                const propValue = newProps[propName];
                domElement.setAttribute(propName, propValue);
            }
        });
    },

    /**
     * This method should mutate the `textInstance` and update its text content to `nextText`.
     *
     * Here, `textInstance` is a node created by `createTextInstance`.
     */
    commitTextUpdate(textInstance, oldText, newText) {
        textInstance.text = newText;
    },

    /**
     * This method should mutate the `parentInstance` to remove the `child` from the list of its children.
     *
     * React will only call it for the top-level node that is being removed. It is expected that garbage 
     * collection would take care of the whole subtree. You are not expected to traverse the child tree in it.
     */
    removeChild(parentInstance, child) {
        parentInstance.removeChild(child);
    },

    /**
     * This method should mutate the `container` root node and remove all children from it.
     */
    clearContainer() {
        console.log('clear');
    },
};

const ReactReconcilerInst = ReactReconciler(hostConfig);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    render: (reactElement, domElement, callback) => {
        // Create a root Container if it doesnt exist
        if (!domElement._rootContainer) {
            domElement._rootContainer = ReactReconcilerInst.createContainer(
                domElement,
                false
            );
        }

        // update the root Container
        return ReactReconcilerInst.updateContainer(
            reactElement,
            domElement._rootContainer,
            null,
            callback
        );
    },
};
