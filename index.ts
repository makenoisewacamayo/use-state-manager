import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// Manager
class Manager {

    globalKey : string = '';
    subscribers : Array<any> = [];
    value : any;
    debug : boolean = false;

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
        this.subscribers.forEach((callback : any) => {
            callback(value);
        });
    };

    init = () => {
        this.publish(this.value);
    };

    subscribe = (callback : any) => {
        this.subscribers.push(callback);
    };

    console = (data : any) => {
        console.log(`manager[${this.globalKey}]:`, data);
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
 * Ussing in react, by subscribe setter
 * @param {*} manager 
 * @param {*} callback 
 */
export const useManagerCallbackRegister = (manager : Manager, callback : Dispatch<SetStateAction<any>>) : any => {
    useEffect(() => {
        manager.subscribe(callback);
    }, [manager, callback])
    return manager.publish;
};

/**
 * 
 * @param manager 
 */
export const useStateManager = (manager : Manager) : any => {
    const [value, setValue] = useState(manager.getValue());
    useEffect(() => {
        manager.subscribe(setValue);
    }, [manager, setValue])
    return [value, manager.publish];
};
/**
 * Example
 * const [age, setAge] = useState(0);
 * useManagerCallbackRegister(manager, setAge);
 */