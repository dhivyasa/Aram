import { useEffect, useState, useRef } from "react";

const VoiceInputRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [stream, setStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: false, // or { video: { facingMode: 'user' } } for front camera
        audio: true, // set to false if you only want video
      })
      .then((mediaStream) => {
        // Use the stream (e.g., attach it to a video element)
        console.log("Got MediaStream:", mediaStream);
        setStream(mediaStream);

        const mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/wav" });
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
          chunksRef.current = [];
        };
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "inactive"
    ) {
      chunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started");
    }
  };

  const stopRecording = () => {
    // set the media reorder state to stop recording
    // save the data recorded
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped");
    }
  };

  const clearRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL("");
    }
  };

  return (
    <div>
      <div>
        <button onClick={startRecording} disabled={isRecording || !stream}>
          {isRecording ? "Recording.." : "StartRecording"}
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          {" "}
          Stop Recording
        </button>

        <button onClick={clearRecording} disabled={!audioURL}>
          Clear Recording
        </button>
        {audioURL && (
          <div>
            <h3>Recorded Audio</h3>
            <audio controls src={audioURL}></audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInputRecorder;
