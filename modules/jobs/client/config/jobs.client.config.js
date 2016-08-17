(function () {
  'use strict';

  angular
    .module('jobs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    //Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Jobs',
      state: 'jobs',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'jobs',{
      title: 'View Jobs',
      state: 'jobs.list',
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'jobs', {
      title: 'Create Job',
      state: 'jobs.create',
      roles: ['user']
    });
  }
})();