angular.module('app', [])

    .component('greeter', {
        template: '<h1>Hello, {{$ctrl.name}}</h1>',
        bindings: { name: '@' }
    });
