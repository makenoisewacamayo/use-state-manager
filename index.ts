import { useState, useEffect } from 'react';

class Manager {

    private globalKey : string = '';
    private subscribers : any = {};
    private value : any;
    private debug : boolean = false;
    private persist: boolean = false;
    private autoincrement : number = 0;

    constructor(
        initialValue: any = null,
        globalKey : any = '',
        debug : boolean = false,
        persist: boolean = false ) {

        this.globalKey = globalKey;
        this.debug = debug;
        this.persist = persist;
        if (globalKey !== '') {
            const _global = (window /* browser || global /* node */) as any
            _global[globalKey] = this;
        }

        if(initialValue) {
            this.value = initialValue;
        }
    }

    publish = (value: any) => {
        this.console(value);
        this.value = value;
        Object.keys(this.subscribers).forEach((key : any) => {
            this.subscribers[key](value);
        });
    };

    init = () => {
        this.publish(this.value);
    };

    subscribe = (callback : any, key?: string) : string => {
        this.autoincrement += 1;
        const subsciberName = this.persist && key ? key : String(this.autoincrement);
        const assert = Object.keys(this.subscribers).includes(subsciberName)
        if (this.persist && assert) {
          return subsciberName
        }
        this.subscribers[subsciberName] = callback;
        // this.subscribers.push(callback);
        // Object.keys(this.subscribers)
        return subsciberName;
    };

    unsubscribe = (key : string) => {
        if (!this.persist) {
          delete this.subscribers[key];
        }
    }

    private console = (data : any) => {
        if(this.debug) {
            console.log(`manager[${this.globalKey}]:`, data);
        }
    }

    getValue = () : any => {
        return this.value;
    }
}

export const createManager = (initialValue : any, name : string, debug = false, persist = false) => new Manager(initialValue, name, debug, persist);

// react adapter

/**
 * Ussing in App.jsx to initialize manager
 * @param {*} manager 
 */
export const useManagerInit = (manager : Manager) => {
    useEffect(() => {
        manager.init()
    }, [manager])
}

/**
 * 
 * @param manager
 */
export const useStateManager = (manager : Manager, managerKey?: string) : Array<any|Function> => {
    const [value, setValue] = useState(manager.getValue());
    const [key, setKey] = useState('');

    useEffect(() => {
        const k = manager.subscribe(setValue, managerKey);
        setKey(k);
    }, [manager, setValue])

    useEffect(() => {
        return () => manager.unsubscribe(key);
    }, [manager, key])

    return [value, manager.publish];
};
