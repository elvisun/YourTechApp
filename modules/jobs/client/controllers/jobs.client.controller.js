(function () {
  'use strict';

  // Jobs controller
  angular
    .module('jobs')
    .controller('JobsController', JobsController);

  JobsController.$inject = ['$scope', '$state', 'Authentication', 'jobResolve'];

  function JobsController ($scope, $state, Authentication, job) {
    var vm = this;

    vm.authentication = Authentication;
    vm.job = job;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
        //console.log('asdfasdf');
        vm.job.$update(successCallback, errorCallback);
      } else {
        //console.log('asdfasdf');
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



    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    $scope.open = function($event) {
      $scope.status.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = 'dd-MMMM-yyyy';

    $scope.status = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

    $scope.getDayClass = function(date, mode) {
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0,0,0,0);

        for (var i=0;i<$scope.events.length;i++){
          var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }
      return '';
    };
  }
})();
