import { useState } from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Visualization from "./components/Visualization.jsx";
import Visualization2 from './components/Visualization2.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Visualization />} />
        <Route path="/project" element={<Visualization2 />} />
      </Routes>
    </Router>
  )
}

export default App
