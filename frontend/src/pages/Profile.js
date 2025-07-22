import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
//import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ContentArea, PhotoFrame, ProfilePhoto, NavIconWrapper, NavIcon, ActiveCircle, StyledButton,  ButtonText, CalendarItem, CalendarItemTitle, CalendarItemContent, CalendarItemDate, CalendarItemDateText } from '../components/ProfileComponents';
import { db, storage, auth } from './firebase';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

// Styled Components
const NavigationBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  width: 100%;
  z-index: 100;
  background-color: #f5ebfb;
`;

const ProfileContainer = styled(motion.div)`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5ebfb;
  height: calc(100vh - 60px); // Subtract nav bar height
  padding-bottom: 80px; // Extra space at bottom
  overflow-y: auto;
  position: relative;
  -webkit-overflow-scrolling:
`;

const ContentWrapper = styled.div`
  padding-bottom: 40px; // Adds space at the bottom
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;
  position: sticky;
  top: 0;
  background-color: #f5ebfb;
  padding: 10px 0;
  z-index: 1;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #8c588c;
`;

const Title = styled.h1`
  color: #8c588c;
  font-size: 24px;
  margin: 0;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserName = styled.h2`
  color: #333;
  font-size: 22px;
  margin: 0 0 5px 0;
`;

const UserEmail = styled.p`
  color: #888;
  font-size: 14px;
  margin: 0 0 20px 0;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 20px 0;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #8c588c;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
`;

const SectionTitle = styled.h3`
  color: #8c588c;
  font-size: 18px;
  margin: 25px 0 15px 0;
  padding-left: 10px;
`;

const MenuItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    transform: translateX(5px);
  }
`;

const MenuItemLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MenuItemIcon = styled.div`
  color: #8c588c;
  font-size: 20px;
`;

const MenuItemText = styled.span`
  color: #333;
  font-size: 16px;
`;

const ChevronIcon = styled.span`
  color: #ccc;
  font-size: 18px;
