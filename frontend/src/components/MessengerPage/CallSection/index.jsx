import React, { useContext, useCallback, useEffect, useState } from "react";
import CallAlert from "./CallAlert";
import Peer from "peerjs";
import SocketContext from "../../../context/SocketContext";
import LoggedInUserContext from "../../../context/LoggedInUserContext";
import VideoCallScreen from "./VideoCallScreen";

export const CALLSTATES = {
  CONNECTING: "connecting",
  CONNECTED: "connected",
  CALLFAILED: "callFailed",
  CALLING: "calling",
  RINGING: "ringing",
  NOANSWER: "noAnswer",
  BUSY: "busy",
  ONGOING: "ongoing",
  RECONNECTING: "reconnecting",
  CONNECTIONLOST: "connectionLost",
  HANGUP: "hangup",
};
export const CALLDIRECTION = {
  INCOMING: "incoming",
  OUTGOING: "outgoing",
};
export const CALLTYPE = {
  AUDIOCALL: "AudioCall",
  VIDEOCALL: "VideoCall",
};

function CallSection() {
  const socket = useContext(SocketContext);
  const { LoggedInUser } = useContext(LoggedInUserContext);
  //states
  const [remoteStream, setRemoteStream] = useState();
  const [localStream, setLocalStream] = useState();
  const [showVideoScreen, setShowVideoScreen] = useState(false);

  /**
   * *callStates
   * callStates in outgoing call ["connecting","connected","callFailed","calling","noAnswer" , "busy" , "ongoing" ,"reconnecting", "connectionLost" ,"hangup"]
   * callStates in incoming call ["ringing","ongoing","reconnecting","connectionLost","hangup"]
   * * these callSates are in order in they occur.
   */
  const [callState, setCallState] = useState(); //
  const [direction, setDirection] = useState();
  const [callType, setCallType] = useState(); // AudioCall VideoCall
  const [callingUser, setCallingUser] = useState(); //object it hold is in this shape {username,firstName,lastName,online,profilePic}
  const [callStartedTime, setCallStartedTime] = useState(); // new Date();

  const showCallAlert =
    !(
      direction === CALLDIRECTION.INCOMING &&
      callState === CALLSTATES.CONNECTING
    ) &&
    callState &&
    !showVideoScreen;

  const resetStates = () => {
    setShowVideoScreen(false);
    setCallState();
    setRemoteStream();
    setLocalStream();
    setDirection();
    setCallType();
    setCallingUser();
    setCallStartedTime();
  };

  const call = (peer, remotePeerId, callType) => {
    //call acknowledgement is received form the otherEnd.
    navigator.mediaDevices
      .getUserMedia({ video: callType === CALLTYPE.VIDEOCALL, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        setShowVideoScreen(callType === CALLTYPE.VIDEOCALL);
        const call = peer.call(remotePeerId, stream);
        setCallState(CALLSTATES.CALLING); //play calling tone in CallAlert component
        call.on("stream", (remoteStream) => {
          //call is accepted by otherEnd
          // Show stream in some <video> element if callType === videoCall
          setRemoteStream(remoteStream);
          setCallStartedTime(new Date()); //start call timer
          setCallState(CALLSTATES.ONGOING);
        });
      })
      .catch((err) => {
        setCallState(CALLSTATES.CALLFAILED);
        console.error("Failed to get local stream", err);
      });
  };

  const acceptCall = (call, callType) => {
    navigator.mediaDevices
      .getUserMedia({ video: callType === CALLTYPE.VIDEOCALL, audio: true })
      .then((stream) => {
        call.answer(stream); // Answer the call with an A/V stream.
        setLocalStream(stream);
        call.on("stream", (remoteStream) => {
          setCallStartedTime(new Date()); //start call timer
          setCallState(CALLSTATES.ONGOING);
          // Show stream in some <video> element.
          setRemoteStream(remoteStream);
          setShowVideoScreen(callType === CALLTYPE.VIDEOCALL);
        });
      })
      .catch((err) => {
        setCallState(CALLSTATES.CALLFAILED);
        console.error("Failed to get local stream", err);
      });
  };

  const handleCall = useCallback(
    (e) => {
      const callDirection = e.detail
        ? CALLDIRECTION.OUTGOING
        : CALLDIRECTION.INCOMING;
      const callType = e.detail?.callType || e.callType;
      setDirection(callDirection);
      setCallingUser(e.detail?.userInfo || e.caller);
      setCallType(callType);
      setCallState(CALLSTATES.CONNECTING); //show CallAlert component

      const peer = new Peer(); //creating new peer
      peer.on("open", function (peerId) {
        if (callDirection === CALLDIRECTION.OUTGOING) {
          const userInfo = e.detail.userInfo; //this person
          socket.emit("outgoingCall", peerId, userInfo, callType);
          socket.on(
            "acknowledgedCall",
            (remotePeerId, caller, receiver, ackCallType) => {
              if (
                caller.username === LoggedInUser.username &&
                receiver === userInfo.username &&
                ackCallType === callType
              ) {
                setCallState(CALLSTATES.CONNECTED); //play call connected sound in CallAlert component
                call(peer, remotePeerId, callType);
              }
            }
          );
        } else {
          setCallType(e.callType);
          setCallState(CALLSTATES.RINGING); //play ringtone
          socket.emit(
            "callAcknowledged",
            peerId,
            e.caller,
            LoggedInUser.username,
            e.callType
          );
        }
      });

      function callHandler(call) {
        setCallState(CALLSTATES.RINGING); //play ringtone
        document.addEventListener("callAccepted", () => {
          acceptCall(call, callType);
        });
      }
      //answer call
      peer.on("call", callHandler);
    },
    [socket, LoggedInUser]
  );

  //stopping the mic and camera streams.
  const stopStreams = useCallback(() => {
    remoteStream?.getTracks().forEach((tracks) => tracks.stop());
    localStream?.getTracks().forEach((tracks) => tracks.stop());
  }, [remoteStream, localStream]);

  const endCall = useCallback(
    function () {
      if (this !== socket) {
        callState === CALLSTATES.RINGING
          ? socket.emit("callRejected", callingUser)
          : socket.emit("callEnd", callingUser);
      } //if it is called by socket.on() no need to emit. This happens when otherEnd ends the call. So no need to tell otherEnd the call has ended.
      setCallState(CALLSTATES.HANGUP);
      stopStreams();
      setTimeout(resetStates, 2000); //wait 2 sec before everything is clear so callEnd sound and callended info can be shown.
    },
    [socket, callingUser, callState, stopStreams]
  );

  useEffect(() => {
    switch (callState) {
      //for callFailed
      case CALLSTATES.CONNECTING:
        var callFailTimeOut = setTimeout(() => {
          setCallState(CALLSTATES.CALLFAILED);
          setTimeout(resetStates, 3000);
        }, 10000);
        break;

      //for noAnswer
      case CALLSTATES.RINGING:
        var noAnswerTimeOut = setTimeout(() => {
          socket.emit("noAnswer", callingUser);
          resetStates();
        }, 10000);
        break;
      case CALLSTATES.NOANSWER:
      case CALLSTATES.BUSY:
        setTimeout(resetStates, 3000);
        stopStreams();
        break;

      default:
        break;
    }

    return () => {
      clearTimeout(callFailTimeOut);
      clearTimeout(noAnswerTimeOut);
    };
  }, [socket, callState, callingUser, stopStreams]);

  useEffect(() => {
    socket.on("incomingCall", handleCall);
    socket.on("callEnd", endCall);
    socket.on("noAnswer", () => {
      setCallState(CALLSTATES.NOANSWER);
    });
    socket.on("callRejected", () => {
      setCallState(CALLSTATES.BUSY);
    });
    socket.on("userBusy", (busyUser) => {
      callingUser === busyUser && setCallState(CALLSTATES.BUSY);
    });

    document.addEventListener("call", handleCall);
    document.addEventListener("callEnd", endCall);
    return () => {
      document.removeEventListener("call", handleCall);
      document.removeEventListener("callEnd", endCall);
      socket.off("incomingCall", handleCall);
      socket.off("callEnd", endCall);
    };
  }, [socket, callingUser, handleCall, endCall]);

  return (
    <>
      {showCallAlert && (
        <CallAlert
          direction={direction}
          callType={callType}
          callingUser={callingUser}
          callState={callState}
          callStartedTime={callStartedTime}
          //AudioCall is handled in this component
          remoteStream={remoteStream}
          localStream={localStream}
        />
      )}

      {showVideoScreen && (
        <VideoCallScreen
          localStream={localStream}
          remoteStream={remoteStream}
          callState={callState}
          callingUser={callingUser}
          callStartedTime={callStartedTime}
        />
      )}
    </>
  );
}

export default CallSection;
