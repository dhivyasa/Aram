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

  /*
  0. Add table
  1. Split the table into two columns
  2. Accent in tamil

  */

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
    setTimeout(() => {
      synthRef.current.speak(utterThis);
    }, 1000);
  };

  const incorrect = () => {
    const words = ["Next time", "Oops", "Not quite", "Don't give up"];
    const utterThis = new SpeechSynthesisUtterance(random(words));
    utterThis.rate = 1.5;
    setTimeout(() => {
      synthRef.current.speak(utterThis);
    }, 1000);
  };

  const speakTamil = (word) => {
    // find the corresponding audio file for the word
    // and play it
    const audio = new Audio(`audio/${word}.mp3`);
    audio.play();
  };
  const choose = (choice) => {
    if (choice.lang === langA.code) {
      const utterThis = new SpeechSynthesisUtterance(choice.value);
      utterThis.voice = langAVoice;
      synthRef.current.speak(utterThis);
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
      <table>
        <thead>
          <tr>
            <th>{langA.name}</th>
            <th>{langB.name}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td key="langA">
              {langAchoices.map((choice) => (
                <button
                  key={`${choice.lang}-${choice.value}`}
                  onClick={() => {
                    choose(choice);
                  }}
                  className={
                    current && current.value === choice.value ? "selected" : ""
                  }
                  disabled={!!selected[choice.value]}
                >
                  {choice.value}{" "}
                </button>
              ))}
            </td>
            <td key="langB">
              {langBchoices.map((choice) => (
                <button
                  key={`${choice.lang}-${choice.value}`}
                  onClick={() => {
                    choose(choice);
                  }}
                  className={
                    current && current.value === choice.value ? "selected" : ""
                  }
                  disabled={!!selected[choice.value]}
                >
                  {choice.value}
                </button>
              ))}
            </td>
          </tr>
        </tbody>
      </table>

      <button className="reset" onClick={() => reset()}>
        reset
      </button>
    </>
  );
}
