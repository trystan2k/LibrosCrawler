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
    .factory('abebooksService', ['$log', '$q', 'corsURL', 'serviceUtils', '$httpParamSerializer', 'urlInvocator',
      function($log, $q, corsURL, serviceUtils, $httpParamSerializer, urlInvocator) {
        $log.debug('abebooksService loading');

        var factory = {};

        var abebooksURL = 'https://www.abebooks.co.uk';
        var abebooksSearchURL = abebooksURL + '/servlet/SearchResults?';
        var storeLogo = 'https://static.abebookscdn.com/cdn/uk/images/header/abebooks-logo-uk.gif';

        factory.callURLAndParseHTML = function(data) {
          var queryURL = $httpParamSerializer(data);
          var defered = $q.defer();

          urlInvocator.callURL(corsURL.url + abebooksSearchURL + queryURL, 'GET', {}).then(function(response) {

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

            var inGBP = _.includes(price, '£');
            if (inGBP) {
              var originalPrice = price;
              var priceTemp = _.trim(_.replace(price, '£', ''));
              var priceFloat = parseFloat(priceTemp).toFixed(2);
              var eurPrice = serviceUtils.convertGBP2EUR(priceFloat);
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
              foreignPrice: inGBP,
              originalPrice: originalPrice,
              description: description,
              url: abebooksURL + url,
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
