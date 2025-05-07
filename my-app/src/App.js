import "./App.css";
import "./css/styles.css";
import LangPage from "./components/PairsPage";

export default function Story() {
  return <LangPage />;
}

/*function Sentence() {
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
}*/
