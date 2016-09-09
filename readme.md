Tessel 2 Garage Door Controller
===============================
By [John M. Wargo](www.johnwargo.com)

Introduction
---------------------
This project is a super simple garage door controller built using the [Tessel 2](https://tessel.io/) development platform and a [Tessel relay module](https://tessel.io/modules#module-relay). The relay module connects to your garage door in parallel with the existing garage door button and simulates a button press by shorting the contacts across the relay.

The Tessel development board runs a simple web server application that: 

+ Serves a simple web page (shown in the figure below)
+ Responds to requests from the web application
+ Triggers the relay to 'push' the garage door button on request

Components
---------------------
To build this project, you'll need the following:

+ [Tessel 2 development board](https://tessel.io/)
+ [Tessel Relay module](https://tessel.io/modules#module-relay)
+ [5V, Micro USB power supply](https://www.adafruit.com/products/1995)
+ Two lengths of 20ga wire 

**Note:** *The development board is available in the US from Sparkfun, but they don't carry the relay module, so I ordered both from Seeed Studio (China).*

Hardware Setup
---------------------
Follow the instructions on the [Tessel web site](http://tessel.github.io/t2-start/) to setup your development system and connect the Tessel board. Be sure to update the Tessel board's firmware to the latest version and connect the device to your Wi-Fi network. Next, disconnect the USB cable from the Tessel board then attach the relay module to the Tessel's module A port.

Install the relay module's software library using the following command:

	npm install relay-mono

Software Installation
-------------------- 
Copy the project's source code to a folder on your development system, then open a terminal window and navigate to the folder where you copied the files.
Connect the Tessel to your development system using a USB cable and test the server process using the following command:

	t2 run server.js 

The application should load and display the following output:

	INFO Looking for your Tessel...
	INFO Connected to tessel-gdo.
	INFO Building project.
	INFO Writing project to RAM on tessel-gdo (16.384 kB)...
	INFO Deployed.
	INFO Running server.js...
	Server running at http://192.168.1.168:8080/
	Initializing relay module
	Relay command completed
	Relay command completed
	Relay module initialized

**Note:** *In this example, I'd renamed my Tessel device to 'tessel-gdo' (for 'Tessel Garage Door Opener'), your output will properly reflect the name of your Tessel device, not mine.* 

Testing
---------------------
At this point, you can open your browser of choice and navigate to the URL provided in the listed output (http://192.168.1.168:8080 in this example) to access the web application included with this project (shown below).

![Tessel Garage Door Controller Web Application](http://johnwargo.com/files/tessel-gdc-web-app-640.png)
 
When you press the button in the web app, you should see the blue user LED illuminate for half a second and hear the relay click. At this point, bookmark the address on your device so you can access it whenever you want to open or close the garage door.

Deployment
---------------------
So far, the server app is just executing on the Tessel board when you need it to, for production use, you'll need to deploy the app (and it's associated file(s)) to the device. To deploy the project's files to the device, use the same terminal window and issue the following command:

	t2 push server.js  

This command will save the server.js and index.html files to the device and configure it so it executes server.js every time you power on the Tessel device.

Finally, connect a length of wire between the relay contacts and the garage door button contacts, provide power to the Tessel device and you're all ready to go.

Known Issues
---------------------
On startup, the Tessel board will automatically attempt a connection to the last Wi-Fi access point it used. Unfortunately, if it cannot connect to that access point, it will not try again. So, if the device isn't working as expected, and you think it's the network connection, you'll need to remove power from the Tessel board then reconnect it to let it try the Wi-Fi connection again.

The device's IP address is assigned by your network router; if you replace your router, or get a new ISP, the network settings on the device may change. If this happens, or if you suspect this has happend, you'll need to use the `T2 run server.js` command to execute the server.js command interactively to see what IP address the device is using then change your browser shortcut accordingly.  

Revision History
---------------------
None yet!

***

You can find information on many different topics on my [personal blog](http://www.johnwargo.com). Learn about all of my publications at [John Wargo Books](http://www.johnwargobooks.com). 
