(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name  service-invocator
   * @description Angular module to allow invocation of services.
   */

  /**
   * service-invocator module.
   * Bootstraps the application by integrating services that have any relation.
   */
  angular.module('url-invocator', [])
    .config(config).run(run);

  /**
   * Preliminary configuration.
   *
   * Configures the integration between modules that need to be integrated
   * at the config phase.
   */
  function config($provide, $httpProvider) {

    $provide.factory('myHttpInterceptor', ["$q", function($q) {
      return {
        'responseError': function(rejection) {
          return $q.reject(rejection);
        }
      }
    }]);

    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.interceptors.push('myHttpInterceptor');
  }

  config.$inject = ["$provide", "$httpProvider"];

  function run($log) {
    $log.debug('Using url-invocator.');
  }
  run.$inject = ["$log"];

}());
