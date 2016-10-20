

'use strict';

$(document).ready(function() {

  //########   #######  ##      ## ##    ## ##        #######     ###    ########
  //##     ## ##     ## ##  ##  ## ###   ## ##       ##     ##   ## ##   ##     ##
  //##     ## ##     ## ##  ##  ## ####  ## ##       ##     ##  ##   ##  ##     ##
  //##     ## ##     ## ##  ##  ## ## ## ## ##       ##     ## ##     ## ##     ##
  //##     ## ##     ## ##  ##  ## ##  #### ##       ##     ## ######### ##     ##
  //##     ## ##     ## ##  ##  ## ##   ### ##       ##     ## ##     ## ##     ##
  //########   #######   ###  ###  ##    ## ########  #######  ##     ## ########

  function CSVDownloader() {
    this.mapURL =  'data/2.csv';
  }

  CSVDownloader.prototype.init = function() {
    this.downloadFile(this.mapURL);
  }

  CSVDownloader.prototype.downloadFile = function(url) {
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'text',
      success: function(data) {
        this.sendDataToConvert(data);
      }.bind(this),
      error: function(textStatus) {
        console.log(textStatus);
      }
    });
  }

  CSVDownloader.prototype.sendDataToConvert = function(data) {
    var csvConverter = new CSVConverter();
    csvConverter.getRawMapData(data)
  }

  // ######   #######  ##    ## ##     ## ######## ########  ########
  //##    ## ##     ## ###   ## ##     ## ##       ##     ##    ##
  //##       ##     ## ####  ## ##     ## ##       ##     ##    ##
  //##       ##     ## ## ## ## ##     ## ######   ########     ##
  //##       ##     ## ##  ####  ##   ##  ##       ##   ##      ##
  //##    ## ##     ## ##   ###   ## ##   ##       ##    ##     ##
  // ######   #######  ##    ##    ###    ######## ##     ##    ##

  function CSVConverter() {
  }

  CSVConverter.prototype.getRawMapData = function(data) {
    this.rawMapData = data;
    this.convertRawMapDataToArray(this.rawMapData);
  }

  CSVConverter.prototype.convertRawMapDataToArray = function(data) {
    //наш черновой разделитель массива
    //украл знак из интернетов
    var divider = /\r\n|\n/;
    var temporaryArray = [];
    var finalArray = [];

    temporaryArray = data.split(divider);

    //сплитим все массивы на подмассивы по какому-то особо длинному пробелу, что портит всю малину, и удаляем дублирующее число перед названием улицы
    //после этого джойним обратно массивы в строки
    temporaryArray.forEach(function(addressCell) {
      var temporaryAddressCell = addressCell.split('	');
      //удалили первый элемент
      //можно попробовать через слайс, вдруг побыстрее? на таком размере не увидишь
      temporaryAddressCell.shift();
      temporaryAddressCell = temporaryAddressCell.join('');
      //записали в финальный массив адресов
      finalArray.push(temporaryAddressCell);
    })

    //чтобы не нагружать яндекс карты чрезмерным количеством запросов, я финальный масссив чутка укорачиваю
    var newFinalArray = finalArray.slice(10, 20);

    //для примера в консольке старый и новый массивы
    console.log(finalArray);
    console.log(newFinalArray);

    //передаем дальше
    this.sendConvertedMapDataToMap(newFinalArray)
  }

  CSVConverter.prototype.sendConvertedMapDataToMap = function(data) {
    var destroyedBuildingsMap = new DestroyedBuildings();
    destroyedBuildingsMap.getConvertedMapData(data);
  }

  //########  ######## ##    ## ########  ######## ########
  //##     ## ##       ###   ## ##     ## ##       ##     ##
  //##     ## ##       ####  ## ##     ## ##       ##     ##
  //########  ######   ## ## ## ##     ## ######   ########
  //##   ##   ##       ##  #### ##     ## ##       ##   ##
  //##    ##  ##       ##   ### ##     ## ##       ##    ##
  //##     ## ######## ##    ## ########  ######## ##     ##

  function DestroyedBuildings() {
    this.mapContainerID = 'map';
  }

  DestroyedBuildings.prototype.getConvertedMapData = function(data) {
    //блин, я бы сделал промисами, но с бабелем не хочется возиться
    //потому просто организую цепочку выполнения функций внутри каждой следующей =/
    this.receivedData = data;
    this.createMap();
  }

  DestroyedBuildings.prototype.createMap = function() {
    ymaps.ready(this.mapStartInit.bind(this));
  }

  DestroyedBuildings.prototype.mapStartInit = function() {
    this.mainMap = new ymaps.Map(this.mapContainerID, {
      // При инициализации карты обязательно нужно указать
      // её центр и коэффициент масштабирования.
      center:[55.76, 37.64], // Москва
      zoom:10
    });

    this.toFullViewport();
    this.updateMapInfo();
  }

  DestroyedBuildings.prototype.toFullViewport = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var mapNode = document.getElementById(this.mapContainerID);

    mapNode.style.width = w + 'px';
    mapNode.style.height = h + 'px';
    this.mainMap.container.fitToViewport();
  }

  DestroyedBuildings.prototype.updateMapInfo = function() {
    this.receivedData.forEach(function(buildingAddress) {
      var tempAddress = ymaps.geoQuery(ymaps.geocode(buildingAddress));
      this.mainMap.geoObjects.add(tempAddress.clusterize());
    }.bind(this))
  }

  //#### ##    ## #### ########
  // ##  ###   ##  ##     ##
  // ##  ####  ##  ##     ##
  // ##  ## ## ##  ##     ##
  // ##  ##  ####  ##     ##
  // ##  ##   ###  ##     ##
  //#### ##    ## ####    ##



  var YEAH = new CSVDownloader();

  YEAH.init();

});









































