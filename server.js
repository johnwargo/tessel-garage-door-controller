"use strict";
/**********************************************************
 * Tessel Garage Door Opener
 *
 * by John M. Wargo
 * www.johnwargo.com
 *
 **********************************************************/
// Import the interface to Tessel hardware
var tessel = require('tessel');
// Import the relay module library
var relaylib = require('relay-mono');
// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');

//Setup a relay object to point to the relay module connected to Tessel port A
//Change this value to B if using the second module port instead
var relay = relaylib.use(tessel.port['A']);

// Wait for the relay module to connect
relay.on('ready', function relayReady() {
    //Then initialize the relay module any way you need to
    console.log('Initializing relay module');
    //Check relay state, turn relay off if its on
    // Yes, I know, not the cleanest way to do this, I'm just showing what needs to be done
    if (relay.getState(1, relayResult) == "true") {
        relay.turnOff(1, relayResult);
    }
    if (relay.getState(2, relayResult) == "true") {
        relay.turnOff(2, relayResult);
    }
    console.log('Relay module initialized');
});

function relayResult(err) {
    if (err) {
        console.error('Relay error: ', err);
    } else {
        console.log('Relay command completed');
    }
}

// When a relay channel is set, it emits the 'latch' event
relay.on('latch', function (channel, value) {
    console.log('Relay channel ' + channel + ' switched to', value);
});

// Initialize the web server
var server = http.createServer(function (request, response) {
    // Break up the url into easier-to-use parts
    var urlParts = url.parse(request.url, true);

    // Create a regular expression to match requests to toggle LEDs
    var ledRegex = /leds/;

    if (urlParts.pathname.match(ledRegex)) {
        // If there is a request containing the string 'leds' call a function, toggleLED
        toggleLED(urlParts.pathname, request, response);
    } else {
        // All other request will call a function, showIndex
        showIndex(urlParts.pathname, request, response);
    }
});

// Stays the same
server.listen(8080);

// Stays the same
console.log('Server running at http://192.168.1.101:8080/');

// Respond to the request with our index.html page
function showIndex(url, request, response) {
    // Create a response header telling the browser to expect html
    response.writeHead(200, {"Content-Type": "text/html"});

    // Use fs to read in index.html
    fs.readFile(__dirname + '/index.html', function (err, content) {
        // If there was an error, throw to stop code execution
        if (err) {
            throw err;
        }
        // Serve the content of index.html read in by fs.readFile
        response.end(content);
    });
}

// Toggle the led specified in the url and respond with its state
function toggleLED(url, request, response) {
    // Create a regular expression to find the number at the end of the url
    var indexRegex = /(\d)$/;

    // Capture the number, returns an array
    var result = indexRegex.exec(url);

    // Grab the captured result from the array
    var index = result[1];

    // Use the index to reference the correct LED
    var led = tessel.led[index];

    // Toggle the state of the led and call the callback after that's done
    led.toggle(function (err) {
        if (err) {
            // Log the error, send back a 500 (internal server error) response to the client
            console.log(err);
            response.writeHead(500, {"Content-Type": "application/json"});
            response.end(JSON.stringify({error: err}));
        } else {
            // The led was successfully toggled, respond with the state of the toggled led using led.isOn
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify({on: led.isOn}));
        }
    });
}

// Simple sleep function with promise
// 'borrowed' from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(time) {
    return new Promise((resolve)=>setTimeout(resolve, time));
}

function toggleRelay(idx) {
    // turn the relay on
    relay.turnOn(idx, relayResult);
    //sleep for a little while (a half second)
    sleep(500).then(() => {
        //Then turn the relay off
        relay.turnOff(idx, relayResult);
    });
}