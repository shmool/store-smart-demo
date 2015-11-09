import moment from 'moment';
import mockData from 'mocks/smartphone_data.json'

export default class SmartphoneCountService {

  constructor ($http, storage) {

    this.data = {};

    this.chartData = {
      labels: [],
      series: ['Outside', 'Inside'],
      data: [],
      errorMessage: null
    };

    this.getSavedDates = () => {
      return {
        fromDate: storage.getItem('smartphoneChart_fromDate') ? new Date(storage.getItem('smartphoneChart_fromDate')) : new Date(),
        toDate: storage.getItem('smartphoneChart_toDate') ? new Date(storage.getItem('smartphoneChart_toDate')) : new Date()
      }
    };

    this.saveDate = (date, type) => {
      storage.setItem('smartphoneChart_' + type, date);
    };

    this.getData = () => {
      return $http({
        method: 'GET',
        url: 'http://files.storesmarts.com/test/sample_data.json'
      }).catch(function () {
        return mockData;
      });
    };

    this.getSmartphoneCountData = () => {
      return this.getData()
      .then( (response) => {
        response.forEach( (item) => {
          if (!isItemValid(item)) {
            return;
          }
          if (!this.data[item.date]) { // init date array
            this.data[item.date] = newDayArray();
          }
          this.data[item.date][item.is_inside][item.hour].push(item.mac_address);
        });
        return this.data;
      })
    }

  }

  getDataByDates(fromDate, toDate) {

    this.saveDate(fromDate, 'fromDate');
    if (toDate) {
      this.saveDate(toDate, 'toDate');
    }

    const fromDateParsed = parseDate(fromDate);
    const toDateParsed = parseDate(toDate);

    this.chartData.errorMessage = null;

    if (!toDate || fromDateParsed === toDateParsed) { // one day
      let dataInDate = this.data[fromDateParsed];

      if (!dataInDate) {
        this.chartData.errorMessage = 'no data for the given date';
        return;
      }

      this.chartData.labels = hours;
      this.chartData.data = getDataArray(24, (isInside, index) =>
          dataInDate[isInside][index] ? _.uniq(dataInDate[isInside][index]).length : 0);

    } else { // range of dates
      var numOfDays = moment(toDate).diff(moment(fromDate), 'days') + 1;

      this.chartData.labels = Array.from({length: numOfDays}, (value, key) =>
        moment(fromDate).add(key, 'd').format('l'));

      this.chartData.data = getDataArray(numOfDays, (isInside, index) => {
        let dataInDate = this.data[parseDate(moment(fromDate).add(index, 'd'))];
        return dataInDate ? _.uniq(_.flatten(dataInDate[isInside])).length : null;
      });
    }
  };
}

function parseDate (date) {
  return date ? date.toISOString().split('T')[0] : null;
}

function isItemValid (item) {
  return item.date &&
    item.hour &&
    item.mac_address &&
    item.is_inside != null;
}

const hours = Array.from({ length: 24 }, (value, index) => index + ':00');

function newDayArray () {
  return getDataArray(24, () => []);
}

function getDataArray (length, getDataFunction) {
  return Array.from([0, 1], isInside => {
    return Array.from({length: length}, (value, index) => getDataFunction(isInside, index));
  });
}

SmartphoneCountService.$inject = ['$http', 'storage'];
