/* global io */
'use strict';

angular.module('app')
    .factory('socket', function (socketFactory, Auth) {

        // socket.io now auto-configures its connection when we ommit a connection url
        var ioSocket = io('', {
            // Send auth token on connection, you will need to DI the Auth service above
            //'query': 't=' + Auth.getToken(),
            path: '/socket.io-client'
        });

        var socket = socketFactory({
            ioSocket: ioSocket
        });

        return {
            socket: socket,

            /**
             * Register listeners to sync an array with updates on a model
             *
             * Takes the array we want to sync, the model name that socket updates are sent from,
             * and an optional callback function after new items are updated.
             *
             * @param {String} modelName
             * @param {Array} array
             * @param {Function} cb
             */

            syncUpdates: function (modelName, array, cb) {
                //console.log('[syncUpdates]=' + modelName);
                //console.log(array);
                cb = cb || angular.noop;
                /**
                 * Syncs item creation/updates on 'model:save'
                 */
                socket.on(modelName + ':save', function (item, token) {
                    //console.log('socket Auth= ' + JSON.stringify(Auth.getToken()));
                    if(token){
                        //console.log('jest TOKEN!');
                        if(token === Auth.getToken()){
                            //console.log('TOKEN równy!');
                            var oldItem = _.find(array, {_id: item._id});
                            var index = array.indexOf(oldItem);
                            var event = 'created';

                            // replace oldItem if it exists
                            // otherwise just add item to the collection
                            if (oldItem) {
                                array.splice(index, 1, item);
                                event = 'updated';
                            } else {
                                array.push(item);
                            }
                            cb(event, item, array);
                        }
                        else{
                            //console.log('TOKEN NIE równy!');
                            cb(event, item, array);
                        }
                    }else {
                        //console.log('nie ma TOKEN!')
                        var oldItem = _.find(array, {_id: item._id});
                        var index = array.indexOf(oldItem);
                        var event = 'created';

                        // replace oldItem if it exists
                        // otherwise just add item to the collection
                        if (oldItem) {
                            array.splice(index, 1, item);
                            event = 'updated';
                        } else {
                            array.push(item);
                        }
                        cb(event, item, array);
                    }
                });

                /**
                 * Syncs removed items on 'model:remove'
                 */
                socket.on(modelName + ':remove', function (item) {
                    var event = 'deleted';
                    //console.log('jest item=' + JSON.stringify(item));
                    _.remove(array, {_id: item._id});
                    cb(event, item, array);
                });
            },

            /**
             * Removes listeners for a models updates on the socket
             *
             * @param modelName
             */
            unsyncUpdates: function (modelName) {
                //console.log('ModelName=' + modelName);
                socket.removeAllListeners(modelName + ':save');
                socket.removeAllListeners(modelName + ':remove');
            }
        };
    });
