(function () {
  'use strict';

  angular
    .module('jobs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    // Menus.addMenuItem('topbar', {
    //   title: 'Jobs',
    //   state: 'jobs',
    //   type: 'dropdown',
    //   roles: ['*']
    // });

    // Add the dropdown list item
    Menus.addMenuItem('topbar', {
      title: 'View Jobs',
      state: 'jobs.list'
    });

    // Add the dropdown create item
    Menus.addMenuItem('topbar', {
      title: 'Create Job',
      state: 'jobs.create',
      roles: ['user']
    });
  }
})();
d