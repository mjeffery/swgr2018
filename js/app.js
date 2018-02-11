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
        bindings: {
            //outlet: '^^outlet',
            outlet: '<'
        },
        controller: ['$interval', '$element', 'outlets', function($interval, $element, outlets) {
            var ctrl = this;
            let camera = null;
            ctrl.$postLink = function() {

                if(camera) {
                    this.camera.stop();
                }

                let canvas = $element.find('canvas');
                camera = new Camera(canvas[0]);
                ctrl.something = true;
                if(!ctrl.outlet.photo) {
                    camera.start();
                }
            };

            ctrl.outlets = outlets;

            ctrl.takePhoto = function() {
                camera.stop();

                ctrl.outlet.photo = camera.getSnapshot()
                    .then((photo)=>{
                        ctrl.outlet.photo = photo;
                        ctrl.outlets.$save(ctrl.outlet);
                    })
            };

            ctrl.retake = function() {
                ctrl.outlet.photo = null;
                ctrl.outlets.$save(ctrl.outlet);
                camera.start();
            };

            ctrl.save = function() {
                //ctrl.outlet.outlet.photo = ctrl.photo;
            };

        }],
        template: `
            <div ng-show="!$ctrl.outlet.photo">
                <canvas></canvas>
                <button ng-click="$ctrl.takePhoto()">Take Picture</button>
            </div>
            <div ng-show="$ctrl.outlet.photo">
                <img ng-src="{{$ctrl.outlet.photo}}">
                <button ng-click="$ctrl.retake()">Retake</button>
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
