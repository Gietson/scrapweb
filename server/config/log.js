var winston = require('winston');
require('winston-mongodb').MongoDB;
var config = require('./environment');
/*
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/logs.log'
            //handleExceptions: true,
            //json: true,
            //maxsize: 5242880, //5MB
            //maxFiles: 5,
            //colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});
*/
var logger = new (winston.Logger)({ 
	transports: [
		/*new (winston.transports.File)({
			filename: './server/logs/app.log',
			handleExceptions: true
		}),*/
		new (winston.transports.Console)({ 
            handleExceptions: true,
			colorize: true
			}),
		new (winston.transports.MongoDB)({
			db: 'mongodb://lolo267:lolo267@ds055925.mongolab.com:55925/standuptestowy',
			//db: 'mongodb://localhost:27017/test',
			//db: config.mongo.uri,
            handleExceptions: true,
			collection: 'logs'
		})
		
	],
	exitOnError: false
});


module.exports=logger;