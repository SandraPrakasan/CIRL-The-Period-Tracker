// pages/Home.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc,collection,query,orderBy,limit,getDocs } from 'firebase/firestore';
import {db, auth} from './firebase';
import './Home.css';
import calculateNextPeriodDate from './calculateNextPeriod';
import axios from 'axios';
import { checkActionCode } from 'firebase/auth';

// Define smooth animation variants
const pageVariants = {
  initial: { x: '100vw', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100vw', opacity: 0 },
};

// Smooth 60 FPS transition
const pageTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for smooth motion
  duration: 0.6, // 600ms feels smooth at 60 FPS
};

const MobileViewport = styled.div`height: 100%;`;
const MainContainer = styled(motion.div)`height: 100%; display: flex; flex-direction: column; background-color: #f5ebfb; position: relative; padding: 20px; justify-content: space-between;`;
const ContentArea = styled.div`flex: 1; overflow-y: auto;`;
const Greeting = styled.h2`color: #000000; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; font-family: 'Delm Medium', sans-serif;`;
const CalendarContainer = styled.div`
   margin:auto;
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
const InsightValueForInfo = styled.p`color: ${props => props.purple ? '#8c588c' : '#fff'}; font-size: 24px; text-align: center; white-space: nowrap; margin: 0;`;
const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #8c588c;
  font-family: 'Delm Medium', sans-serif;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 5px;
  border: ${props => props.border ? `2px solid ${props.color}` : 'none'};
  background-color: ${props => props.border ? 'transparent' : props.color};
`;
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

const calculateOvulationDate = (periodDate) => {
  if (!periodDate) return null;
  const ovulationDate = new Date(periodDate);
  ovulationDate.setDate(ovulationDate.getDate() - 14);
  return ovulationDate;
};

const calculateNextMonthDate = (periodDate, cycle) => {
  if (!periodDate || !cycle) return null;
  const nextDate = new Date(periodDate);
  return nextDate;
};


