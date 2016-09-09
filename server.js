"use strict";
/**********************************************************
 * Tessel Garage Door Opener
 *
 * by John M. Wargo
 * www.johnwargo.com
 *
 **********************************************************/

// use the blue LED when showing activity, change to 2 for green LED
const ACTIVITY_LED = 3;
//Change MODULE_PORT to B id your relay module is plugged into the Tessel's port B
const MODULE_PORT = 'A';
//Indicates the garage door is connected to relay 1.
//Change to 2 if you're using the second relay on the module
const RELAY_PORT = 1;
//Specifies how long the relay stays on in the toggleRelay function
const RELAY_DELAY = 500;  //milliseconds
//Used to check status of a relay
const TRUE_TEXT = 'true';

const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};

// Import the interface to Tessel hardware
var tessel = require('tessel');
// Import the relay module library
var relaylib = require('relay-mono');
// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var os = require('os');
var url = require('url');

//Setup a relay object to point to the relay module connected to Tessel port A
//Change this value to B if using the second module port instead
var relay = relaylib.use(tessel.port[MODULE_PORT]);

//Turn off the Activity LED, just in case it's already on
tessel.led[ACTIVITY_LED].off();

// When the relay module connects to the Tessel
relay.on('ready', function relayReady() {
    //Then initialize the relay module any way you need to
    //In this case, we're just going to make sure the relays are both off, just in case
    console.log('Initializing relay module');
    //Check relay state, turn relay off if its on
    //Yes, I know I could have done this more efficiently
    if (relay.getState(1, relayResult) == TRUE_TEXT) {
        relay.turnOff(1, relayResult);
    }
    if (relay.getState(2, relayResult) == TRUE_TEXT) {
        relay.turnOff(2, relayResult);
    }
    console.log('Relay module initialized');
});

function relayResult(err) {
    if (err) {
        // this should never happen
        console.error('Relay error: %s', err);
    } else {
        //Just log something to the console to let everyone know it worked
        console.log('Relay command completed');
    }
}

// When a relay channel is set, it emits the 'latch' event
// so we can do something on that event
relay.on('latch', function (channel, value) {
    //Show the status of the relay
    console.log('Relay #%s: %s', channel, value);
});

// Initialize the web server
var server = http.createServer(function (request, response) {
    // Break up the url into easier-to-use parts
    var urlParts = url.parse(request.url, true);
    //is the request /gdb? then push the button
    if (urlParts.path == '/gdb') {
        toggleRelay(RELAY_PORT);
        //Let the calling application know it worked
        //This assumes it always works, there's no real error checking
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end('Success!');
    } else {
        // All other request will call a function, showIndex to load the index.html file
        //This can be easily expanded to load any file from the Tessel file system
        showIndex(urlParts.pathname, request, response);
    }
});

//Setup the server port we'll be listening on
//Change this to a more 'interesting' port number to fool hackers trying to get in
server.listen(8080);

//Log the IP address we're listening on
var ipAddr = os.networkInterfaces().wlan0[0].address;
console.log('Server running at http://' + ipAddr + ':8080/');

function showIndex(url, request, response) {
    // Respond to the request with our index.html page
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

function sleep(time) {
    // Simple sleep function with promise
    // 'borrowed' from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    return new Promise((resolve)=>setTimeout(resolve, time));
}

function toggleRelay(idx) {
    //Toggle the specified relay, keeping it on for RELAY_DELAY milliseconds
    //first turn on the activity LED
    tessel.led[ACTIVITY_LED].on();
    //next, the relay on
    relay.turnOn(idx, relayResult);
    //sleep for RELAY_DELAY milliseconds
    sleep(RELAY_DELAY).then(() => {
        //Then turn the relay off
        relay.turnOff(idx, relayResult);
        //and turn off the activity LED
        tessel.led[ACTIVITY_LED].off();
    });
}