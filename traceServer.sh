# /bin/bash
function checkRun(){
	echo "helo"
	PID=$(/bin/cat /home/sysadmin/www_core_cam9/cms3.0_API/optimizeCameraAPI.pid)
	TOTAL_MEM=$(cat /proc/$PID/status | grep VmRSS | awk '{print $2}')
	echo $TOTAL_MEM
	if ps -p $PID > /dev/null 
	then
		echo "$PID is running"
		if [ $TOTAL_MEM -gt 1500000 ]; then
			echo "$PID eat too much ram. Start again"
			kill $PID
                	RUN_CMD="node --expose-gc optimizeCameraAPI.js &> optimizeCameraAPI.log sleep 2 & echo \$! > optimizeCameraAPI.pid"
                	echo $RUN_CMD
                	eval $RUN_CMD
		fi
	else
		echo "$PID is not running. Start again"
		RUN_CMD="sudo node --expose-gc optimizeCameraAPI.js &> optimizeCameraAPI.log sleep 2 & echo \$! > optimizeCameraAPI.pid"
		echo $RUN_CMD
		eval $RUN_CMD
	fi 

	PID_CMS=$(/bin/cat /home/sysadmin/www_core_cam9/cms3.0_API/cms_api.pid)
        if ps -p $PID_CMS > /dev/null
        then
                echo "$PID_CMS is running"
        else
                echo "$PID_CMS is not running. Start again"
                RUN_CMD="node cms_api/cms_api.js &> cms_api.log sleep 2 & echo \$! > cms_api.pid"
                echo $RUN_CMD
                #eval $RUN_CMD
        fi
}

count=0
while true
do
	if [ $count -eq 0 ]; then
		echo "First time!"
		count=$[$count+1]
		checkRun
	elif [ $count -eq 5 ]; then
 		count=1
 		echo "Do something!"
		checkRun
 	else
 		count=$[$count+1]
 	fi
 	echo $count
 	sleep 1
done
