angular.module('app')

    .factory('outlets', ['$firebaseArray', function($firebaseArray) {
        return $firebaseArray(firebase.database().ref('outlets'));;

    }])

    .component('outletList', {
        templateUrl: '/templates/outlet-list.html',
        bindings: {
            uid: '<'
        },
        controller: function(outlets) {
            var ctrl = this;
            ctrl.outlets = outlets;

            ctrl.addOutlet = function(){
                var outlet = {name: 'bathroom', status: 'enabled'};
                ctrl.outlets.$add(outlet).then(function(data){
                    ctrl.result = data;
                })
            }
        }
    })

    .component('outlet', {
        templateUrl: '/templates/outlet.html',
        bindings: {
            uid: '<'
        },
        controller: function() {
            var ctrl = this;

        }
    })

    .config(function($stateProvider) {
        $stateProvider.state({
            name: 'outlet',
            url: '/outlets/:outlet',
            resolve: {
                uid: function($firebaseAuth, $state){
                    return $firebaseAuth().$requireSignIn().then(function(auth){
                        return auth.uid;
                    })
                        .catch(function () {
                            $state.go('/');
                        });
                }
            }
        });

        $stateProvider.state({
            name: 'outlets',
            url: '/outlets',
            component: 'outletList',
            resolve: {
                uid: function($firebaseAuth, $state){
                    return $firebaseAuth().$requireSignIn().then(function(auth){
                        return auth.uid;
                    })
                        .catch(function () {
                            $state.go('/');
                        });
                }
            }
        });
    });
