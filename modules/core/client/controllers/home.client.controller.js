'use strict';

angular
	.module('core')
	.controller('HomeController', ['$scope', 'Authentication','CustomersService','JobsService',
  function ($scope, Authentication,CustomersService,JobsService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.jobs = JobsService.query();
    $scope.customers =CustomersService.query();
  }
]);
