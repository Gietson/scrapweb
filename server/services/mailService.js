var nodemailer = require('nodemailer');
var logger = require('../config/log.js');
var config = require('../config/environment');
var blockedCtrl = require('../api/blocked/blocked.controller.js');
var statusCtrl = require('../api/status/status.controller.js');

var async = require('async');
//var transporter = nodemailer.createTransport('smtps://gumsearcher@gmail.com:klopik123@smtp.gmail.com');
var transporter = nodemailer.createTransport(config.email.address);


exports.sendMail = function (data, notificationArray, callback) {
    var mailArray = [];
    async.forEach(notificationArray, function (notifi, callback) {
            if (notifi) {
                //logger.info('=> start  ' + notifi.username + ' <=');

                if (notifi.city) {
                    if (notifi.city === data.city) {
                        //console.log('miasto zgadza sie!');
                        send = true;
                    }
                    else {
                        //logger.info('miasto nie zgadza si?..' + data.city);
                        return callback(null, data); // stop
                    }
                }

                if (notifi.district) {
                    if (notifi.district === data.district) {
                        //console.log('dzielnica zgadza si?!');
                        send = true;
                    }
                    else {
                        //logger.info('dzielnica nie zgadza si?..' + data.district);
                        return callback(null, data); // stop
                    }
                }

                if (notifi.agency != null) {
                    if (notifi.agency === data.agency) {
                        //console.log('agency zgadza si?!');
                        send = true;
                    }
                    else {
                        //logger.info('agency nie zgadza si?..' + data.agency);
                        return callback(null, data); // stop
                    }
                }

                if (notifi.priceFrom && notifi.priceTo) {
                    if (data.price >= notifi.priceFrom && data.price <= notifi.priceTo) {
                        //console.log('cena zgadza si?!');
                        send = true;
                    }
                    else {
                        //logger.info('cena nie zgadza si?.. price=' + data.price + ', notifi.priceFrom=' + notifi.priceFrom + ', notifi.priceTo=' + notifi.priceTo);
                        return callback(null, data); // stop
                    }
                }

                if (notifi.priceM2From && notifi.priceM2To) {
                    if (data.priceM2 >= notifi.priceM2From && data.priceM2 <= notifi.priceM2To) {
                        //console.log('cena M2 zgadza si?!');
                        send = true;
                    }
                    else {
                        //logger.info('cena M2 nie zgadza si?.. priceM2=' + data.priceM2);
                        return callback(null, data); // stop
                    }
                }

                if (notifi.sizeFrom && notifi.sizeTo) {
                    if (data.size >= notifi.sizeFrom && data.size <= notifi.sizeTo) {
                        //console.log('rozmiar zgadza si?!');
                        send = true;
                    }
                    else {
                        //logger.info('rozmiar nie zgadza si?.. size=' + data.size);
                        return callback(null, data); // stop
                    }
                }
                if (send) {
                    console.log('ide do blockMail');
                    blockMail(notifi, data, function (result) {
                        callback(null, result);
                    });
                }
                else {
                    console.log('nic nie podpasowalo..notifi=' + JSON.stringify(notifi));
                    callback();
                }
            }
            else {
                console.log('brak notifi...');
                callback(); // continue
            }
        },

        function (err, result) {
            // check if we have a real error:
            if (err) {
                console.log('bledyy... err=' + err);
                return callback(err);
            }
            callback(null, data);
        }
    );
};
function blockMail(noti, data, callback) {

    blockedCtrl.getByUser(noti.email, function (blockArray) {
        //console.log('jestem tu blockArray = ' + blockArray);
        console.log('SPRAWDZAM USERA => ' + noti.email);
        //console.log('sprawdzam data = ' + JSON.stringify(data));
        console.log('sprawdzam noti = ' + JSON.stringify(noti));
        var blocked = {
            status: false,
            description: '',
            action: ''
        };
        async.forEach(blockArray, function (block, callback) {
            // jesli raz juz zablokuje to nie sprawdza reszty blokowań
            console.log('jestem tu blocked.status=' + blocked.status);
            if (!blocked.status) {
                console.log('sprawdzam block = ' + JSON.stringify(block));
                console.log('1. jestem tu blocked.status=' + blocked.status);
                blocked = checkInclude(data.district, block.district, blocked);
                console.log('2. jestem tu blocked.status=' + blocked.status);
                blocked = checkInclude(data.city, block.city, blocked);
                console.log('3. jestem tu blocked.status=' + blocked.status);
                blocked = checkInclude(data.title, block.title, blocked);
                // jesli nic nie zablokowal to wysyla maila
                if (!blocked.status) {
                    console.log('5. jestem tu blocked.status=' + blocked.status);
                    blocked.status = true;
                    console.log('6. jestem tu blocked.status=' + blocked.status);
                    blocked.action = 'Wysłano';
                    sendMailer(data, noti, function (cb) {
                        statusCtrl.create(data, noti.email, blocked, function (err, data) {
                            console.log('Mail został wysłany!');
                            callback(null, cb);
                        });
                    });
                }
                else {
                    console.log('4. jestem tu blocked.status=' + blocked.status);
                    console.log('ZABLOKOWALEM HIE HIE HIE email =' + noti.email);
                    //console.log(JSON.stringify(data));
                    blocked.action = 'Zablokowano';
                    statusCtrl.create(data, noti.email, blocked, function (err, data) {
                        return callback(err, data);
                    });

                }

            }
            else {
                console.log('BLOCKED = true to juz czyli zablokowalem to');
                return callback(null, null);
            }

        }, function (err, result, stop) {
            if (err) {
                console.log('bledyy... err=' + err);
                return callback(err);
            }
            callback(null, result);
        })
    });
}

