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
    .factory('uniliberService', ['$log', '$q', 'corsURL', 'serviceUtils', '$httpParamSerializer', 'urlInvocator',
      function($log, $q, corsURL, serviceUtils, $httpParamSerializer, urlInvocator) {
        $log.debug('uniliberService loading');

        var factory = {};

        var uniliberURL = 'https://www.uniliber.com';
        var uniliberSearchURL = uniliberURL + '/buscar/?';
        var storeLogo = 'https://www.uniliber.com/static/img/logo-uniliber.jpg';

        factory.callURLAndParseHTML = function(data) {
          var queryURL = $httpParamSerializer(data);
          var defered = $q.defer();

          urlInvocator.callURL(corsURL.url + uniliberSearchURL + queryURL, 'GET', {}).then(function(response) {

            var htmlPageObject = angular.element(response.data);
            var result = convertHTMLToJSONObject(htmlPageObject);

            //result = serviceUtils.naturalOrderByProperty(result, 'price', -1);

            defered.resolve(result);

          });

          return defered.promise;
        }

        function convertHTMLToJSONObject(htmlPageObject) {
          var books = [];
          var results = htmlPageObject.find('.product-record');
          [].forEach.call(results, function(data) {
            var ctl = angular.element(data);

            var img = ctl.find('.book-cover a img').attr('src');

            var details = ctl.find('.book-info');
            var titulo = details.find('h2.book-title a').text();
            var url = details.find('h2.book-title a').attr('href');
            var author = details.find('p.book-author').text();

            var otherInfos = details.find('ul');
            var isbn;
            var estado;
            var editorial = '';
            [].forEach.call(otherInfos, function(info) {
              var temp = angular.element(info);

              var tempEstado = temp.find('p').text();
              if (_.includes(tempEstado, 'Estado:')) {
                estado = tempEstado;
              }

              var lis = temp.find('li');
              [].forEach.call(lis, function(infoLis) {
                var tempLis = angular.element(infoLis).text();
                if (_.includes(tempLis, 'ISBN')) {
                  isbn = tempLis;
                } else if (_.includes(tempLis, 'Estado:')) {
                  estado = tempLis;
                } else if (!_.isNil(tempLis) && _.trim(tempLis).length !== 0 &&
                  !_.includes(tempLis, 'TEMAS:') && !_.includes(tempLis, 'Referencia Libre')) {
                  editorial = editorial + '<br/>' + tempLis;
                }
              });
            });

            var libraria = details.find('div.pull-right span.bookstore-name a').text() + ' ' +
              details.find('div.pull-right span.bookstore-town').text() + '';

            var tempPrice = details.find('div.pull-left span.book-price').text();
            var currency = details.find('div.pull-left span.book-price span').text();
            tempPrice = _.replace(tempPrice, currency);

            var price = 'EUR ' + parseFloat(tempPrice).toFixed(2);

            var inUSD = _.includes(price, 'US$');
            if (inUSD) {
              var originalPrice = price;
              var priceTemp = _.trim(_.replace(price, 'US$', ''));
              var priceFloat = parseFloat(priceTemp).toFixed(2);
              var eurPrice = serviceUtils.convertUSD2EUR(priceFloat);
              if (!_.isNil(eurPrice)) {
                price = 'EUR ' + _.replace(eurPrice, '.', ',');
              }
            }

            var description = details.find('p.book-description').text();

            var bookDetail = {
              img: uniliberURL + img,
              title: titulo,
              author: author,
              editorial: editorial,
              isbn: isbn,
              estado: estado,
              libraria: libraria,
              price: price,
              inUSD: inUSD,
              originalPrice: originalPrice,
              description: description,
              url: uniliberURL + url,
              storeLogo: storeLogo
            };

            //$log.debug('book', bookDetail);

            books.push(bookDetail);
          });

          return books;
        }

        return factory;

      }
    ])
}());
