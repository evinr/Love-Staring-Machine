import serial
import json

#Variables setup here
ogVar = '0'
newVar = '0'

ser = serial.Serial('/dev/ttyUSB1', timeout=2)
ser.setRTS(True)
ser.setRTS(False)

while 1:
    data = {
        "state": newVar,
    }
	#no timeouts allowed in here, they belong on the microcontroller
    newVar = ser.readline()
    newStr = json.dumps(data)
    if ogVar != newVar:
        print(newVar)
    with open('result.json', 'w+') as fp:
        json.dump(data, fp,  sort_keys=True, indent=4)
    ogVar = newVar
ser.close