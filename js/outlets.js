angular.module('app')

    .factory('outlets', ['$firebaseArray', function($firebaseArray) {
        return $firebaseArray(firebase.database().ref('outlets'));;

    }])

    .factory('mqttstatus2', ['$firebaseObject', function($firebaseObject) {
        return $firebaseObject(firebase.database().ref('mqttstatus2'));;
    }])

    .component('outletList', {
        templateUrl: '/templates/outlet-list.html',
        bindings: {
            uid: '<',
            status: '<'
        },
        controller: function($state, outlets) {
            var ctrl = this;

            ctrl.outlets = outlets;

            ctrl.addOutlet = function() {
                $state.go('locateNewOutlet');
            }

            ctrl.turnOn = function(outlet){
                outlet.status = "1a";
                ctrl.outlets.$save(outlet);
            };
            ctrl.turnOff = function(outlet){
                outlet.status = "0a";
                outlets.$save(outlet);
            }
        }
    })

    .component('outlet', {
        templateUrl: '/templates/outlet.html',
        bindings: {
            outlet: '<',
            status: '<'
        },
        controller: function(outlets) {
            var ctrl = this;
            ctrl.turnOn = function(){
                ctrl.outlet.status = "1a";
                outlets.$save(ctrl.outlet);
            };
            ctrl.turnOff = function(){
                ctrl.outlet.status = "0a";
                outlets.$save(ctrl.outlet);
            }

        }
    })

    .config(function($stateProvider) {

        $stateProvider.state({
            name: 'outlet',
            url: '/outlets/:outletId',
            component: 'outlet',
            resolve: {
                requireAuth: function ($firebaseAuth, $state) {
                    return $firebaseAuth().$requireSignIn().catch(function () {
                        $state.go('/');
                    });
                },
                outlet: function ($stateParams, outlets) {
                    return outlets.$loaded().then(function (outletData) {
                        return outletData.$getRecord($stateParams.outletId);
                    });
                },
                status: function (mqttstatus2) {
                    return mqttstatus2.$loaded().then(function (outletData) {
                        return outletData;
                    });
                }
            }
        });

        $stateProvider.state({
            name: 'outlets',
            url: '/outlets',
            component: 'outletList',
            resolve: {
                uid: function ($firebaseAuth, $state) {
                    return $firebaseAuth().$requireSignIn().then(function (auth) {
                        return auth.uid;
                    })
                        .catch(function () {
                            $state.go('/');
                        });
                },
                status: function (mqttstatus2) {
                    return mqttstatus2.$loaded().then(function (outletData) {
                        return outletData;
                    });
                }
            }
        });
    });
