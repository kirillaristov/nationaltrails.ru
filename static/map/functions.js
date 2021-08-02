function buttonClick (item) {
	//Загрузить и отобразить KML
	if (base[item].loaded == false) {
		loadKML (item, 'button');
		body.className = body.className.replace('loaded', '');
		updateUrl ('kml', 'add', item);
	}
	//Отобразить KML если уже загружено
	else if (base[item].loaded == 'hidden') {
		base[item].collection.options.set('visible', true);
		base[item].loaded = true;
		updateUrl ('kml', 'add', item);
	}
	//Скрыть KML
	else {		
		base[item].loaded = 'hidden';
		base[item].collection.options.set('visible', false);
		updateUrl ('kml', 'remove', item);
	}
}

//Загрузка KML
function loadKML (file, from) {
	parseKML(file).forEach( function (element) {
		var revision = fileTime(base[element].url);
		ymaps.geoXml.load('http://kirillaristov.com/kml-files/' + base[element].url + '?rev' + revision).then( function (res) {
			base[element].collection = new ymaps.GeoObjectCollection();
			base[element].collection.add(res.geoObjects);
			myMap.geoObjects.add(base[element].collection);
			if (from == 'button') {
				myMap.setBounds(base[element].collection.getBounds());
			}			
			
			//исправление ошибки перестановки ширина-высота в api
			ymaps.geoQuery(myMap.geoObjects).setOptions({iconImageSize: [32, 37]});
			base[element].loaded = true;
			body.className = 'loaded';
		});
	});
}

function openPlacemark (placemark) {
	myPlacemark = new ymaps.Placemark(placemark.split(','), {
		balloonContent: placemark,
		balloonContentHeader: placemark,
		balloonContentBody: placemark,
		iconContent: placemark,
	}, {
		preset: "islands#violetStretchyIcon",
		balloonCloseButton: true
	});			
	myMap.geoObjects.add(myPlacemark);
}


function parseKML (KML) {
	return KML.split(/\+/g);
}

function fileTime (file) {
	return 533745935;
}

function updateUrl (item, action, value) {	
	var url = window.location.hash;
	var oldItem = getParam(item);
	switch (action) {
		case 'add':
			if (oldItem != false) {
				var newVal = oldItem + '+' + value;
				var newUrl = url.replace(item + '=' + oldItem, item + '=' + newVal);
			}
			else {
				var newUrl = url + '&' + item + '=' + value;
			}
			break;
		case 'remove':
			var newVal = oldItem.split('+').filter(item => item !== value);
			var newUrl = newVal.join('+');			
			newUrl = url.replace('&' + item + '=' + oldItem, newUrl.length > 1 ? '&' + item + '=' + newUrl : '');
			break;
	}
	history.pushState(null, null, newUrl);
	
	titleUpdate();
}

function titleUpdateOLD (action, value) {
	var title = document.title;
	var titleKML = title.match(/\[[^\]]*\]/).toString().replace(/[\[|\]]/g, '').split('+');

	if (action == 'add') {
		titleKML.push(value);
	}
	if (action == 'remove') {
		titleKML.splice(titleKML.indexOf(value), 1);
	}

	document.title = title.replace(/\[[^\]]*\]/, '[' + titleKML.join('+') + ']');
}

function titleUpdate () {
	document.title = document.title.replace(/\[[^\]]*\]/, '[' + (getParam('kml') == false ? '' : getParam('kml')) + ']');
}


//Получение одного параметра
function getParam (name, location) {
	location = location || window.location.hash;
  var res = location.match(new RegExp('[#&]' + name + '=([^&]*)', 'i'));
  return (res && res[1] ? res[1] : false);
}

//Передача параметров в hash при изменении размеров, зума, типа карты
function setLocationHashOLD () {
	var mapType;
	switch (myMap.getType().split('#')[1]) {
		case 'map': mapType = 'roadmap'; break;
		case 'satellite': mapType = 'satellite'; break;
		case 'hybrid': mapType = 'hybrid'; break;
		default: mapType = 'roadmap'; break;
	}	
	var url = 
		'?type=' + mapType +
		'&center=' + myMap.getCenter()[0].toFixed(5) + ',' + myMap.getCenter()[1].toFixed(5) +
		'&zoom=' + myMap.getZoom() +
		(getParam('kml') != false ? '&kml=' + getParam('kml') : '') +
		(getParam('placemark') != false ? '&placemark=' + getParam('placemark') : '');

	history.pushState(null, null, url);
}


function setLocationHash () {
    var params = [
        'type=' + myMap.getType().split('#')[1],
        'center=' + myMap.getCenter()[0].toFixed(5) + ',' + myMap.getCenter()[1].toFixed(5),        
        'zoom=' + myMap.getZoom(),
        (getParam('kml') != false ? 'kml=' + getParam('kml') : ''),
        (getParam('placemark') != false ? 'placemark=' + getParam('placemark') : '')
    ];
    
    window.location.hash = params.join('&');
}



//Установка состояния карты из hash
function setMapStateByHash (from = 'button') {//from = 'backspace', from = 'initial'
	var hashType = getParam('type'),
		hashCenter = getParam('center'),
		hashZoom = parseInt(getParam('zoom')),
		hashKML = getParam('kml'),
		hashPlacemark = getParam('placemark');
	
	switch (hashType) {
		case 'map' : myMap.setType('yandex#map'); break;
		case 'satellite' : myMap.setType('yandex#satellite'); break;
		case 'hybrid' : myMap.setType('yandex#hybrid'); break;
	}
	
	if (hashCenter) myMap.setCenter(hashCenter.split(','));
	
	if (hashZoom) myMap.setZoom(hashZoom);
	
	if (hashPlacemark) openPlacemark(hashPlacemark);

	var string = Object.keys(base);
	if (hashKML) {
		//элементы добавившиеся
		hashKML.split('+').forEach( function (element) {
			string.splice(string.indexOf(element), 1);
			base[element].button.state.set('selected', true);
			base[element].loaded = true;
			base[element].collection.options.set('visible', true);
		});
		//элементы, оставшиеся вне списка
		string.forEach( function (element) {
			base[element].button.state.set('selected', false);
			if (base[element].collection != '') {
				base[element].collection.options.set('visible', false);
				base[element].loaded = 'hidden';
			}
		});
		titleUpdate();
	}
}