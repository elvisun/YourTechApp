//Jobs service used to communicate Jobs REST endpoints
(function () {
  'use strict';

  angular
    .module('jobs')
    .factory('JobsService', JobsService);

  JobsService.$inject = ['$resource'];

  function JobsService($resource) {
    return $resource('api/jobs/:jobId', {
      jobId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
