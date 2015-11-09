import angular     from 'angular';
import uiRouter    from 'ui-router';

import SmartphoneCountChartController from './smartphone_count_chart/smartphone_count_chart.js'

export function baseRoutes ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'views/smartphone_count_chart/smartphone_count_chart.html',
      controller: SmartphoneCountChartController,
      controllerAs: 'smartphoneCount'
    })
}

baseRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];