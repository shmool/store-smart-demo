export default class SmartphoneCountChartController {
  
  constructor(SmartphoneCountService) {

    this.dates = SmartphoneCountService.getSavedDates();

    this.today = new Date();

    this.chart = SmartphoneCountService.chartData;

    SmartphoneCountService.getSmartphoneCountData()
      .then(() => {
        this.changeDate();
      });


    this.changeDate = (isFromDate) => {
      if (this.dates.fromDate > this.today || this.dates.toDate > this.today) {
        this.chart.errorMessage = 'No data has come from the future yet';
        return;
      }
      if (this.dates.fromDate > this.dates.toDate) {
        if (isFromDate) {
          this.dates.toDate = this.dates.fromDate;
        } else {
          this.chart.errorMessage = 'date range is not correct';
          return;
        }
      }
      if (!this.dates.fromDate) {
        this.chart.errorMessage = 'no starting date';
        return;
      }

      SmartphoneCountService.getDataByDates(this.dates.fromDate, this.dates.toDate);
    };


  };


}

SmartphoneCountChartController.$inject = ['SmartphoneCountService'];