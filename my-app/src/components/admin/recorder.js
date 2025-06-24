import React, { useState } from 'react';

const VoiceInputRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setRecording(true);
    };

    recognition.onresult = (event) => {
      const word = event.results[0][0].transcript;
      setTranscript(word);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognition.start();
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        {recording ? 'Listening...' : 'Start Recording'}
      </button>
      {transcript && <p>Recorded Word: {transcript}</p>}
    </div>
  );
};

export default VoiceInputRecorder;
