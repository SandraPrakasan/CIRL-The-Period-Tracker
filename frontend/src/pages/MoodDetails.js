import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import './Home.css';

// Define smooth animation variants
const pageVariants = {
  initial: { x: '100vw', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100vw', opacity: 0 },
};

// Smooth 60 FPS transition
const pageTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: 0.6,
};

const MobileViewport = styled.div`height: 100%;`;
const MainContainer = styled(motion.div)`height: 100%; display: flex; flex-direction: column; background-color: #f5ebfb; position: relative; padding: 20px; justify-content: space-between;`;
const ContentArea = styled.div`flex: 1; overflow-y: auto;`;
const Greeting = styled.h2`color: #000000; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; font-family: 'Delm Medium', sans-serif;`;
const CalendarContainer = styled.div`
  margin: auto;
  margin-top: 3vh;
  background-color: #fff;
  align-self: center;
  height: 42vh;
  width: 70%;
  border-radius: 45px;
  padding: 25px 25px 0 25px;
  margin-bottom: 3vh;
  border: 2px solid #8c588c;
  .react-calendar { position: relative; width: 100%; color: #8c588c; }
  .react-calendar__tile { color: #8c588c; font-weight: bold; padding: 0.5em 0.1em; height: 2.3em; font-size: 0.9em; border: none; border-radius: 50px; background: none !important; }
  .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus, .react-calendar__tile--active { background-color: #8c588c !important; color: white; border-radius: 50px; }
  .react-calendar__month-view__days__day abbr { font-size: 0.9em; }
`;
const SectionHeader = styled.h3`color: ${props => props.purple ? '#8c588c' : '#000000'}; font-size: 18px; font-weight: bold; text-align: center; margin-top: ${props => props.purple ? '0' : '40px'}; margin-bottom: ${props => props.purple ? '10px' : '15px'}; font-family: 'Delm Medium', sans-serif;`;
const InsightsContainer = styled.div`display: flex; justify-content: flex-start; margin-bottom: 30px; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; &::-webkit-scrollbar { height: 8px; } &::-webkit-scrollbar-thumb { background: rgba(140, 88, 140, 0); border-radius: 4px; }`;
const InsightCard = styled.div`font-size: 12px; height: 70px; background-color: #8c588c; border-radius: 25px; padding: 17px; width: 12%; text-align: left; border: 2px solid #8c588c; box-shadow: 0 4px 6px rgba(0,0,0,0.1); flex-shrink: 0; margin-right:auto;`;
const InsightLabel = styled.p`white-space: nowrap; color: #fff; font-weight: bold; margin-bottom: 1px; font-family: 'Delm Medium', sans-serif;`;
const InsightValue = styled.p`color: ${props => props.purple ? '#8c588c' : '#fff'}; font-size: 18px; font-weight: bold; text-align: center; white-space: nowrap;`;
const NavigationBar = styled.div`display: flex; justify-content: space-around; padding: 10px 0; width: 100%;`;
const NavIconWrapper = styled.div`
  position: relative;
  padding: 5px;
  &:hover .nav-icon { filter: brightness(1.2); }
`;
const NavIcon = styled.img`
  width: ${props => props.width || '30px'};
  height: ${props => props.height || '30px'};
  cursor: pointer;
  transition: all 0.3s ease;
`;
const ActiveCircle = styled.div`position: absolute; top: 0; left: 0; width: 40px; height: 40px; background-color: #6a3b6a; border-radius: 50%; z-index: -1;`;

// Mood Card Components
const MoodCard = styled.div`
  width: 389px;
  height: 277px;
  background: #e9c8e6;
  border-radius: 50px 50px 20px 20px;
  position: absolute;
  bottom: 78px;
  left: 50%;
  transform: translateX(-50%);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MoodTitle = styled.h2`
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-weight: 900;
  color: #ab1c5a;
  font-size: 32px;
  text-align: center;
  margin: 8px 0 0;
`;

const EmojiContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 32px;
`;

