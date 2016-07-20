(function () {
  'use strict';

  describe('Customers Route Tests', function () {
    // Initialize global variables
    var $scope,
      CustomersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CustomersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CustomersService = _CustomersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('customers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/customers');
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
          CustomersController,
          mockCustomer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('customers.view');
          $templateCache.put('modules/customers/client/views/view-customer.client.view.html', '');

          // create mock Customer
          mockCustomer = new CustomersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Customer Name'
          });

          //Initialize Controller
          CustomersController = $controller('CustomersController as vm', {
            $scope: $scope,
            customerResolve: mockCustomer
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:customerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.customerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            customerId: 1
          })).toEqual('/customers/1');
        }));

        it('should attach an Customer to the controller scope', function () {
          expect($scope.vm.customer._id).toBe(mockCustomer._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/customers/client/views/view-customer.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CustomersController,
          mockCustomer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('customers.create');
          $templateCache.put('modules/customers/client/views/form-customer.client.view.html', '');

          // create mock Customer
          mockCustomer = new CustomersService();

          //Initialize Controller
          CustomersController = $controller('CustomersController as vm', {
            $scope: $scope,
            customerResolve: mockCustomer
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.customerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/customers/create');
        }));

        it('should attach an Customer to the controller scope', function () {
          expect($scope.vm.customer._id).toBe(mockCustomer._id);
          expect($scope.vm.customer._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/customers/client/views/form-customer.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CustomersController,
          mockCustomer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('customers.edit');
          $templateCache.put('modules/customers/client/views/form-customer.client.view.html', '');

          // create mock Customer
          mockCustomer = new CustomersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Customer Name'
          });

          //Initialize Controller
          CustomersController = $controller('CustomersController as vm', {
            $scope: $scope,
            customerResolve: mockCustomer
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:customerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.customerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            customerId: 1
          })).toEqual('/customers/1/edit');
        }));

        it('should attach an Customer to the controller scope', function () {
          expect($scope.vm.customer._id).toBe(mockCustomer._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/customers/client/views/form-customer.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
