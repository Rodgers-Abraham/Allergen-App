import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import Home from './components/Dashboard/Home';
import UserProfile from './components/Profile/UserProfile';
import CameraView from './components/Scanner/CameraView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/scan" element={<CameraView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
