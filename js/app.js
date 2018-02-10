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

            ctrl.photo = null;

            let camera = new Camera(canvas[0]);
            camera.start();

            ctrl.takePhoto = function() {
                camera.stop();

                ctrl.photo = camera.getSnapshot();

            };

            ctrl.retake = function() {
                ctrl.photo = null;
                camera.start();
            };

            ctrl.save = function() {

            };

        }],
        template: `
            <div ng-show="!$ctrl.photo">
                <canvas></canvas>
                <button ng-click="$ctrl.takePhoto()">Take Picture</button>
            </div>
            <div ng-show="$ctrl.photo">
                <img ng-src="{{$ctrl.photo}}">
                <button ng-click="$ctrl.retake()">Retake</button>
                <button ng-click="$ctrl.save()">Save</button>
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

        $stateProvider.state({
            name: 'camera',
            url: '/camera',
            templateUrl: '/templates/camera.html'
        });

        $urlRouterProvider.otherwise('/sign-in');
    })
