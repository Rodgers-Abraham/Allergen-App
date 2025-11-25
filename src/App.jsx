// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import ForgotPassword from './components/Auth/ForgotPassword';
import Home from './components/Dashboard/Home';
import UserProfile from './components/Profile/UserProfile';
import CameraView from './components/Scanner/CameraView';
import HeroGame from './components/Gamification/HeroGame';
import './index.css';
import AppLayout from './components/Layout/AppLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          {/* <Route path="/" element={<div>APP LAYOUT WORKING</div>} /> */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/scan" element={<CameraView />} />
          <Route path="/game" element={<HeroGame />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
