'use strict';

/**
 * @ngdoc overview
 * @name proposalApp
 * @description
 * # proposalApp
 *
 * Main module of the application.
 */
angular
    .module('proposalApp', [
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ui.router',
        'ngSanitize',
        'ngTouch',
        'smart-table',
        'ui.bootstrap'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller: 'HeaderCtrl as header'
                    },
                    'sidebar': {
                        templateUrl : 'views/sidebar.html',
                        controller: 'SidebarCtrl as sidebar'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller: 'HomeCtrl as home'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }
            });
        $urlRouterProvider.otherwise('/');
    })
;
