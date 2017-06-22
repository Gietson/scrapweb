var logger = require('../config/log.js');
var moment = require("moment");

exports.GetData = function (scrapedPage, element, callback) {
    try {
        var tempUrl = scrapedPage(element).find('div[class="title"] > a').attr('href');
        var url = 'http://gumtree.pl' + tempUrl;

        var e = tempUrl.length;
        var s = e - 25;
        var id = tempUrl.substring(s, e);

        //console.log('id='+id);
        var data = {
            id: id,
            url: url
        };
        callback(null, data);
    }
    catch (err) {
        callback(err, null);
    }
};


exports.GetDataSubPage = function (page, callback) {
    if (!page) {
        logger.error('GetDataSubPage, page = ' + page);
        callback("GetDataSubPage, page = " + page);
        //callback(null);
        //return null;
    }
    else {
        var id, title, url, price, description, date, district, city, agency, propertyType, size, parking, userName, phoneNumber;
        var numberOfRooms, numberOfBathrooms = 0;
        var idPhotos = [];
        var data = [];
        //var e = url.length;
        //var s = e - 25;
        //id = url.substring(s, e);
        url = page('link[rel="canonical"]').attr('href');
        //console.log('url=' + url);
        id = page('input[name="adId"]').val();
        if (!id) {
            id = page('input[id="adId"]').val();
        }
        //console.log('id=' + id);
        title = page('div[class="vip-title clearfix"] > h1 > span').text();
        price = page('div[class="vip-title clearfix"] > div > span > span').text();
        if (price) {
            price = price.replace(/[^0-9]/g, '');
        }

        var description = page('div[class="description"] > span').text();

        page('ul[class="selMenu"] > li').each(function (par) {
            var name = page(this).find('div[class="attribute"] > span[class="name"]');
            if (name.text() === 'Data dodania') {
                /*var tempDate = name.next().text().trim();

                 var arrayDate = tempDate.split('/');
                 var day = arrayDate[0];
                 var month = arrayDate[1];
                 var year = arrayDate[2];
                 //console.log(year + '-' + month + '-' + day);
                 date = year + '-' + month + '-' + day;*/

                //data = parseDate;
                //console.log(name.text() + '=' + data);
            }
            else if (name.text() === 'Lokalizacja') {
                var location = name.next().text();
                var tempLocation = location.split(', ');
                district = tempLocation[0].trim();
                city = tempLocation[1].trim();
                //console.log('dzielnica=' + district);
                //console.log('miasto=' + city);

            }
            else if (name.text() === 'Na sprzedaż przez') {
                if (name.next().text() === 'Agencja') {
                    agency = true;
                }
                else {
                    agency = false;
                }
                //console.log('Agencja=' + agency);
            }
            else if (name.text() === 'Rodzaj nieruchomości') {
                propertyType = name.next().text()
                //console.log(name.text() + '=' + propertyType);
            }
            else if (name.text() === 'Liczba pokoi') {
                numberOfRooms = name.next().text();
                numberOfRooms = numberOfRooms.replace(/[^0-9]/g, '');
                if (!numberOfRooms) {
                    numberOfRooms = 1;
                }
                //console.log(name.text() + '=' + numberOfRooms);
            }
            else if (name.text() === 'Liczba łazienek') {
                numberOfBathrooms = name.next().text().replace(/[^0-9]/g, '');
                //console.log(name.text() + '=' + numberOfBathrooms);
            }
            else if (name.text() === 'Wielkość (m2)') {
                size = name.next().text();
                //console.log(name.text() + '=' + size);
            }
            else if (name.text() === 'Parking') {
                parking = name.next().text();
                //console.log(name.text() + '=' + parking);
            }
            else {
                if (name.next().text()) {
                    console.log('INNE=' + name.text() + '=' + name.next().text());
                }
            }
        });

        phoneNumber = page('a[class="button telephone"]').attr('href');
        if (phoneNumber) {
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        }
        //console.log('Numer Telefonu=' + user.phoneNumber);
        userName = page('span[class="username"] > a').text();
        userName = userName.replace(' (Zobacz więcej ogłoszeń)', '').trim();
        //console.log('U�ytkownik=' + user.userName);

        getIdPhotos(page, function (err, result) {
            //console.log('zdjec= ' + result.length + ', URL=' + url);
            var priceM2 = 0;
            if (price && size) {
                priceM2 = (price / size).toFixed(0);
                //console.log(priceM21);
            }
            data = {
                id: id,
                title: title,
                url: url,
                price: price,
                priceM2: priceM2,
                description: description,
                dateAdd: new Date(),
                district: district,
                city: city,
                agency: agency,
                propertyType: propertyType,
                numberOfRooms: numberOfRooms,
                numberOfBathrooms: numberOfBathrooms,
                size: size,
                parking: parking,
                userName: userName,
                phoneNumber: phoneNumber,
                photos: result,
                page: 'Gumtree'
            };
            callback(err, data);
        });
    }
};
function getIdPhotos(page, callback) {
    var idPhotos = [];
    var photo = page('div[class="main-bg"] > div > img').attr('src');
    //console.log('DUZE=' + photo);
    if (photo) {
        var startIndex = photo.indexOf("/z/") + 3;
        var endIndex = startIndex + 16;
        var idPhoto = photo.substring(startIndex, endIndex);
        //console.log('idPhotoDUZE=' + idPhoto);
        page('div[class="main-bg"]').next().children().find('img').each(function () {

            var tinyPhoto = page(this).attr('src');
            if (tinyPhoto) {
                var startIndex = tinyPhoto.indexOf("/z/") + 3;
                var endIndex = startIndex + 16;

                var idTinyPhoto = tinyPhoto.substring(startIndex, endIndex);
                idPhotos.push(idTinyPhoto);
            }
            else {
                idPhotos.push(idPhoto);
            }
            //console.log('idTinyPhoto=' + idTinyPhoto + ', tinyPhoto='+ tinyPhoto);
        });

    }
    callback(null, idPhotos);
};
