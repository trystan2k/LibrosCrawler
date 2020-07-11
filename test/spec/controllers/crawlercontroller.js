'use strict';

describe('Controller: CrawlercontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('librosCrawlerApp'));

  var CrawlercontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CrawlercontrollerCtrl = $controller('CrawlercontrollerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CrawlercontrollerCtrl.awesomeThings.length).toBe(3);
  });
});
