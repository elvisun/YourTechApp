(function () {
  'use strict';

  angular
    .module('jobs')
    .controller('JobsListController', JobsListController);

  JobsListController.$inject = ['JobsService'];

  function JobsListController(JobsService) {
    var vm = this;
    vm.jobs = [];
    vm.jobs = JobsService.query();
    vm.sortType = 'completed';
    vm.sortReverse = false;
    vm.searchField = '';
  }
})();
