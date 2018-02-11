angular.module('app')

    .factory('EventEmitter', function() {
        return class EventEmitter {
            
            constructor() {
                this._listeners = new Map();
            }

            on(event, callback) {
                let listeners = this._listeners.get(event);
                if(!listeners) {
                    listeners = new Set()
                    this._listeners.add(event, listeners)
                }

                listeners.add(callback);

                const unlisten = () => {
                    listeners.remove(callback);
                }
            }

            emit(event, payload) {
                let listeners = this._listeners.get(event);
                if(listeners) {
                    for(listener of listeners) {
                        listener(payload)
                    }
                }
            }

        }
    })

