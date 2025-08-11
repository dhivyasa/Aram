import React from "react";
import random from "../utils/random";

export default function Game({ pairs, langA, langB }) {
  const synthRef = React.useRef(window.speechSynthesis);
  const [langAVoices, setLangAVoices] = React.useState([]);
  const [langBVoices, setLangBVoices] = React.useState([]);
  const [langAVoice, setLangAVoice] = React.useState(null);
  const [langBVoice, setLangBVoice] = React.useState(null);
  const [current, setCurrent] = React.useState(null);
  const [langAchoices, setlangAChoices] = React.useState([]);
  const [langBchoices, setlangBChoices] = React.useState([]);
  const [selected, setSelected] = React.useState({});

  React.useEffect(() => {
    setTimeout(() => {
      const voices = synthRef.current
        .getVoices()
        .filter((voice) => !voice.name.includes("Google"))
        .filter((voice) => !voice.name.includes("Kingdom"))
        .filter((voice) => !voice.name.includes("States"));

      const filteredA = voices.filter(
        (voice) => voice.lang.substr(0, 2) === langA.code
      );
      setLangAVoices(filteredA);
      setLangAVoice(random(filteredA));

      const filteredB = voices.filter(
        (voice) => voice.lang.substr(0, 2) === langB.code
      );
      setLangBVoices(filteredB);
      setLangBVoice(random(filteredB));
    }, 100);
  }, []);

  React.useEffect(() => {
    const langAchoices = [];
    const langBchoices = [];
    pairs.forEach((element) => {
      langAchoices.push({ lang: langA.code, value: element[0] });
      langBchoices.push({ lang: langB.code, value: element[1] });
    });

    const langAsorted = langAchoices.sort(() => Math.random() - 0.5);
    const langBsorted = langBchoices.sort(() => Math.random() - 0.9);
    setlangAChoices(langAsorted);
    setlangBChoices(langBsorted);
  }, [pairs]);

  const isMatch = (valueA, valueB) =>
    pairs.some(
      ([choiceA, choiceB]) =>
        (choiceA === valueA && choiceB === valueB) ||
        (choiceA === valueB && choiceB === valueA)
    );

  const correct = () => {
    const words = ["Nice one!", "You did it!", "Impressive"];
    const utterThis = new SpeechSynthesisUtterance(random(words));
    utterThis.rate = 1.5;
    utterThis.volume = 1.0;

    utterThis.onerror = (event) => {
      console.warn("Correct speech error:", event.error);
    };

    setTimeout(() => {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      synthRef.current.speak(utterThis);
    }, 1000);
  };

  const incorrect = () => {
    const words = ["Oops", "Not quite", "Don't give up"];
    const utterThis = new SpeechSynthesisUtterance(random(words));
    utterThis.rate = 1.5;
    utterThis.volume = 1.0;

    utterThis.onerror = (event) => {
      console.warn("Incorrect speech error:", event.error);
    };

    setTimeout(() => {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      synthRef.current.speak(utterThis);
    }, 1000); // Reduced from 3000ms to 1000ms
  };

  const speakTamil = (word) => {
    // find the corresponding audio file for the word and play it
    const audio = new Audio(`audio/${word}.mp3`);

    audio.onerror = (error) => {
      console.warn(
        `Audio file not found or failed to load: audio/${word}.mp3`,
        error
      );
      // Fallback: try to use speech synthesis for Tamil
      const utterThis = new SpeechSynthesisUtterance(word);
      if (langBVoice) {
        utterThis.voice = langBVoice;
      }
      utterThis.lang = "ta-IN";
      utterThis.rate = 0.8;
      utterThis.volume = 1.0;

      setTimeout(() => {
        if (synthRef.current.speaking) {
          synthRef.current.cancel();
        }
        synthRef.current.speak(utterThis);
      }, 100);
    };

    audio.oncanplaythrough = () => {
      audio.play().catch((error) => {
        console.warn("Audio play failed:", error);
      });
    };

    // Set volume and load the audio
    audio.volume = 1.0;
    audio.load();
  };
  const choose = (choice) => {
    if (choice.lang === langA.code) {
      // Stop any ongoing speech before starting new one
      synthRef.current.cancel();

      const utterThis = new SpeechSynthesisUtterance(choice.value);
      utterThis.voice = langAVoice;
      utterThis.rate = 1.0;
      utterThis.volume = 1.0;

      // Add error handling and retry logic
      utterThis.onerror = (event) => {
        console.warn("Speech synthesis error:", event.error);
        // Retry once after a short delay
        setTimeout(() => {
          synthRef.current.cancel();
          synthRef.current.speak(utterThis);
        }, 100);
      };

      utterThis.onstart = () => {
        console.log("Started speaking:", choice.value);
      };

      utterThis.onend = () => {
        console.log("Finished speaking:", choice.value);
      };

      // Small delay to ensure speech synthesis is ready
      setTimeout(() => {
        if (synthRef.current.speaking) {
          synthRef.current.cancel();
        }
        synthRef.current.speak(utterThis);
      }, 50);
    }

    // If langB then get audio file for word
    if (choice.lang === langB.code) {
      speakTamil(choice.value);
    }

    if (current) {
      if (isMatch(current.value, choice.value)) {
        correct();
        setSelected((val) => ({ ...val, [choice.value]: true }));
      } else {
        incorrect();
        setSelected((val) => ({ ...val, [current.value]: false }));
      }
      setCurrent(null);
    } else {
      setSelected((val) => ({ ...val, [choice.value]: true }));
      setCurrent(choice);
    }
  };

  const reset = () => {
    setCurrent(null);
    setSelected({});
  };

  return (
    <>
      <h2>Choose your accent</h2>
      <div className="languages">
        <ul className="voices">
          <li>{langA.name}:</li>
          {langAVoices.map((voice) => (
            <li key={voice.name}>
              <button
                onClick={() => {
                  setLangAVoice(voice);
                }}
                className={
                  langAVoice && langAVoice.name === voice.name ? "selected" : ""
                }
              >
                {voice.name}
              </button>
            </li>
          ))}
        </ul>
        <ul className="voices">
          <li>{langB.name}:</li>
          {langBVoices.map((voice) => (
            <li key={voice.name}>
              <button
                onClick={() => {
                  setLangBVoice(voice);
                }}
                className={
                  langBVoice && langBVoice.name === voice.name ? "selected" : ""
                }
              >
                {voice.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <h2>Choose the pairs</h2>
      <div className="pairs-game">
        <div className="language-section">
          <h3 className="language-title">{langA.name}</h3>
          <div className="choices-container">
            {langAchoices.map((choice, index) => (
              <div
                key={`${choice.lang}-${choice.value}`}
                className="choice-card"
              >
                <button
                  onClick={() => {
                    choose(choice);
                  }}
                  className={`choice-btn ${
                    current && current.value === choice.value ? "selected" : ""
                  } ${selected[choice.value] ? "matched" : ""}`}
                  disabled={!!selected[choice.value]}
                >
                  <div className="choice-number">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="choice-text">{choice.value}</div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="language-section">
          <h3 className="language-title">{langB.name}</h3>
          <div className="choices-container">
            {langBchoices.map((choice, index) => (
              <div
                key={`${choice.lang}-${choice.value}`}
                className="choice-card"
              >
                <button
                  onClick={() => {
                    choose(choice);
                  }}
                  className={`choice-btn ${
                    current && current.value === choice.value ? "selected" : ""
                  } ${selected[choice.value] ? "matched" : ""}`}
                  disabled={!!selected[choice.value]}
                >
                  <div className="choice-number">{index + 1}</div>
                  <div className="choice-text">{choice.value}</div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <br></br>
      <button className="reset" onClick={() => reset()}>
        Oops! Start Over
      </button>
    </>
  );
}
