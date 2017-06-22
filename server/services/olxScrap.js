var logger = require('../config/log.js');
var moment = require("moment");

exports.GetDataOlx = function(scrapedPage, element, callback){
	try{
		var tempUrl = scrapedPage(element).find('td[class="wwnormal tright td-price"]').parent().children().children().attr('href');
		var url;
		if(tempUrl){
			var arr = tempUrl.split('#');
			url = arr[0].trim();
		}
		//console.log('tempUrl=' + url);
		var tempId = scrapedPage(element).find('td[class="wwnormal tright td-price"]').parent().parent().parent().attr('data-id');

		var data = {
				id: tempId,
				url: url
			}

		callback(null, data);
		//callback(null, tempUrl);
	}
	catch(err){
		callback(err);
	}
};


exports.GetDataSubPageOlx = function(page, callback) {
	var id, title, url, price, description, date, district, city, agency, propertyType, size, parking, userName, phoneNumber;
    var numberOfRooms, numberOfBathrooms = 0;
    var idPhotos = [];
	var data = [];

	if(!page){
		logger.error('GetDataSubPage, page = ' + page);
		callback("GetDataSubPage, page = " + page);
	}

	try{
		title = page('div[class="offercontentinner"] > div > h1').text().trim();

		price = page('div[id="offeractions"] > div > div > strong').text();
		if (price) {
			price = price.replace(/[^0-9]/g, '');
		}

		url = page('link[rel="canonical"]').attr('href');
		
		//console.log('[GetDataSubPageOlx] url=' + url);
		if(url){
			url = url.trim();
		}
		else{
			logger.error('brak url, title=' + title + ', price=' + price);
			url = page('form[id="contact-form"]').attr('action');
			if(url){
				logger.info('teraz znalaz³em url = ' + url);
				url = url.trim();
			}
			else{
				logger.error('2 brak url, title=' + title + ', price=' + price);
				
				callback(null, false);
			}
		}
		

		var tempCity = page('div[class="offercontentinner"] > div > p > span > span > strong').text();
		var arrayCity = tempCity.split(',');
		if(arrayCity[0]){
			city = arrayCity[0].trim();
		}
		else{
			logger.error('brak city = ' + city + ', url=' + url);
		}
		//var state = arrayCity[1].trim();
		if(arrayCity[2]){
			if(arrayCity[2].trim()==="Praga-Pó³noc"){
				district = "Praga Pó³noc";
			}
			else if(arrayCity[2].trim()==="Praga-Po³udnie"){
				district = "Praga Po³udnie";
			}
			else{
				district = arrayCity[2].trim();
			}
		}
		else{
			logger.error('brak district = ' + district + ', ustawiam none, url=' + url);
			district = 'none';
		}

		id = page('div[class="offercontentinner"] > div > p > small > span > span > span').text();
		
		date = page('div[class="offercontentinner"] > div > p > small > span').text();

		
		page('td[class="value"]').prev().map(function(i, el) {
        		// el === page(this)
			  var t = page(this).text();
			  
			  if(t === "Oferta od"){
			  	var odp = page(this).next().children().children().text().trim();
			  	if(odp){
			  		if(odp === "Osoby prywatnej"){
			  			agency = false;
			  		}
			  		else{
			  			agency = true;
			  		}
			  	}
			  	//console.log(t + '=' + agency);
			  }
			  else if(t === "Cena za m2"){
			  	var odp = page(this).next().children().text().trim();
			  	if(odp){
					var arrOdp = odp.split(' ');
		  			var arrOdp2 = arrOdp[0].split('.');
		  			priceM2 = arrOdp2[0];
			  	}
			  	//console.log(t + '=' + priceM2);
			  }
			  else if(t === "Liczba pokoi"){
			  	var odp = page(this).next().children().children().text().trim();
			  	if(odp){
			  		numberOfRooms = odp.replace(/[^0-9]/g, '');
			  	}
			  	//console.log(t + '=' + numberOfRooms);
			  }
			  else if(t === "Powierzchnia"){
			  	var odp = page(this).next().children().text().trim();
			  	if(odp){
			  		var arrOdp = odp.split(' ');
		  			var arrOdp2 = arrOdp[0].split(',');
		  			size = arrOdp2[0];
			  	}
			  	//console.log(t + '=' + size);
			  }
			  else if(t === "Rodzaj zabudowy"){
			  	var odp = page(this).next().children().children().text().trim();
			  	if(odp){
			  		if(odp === "Blok"){
			  			propertyType = "Mieszkanie";
			  		}
			  		else{
			  			propertyType = odp;
			  		}
			  		//console.log(t+ '='+ propertyType);
			  	}
			  }
			  else{
			  	//console.log(t);
			  }
			});
		data = {
			id: id,
			title: title,
			url: url,
			price: price,
			priceM2: priceM2,
			//description: description,
			dateAdd: moment().format("YYYY/MM/DD"),
			district: district,
			city: city,
			agency: agency,
			propertyType: propertyType,
			numberOfRooms: numberOfRooms,
			//numberOfBathrooms: numberOfBathrooms,
			size: size,
			//parking: parking,
			//userName: userName,
			//phoneNumber: phoneNumber,
			//photos: result
			page: 'olx'
		}
		//console.log(data);
		//return('koncz juz');
		//return false;
		callback(null, data);
	}
	catch(error){
		logger.error('[GetDataSubPageOlx] error = ' + error);
		callback(error);
		//return false;
	}
}