(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name  service-utils
   * @description Angular module to allow invocation of URLs.
   */

  /**
   * service-utils module.
   */
  angular.module('service-utils')

    .factory('serviceUtils', ["$log", "$q", function($log, $q) {

      $log.debug('serviceUtils loading');

      var factory = {};

      var mainProperty = {};
      var mainOrder = {};

      var usd2eurRatio;
      var gbp2eurRatio;

      factory.naturalOrderByProperty = function(array, property, order) {
        mainProperty = property;
        mainOrder = order;
        return array.sort(naturalCompare);
      }

      factory.setUSD2EURRatio = function(newRatio) {
        if (!_.isNil(newRatio)) {
          this.usd2eurRatio = newRatio;
        }
      }

      factory.convertUSD2EUR = function(value) {
        if (!_.isNil(this.usd2eurRatio)) {
          return parseFloat(value * this.usd2eurRatio).toFixed(2);
        }

        return null;
      }

      factory.setGBP2EURRatio = function(newRatio) {
        if (!_.isNil(newRatio)) {
          this.gbp2eurRatio = newRatio;
        }
      }

      factory.convertGBP2EUR = function(value) {
        if (!_.isNil(this.gbp2eurRatio)) {
          return parseFloat(value * this.gbp2eurRatio).toFixed(2);
        }

        return null;
      }

      function naturalCompare(x, y) {

        var a, b;

        if (mainOrder && mainOrder > 0) {
          a = x[mainProperty];
          b = y[mainProperty];
        } else {
          b = x[mainProperty];
          a = y[mainProperty];
        }

        var ax = [],
          bx = [];

        a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
          ax.push([$1 || Infinity, $2 || ""])
        });
        b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
          bx.push([$1 || Infinity, $2 || ""])
        });

        while (ax.length && bx.length) {
          var an = ax.shift();
          var bn = bx.shift();
          var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
          if (nn) return nn;
        }

        return ax.length - bx.length;
      }

      return factory;
    }]);
}());
