const int GSR_1=A0;
const int GSR_2=A1;
int sensorValueA;
int sensorValueB;

void setup(){
  Serial.begin(9600);
  delay(500);
  }//end setup

void loop(){
  sensorValueA=analogRead(GSR_1);
  sensorValueB=analogRead(GSR_2);
  Serial.print("1:");
  Serial.print(sensorValueA);
  Serial.print("::2:");
  Serial.println(sensorValueB);
  delay(1000);
  }//end main loop
