'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mqtt    = require('mqtt');
admin.initializeApp(functions.config().firebase);
var client  = mqtt.connect('mqtt://broker.mqttdashboard.com');
var options = {qos: 0,retain: true};

exports.sendMessage = functions.database.ref('/mqtt/{messageid}').onWrite(function(event) {

    console.log("function start");
    return new Promise( function(resolve, reject) {
        client.publish("startupweekend/simple", event.data.val(), options, function(error){
            resolve();
        });
   });

});