import "./App.css";
import "./css/styles.css";
import LangPage from "./components/PairsPage";
import About from "./components/About";
import VoiceInputRecorder from "./components/admin/recorder";
import { Routes, Route, Link } from "react-router-dom";

const Home = () => <h1>Home</h1>;

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/learn">Learn</Link>
          </li>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/learn" element={<LangPage />} />
        <Route path="/admin" element={<VoiceInputRecorder />} />
      </Routes>
    </div>
  );
}

export default App;

/*
export default function Story() {
  return <LangPage />;
}*/