const Home = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || null);
  const [date, setDate] = useState(new Date());
  const [ovulationDate, setOvulationDate] = useState(null);
  const [nextPeriodDate, setNextPeriodDate] = useState(null);
  const [userName, setUserName] = useState(null);
  const [periodStartDate, setPeriodStartDate] = useState(null); // Add this
  const [periodEndDate, setPeriodEndDate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [avgPeriodLength, setAvgPeriodLength] = useState(5);
  const [avgCycleLength, setAvgCycleLength] = useState(28); // Default to 28 days
  const [cycleDay, setCycleDay] = useState(1);
const [latestPeriod, setLatestPeriod]=useState(null);
 useEffect(() => {
     const fetchUserName = async () => {
       const user = auth.currentUser;
       if (!user) return;

       const userDocRef = doc(db, "users", user.email);
       const userDocSnap = await getDoc(userDocRef);

       if (userDocSnap.exists()) {
         setUserName(userDocSnap.data().nickname || "User");
         const nextPeriod = userDocSnap.data().nextPeriod;
         setAvgPeriodLength(userDocSnap.data().avgPeriodLength || 5);
         setAvgCycleLength(userDocSnap.data().avgCycleLength || 28);
         const periodDate = nextPeriod?.toDate ? nextPeriod.toDate() : new Date(nextPeriod || new Date());
         setDate(periodDate);
         setOvulationDate(calculateOvulationDate(periodDate));
         
         const userCycle = userDocSnap.data().avgCycleLength || 28; // Default to 28 if not set
         
         updateCycleDay(periodDate, userCycle);
         // Calculate next period date after cycle is set
         const nextDate = calculateNextMonthDate(periodDate, userCycle);
         if (nextDate) {
           setNextPeriodDate(nextDate);
           
           // Add calendar event for the next period date if we have access token
           // Add a small delay to ensure token is properly set
           if (accessToken) {
             console.log('Access token found, waiting for token propagation...');
             setTimeout(async () => {
               console.log('Attempting to add calendar event for date:', nextDate);
               await addPeriodCalendarEvent(nextDate);
             }, 1000); // 1 second delay
           }
         }
         
         console.log("Next period date set to:", nextDate);
       }
     };
     fetchUserName();
   }, [accessToken, refreshToken]);

   const updateCycleDay = (nextPeriodDate, cycleLength) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextPeriod = new Date(nextPeriodDate);
    nextPeriod.setHours(0, 0, 0, 0);
    
    // Calculate days between today and next period
    const diffTime = nextPeriod - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate current cycle day
    const currentDay = cycleLength - diffDays + 1;
    setCycleDay(currentDay > 0 ? currentDay : 1); // Ensure it doesn't go below 1
  };

  const addPeriodCalendarEvent = async (nextPeriodDate) => {
    if (!accessToken) {
      console.log('No access token available for calendar event creation');
      return;
    }

    if (!nextPeriodDate) {
      console.log('No next period date provided');
      return;
    }

    // Convert nextPeriodDate to Date object if it's not already
    const startDate = nextPeriodDate instanceof Date ? nextPeriodDate : new Date(nextPeriodDate);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // First, check if an event already exists on this date
    const existingEventsResponse = await axios.get('/api/get-calendar-events', {
      params: {
        access_token: localStorage.getItem('access_token'),
        refresh_token: localStorage.getItem('refresh_token'),
      }
    });
    
    const existingEvents = existingEventsResponse.data.events || [];
    
    let eventExists = false;
    if (existingEvents.length > 0) {
      eventExists = existingEvents.some(event => {
        if (!event.start || !event.summary) return false;
        const eventStartDate = new Date(event.start);
        return event.summary === "Next Period Start Date" &&
               eventStartDate.toDateString() === startDate.toDateString();
      });
    }
    
    if (eventExists) {
      console.log('Period calendar event already exists for this date');
      return;
    }

    console.log('Creating new period event for:', startDate.toDateString());

    // Format the date manually to avoid timezone issues
    const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
    const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
    
    // If no existing event, create a new one
    const response = await axios.post('/api/create-event', {
      access_token: localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token'),
      summary: "Next Period Start Date",
      start: {
        date: formattedStartDate
      },
      end: {
        date: formattedEndDate
      }
    });

    if (response.data.event) {
      console.log('Period calendar event created successfully:', response.data.event);
    }
  };

  const isDateInPeriodRange = (tileDate) => {
    if (!date) return false; // date is the nextPeriod date from state
  
    const checkDate = new Date(tileDate);
    checkDate.setHours(0, 0, 0, 0);
  
    const periodStart = new Date(date); // Start from nextPeriod date
    periodStart.setHours(0, 0, 0, 0);
  
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodStart.getDate() + (avgPeriodLength - 1)); // Add period length days
    periodEnd.setHours(0, 0, 0, 0);
  
    return checkDate >= periodStart && checkDate <= periodEnd;
  };
  
  const isDateInFertilityWindow = (date) => {
    if (!ovulationDate) return false;
  
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
  
    const ovulation = new Date(ovulationDate);
    ovulation.setHours(0, 0, 0, 0);
  
    // Calculate 5 days before ovulation and 1 day after
    const fiveDaysBefore = new Date(ovulation);
    fiveDaysBefore.setDate(ovulation.getDate() - 5);
  
    const oneDayAfter = new Date(ovulation);
    oneDayAfter.setDate(ovulation.getDate() + 1);
  
    return checkDate >= fiveDaysBefore && checkDate <= oneDayAfter;
  };

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
                        Your next period will start on {new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(nextPeriodDate)}
                      </p>
                      <Calendar
                        className="calendar"
                        value={date}
                        tileDisabled={() => true}
                        //onChange=
                        locale="en-US"
                        tileClassName={({ date: tileDate, view }) => {
                          if (view !== 'month') return null;

                          const classes = [];

                          // Mark next period date (purple)
                          {/*if (tileDate.toDateString() === date.toDateString()) {
                            classes.push('period-range');
                          }*/}
                            if (isDateInPeriodRange(tileDate)) {
                                  classes.push('period-range');
                              }

                          // Mark fertility window (orange)
                          if (isDateInFertilityWindow(tileDate)) {
                            classes.push('fertility-window');
                          }
                          
                          return classes.join(' ');
                        }}
                      />
                      <LegendContainer>
    <LegendItem>
      <LegendColor color="#8c588c" />
      <span>Period</span>
    </LegendItem>
    <LegendItem>
      <LegendColor color="#ffa500" border />
      <span>Fertile</span>
    </LegendItem>
    <LegendItem>
    </LegendItem>
  </LegendContainer>
                    </CalendarContainer>

          <SectionHeader>Your Daily Insights</SectionHeader>
          <div style={{ width: '100%', height: '2px', backgroundColor: '#8c588c', opacity: 0.6, borderRadius: '1px', marginTop: '5px', marginBottom: '30px' }} />
          <InsightsContainer>
            <InsightCard><InsightLabel>Cycle Day</InsightLabel><InsightValue>{cycleDay}</InsightValue></InsightCard>
            <InsightCard><InsightLabel>Ovulation</InsightLabel><InsightValue>{formatOvulationDate(ovulationDate)}</InsightValue></InsightCard>
            <InsightCard onClick={() => navigate('/moods')} style={{ cursor: 'pointer' }} ><InsightLabel>Moods</InsightLabel><InsightValue>😊😔<br/>😣</InsightValue></InsightCard>
          </InsightsContainer>
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
          <NavIconWrapper> {/*onClick={() => navigate('/women')}>*/}
           {/*{location.pathname === '/women' && <ActiveCircle />}*/}
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