/*
  Love Machine Proof of Concept for 2015 Burning Man Midway
 
 Turns on and off a light emitting diode(LED) connected to digital  
 pin 13 and pushes the button state up the serial comm port every second, 
 when pressing a pushbutton attached to pin 2. 
 
 The circuit:
http://www.arduino.cc/en/Tutorial/Button
 
 This example code is in the public domain.
  created 2005 by DojoDave <http://www.0j0.org>
  modified 30 Aug 2011 by Tom Igoe
 */

// constants won't change. They're used here to 
// set pin numbers:
const int buttonPin = 2;     // the number of the pushbutton pin
const int ledPin =  13;      // the number of the LED pin

// variables will change:
int buttonState = 0;         // variable for reading the pushbutton status

void setup() {
  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);      
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT); 
  // initialize serial:
  Serial.begin(9600);  

}

void loop(){
  // needed for debouncing the button, could be set lower with testing
  delay(1000);
  // read the state of the pushbutton value:
  buttonState = digitalRead(buttonPin);
  // check if the pushbutton is pressed.
  // if it is, the buttonState is HIGH:
  
  if (buttonState == HIGH) {     
    // turn LED on:    
    digitalWrite(ledPin, HIGH); 
  } 
  else {
    // turn LED off:
    digitalWrite(ledPin, LOW); 
  }
  //pushes the state of the button up the serial comm port
  Serial.println(buttonState); 
}
