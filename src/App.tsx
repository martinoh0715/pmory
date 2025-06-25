import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Homepage from './pages/Homepage';
import WhatIsPM from './pages/WhatIsPM';
import SkillsetHub from './pages/SkillsetHub';
import Mentorship from './pages/Mentorship';
import JobAlert from './pages/JobAlert';
import About from './pages/About';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/what-is-pm" element={<WhatIsPM />} />
            <Route path="/skillset-hub" element={<SkillsetHub />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/job-alert" element={<JobAlert />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;