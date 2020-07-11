(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name librosCrawlerApp.controller:CrawlercontrollerCtrl
   * @description
   * # CrawlercontrollerCtrl
   * Controller of the librosCrawlerApp
   */
  angular.module('librosCrawlerApp')
    .config(function($stateProvider) {

      $stateProvider.state({
        name: 'search',
        url: '/search',
        templateUrl: 'scripts/controllers/Search/crawler-search-tpl.html',
        controller: 'crawlerSearchController',
        controllerAs: 'crawlerSearchCtrl'
      });

    })
}());
