angular.module('app', ['firebase', 'ui.router'])

    .component('app', {
        templateUrl: '/templates/app.html',
        controller: function($firebaseAuth, $state) {
            var auth = $firebaseAuth()

            this.currentUser = auth.$getAuth()

            this.logout = function() {
                auth.$signOut()
            }

            auth.$onAuthStateChanged( user => this.currentUser = user )
        }
    })

    .component('greeter', {
        template: '<h1>Hello, {{$ctrl.name}}</h1>',
        bindings: { name: '@' }
    })

    .component('camera', {
        controller: ['$element', function($element) {
            var ctrl = this;
            let canvas = $element.find('canvas');

            this.camera = new Camera(canvas[0]);
            this.camera.start();

            ctrl.users = users;
        }],
        template: `
            <div>
                <canvas></canvas>
            </div>
        `
    })

    .factory('users', ['$firebaseArray', '$firebaseObject', function($firebaseArray, $firebaseObject) {
        var usersRef = firebase.database().ref('users');
        return $firebaseArray(usersRef);
    }])

    .config(function() {
          // Initialize Firebase
          var config = {
            apiKey: "AIzaSyDZsXvUkBa2aUBr_zBVXNFzCaZ7t9NJ5eI",
            authDomain: "swgr2018.firebaseapp.com",
            databaseURL: "https://swgr2018.firebaseio.com",
            projectId: "swgr2018",
            storageBucket: "",
            messagingSenderId: "1035921728332"
          };
          firebase.initializeApp(config);
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state({
            name: 'main',
            url: '/',
            templateUrl: '/templates/main.html' 
        });

        $urlRouterProvider.otherwise('/sign-in');
    })
