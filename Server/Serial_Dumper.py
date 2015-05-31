import serial
import json
import re


#Variables setup here
ogVarA = 0
newVarA = 0
ogVarB = 0
newVarB = 0

ser = serial.Serial('/dev/ttyUSB0', timeout=2)
ser.setRTS(True)
ser.setRTS(False)

print "The script is running. Press ctrl + c to quit"

while 1:
    data = {
        "player1": newVarA,
        "player2": newVarB
    }
    #Keep timeouts on the microcontroller
    rawString = ser.readline()
    #regex to parse out the values
    newStr = (str(rawString))
    m = re.search("1:(\d+)::2:(\d+)", newStr)
    # print (rawString)
    if m:
        newVarA = int(m.groups()[0])
        newVarB = int(m.groups()[1])
    if ogVarA != newVarA and ogVarB != newVarB:
        #debugging purposes
        # print "player1 ", newVarA
        # print "player2 ", newVarB
        with open('../result.json', 'w+') as fp:
             json.dump(data, fp,  sort_keys=True, indent=4)
        ogVarA = newVarA 
        ogVarB = newVarB
ser.close
