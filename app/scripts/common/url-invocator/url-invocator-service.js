(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name  url-invocator
   * @description Angular module to allow invocation of URLs.
   */

  /**
   * url-invocator module.
   */
  angular.module('url-invocator')

    .factory('urlInvocator', ['$log', '$http', '$q', 'blockUI', function($log, $http, $q, blockUI) {

      $log.debug('urlInvocationServices loading');

      var factory = {};

      factory.callURL = function(url, method, body) {
        if (!method) {
          method = 'GET';
        }

        $log.debug('Calling url:' + url);

        var deferredPetition = $q.defer();

        var defaultHeaders = {};

        if (body.headers) {
          angular.extend(defaultHeaders, body.headers);
          delete body.headers;
        }

        blockUI.start();

        $http({
            method: method,
            url: url,
            data: body,
            headers: defaultHeaders
          })
          .then(function successCallback(response) {
            deferredPetition.resolve(response);

            blockUI.stop();
          }, function errorCallback(error) {
            $log.error(error);
            deferredPetition.reject(error);
            blockUI.stop();
          });

        return deferredPetition.promise;
      }

      return factory;
    }]);
}());
