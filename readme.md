Tessel 2 Garage Door Controller
===============================
By [John M. Wargo](www.johnwargo.com)

This project is a super simple garage door controller built using the [Tessel 2](https://tessel.io/) development platform and a [Tessel relay module](https://tessel.io/modules#module-relay). The relay module connects to your garage door in parallel with the existing garage door button and simulates a button press by shorting the contacts across the relay.

The Tessel development board runs a simple web server application that: 

+ Serves a simple web page (shown in the figure below)
+ Responds to requests from the web application
+ Triggers the relay to 'push' the garage door button

To build this project, you'll need the following:

+ [Tessel 2 development board](https://tessel.io/)
+ [Tessel Relay module](https://tessel.io/modules#module-relay)
+ [5V, Micro USB power supply](https://www.adafruit.com/products/1995)
+ 20ga wire 

**Note:** *The development board is available in the US from Sparkfun, but they don't carry the relay module, so I ordered both from Seed Studio (China).*

Follow the instructions on the [Tessel web site](http://tessel.github.io/t2-start/) to setup your development system and connect the Tessel board. Be sure to update the Tessel board's firmware to the latest version and connect the device to your Wi-Fi network. Next, disconnect the USB cable from the Tessel board then attach the relay module to the Tessel's module A port. 

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

**Note:** *In this example, I'd renamed my Tessel device to 'tessel-gdo' (for 'Tessel Garage Door Opener'), your output will properly reflect the name of your Tessel device.* 

At this point, you can open your browser of choice and navigate to the URL provided in the listed output (http://192.168.1.168:8080) to access the web application included with this project (shown below).

![Tessel Garage Door Controller Web Application](http://johnwargo.com/files/tessel-gdc-web-app.png)
 
When you press the button in the web app, you should see the blue user LED illuminate for half a second and hear the relay click. 

Deploy the project's server.js file to the device using the following command:

	t2 push server.js  

This saves the server app to the device so it runs every time you power on the Tessel device.

Finally, connect a length of wire between the relay contacts and the garage door button contacts, provide power to the Tessel device and you're all ready to go.

***

You can find information on many different topics on my [personal blog](http://www.johnwargo.com). Learn about all of my publications at [John Wargo Books](http://www.johnwargobooks.com). 