function checkInclude(data, block, blocked) {
    if (!blocked.status) {
        console.log('[checkInclude] 1. jestem w blocked.status = ' + blocked.status);
        if (block && data) {
            console.log('[checkInclude] 2. jestem w blocked.status = ' + blocked.status);
            block = block.toLowerCase();
            data = data.toLowerCase();

            if (data.includes(block)) {
                blocked = {
                    status: true,
                    description: 'data= ' + data + ', block=' + block
                };
                console.log('ZABLOKOWALEM ponieważ: blocked = ' + JSON.stringify(blocked));
                return blocked;
            }
            else{
                console.log('=> NIE ZABLOKOWALEM ponieważ: blocked = ' + JSON.stringify(blocked));
            }
        }
        /*else {
         console.log('[checkInclude] 3. jestem w blocked.status = ' + blocked.status);
         console.log('WYCHODZE ONE=' + one + ' LUB TWO=' + two + ' JEST PUSTE');
         blocked.status = false;
         return blocked;
         }*/
    }
    return blocked;
    /*else {
     console.log('[checkInclude] 4. jestem w blocked.status = ' + blocked.status);
     console.log('juz kolejnego nie sprawdzam bo zablokowalem wczesniej one=' + one + ', two=' + two);
     return blocked;
     }*/
}
function sendMailer(data, notifi, callback) {
    logger.info("Wysyłam maila do: " + notifi.email);
    var mailOptions = {
        from: '"GS" <gumsearcher@gmail.com>', // sender address
        to: notifi.email, // list of receivers
        subject: 'Hello ' + notifi.username + ' ?', // Subject line
        text: notifi.username + ', mam nową ofertę specjalnie dla Ciebie!', // plaintext body
        html: '<h4><b>' + data.title + '</b></h4>' +
        '<p> <b>Dzielnica: </b>' + data.district +
        '</p> <p> <b>Cena: </b>' + data.price +
        '</p> <p> <b>Rozmiar: </b>' + data.size +
        '</p> <p> <b>Cena/M2: </b>' + data.priceM2 +
        '</p> <p> <b>Pokoi: </b>' + data.numberOfRooms +
        '<p> ' + data.url +

        '</p> <p>Pozdrawiam i oczekuj na więcej mailów! :)</p>'

        // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log('[sendMailer] err=' + error);
        }
        console.log('Message sent: ' + info.response);
        callback(null, true);
    });
}