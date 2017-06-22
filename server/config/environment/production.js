'use strict';

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP ||
    process.env.IP ||
    undefined,

    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.PORT ||
    8080,

    // MongoDB connection options
    mongo: {
        uri: 'mongodb://lolo267:lolo267@ds055925.mlab.com:55925/standuptestowy'
        //process.env.OPENSHIFT_MONGODB_DB_URL ||
    },

    facebook: {
        clientID: process.env.FACEBOOK_ID || '147828205628228',
        clientSecret: process.env.FACEBOOK_SECRET || '393b926d71f622dc984d9ac61e8438dc',
        callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || '1062224654949-an8irqvas62lcpu67rujoehajr8ilma0.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'AlpJgbqtb3OatogpLULvV078',
        callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
    },
    seedDB: true

};
