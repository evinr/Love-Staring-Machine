#!/bin/bash
# ------------------------------------------------------------------
#   Love Machine Server Auto Run File: Set me to run on startup
#       -pulls down the newest code from github
#       -runs servedir to serve the content
#       -launches Chrome in a kisoked mode 
# ------------------------------------------------------------------

VERSION=0.1.0
SUBJECT=love-machine
USAGE="Usage: sudo cp ./autoRun.sh /etc/init.d/script"

# --- Locks -------------------------------------------------------
LOCK_FILE=/tmp/$SUBJECT.lock
if [ -f "$LOCK_FILE" ]; then
   echo "Script is already running"
   exit
fi

trap "rm -f $LOCK_FILE" EXIT
touch $LOCK_FILE

# --- Body --------------------------------------------------------
alias proj="cd /home/code/Love-Staring-Machine"

#checks if network is available pulls down the newest code from github
  wget -q --tries=10 --timeout=20 --spider http://google.com
if [[ $? -eq 0 ]]; then
  git pull 
fi

#updates files to be auto run on startup
  #cp ./Server/autoRun.sh /etc/init.d/script
  #cp ./Server/startup-python.sh /etc/init.d/script
#launches Chrome in a kisoked mode 
  chromium-browser --kiosk http://localhost:8000/index.html

#runs servedir to serve the content
  servedir ./

# -----------------------------------------------------------------
#http://stackoverflow.com/questions/12973777/how-to-run-a-shell-script-at-startup