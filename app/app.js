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
    .module('App', [
      'librosCrawlerApp'
    ])
    .run(function($log, $urlRouter, urlInvocator, corsURL, serviceUtils) {
      $log.debug('App Run');
    });
}());
