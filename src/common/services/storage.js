export class Storage {

  constructor($window) {
    this.storage = $window.localStorage;
  }

  getItem(key){
    return JSON.parse(this.storage.getItem(key));
  }

  setItem(key, item) {
    this.storage.setItem(key, JSON.stringify(item));
  }

}