`;

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || null);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [user, setUser] = useState({
      name: '',
      email: '',
      avatar: null,
      cyclesTracked: 0,
      symptomsLogged: 0,
      streak: 0,
      avgCycleLength:28,
      cycleLength: 28,
      periodLength: 5,
      loading: true,
      error: null
    });

useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate('/login');
          return;
        }

        const userDocRef = doc(db, "users", currentUser.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({
                      name: userData.nickname || 'User',
                      email: currentUser.email,
                      avatar: currentUser.photoURL || null,
                      cyclesTracked: userData.cyclesCount || 0,
                      symptomsLogged: userData.symptoms || 0,
                      streak: userData.streak || 0,
                      cycleLength: userData.avgCycleLength || 28,
                      periodLength: userData.periodLength || 5,
                      loading: false,
                      avgCycleLength:userData.avgCycleLength
                    });
                     } else {
                              // Create user document if it doesn't exist
                              await updateDoc(userDocRef, {
                                nickname: currentUser.nickname || 'User',
                                email: currentUser.email,
                                cyclesTracked: 0,
                                symptomsLogged: 0,
                                streak: 0,
                                avgCycleLength: 28,
                                periodLength: 5,
                                createdAt: new Date()
                              });
                               setUser(prev => ({ ...prev, loading: false }));
                                      }
                                    } catch (err) {
                                      setUser(prev => ({
                                        ...prev,
                                        loading: false,
                                        error: err.message
                                      }));
                                    }
                                  };

                                  fetchUserData();
                                }, [navigate]);
                                
                                const login = useGoogleLogin({
                                  onSuccess: async (codeResponse) => {
                                    try {
                                      console.log('Google OAuth response:', codeResponse);
                                      // Exchange the code for tokens
                                      const response = await axios.post('/api/create-tokens', {
                                        code: codeResponse.code
                                      });
                              
                                      const { access_token, refresh_token, expiry_date } = response.data;
                                      
                                      setAccessToken(access_token);
                                      setRefreshToken(refresh_token);
                                      setTokenExpiry(expiry_date);
                                      // set the access token to the local storage
                                      localStorage.setItem('access_token', access_token);
                                      localStorage.setItem('refresh_token', refresh_token);
                                      localStorage.setItem('token_expiry', expiry_date);
                                      
                                      console.log('Login successful, tokens received');
                                    } catch (error) {
                                      console.error('Error exchanging code for tokens:', error.response?.data || error);
                                    }
                                  },
                                  onError: (error) => console.error('Login Failed:', error),
                                  flow: 'auth-code',
                                  scope: 'openid email profile https://www.googleapis.com/auth/calendar',
                                  redirect_uri: 'http://localhost:3000'
                                });
                              
                                const handleCalendarEvents = async () => {
                                  try {
                                    if (!accessToken) {
                                      console.error('No access token available');
                                      return;
                                    }
                              
                                    const response = await axios.get('/api/get-calendar-events', {
                                      params: { 
                                        access_token: localStorage.getItem('access_token'),
                                        refresh_token: localStorage.getItem('refresh_token')
                                      }
                                    });
                              
                                    console.log('Calendar events:', response.data.events);
                                    setCalendarEvents(response.data.events);
                                  } catch (error) {
                                    console.error('Calendar events error:', error.response?.data || error.message);
                                  }
                                };
                               
  return (
  <>
    <ProfileContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
    <ContentWrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <Title>My Profile</Title>
      </Header>

      <ProfileCard>
      <PhotoFrame>
        <ProfilePhoto src={ process.env.PUBLIC_URL + '/happy.png'} alt="Profile" />
      </PhotoFrame>
        <UserName>{user.name}</UserName>
        <UserEmail>{user.email}</UserEmail>
        
        <StatsContainer>
          <StatItem>
            <StatValue>{user.cyclesTracked}</StatValue>
            <StatLabel>Cycles</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{user.avgCycleLength}</StatValue>
            <StatLabel>Average Cycle Length</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{user.streak}</StatValue>
            <StatLabel>Day Streak</StatLabel>
          </StatItem>
        </StatsContainer>
        {!accessToken && (
            <StyledButton onClick={() => login()}>
              <ButtonText>Login with Google Calendar</ButtonText>
            </StyledButton>
          )}
          
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              {accessToken && (
                <StyledButton onClick={handleCalendarEvents}>
                  <ButtonText>Get Calendar Events</ButtonText>
                </StyledButton>
              )}
            </div>

          <ContentArea>
            {calendarEvents.length > 0 && (
              <CalendarItem>
                <CalendarItemTitle>Upcoming Events</CalendarItemTitle>
                {calendarEvents.map(event => (
                  <CalendarItemContent key={event.id}>
                    <CalendarItemDate>
                      <CalendarItemDateText>
                        {new Date(event.start).toLocaleDateString()} - {event.summary}
                      </CalendarItemDateText>
                    </CalendarItemDate>
                  </CalendarItemContent>
                ))}
              </CalendarItem>
            )}
          </ContentArea>
      </ProfileCard>

      <SectionTitle>Account Settings</SectionTitle>
      
      <MenuItem onClick={() => navigate('/edit-profile')}>
        <MenuItemLabel>
          <MenuItemIcon>👤</MenuItemIcon>
          <MenuItemText>Edit Profile</MenuItemText>
        </MenuItemLabel>
        <ChevronIcon>›</ChevronIcon>
      </MenuItem>
      
      <MenuItem onClick={() => navigate('/privacy')}>
        <MenuItemLabel>
          <MenuItemIcon>🔒</MenuItemIcon>
          <MenuItemText>Privacy Settings</MenuItemText>
        </MenuItemLabel>
        <ChevronIcon>›</ChevronIcon>
      </MenuItem>
      
      <MenuItem onClick={() => navigate('/notifications')}>
        <MenuItemLabel>
          <MenuItemIcon>🔔</MenuItemIcon>
          <MenuItemText>Notification Preferences</MenuItemText>
        </MenuItemLabel>
        <ChevronIcon>›</ChevronIcon>
      </MenuItem>

      <SectionTitle>Support</SectionTitle>
      
      <MenuItem onClick={() => navigate('/help')}>
        <MenuItemLabel>
          <MenuItemIcon>❓</MenuItemIcon>
          <MenuItemText>Help Center</MenuItemText>
        </MenuItemLabel>
        <ChevronIcon>›</ChevronIcon>
      </MenuItem>
      
      <MenuItem onClick={() => navigate('/contact')}>
        <MenuItemLabel>
          <MenuItemIcon>✉️</MenuItemIcon>
          <MenuItemText>Contact Us</MenuItemText>
        </MenuItemLabel>
        <ChevronIcon>›</ChevronIcon>
      </MenuItem>
      
      <MenuItem onClick={() => navigate('/about')}>
        <MenuItemLabel>
          <MenuItemIcon>ℹ️</MenuItemIcon>
          <MenuItemText>About the App</MenuItemText>
        </MenuItemLabel>
        <ChevronIcon>›</ChevronIcon>
      </MenuItem>
      </ContentWrapper>
    </ProfileContainer>
    {!accessToken && (
            <StyledButton onClick={() => login()}>
              <ButtonText>Login with Google Calendar</ButtonText>
            </StyledButton>
          )}
          
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              {accessToken && (
                <StyledButton onClick={handleCalendarEvents}>
                  <ButtonText>Get Calendar Events</ButtonText>
                </StyledButton>
              )}
            </div>

          <ContentArea>
            {calendarEvents.length > 0 && (
              <CalendarItem>
                <CalendarItemTitle>Upcoming Events</CalendarItemTitle>
                {calendarEvents.map(event => (
                  <CalendarItemContent key={event.id}>
                    <CalendarItemDate>
                      <CalendarItemDateText>
                        {new Date(event.start).toLocaleDateString()} - {event.summary}
                      </CalendarItemDateText>
                    </CalendarItemDate>
                  </CalendarItemContent>
                ))}
              </CalendarItem>
            )}
          </ContentArea>
     <NavigationBar>
              <NavIconWrapper onClick={() => navigate('/home')}>
                {location.pathname === '/home' && <ActiveCircle />}
                <NavIcon className="nav-icon" src={process.env.PUBLIC_URL + '/home.png'} alt="Home" />
              </NavIconWrapper>
              <NavIconWrapper onClick={() => navigate('/notifications')}>
                {location.pathname === '/notifications' && <ActiveCircle />}
                <NavIcon className="nav-icon" src={process.env.PUBLIC_URL + '/bell.png'} alt="Notifications" />
              </NavIconWrapper>
              <NavIconWrapper> 
                <NavIcon className="nav-icon" src={process.env.PUBLIC_URL + '/women.png'} alt="Women" width="20px" height="40px" />
              </NavIconWrapper>
              <NavIconWrapper onClick={() => navigate('/profile')}>
                {location.pathname === '/profile' && <ActiveCircle />}
                <NavIcon className="nav-icon" src={process.env.PUBLIC_URL + '/profile.png'} alt="Profile" />
              </NavIconWrapper>
              <NavIconWrapper onClick={() => navigate('/settings')}>
                {location.pathname === '/settings' && <ActiveCircle />}
                <NavIcon className="nav-icon" src={process.env.PUBLIC_URL + '/settings.png'} alt="Settings" />
              </NavIconWrapper>
            </NavigationBar>
           </>
  );
};

export default Profile;