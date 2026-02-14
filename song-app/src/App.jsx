import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoodSelect from "./Pages/MoodSelect";
import SongList from "./Pages/SongList";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoodSelect />} />
        <Route path="/mood/:mood" element={<SongList />} />
      </Routes>
    </Router>
  );
}
