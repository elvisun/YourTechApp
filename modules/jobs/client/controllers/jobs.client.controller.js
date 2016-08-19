(function () {
  'use strict';

  // Jobs controller
  angular
    .module('jobs')
    .controller('JobsController', JobsController);

  JobsController.$inject = ['$scope', '$state', 'Authentication', 'jobResolve','CustomersService','$http'];

  function JobsController ($scope, $state, Authentication, job, CustomersService, $http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.job = job;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.takeJob = takeJob;
    vm.completeJob = completeJob;
    vm.abandonJob = abandonJob;

    vm.customers = CustomersService.query();

    console.log(job);

    // Remove existing Job
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.job.$remove($state.go('jobs.list'));
      }
    } 

    // Save Job
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.jobForm');
        vm.error = 'Invalid inputs';
        return false;
      }
      // TODO: move create/update logic to service
      if (vm.job._id) {
        vm.job.$update(successCallback, errorCallback);
      } else {
        vm.job.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('jobs.view', {
          jobId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    $scope.open = function($event) {
      $scope.status.opened = true;
    };

    $scope.format = 'dd-MMMM-yyyy';

    $scope.status = {
      opened: false
    };

    function takeJob() {
      vm.job.taken = true;
      console.log(vm.job);
      $http.post('/api/jobs/takejob/' + vm.job._id, vm.job).then(
        function successCallback(res) {
        vm.job = res.data;
        vm.job.theOne = true;
      }, function errorCallback(res) {
        console.log('errorCallback');
      });
    }

    function completeJob() {
      vm.job.completed = true;
      console.log(vm.job);
      $http.post('/api/jobs/completejob/' + vm.job._id, vm.job).then(
        function successCallback(res) {
        vm.job = res.data;
      }, function errorCallback(res) {
        console.log('errorCallback');
      });
    }

    function abandonJob() {
      vm.job.taken = false;
      vm.job.technician = null;
      console.log(vm.job);
      $http.post('/api/jobs/abandonjob/' + vm.job._id, vm.job).then(
        function successCallback(res) {
        vm.job = res.data;
      }, function errorCallback(res) {
        console.log('errorCallback');
      });
    }
  }
})();
