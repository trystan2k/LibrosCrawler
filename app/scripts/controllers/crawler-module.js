(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name librosCrawlerApp
   * @description
   * # librosCrawlerApp
   *
   * Main module of the application.
   */
  angular
    .module('librosCrawlerApp', [
      'ngAnimate',
      'ngAria',
      'ngCookies',
      'ngMessages',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'ui.router',
      'url-invocator',
      'service-utils',
      'ui.bootstrap',
      'blockUI'
    ])
    .constant('corsURL', {
      url: 'https://cors-anywhere.herokuapp.com/'
    })
    .config(function($urlRouterProvider, blockUIConfig) {
      $urlRouterProvider.otherwise('/search');
      blockUIConfig.autoBlock = false;
    })
    .run(function($log, $urlRouter, urlInvocator, corsURL, serviceUtils) {
      $log.debug('Started librosCrawlerApp');

      var currencyConverterURL = 'http://free.currencyconverterapi.com/api/v3/convert?q=GBP_EUR&compact=y';

      urlInvocator.callURL(corsURL.url + currencyConverterURL, 'GET', {}).then(function(response) {
        $log.debug('rate', response);
        var rate = response.data.GBP_EUR.val;
        serviceUtils.setGBP2EURRatio(rate);
      });
    });
}());
