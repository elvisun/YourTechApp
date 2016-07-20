'use strict';

describe('Customers E2E Tests:', function () {
  describe('Test Customers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/customers');
      expect(element.all(by.repeater('customer in customers')).count()).toEqual(0);
    });
  });
});
