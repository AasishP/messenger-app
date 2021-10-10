import React, { useContext, useCallback, useEffect, useState } from "react";
import CallAlert from "./CallAlert";
import Peer from "peerjs";
import SocketContext from "../../../context/SocketContext";
import LoggedInUserContext from "../../../context/LoggedInUserContext";
import VideoCallScreen from "./VideoCallScreen";

function CallSection() {
  const socket = useContext(SocketContext);
  const { LoggedInUser } = useContext(LoggedInUserContext);

  const [remoteStream, setRemoteStream] = useState();
  const [localStream, setLocalStream] = useState();
  const [calling, setCalling] = useState(false);
  const [showVideoScreen, setShowVideoScreen] = useState(false);
  const [direction, setDirection] = useState("");
  const [callType, setCallType] = useState("");

  function resetState() {
    setRemoteStream(null);
    setLocalStream(null);
    setCalling(false);
    setShowVideoScreen(false);
    setDirection("");
    setCallType("");
  }

  function call(peer, peerId) {
    navigator.mediaDevices
      .getUserMedia({ video: callType === "VideoCall", audio: true })
      .then((stream) => {
        setLocalStream(stream);
        setShowVideoScreen(true);
        const call = peer.call(peerId, stream);
        call.on("stream", (remoteStream) => {
          // Show stream in some <video> element.
          console.log("got remoteVideo stream");
          setRemoteStream(remoteStream);
          setShowVideoScreen(true);
        });
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  }

  function acceptCall(call) {
    navigator.mediaDevices
      .getUserMedia({ video: callType === "VideoCall", audio: true })
      .then((stream) => {
        call.answer(stream); // Answer the call with an A/V stream.
        setLocalStream(stream);
        call.on("stream", (remoteStream) => {
          // Show stream in some <video> element.
          setRemoteStream(remoteStream);
          setShowVideoScreen(true);
        });
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  }

  const handleCall = useCallback(
    (e) => {
      const callDirection = e.detail ? "outgoing" : "incoming";
      setDirection(callDirection);

      const peer = new Peer(); //creating new peer
      peer.on("open", function (peerId) {
        if (callDirection === "outgoing") {
          setCalling(true); //showing the calling popup
          const userInfo = e.detail.userInfo;
          const callType = e.detail.callType;
          setCallType(callType);

          socket.emit("outgoingCall", peerId, userInfo, callType);
          socket.on(
            "acknowledgedCall",
            (remotePeerId, caller, receiver, ackCallType) => {
              if (
                caller === LoggedInUser.username &&
                receiver === userInfo.username &&
                ackCallType === callType
              ) {
                call(peer, remotePeerId);
              }
            }
          );
        } else {
          setCallType(e.callType);
          socket.emit(
            "callAcknowledged",
            peerId,
            e.caller,
            LoggedInUser.username,
            e.callType
          );
        }
      });

      //answer call
      peer.on("call", (call) => {
        setCalling(true); //showing the calling popup
        document.addEventListener("callAccepted", () => {
          acceptCall(call);
        });
      });
    },
    [socket, LoggedInUser]
  );

  useEffect(() => {
    socket.on("incomingCall", handleCall);

    document.addEventListener("call", handleCall);
    return () => {
      document.removeEventListener("call", handleCall);
    };
  }, [socket, handleCall]);

  return (
    <>
      {calling && !showVideoScreen ? (
        <CallAlert direction={direction} callType={callType} />
      ) : null}

      {calling && showVideoScreen ? (
        <VideoCallScreen
          localStream={localStream}
          remoteStream={remoteStream}
        />
      ) : null}
    </>
  );
}

export default CallSection;
