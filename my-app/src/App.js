import "./App.css";
import { useState } from "react";

export default function Story() {
  return (
    <>
      <div className="square">
        <Sentence/>
        <Sentence/>
      </div>
    </>
  );
}
const Originalvalue="En Peru Arya"

function Sentence() {
  const [value, setValue] = useState(Originalvalue);
  function handleClick() {
    setValue("My name is Arya");
    console.log("clicked!");
  }
  return (
    <button onClick={handleClick} className="square">
      {value}
    </button>
  );
}
