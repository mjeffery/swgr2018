'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mqtt    = require('mqtt');
admin.initializeApp(functions.config().firebase);
var client  = mqtt.connect('mqtt://broker.mqttdashboard.com');
var options = {qos: 0,retain: true};

exports.sendMessage = functions.database.ref('/outlets/{outletId}/status').onWrite(function(event) {

    console.log("function start");
    return new Promise( function(resolve, reject) {
        client.publish("startupweekend/simple", event.data.val(), options, function(error){
            resolve();
        });
   });

});

client.subscribe('startupweekend/simplereply');

client.on('message', function (topic, message) {
    var status = message.toString();
    console.log(status);

    return admin.database().ref('/mqttstatus2').set(status);
});