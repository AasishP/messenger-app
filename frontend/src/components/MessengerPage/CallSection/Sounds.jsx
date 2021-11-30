import React, { useEffect, useRef } from "react";
function Sounds({ callState }) {
  const audioRef = useRef();
  useEffect(() => {
    audioRef.current.play();
    return () => {};
  }, [callState]);
  return (
    <audio
      ref={audioRef}
      src={`../../../assets/sounds/${callState}.mp3`}
      autoPlay
      loop
    />
  );
}

export default Sounds;
