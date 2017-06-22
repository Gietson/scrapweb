'use strict';

var Ads = require('./ads.model');
var async = require('async');

var validationError = function (res, err) {
    return res.status(422).json(err);
};


exports.findFilter = function (req, res) {
    var q = req.body.data;
    var opt = req.body.opt;
    console.log(JSON.stringify(q));
    //console.log(opt);
    var options = {
        sort:     {dateScan: (opt.sort == 'new') ? -1 : 1},
        page:   opt.currentPage,
        limit:    opt.limitOnPage
    };
    //console.log(options);

    //<editor-fold desc="query">
    var query = {};
    if (q.priceFrom) {
        if (q.priceTo) {
            query["price"] = { $gte : q.priceFrom , $lte : q.priceTo };
        }
        else {
            query["price"] = { $gte : q.priceFrom };
        }
    }
    else if (q.priceTo) {
        query["price"] = {lte : q.priceTo};
    }

    if (q.priceM2From) {
        if (q.priceM2To) {
            query["priceM2"] = { $gte : q.priceM2From , $lte : q.priceM2To };
        }
        else {
            query["priceM2"] = { $gte : q.priceM2From };
        }
    }
    else if (q.priceM2To) {
        query["priceM2"] = {lte : q.priceM2To};
    }

    if (q.agency) query["agency"] = true;
    else query["agency"] = false;

    if(q.district) query["district"] = q.district;
    if(q.city) query["city"] = q.city;
    //</editor-fold>


   /* if(q) {
        console.log('jestem');
        /!*if(q.agency){
            console.log('jestem w true');
            query.where('agency', true);
        }
        else{
            console.log('jestem w false');
            query.where('agency', false);
        }*!/

        //.limit(500);
        //dzielnica
        if (q.district) {
            console.log('dzielnica='+q.district);
            query.where('district', q.district);

        }

        if (q.city) {
            console.log('city=' +q.city);
            query.where('city', q.city);
        }

        // user
        /!*if (q.userName) {
            query.where('userName', q.userName);
        }*!/

        //cena

        if (q.priceFrom) {
            if (q.priceTo) {
                query.where('price').gte(q.priceFrom).lte(q.priceTo);
            }
            else {
                query.where('price').gte(q.priceFrom);
            }
        }
        else if (q.priceTo) {
            query.where('price').lte(q.priceTo);
        }

        //cena/m2
        if (q.priceM2From) {
            if (q.priceM2To) {
                query.where('priceM2').gte(q.priceM2From).lte(q.priceM2To);
            }
            else {
                query.where('priceM2').gte(q.priceM2From);
            }
        }
        else if (q.priceM2To) {
            query.where('priceM2').lte(q.priceM2To);
        }
        //liczba pokoi
        /!*if (q.numberOfRoomsFrom) {
            if (q.numberOfRoomsTo) {
                query.where('numberOfRooms').gte(q.numberOfRoomsFrom).lte(q.numberOfRoomsTo);
            }
            else {
                query.where('numberOfRooms').gte(q.numberOfRoomsFrom);
            }
        }
        else if (q.numberOfRoomsTo) {
            query.where('numberOfRooms').lte(q.numberOfRoomsTo);
        }*!/


    }*/


    Ads.paginate(query, options).then(function(result) {
        //console.log(result);
        res.status(200).json(result);
    });
};

exports.getUniqueData = function(req, res) {


    Ads.aggregate(
        [
            { $group: { _id: '$'+req.query.value, count: { $sum: 1 } } },
            { $sort : { _id : 1 } }
        ],
        function(err,result) {
            if(err) { return handleError(res, err); }
            result.unshift('');
            return res.status(200).json(result);
        }
    );
};


exports.create = function (data, callback) {
	var entry = new Ads({
		_id: data.id,
		title: data.title,
		url: data.url,
		price: data.price,
		priceM2: data.priceM2,
		dateAdd: data.dateAdd,
		district: data.district,
		city: data.city,
		agency: data.agency,
		propertyType: data.propertyType,
		numberOfRooms: data.numberOfRooms,
		numberOfBathrooms: data.numberOfBathrooms,
		size: data.size,
		parking: data.parking,
		userName: data.userName,
		phoneNumber: data.phoneNumber,
		photos: data.photos,
		page: data.page
	});
	entry.save(function (err) {
		if (err) {
			callback(err);
		}
		else {
			callback();
		}
		
	});
};

exports.findByUrl = function (data, callback) {
	try{
		Ads.findOne({ id: data.id }, function (err, doc) {
		// doc is a Document
		if (err) console.log('==findByUrl ERROR=' + err);
		if(doc){
			// jeżeli coś znajdzie w bazie to zwracam pusty callback
			callback(null);
			
		}
		else{
			//console.log('NIE MA W BAZIE doc=' + doc);
			callback(data.url);
		}
		});
	}
	catch(err){
		console.log('[findByUrl] err=' + err);
		callback(null);
	}
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
    res.redirect('/');
};
