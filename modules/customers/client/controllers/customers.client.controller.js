(function () {
  'use strict';

  // Customers controller
  angular
    .module('customers')
    .controller('CustomersController', CustomersController);

  CustomersController.$inject = ['$scope', '$state', 'Authentication', 'customerResolve','$window','$http'];

  function CustomersController ($scope, $state, Authentication, customer, $window,$http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.customer = customer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.stripeCallback = function (code, result) {
      if (result.error) {
          console.log('it failed! error: ' + result.error.message);
      } else {
          console.log('success! token: ' + result.id);
          $http.post('/api/customers/subscribe/' + customer._id,{stripeToken:result.id})
            .then(function(response) {
                vm.customer = response.data;
              }, function(err){
                vm.error = err.data.message;
              });
      }
    };

    // Remove existing Customer
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.customer.$remove($state.go('customers.list'));
      }
    }

    // Save Customer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.customer._id) {
        vm.customer.$update(successCallback, errorCallback);
      } else {
        vm.customer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('customers.view', {
          customerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
