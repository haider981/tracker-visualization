import './index.css'
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const Visualization = lazy(() => import('./components/Visualization.jsx'));
const Visualization2 = lazy(() => import('./components/Visualization2.jsx'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4" />
        <p className="text-white text-lg">Loading…</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Visualization />} />
          <Route path="/night" element={<Visualization />} />
          <Route path="/books" element={<Visualization />} />
          <Route path="/project" element={<Visualization2 />} />
          <Route path="/project/night" element={<Visualization2 />} />
          <Route path="/project/books" element={<Visualization2 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
