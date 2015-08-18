This is project is for Burning Man 2015. We are taking the readings from a microcontroller, dumping them through a pipline, and finally rendering the values in a webpage. 

To run this project:

	Upload .GSR_Raw_Dumper/GSR_Raw_Dumper.ino file to an arduino with two of these http://www.seeedstudio.com/wiki/Grove_-_GSR_Sensor with the yellow wires connected to the pins A0 and A1. 

	Execute the ./Server/Serial_Dumper.py on the host computer. The port might need to be adjusted. Ensure the data in the JSON is changing.

	Launch a webserver, like servedir, in the root directory of this project and open the ./index.html file in a web browser.