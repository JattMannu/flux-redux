//This feels like a interface in javascript
export class Store {
    constructor(dispatcher) {
        //Double underscore means this is a private variables as such no one is allowed to modify it.
        this.__listeners = [];
        this.__state = this.getInitialState();
        //Dispatcher.register takes in a Listener. this.__onDispatch.bind(this) is a listener.
        //Means when a event is Dispatcher Dispatch then this code will get triggered.
        dispatcher.register(this.__onDispatch.bind(this)); //How you link dispatcher with store.

        /*
        Whenever the dispatcher was fired the __onDispatch gets triggered.
        */
    }

    __onDispatch() {
        //This will let us know if did not override this function.
        throw new Error('Subclass must override __onDispatch method of a flux store');
    }

    getInitialState() {
        //The subclass must declare this function in-order to use it.
        throw new Error('Subclass must override   method of a flux store');
    }

    //Works similar to how dispatcher's work
    addListener(listener) {
        this.__listeners.push(listener);
    }

    //This function is called when ever the something in the store has change
    __emitChange() {
        //This will class the listeners
        this.__listeners.forEach(function (listener) {
            //Passing the state to all the listener.
            listener(this.__state);
        }, this);
    }
}
