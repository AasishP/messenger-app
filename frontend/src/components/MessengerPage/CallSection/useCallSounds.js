import { useEffect } from "react";

import connecting from "../../../assets/sounds/connecting.mp3";
import connected from "../../../assets/sounds/connected.mp3";
import calling from "../../../assets/sounds/calling.mp3";
import callFailed from "../../../assets/sounds/callFailed.mp3";
import ringing from "../../../assets/sounds/ringing.mp3";
import reconnecting from "../../../assets/sounds/reconnecting.mp3";
import connectionLost from "../../../assets/sounds/connectionLost.mp3";
import hangup from "../../../assets/sounds/hangup.mp3";

const sounds = {
  connecting,
  connected,
  calling,
  callFailed,
  ringing,
  reconnecting,
  connectionLost,
  hangup,
};

function useCallSounds(callState) {
  useEffect(() => {
    if (
      callState &&
      callState !== "noAnswer" &&
      callState !== "busy" &&
      callState !== "ongoing"
    ) {
      var audio = new Audio(sounds[callState]);
      audio.load();
      if (
        callState === "connecting" ||
        callState === "ringing" ||
        callState === "reconnecting"
      )
        audio.loop = true;
      audio.play();
    }
    return () => {
      if (audio) audio.pause();
    };
  }, [callState]);
}

export default useCallSounds;
