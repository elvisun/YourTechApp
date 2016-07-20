'use strict';

describe('Jobs E2E Tests:', function () {
  describe('Test Jobs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/jobs');
      expect(element.all(by.repeater('job in jobs')).count()).toEqual(0);
    });
  });
});
