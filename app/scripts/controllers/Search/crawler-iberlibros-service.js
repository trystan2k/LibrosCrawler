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
    .factory('iberlibrosService', ['$log', '$q', 'corsURL', 'serviceUtils', '$httpParamSerializer', 'urlInvocator',
      function($log, $q, corsURL, serviceUtils, $httpParamSerializer, urlInvocator) {
        $log.debug('iberlibrosService loading');

        var factory = {};

        var iberlibrosURL = 'https://www.iberlibro.com';
        var iberlibrosSearchURL = iberlibrosURL + '/servlet/SearchResults?';
        var storeLogo = 'https://static.abebookscdn.com/cdn/es/images/header/abebooks-logo-sp.gif';

        factory.callURLAndParseHTML = function(data) {
          var queryURL = $httpParamSerializer(data);
          var defered = $q.defer();

          urlInvocator.callURL(corsURL.url + iberlibrosSearchURL + queryURL, 'GET', {}).then(function(response) {

            var htmlPageObject = angular.element(response.data);
            var result = convertHTMLToJSONObject(htmlPageObject);

            //result = serviceUtils.naturalOrderByProperty(result, 'price', -1);

            defered.resolve(result);

          });

          return defered.promise;
        }

        function convertHTMLToJSONObject(htmlPageObject) {
          var books = [];
          var results = htmlPageObject.find('.cf.result');
          [].forEach.call(results, function(data) {
            var ctl = angular.element(data);

            var img = ctl.find('.result-image a img').attr('src');
            if (_.startsWith(img, '//')) {
              img = _.replace(img, '//', 'http://');
            }

            var details = ctl.find('.result-data .result-detail');
            var titulo = details.find('h2 a span').text();
            var url = details.find('h2 a').attr('href');
            var author = details.find('p.author').text();
            var editorial = details.find('div.m-md-b p#publisher span').text();
            var isbn = details.find('div p.isbn span').text();
            var estado = details.find('p.collectable-attr strong:first-child').text();
            var quantity = details.find('p#quantity').text();
            var libraria = details.find('div.bookseller-info p:first-child a').text() + ' ' +
              details.find('div.bookseller-info p:first-child span').text();

            var pricing = ctl.find('.result-data .result-pricing');
            var price = pricing.find('div.item-price span.price').text();
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

            var description = ctl.find('p.clear-all.p-md-t').text();

            var bookDetail = {
              img: img,
              title: titulo,
              author: author,
              editorial: editorial,
              isbn: isbn,
              estado: estado,
              quantity: quantity,
              libraria: libraria,
              price: price,
              inUSD: inUSD,
              originalPrice: originalPrice,
              description: description,
              url: iberlibrosURL + url,
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
