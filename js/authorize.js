angular.module('app')

    .component('signIn', {
        templateUrl: '/templates/sign-in.html',
        controller: function($firebaseAuth, $state) {
            var ctrl = this;
            var auth = $firebaseAuth()

            this.login = () => {
                try {
                auth.$signInWithEmailAndPassword(ctrl.email, ctrl.password)
                    .then( () => $state.go('main') )
                    .catch( e => ctrl.error = e.message )
                } catch(e) {
                    ctrl.error = e.message;
                }
            }
        }
    })

    .component('register', {
        templateUrl: '/templates/register.html',
        controller: function($firebaseAuth, $state) {
            var ctrl = this;
            var auth = $firebaseAuth()

            this.register = function() {
                try {
                    auth.$createUserWithEmailAndPassword(ctrl.email, ctrl.password)
                        .then( user => $state.go('main') )
                        .catch( e => ctrl.error = e.message )
                } catch(e) {
                    ctrl.error = e.message;
                }
            }
        }
    })

    .config(function($stateProvider) {
        $stateProvider.state({
            name: 'signIn',
            url: '/sign-in',
            component: 'signIn'
        })

        $stateProvider.state({
            name: 'register',
            url: '/register',
            component: 'register'
        });
    })
