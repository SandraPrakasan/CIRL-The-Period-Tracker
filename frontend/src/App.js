// App.js
//import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import PeriodDates from "./pages/PeriodDates"; // Adjust path if needed
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import SignUp2 from './pages/SignUp2';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Front from './pages/Front';
import Landing from './pages/Landing';
import Moods from './pages/Moods';
import MoodDetails from './pages/MoodDetails';
import Happy from './pages/Happy';
import Sad from './pages/Sad';
import Angry from './pages/Angry';
import Neutral from './pages/Neutral';
import styled from 'styled-components';
import EditProfile from './pages/EditProfile';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
console.log("Google Client ID:", clientId); 

const NavbarWrapper = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  z-index: 1000;
`;

const ContentWrapper = styled.div`
  position: relative;
  height: calc(100% - 60px); // Adjust based on navbar height
`;

function App() {
  return (
    <Router>
      <div className="mobile-viewport">
        <AppContent />
      </div>
    </Router>
  );
}

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      <ContentWrapper>
        <GoogleOAuthProvider clientId={clientId}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/front" element={<Front />} />
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/period-dates" element={<PeriodDates />} />
              <Route path="/mood-details" element={<MoodDetails/>} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/signup2" element={<SignUp2 />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/home" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path='/moods' element={<Moods/>} />
            <Route path="/mood/happy" element={<Happy />} />
            <Route path="/mood/sad" element={<Sad />} />
            <Route path="/mood/angry" element={<Angry />} />
            <Route path="/mood/neutral" element={<Neutral />} />
            </Routes>
          </AnimatePresence>
        </GoogleOAuthProvider>
      </ContentWrapper>
      <NavbarWrapper>
        {/* Navbar will be part of each page component */}
      </NavbarWrapper>
    </>
  );
};

export default App;