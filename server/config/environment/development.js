'use strict';

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        //uri: 'mongodb://lolo267:lolo267@ds055925.mongolab.com:55925/standuptestowy'
        uri: 'localhost/test'
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || '554687644668689',
        clientSecret: process.env.FACEBOOK_SECRET || 'a36642e3884b92ec5ee87e29dde73621',
        callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || '1062224654949-an8irqvas62lcpu67rujoehajr8ilma0.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'AlpJgbqtb3OatogpLULvV078',
        callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
    },
    seedDB: true
};
