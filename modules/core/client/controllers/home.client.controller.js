'use strict';

angular
	.module('core')
	.controller('HomeController', ['$scope', 'Authentication','CustomersService',
  function ($scope, Authentication,CustomersService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.jobs = 1;
    $scope.customers =CustomersService.query();
  }
]);
