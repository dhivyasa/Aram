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

  const saveToServer = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    console.log("called saveToServer with formData", formData);
    if (audioURL) {
      debugger;
      var filename = formData.get("audioName") || `recording-${Date.now()}`;
      filename = filename.concat(".wav");

      try {
        console.log("🔄 Starting upload process...");

        // Convert the blob URL back to a blob
        const response = await fetch(audioURL);
        const blob = await response.blob();
        console.log("✅ Audio blob created:", blob.size, "bytes");

        // Create FormData to send to server
        const serverFormData = new FormData();
        serverFormData.append("audio", blob, filename);
        serverFormData.append("audioName", filename);
        console.log("✅ FormData created with filename:", filename);

        // Send to your backend endpoint
        console.log("🚀 Sending to server...");
        const uploadResponse = await fetch(
          "http://localhost:3001/api/upload-audio",
          {
            method: "POST",
            body: serverFormData,
          }
        );

        console.log("📡 Server response status:", uploadResponse.status);

        if (uploadResponse.ok) {
          const result = await uploadResponse.json();
          console.log("✅ Server response:", result);
          alert(`Recording saved successfully! File: ${result.filename}`);
        } else {
          const errorText = await uploadResponse.text();
          console.error("❌ Server error:", uploadResponse.status, errorText);
          alert(`Failed to save recording. Status: ${uploadResponse.status}`);
        }
      } catch (error) {
        console.error("❌ Network error:", error);
        alert(`Network error: ${error.message}`);
      }
    }
  };

  // Test function to check if server is running
  const testServerConnection = async () => {
    try {
      console.log("🔍 Testing server connection...");
      const response = await fetch("http://localhost:3001/api/health");
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Server is running:", data);
        alert("Server connection successful!");
      } else {
        console.error("❌ Server health check failed:", response.status);
        alert("Server is not responding properly");
      }
    } catch (error) {
      console.error("❌ Server connection error:", error);
      alert("Cannot connect to server. Make sure it's running on port 3001");
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={testServerConnection}
          style={{
            marginBottom: "10px",
            backgroundColor: "#2196F3",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔍 Test Server Connection
        </button>
        <br />

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
            <form onSubmit={saveToServer}>
              <label>File Name</label>
              <input
                name="audioName"
                placeholder="தமிழில் பதிவு செய்யுங்கள்"
                lang="ta"
              ></input>
              <button type="submit">save to server</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInputRecorder;