const EmojiButton = styled.button`
  width: 61px;
  height: 61px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const EmojiImage = styled.img`
  width: 30px;
  height: 30px;
`;

const calculateOvulationDate = (periodDate) => {
  if (!periodDate) return null;
  const ovulationDate = new Date(periodDate);
  ovulationDate.setDate(ovulationDate.getDate() - 14);
  return ovulationDate;
};

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [ovulationDate, setOvulationDate] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Mood emojis with their corresponding routes
  const moodEmojis = [
    { 
      src: process.env.PUBLIC_URL + "/happye.png", 
      alt: "happy", 
      name: "Happy",
      route: "/mood/happy"
    },
    { 
      src: process.env.PUBLIC_URL + "/sade.png", 
      alt: "sad", 
      name: "Sad",
      route: "/mood/sad"
    },
    { 
      src: process.env.PUBLIC_URL + "/angrye.png", 
      alt: "angry", 
      name: "Angry",
      route: "/mood/angry"
    },
    { 
      src: process.env.PUBLIC_URL + "/neutrale.png", 
      alt: "neutral", 
      name: "Neutral",
      route: "/mood/neutral"
    },
  ];

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.email);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserName(userDocSnap.data().nickname || "User");
        const nextPeriod = userDocSnap.data().nextPeriod;
        const periodDate = nextPeriod?.toDate ? nextPeriod.toDate() : new Date(nextPeriod || new Date());
        setDate(periodDate);
        setOvulationDate(calculateOvulationDate(periodDate));
      }
    };
    fetchUserName();
  }, []);

  const formatOvulationDate = (date) => {
    if (!date) return "_";
    return new Intl.DateTimeFormat("en-US", {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const greeting = userName ? `Good Morning, ${userName}!` : "Good Morning!";

  return (
    <MobileViewport>
      <MainContainer
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <ContentArea>
          <Greeting>{greeting}</Greeting>

          <CalendarContainer>
            <SectionHeader purple>PERIOD CALENDAR</SectionHeader>
            <p style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold", color: "#8c588c" }}>
              {new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(date)}
            </p>
            <p style={{ textAlign: "center", fontSize: "16px", color: "#8c588c" }}>
              Your next period will starts on
            </p>
            <Calendar
              className="calendar"
              value={date}
              tileDisabled={() => true}
              locale="en-US"
              tileClassName={({ date: tileDate }) => (tileDate.toDateString() === date.toDateString() ? 'marked' : null)}
            />
          </CalendarContainer>

          <SectionHeader>Your Daily Insights</SectionHeader>
          <div style={{ width: '100%', height: '2px', backgroundColor: '#8c588c', opacity: 0.6, borderRadius: '1px', marginTop: '5px', marginBottom: '30px' }} />
          <InsightsContainer>
            <InsightCard>
              <InsightLabel>Cycle Day</InsightLabel>
              <InsightValue>1</InsightValue>
            </InsightCard>
            <InsightCard>
              <InsightLabel>Ovulation</InsightLabel>
              <InsightValue>{formatOvulationDate(ovulationDate)}</InsightValue>
            </InsightCard>
            <InsightCard>
              <InsightLabel>Symptoms</InsightLabel>
              <InsightValue>😊😔<br/>😣</InsightValue>
            </InsightCard>
          </InsightsContainer>

          {/* Mood Card Section */}
          <MoodCard>
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  opacity: 0.68, 
                  color: 'black', 
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }} 
                onClick={() => navigate('/home')}
              >
                Skip
              </button>
            </div>
            <MoodTitle>LOG YOUR MOOD</MoodTitle>
            <EmojiContainer>
              {moodEmojis.map((emoji, index) => (
                <EmojiButton 
                  key={`emoji-${index}`}
                  onClick={() => navigate(emoji.route)}
                  aria-label={`Log ${emoji.name} mood`}
                >
                  <EmojiImage src={emoji.src} alt={emoji.alt} />
                </EmojiButton>
              ))}
            </EmojiContainer>
          </MoodCard>
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
      </MainContainer>
    </MobileViewport>
  );
};

export default Home;