import React, { useEffect, useState } from "react";
import { CALLSTATES } from ".";

function updateTimer(startTime) {
  let timeNow = new Date();
  let timerHrs = timeNow.getHours() - startTime.getHours();
  let timerMin = (() => {
    let min = timeNow.getMinutes() - startTime.getMinutes();
    if (min < 0) {
      min = min + 60;
      timerHrs--;
    }
    return min;
  })();
  let timerSec = (() => {
    let sec = timeNow.getSeconds() - startTime.getSeconds();
    if (sec < 0) {
      sec = sec + 60;
      timerMin--;
    }
    return sec;
  })();
  return `${timerHrs > 0 ? ("0" + timerHrs).slice(-2) + ":" : ""}${(
    "0" + timerMin
  ).slice(-2)}:${("0" + timerSec).slice(-2)}`; // format hrs:min:sec if hrs exits else  min:sec
}

function CallTimer({ callStartedTime, callState }) {
  const [timer, setTimer] = useState();

  useEffect(() => {
    if (callStartedTime) {
      setTimer(updateTimer(callStartedTime));
      if (![CALLSTATES.HANGUP, CALLSTATES.CONNECTIONLOST].includes(callState)) {
        const updateInterval = setInterval(() => {
          setTimer(updateTimer(callStartedTime));
        }, 1000);

        return () => {
          clearInterval(updateInterval);
        };
      }
    }
  }, [callStartedTime, callState]);

  return <>{timer}</>;
}

export default CallTimer;
