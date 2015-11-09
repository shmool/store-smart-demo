import angular     from 'angular';
import uiRouter    from 'ui-router';
import lodash      from 'lodash';
import appStyle    from 'app.scss';
import chart       from 'angular-chart.js';

import { Storage } from 'common/services/storage';
import SmartphoneCountService from 'common/services/smartphone_data.js'

import { baseRoutes } from 'views/routes.js'

export default angular.module('storeSmartDemo', [
  'ui.router',
  'chart.js'
])
  .run(($rootScope) => {
    $rootScope.$on("$stateChangeError", console.log.bind(console));
  })
  .config(baseRoutes)

  .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: ['#FF5252', '#8A80FF'],
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      datasetFill: false
    });
  }])

  .service('storage', ['$window', Storage])
  .service('SmartphoneCountService', SmartphoneCountService);


angular.bootstrap(document, ['storeSmartDemo']);
