angular.module('app')

    .factory('pairingService', function($timeout, $firebaseObject, outlets) {

        class PairingService {

            constructor() {
                this._listeners = new Set();
                this._network = null;
                this._state = 'ready';
            }

            startPairing() {
                let newOutletData = { name: 'Unknown', status: 'unpaired' } 

                if(this._unwatchOutlet) {
                    this._unwatchOutlet();
                    this._unwatchOutlet = this._outlet = null;
                    this._state = 'ready'
                }

                this._state = 'pairing'

                $timeout(1500)
                    .then( () => outlets.$add(newOutletData) )
                    .then( ref => {
                        this._outlet = $firebaseObject(ref)
                        this._unwatchOutlet = this._outlet.$watch(this._outletChanged, this)

                        this._emit('outlet-found', this._outlet)
                    })
            }

            setNetwork(network) {
                this._network = network;
                if(this._network && this._state == 'enter-wifi-info') {
                    this._finishPairing();
                }
            }

            addListener(callback) {
                this._listeners.add(callback);

                const self = this;
                return function unlisten() {
                    self._listeners.delete(callback);
                }
            }

            _emit(status) {
                for(let listener of this._listeners) {
                    listener(status, this._outlet);
                }
            }

            _finishPairing() {
                this._emit('configuring-outlet', this._outlet)
                $timeout(1500)
                    .then( () => {
                        this._emit('finished-pair', this._outlet);

                        this._unwatchOutlet();
                        this._unwatchOutlet = this._outlet = null;
                        this.state = 'ready';
                    })
            }

            _outletChanged() {
                if(!this._outlet) return;

                switch (this._state) {
                    case 'pairing':
                        if(this._outlet.status == 'paired') {
                            if(!this._network) {
                                this._state = 'enter-wifi-info'
                                this._emit('get-wifi-info', this._outlet)
                            } else {
                                this._finishPairing();
                            }
                        }
                        break;
                }

            }
        }

        return new PairingService();
    })

    .run(function($state, pairingService) {
        pairingService.addListener( (status, outlet) => {
            if(status == 'get-wifi-info')
               $state.go('enterWifiInfo')
        })
    })

    .component('enterWifiInfo', {
        templateUrl: '/templates/enter-wifi-info.html',
        controller: function(pairingService, $state) {
            var ctrl = this;

            //TODO: add some fake networks that look right for the presentation
            ctrl.networks = [
                { ssid: 'Start Garden Managed Network', private: false },
                { ssid: 'Start Garden', private: true },
                { ssid: 'A Private Network', private: true },
                { ssid: 'Another Private Network', private: true }
            ];

            ctrl.saveNetwork = function() {
                $state.go('locateNewOutlet', { state: 'configuring-outlet', startPairing: false })
                pairingService.setNetwork(ctrl.network)
            }
        }
    })

    .component('locateNewOutlet', {
        templateUrl: '/templates/locate-new-outlet.html',
        bindings: { 
            state: '@',
            startPairing: '<'
        },
        controller: function(pairingService, $state, $timeout) {
            this.$onDestroy = pairingService.addListener( (status, outlet) => {
                switch(status) {
                    case 'outlet-found': 
                        this.state = 'outlet-found'; 
                        break;

                    case 'configuring-outlet': 
                        this.state = 'configuring-outlet';
                        break;

                    case 'finished-pair': 
                        this.state = 'finished-pair';
                        $timeout(1000)
                            .then( () => $state.go('firstTimeConfigure', { outlet }) )
                        break;
                }
            })
                
            this.$onInit = function() {
                if(this.startPairing) {
                    this.state = 'looking-for-outlet'
                    pairingService.startPairing();
                }
            }
        }
    })

    .component('firstTimeConfigure', {
        templateUrl: '/templates/first-time-configure.html',
        binding: { outlet: '<' },
        controller: function() {

        }
    })

    .config(function($stateProvider) {
        $stateProvider.state({
            name: 'enterWifiInfo',
            url: '/enter-wifi-info',
            component: 'enterWifiInfo'
        })

        $stateProvider.state({
            name: 'locateNewOutlet',
            url: '/locate-new-outlet',
            params: {
                state: { value: 'looking-for-outlet' },
                startPairing: {
                    type: 'bool',
                    value: true
                }
            },
            component: 'locateNewOutlet',
            resolve: resolveStateParams('state', 'startPairing')
        })

        $stateProvider.state({
            name: 'firstTimeConfigure',
            url: '/first-time-configure',
            component: 'firstTimeConfigure'
        })

        function resolveStateParams(...params) {
            return params.reduce( function(acc, param) {
                acc[param] = ['$stateParams', params => params[param] ]
                return acc
            }, {}) 
        }
    })

