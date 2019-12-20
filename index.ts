import { useState, useEffect } from 'react';

class Manager {

    private globalKey : string = '';
    private subscribers : any = {};
    private value : any;
    private debug : boolean = false;
    private autoincrement : number = 0;

    constructor(
        initialValue: any = null,
        globalKey : any = '',
        debug : boolean = false) {

        this.globalKey = globalKey;
        this.debug = debug;
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

    subscribe = (callback : any) : number => {
        this.autoincrement += 1;

        this.subscribers[this.autoincrement] = callback;
        // this.subscribers.push(callback);
        // Object.keys(this.subscribers)
        return this.autoincrement;
    };

    unsubscribe = (key : number) => {
        delete this.subscribers[key];
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

export const createManager = (initialValue : any, name : string, debug = false) => new Manager(initialValue, name, debug);

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
export const useStateManager = (manager : Manager) : Array<any|Function> => {
    const [value, setValue] = useState(manager.getValue());
    const [key, setKey] = useState(0);

    useEffect(() => {
        const k = manager.subscribe(setValue);
        setKey(k);
    }, [manager, setValue])

    useEffect(() => {
        return () => manager.unsubscribe(key);
    }, [manager, key])

    return [value, manager.publish];
};
