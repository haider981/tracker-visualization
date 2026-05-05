import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Visualization from "./components/Visualization.jsx";
import Visualization2 from './components/Visualization2.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Visualization />} />
        <Route path="/night" element={<Visualization />} />
        <Route path="/books" element={<Visualization />} />
        <Route path="/project" element={<Visualization2 />} />
        <Route path="/project/night" element={<Visualization2 />} />
        <Route path="/project/books" element={<Visualization2 />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
