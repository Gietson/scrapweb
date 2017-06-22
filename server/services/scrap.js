var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
//var mongoose = require('mongoose').connect('mongodb://lolo267:lolo267@ds055925.mongolab.com:55925/standuptestowy');

var scrapCtrl = require('../api/ads/ads.controller.js');
var notificationCtrl = require('../api/notification/notification.controller.js');

var logger = require('../config/log.js');
var moment = require("moment");

var olxScrap = require('./olxScrap');
var gumtreeScrap = require('./gumtreeScrap');
var mailService = require('./mailService')




module.exports = {
    start: function (data, callback) {
		startProccess(data, function(err, result){
			//var date = moment().format("HH:mm:ss");
			if(err){
				callback(err);
			}
			else{
				callback(null, result);
			}
		})	
    }
};

function startProccess(data, callback){
	async.waterfall([
		async.apply(GetScrapedPage, data),
		GetAllUrlsAdsOnPage,
		CheckArrayInDataBase,
		GetArrayScrapedPage,
		GetArrayDataSubPage,
		AddArrayToDataBase,
		GetArrayNotification,
		CheckArraySendEmail
	],function (err, result) {
		if(err) return (err);
		callback(null,result);
    });
}

function GetArrayNotification(arrayData, callback) {
    notificationCtrl.getAll(function(note){
		if(note){
			callback(null, arrayData, note);
		}
		else{
			callback(null);
		}
	})
};


function CheckArraySendEmail(arrayData, notificationArray, callback) {
	console.log('arrayData=' + arrayData.length);
	console.log('notificationArray=' + notificationArray.length);
	var dbArray = [];
	async.forEach(arrayData, function (data, callback) {
		mailService.sendMail(data, notificationArray, function(result){
			console.log(' ===================>>>>>>>>>>>>>>>> RESULT= ' + result);
			dbArray.push(result);
			callback(null, result);
		});


	}, function (err, result) {
			if (err){ 
				logger.error('[CheckArraySendEmail] err=' + err);
				return callback(err)
			}
			logger.debug('[CheckArraySendEmail] dbArray.length='+ dbArray.length);
			callback(null, dbArray.length);
		}
	);
};

