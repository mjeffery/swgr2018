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

    .config(function($stateProvider) {
        $stateProvider.state({
            name: 'signIn',
            url: '/sign-in',
            component: 'signIn'
        })
    })
