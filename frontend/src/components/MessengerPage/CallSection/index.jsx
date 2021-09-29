import React, { useContext, useEffect, useState } from "react";
import CallAlert from "./CallAlert";
import Peer from "peerjs";
import LoggedInUserContext from "../../../context/LoggedInUserContext";
import SocketContext from "../../../context/SocketContext";

function CallSection() {
  const { LoggedInUser } = useContext(LoggedInUserContext);
  const socket = useContext(SocketContext);
  const [remoteStream, setRemoteStream] = useState();
  const [localStream, setLocalStream] = useState();
  const [show, setShow] = useState(false);

  const peer = new Peer(); //creating new peer

  function call(peerId) {
    navigator.mediaDevices.getUserMedia(
      { video: true, audio: true },
      (stream) => {
        const call = peer.call("another-peers-id", stream);
        call.on("stream", (remoteStream) => {
          // Show stream in some <video> element.
          setRemoteStream(remoteStream);
        });
      },
      (err) => {
        console.error("Failed to get local stream", err);
      }
    );
  }

  useEffect(() => {
    function handleCall(e) {
      const userInfo = e.detail.userInfo;
      const callType = e.detail.callType;
      socket.emit("outgoing", peer.id, userInfo, callType, (data) => {
        console.log(data);
      });
    }

    //answer call
    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia(
        { video: true, audio: true },
        (stream) => {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", (remoteStream) => {
            // Show stream in some <video> element.
            setRemoteStream(remoteStream);
          });
        },
        (err) => {
          console.error("Failed to get local stream", err);
        }
      );
    });

    document.addEventListener("call", handleCall);
    return () => {
      document.removeEventListener("call", handleCall);
    };
  }, [socket]);

  return <CallAlert />;
}

export default CallSection;