function AddArrayToDataBase(dataArray, callback){
	var dbArray = [];
	async.forEach(dataArray, function (data, callback) {
		async.waterfall([
			async.apply(AddToDataBase, data)
		], 
			function(err, result){
				if(err) return callback(err);
				if(result){
					dbArray.push(result);
				}
				callback(null, dbArray);			
			}
		);
	}, function (err, result) {
			if (err){ 
				logger.error('[AddArrayToDataBase] err=' + err);
				return callback(err)
			};
			logger.debug('[AddArrayToDataBase] dbArray.length='+ dbArray.length);
			callback(null, dbArray);
		}
	);
};
function AddToDataBase(data, callback){
	if(data){
		scrapCtrl.create(data, function(err){
			if(err){
				if(err.code == 11000){
					//logger.error('[AddToDataBase] duplikat url=' + JSON.stringify(data));
				}
				else{
					logger.error('Hjuston we have problem..' + err + ', data.url=' + data.url + ', data=' + JSON.stringify(data));
				}
				data = null;
			}
			else{
				logger.debug('ogloszenie dodane!');
			}
			callback(null, data);
		});
	}
	else{
		logger.error('data pusty');
		callback('data pusty');
	}
};
function GetArrayScrapedPage(arrayUrls, data, callback) {
	var scrapArray = [];
	logger.debug('[GetArrayScrapedPage] Rozpoczynam scrapowanie..')
	async.forEach(arrayUrls, function (url, callback) {
		async.waterfall([
			async.apply(GetScrapedPage, url)
		], 
			function(err, result){
				if(err) return callback(err);
				if(result){
					//console.log('[GetArrayScrapedPage] ' + scrapArray.length +' result = ' + result);
					scrapArray.push(result);
				}
				callback(null, scrapArray);			
			}
		);
	}, function (err, result) {
			if (err){ 
				logger.error('[GetArrayScrapedPage] err=' + err);
				return callback(err)
			};
			logger.debug('[GetArrayScrapedPage] scrapArray.length='+ scrapArray.length);
			callback(null, scrapArray, data);
		}
	);
};
function GetArrayDataSubPage(arrayScrapedUrls, data, callback) {
	var dataArray = [];

	if(data.page === 'gumtree'){
		var MethodToScan = gumtreeScrap.GetDataSubPage;
	}
	else if(data.page === 'olx'){
		//console.log('jestem olx');
		var MethodToScan = olxScrap.GetDataSubPageOlx;
	}
	else{
		return callback('Brak takiej strony do wyciagniecia danych page=' + data.page);
	}

	async.forEach(arrayScrapedUrls, function (scrapedPage, callback) {
		async.waterfall([
			async.apply(MethodToScan, scrapedPage)
		], 
			function(err, result){
				if(err) callback(err);
				if(result){
					//console.log('[GetArrayScrapedPage] result = ' + result);
					dataArray.push(result);
				}
				callback(null, dataArray);			
			}
		);
	}, function (err, result) {
			if (err){ 
				logger.error('[GetArrayDataSubPage] err=' + err);
				return callback(err)
			};
			logger.debug('[GetArrayDataSubPage] dataArray.length='+ dataArray.length);
			callback(null, dataArray);
		}
	);
};
function GetScrapedPage(data, callback) {
	if(data.url){
		request(data.url, function (error, response, html) {
	        if (!error && response.statusCode == 200) {
	            var scrapedPage = cheerio.load(html, {
	                normalizeWhitespace: true,
	                xmlMode: false,
	                decodeEntities: true
	            });
	        }
	        callback(null, scrapedPage, data);
	    });
	}
	else{
	    request(data, function (error, response, html) {
	        if (!error && response.statusCode == 200) {
	            var scrapedPage = cheerio.load(html, {
	                normalizeWhitespace: true,
	                xmlMode: false,
	                decodeEntities: true
	            });
	        }
	        callback(null, scrapedPage, data);
	    });
	}
};
function GetAllUrlsAdsOnPage(scrapedPage, data, callback) {
	var adsArray = [];

	if(data.page === 'gumtree'){
		var arrayToScrapPage = scrapedPage('.container');
		var MethodToScan = gumtreeScrap.GetData;
	}
	else if(data.page === 'olx'){
		var arrayToScrapPage = scrapedPage('#offers_table').children().children();
		var MethodToScan = olxScrap.GetDataOlx;
	}
	else{
		return callback('Brak takiej strony do skrapowania page=' + data.page);
	}

	//console.log('Zbieram urls ze strony.. URL=' + url);
	async.forEach(arrayToScrapPage, function (element, callback) {
		async.waterfall([
			async.apply(MethodToScan, scrapedPage, element)
		], 
		// sprawdza czy przelecialo po wszystkich elementach w array forEach
			function(err, result){
				if(err) return callback(err);
				if(result && result.id){
					adsArray.push(result);
				}	
				callback(null, adsArray);			
			}
		);
	}, function (err, result) {
			if (err){ 
				logger.error('[GetAllUrlsAdsOnPage] err=' + err);
				return callback(err)
			};
			logger.debug('[GetAllUrlsAdsOnPage] adsArray.length='+ adsArray.length);
			callback(null, adsArray, data);
		}
	);
};

function CheckArrayInDataBase(arrayUrls, data, callback) {
	var dbArray = [];
	async.forEach(arrayUrls, function (data, callback) {
		async.waterfall([
			async.apply(CheckUrlInDataBase, data)
		], 
			function(err, result){
				if(err) return callback(err);
				if(result){
					dbArray.push(result);
				}
				callback(null, dbArray);			
			}
		);
	}, function (err, result) {
			if (err){ 
				logger.error('[CheckArrayInDataBase] err=' + err);
				return callback(err)
			};
			logger.debug('[CheckArrayInDataBase] dbArray.length='+ dbArray.length);
			callback(null, dbArray, data);
		}
	);
};
function CheckUrlInDataBase(tempUrl, callback){
    scrapCtrl.findByUrl(tempUrl, function(cb){
		if(cb){
			callback(null, cb);
		}
		else{
			callback(null);
		}
	})
};

