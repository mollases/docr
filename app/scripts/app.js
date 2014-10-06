'use strict';

/**
 * @ngdoc overview
 * @name docrjs
 * @description
 * # docrjs
 *
 * Main module of the application.
 */
angular
  .module('docrjs', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/docr');
    $stateProvider
      .state('doc', {
        url: '/docr',
        templateUrl: 'views/docr.html',
        controller: 'ReadingController'
      });
  });
