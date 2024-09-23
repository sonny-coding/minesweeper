import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Minesweeper from "./Minesweeper";
// Example components
const Home = () => <h1>Home Page</h1>;
const About = () => <h1>About Page</h1>;
const Contact = () => <h1>Contact Page</h1>;

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul className="flex gap-3">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/game">Minesweeper</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/game" element={<Minesweeper />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
