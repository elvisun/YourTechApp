(function () {
  'use strict';

  describe('Jobs Route Tests', function () {
    // Initialize global variables
    var $scope,
      JobsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _JobsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      JobsService = _JobsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('jobs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/jobs');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          JobsController,
          mockJob;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('jobs.view');
          $templateCache.put('modules/jobs/client/views/view-job.client.view.html', '');

          // create mock Job
          mockJob = new JobsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Job Name'
          });

          //Initialize Controller
          JobsController = $controller('JobsController as vm', {
            $scope: $scope,
            jobResolve: mockJob
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:jobId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.jobResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            jobId: 1
          })).toEqual('/jobs/1');
        }));

        it('should attach an Job to the controller scope', function () {
          expect($scope.vm.job._id).toBe(mockJob._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/jobs/client/views/view-job.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          JobsController,
          mockJob;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('jobs.create');
          $templateCache.put('modules/jobs/client/views/form-job.client.view.html', '');

          // create mock Job
          mockJob = new JobsService();

          //Initialize Controller
          JobsController = $controller('JobsController as vm', {
            $scope: $scope,
            jobResolve: mockJob
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.jobResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/jobs/create');
        }));

        it('should attach an Job to the controller scope', function () {
          expect($scope.vm.job._id).toBe(mockJob._id);
          expect($scope.vm.job._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/jobs/client/views/form-job.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          JobsController,
          mockJob;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('jobs.edit');
          $templateCache.put('modules/jobs/client/views/form-job.client.view.html', '');

          // create mock Job
          mockJob = new JobsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Job Name'
          });

          //Initialize Controller
          JobsController = $controller('JobsController as vm', {
            $scope: $scope,
            jobResolve: mockJob
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:jobId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.jobResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            jobId: 1
          })).toEqual('/jobs/1/edit');
        }));

        it('should attach an Job to the controller scope', function () {
          expect($scope.vm.job._id).toBe(mockJob._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/jobs/client/views/form-job.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
