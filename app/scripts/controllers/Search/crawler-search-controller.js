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
    .controller('crawlerSearchController', function($log, $q, serviceUtils,
      iberlibrosService, abebooksService, uniliberService) {
      var vm = this;

      $log.debug('Started crawlerSearchController');

      vm.model = {
        search: {
          abebooks: true,
          iberlibros: true,
          uniliber: true
        }
      };

      vm.functions = {
        enableSearch: function() {
          return !_.isNil(vm.model.search.abebooks) ||
            !_.isNil(vm.model.search.iberlibros) || !_.isNil(vm.model.search.uniliber);
        },

        search: function() {

          vm.model.results = undefined;

          $log.debug('Search object', vm.model.search);

          var query = {
            an: vm.model.search.autor,
            bi: '0',
            bx: 'off',
            ds: '50',
            isbn: vm.model.search.isbn,
            tn: vm.model.search.titulo
          };

          var queryUniliber = {
            author: vm.model.search.autor,
            order: 'price desc',
            rows: '50',
            isbn: vm.model.search.isbn,
            title: vm.model.search.titulo
          };

          var promisesObject = {};
          if (vm.model.search.abebooks) {
            promisesObject.abebooks = abebooksService.callURLAndParseHTML(query);
          }

          if (vm.model.search.iberlibros) {
            promisesObject.iberlibros = iberlibrosService.callURLAndParseHTML(query);
          }

          if (vm.model.search.uniliber) {
            promisesObject.uniliber = uniliberService.callURLAndParseHTML(queryUniliber);
          }

          $q.all(promisesObject)
            .then(function(results) {
              var tempArray = [];
              if (results.abebooks) {
                Array.prototype.push.apply(tempArray, results.abebooks);
              }

              if (results.iberlibros) {
                Array.prototype.push.apply(tempArray, results.iberlibros);
              }

              if (results.uniliber) {
                Array.prototype.push.apply(tempArray, results.uniliber);
              }

              if (!_.isNil(tempArray)) {
                vm.model.results = serviceUtils.naturalOrderByProperty(tempArray, 'price', -1);
                vm.model.results.total = tempArray.length;
              }

            })
            .catch(function(error) {
              $log.error('Error calling store sites', error);
            });
        }
      }

    });
}());
