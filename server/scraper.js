var pageJob = require('./services/scrap.js');
var CronJob = require('cron').CronJob;
var moment = require("moment");
var logger = require('./config/log.js');
var async = require('async');

var pageCtrl = require('./api/scanpage/scanpage.controller.js');
    
module.exports = function () {
	logger.info(moment().format("HH:mm:ss") + ' Scraper został uruchomiony');
	var job = new CronJob('*/5 * * * *', function () {
		logger.info(moment().format("HH:mm:ss") + 'Cron ruszył');

		runProccess(function(cb){
			logger.debug('koniec');
		});

		}, function (err) {
			logger.error('CronJon: ' + err);
		},
		true
	);
};

function runProccess(callback){
	async.waterfall([
		GetArrayScanPages,
		DoScrap
	],function (err, result) {
		if(err) return (err);
		//logger.info('[THE END] dodany ogłoszeń = ' + result.length);
		logger.info(moment().format("HH:mm:ss") + '[THE END]');
		callback(null,result);
    });
};

function GetArrayScanPages(callback) {
    pageCtrl.getAll(function(pages){
		//console.log(pages);
    	/*var p = {
    		url: 'http://olx.pl/nieruchomosci/mieszkania/sprzedaz/warszawa',
    		page: 'olx'
    	}
    	var arr = []
    	arr.push(p);*/
		if(pages){
			//console.log('[GetArrayScanPages] pages.length=' + pages.length);
			//callback(null, 'http://gumtree.pl/s-mieszkania-i-domy-sprzedam-i-kupie/warszawa/v1c9073l3200008p1');
			callback(null, pages);
		}
		else{
			logger.error('[GetArrayScanPages] brak')
			//callback(null, 'http://gumtree.pl/s-mieszkania-i-domy-sprzedam-i-kupie/warszawa/v1c9073l3200008p1');
		}
	})
};
function DoScrap(arrayUrls, callback){
	//console.log('jestem');
	//console.log('mam array=' + arrayUrls.length);
	var scrapArray =[];
	async.forEach(arrayUrls, function (url, callback) {
		async.waterfall([
			async.apply(PageJob, url)
		], 
			function(err, result){
				if(err) return callback(err);
				if(result){
					logger.debug('[DoScrap] ' + scrapArray.length +' result = ' + result);
					scrapArray.push(result);
				}
				callback(null, scrapArray);			
			}
		);
	}, function (err, result) {
			if (err){ 
				logger.error('[DoScrap] err=' + err);
				return callback(err)
			};
			logger.debug('[DoScrap] scrapArray.length='+ scrapArray.length);
			callback(null, scrapArray);
		}
	);
};

function PageJob(data, callback){
	logger.info('[PageJob] url = ' + data.url);
	pageJob.start(data, function(err, result){
		if(err){
			logger.error('Error przy dodawaniu ogłoszenia - ' + err);
			callback(err);
		}
		else{
			if(result){
				logger.info('Dodanych = ' + result + ',url = ' + data.url);
			}
			callback(null, result);
		}
	});	
};