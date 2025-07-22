import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

// Animation variants
const pageVariants = {
  initial: { x: '100vw', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100vw', opacity: 0 },
};

const pageTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: 0.6,
};

// Styled components
const MobileViewport = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  background-color: #f5ebfb;
`;

const MainContainer = styled(motion.div)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2vh 4vw;
  position: relative;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 2vh;
  -webkit-overflow-scrolling: touch;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  margin: 2vh 0 3vh;

  h2 {
    color: #000000;
    font-size: 5.5vw;
    font-weight: bold;
    margin: 0;
    font-family: 'Delm Medium', sans-serif;
  }
`;

const LogoIcon = styled.div`
  width: 7vw;
  height: 7vw;
  background-color: #8c588c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4vw;
  font-weight: bold;
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5vh;
`;

const NotificationCard = styled(motion.div)`
  background-color: #fff;
  border-radius: 3vw;
  padding: 3vh 4vw;
  box-shadow: 0 0.5vh 1vh rgba(0,0,0,0.08);
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-0.5vh);
    box-shadow: 0 1vh 1.5vh rgba(0,0,0,0.12);
  }
`;

const NotificationTitle = styled.h3`
  color: #8c588c;
  font-size: 4.5vw;
  font-weight: bold;
  margin-bottom: 1.5vh;
  font-family: 'Delm Medium', sans-serif;
  display: flex;
  align-items: center;
  gap: 2vw;
`;

const NotificationPreview = styled.p`
  color: #666;
  font-size: 3.8vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const NotificationMessage = styled.div`
  color: #333;
  font-size: 3.8vw;
  line-height: 1.6;
  margin-top: 1.5vh;
  white-space: pre-line;
`;

const BulletList = styled.ul`
  padding-left: 5vw;
  margin: 1.5vh 0 0;
`;

const BulletItem = styled.li`
  margin-bottom: 1.5vh;
  line-height: 1.5;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: 3vh;
  right: 3vw;
  width: 2.5vw;
  height: 2.5vw;
  background-color: #ff6b6b;
  border-radius: 50%;
`;

const NavigationBar = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1.5vh 0;
  background-color: #f5ebfb;
  width: 100%;
  position: sticky;
  bottom: 0;
  z-index: 10;
  border-top: 1px solid #e0d0e0;
`;

const NavIconWrapper = styled.div`
  position: relative;
  padding: 1vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavIcon = styled.img`
  width: ${props => props.width || '6.5vw'};
  height: ${props => props.height || '6.5vw'};
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ActiveCircle = styled.div`
  position: absolute;
  bottom: 0;
  width: 12vw;
  height: 0.8vh;
  background-color: #6a3b6a;
  border-radius: 1vw;
`;

const UnreadIndicator = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 2.5vw;
  height: 2.5vw;
  background-color: #ff6b6b;
  border-radius: 50%;
`;

// Helper function to format messages with bullet points
const formatMessage = (message) => {
  // Check if message contains bullet-point style content
  if (message.includes(':') || message.includes('.')) {
    const points = message.split(/(?<=[a-z0-9)])(?=[A-Z-])|\.(?=\s*[A-Z-])/).filter(point => point.trim());
    return (
      <BulletList>
        {points.map((point, index) => (
          <BulletItem key={index}>{point.trim().replace(/\.$/, '')}</BulletItem>
        ))}
      </BulletList>
    );
  }
  return message;
};

const Notifications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedNotification, setExpandedNotification] = useState(null);

  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: "What is a Normal Cycle?", 
      message: "A typical menstrual cycle lasts between 21–35 days\nBleeding usually lasts between 2–7 days",
      unread: false 
    },
    { 
      id: 2, 
      title: "Health Tips for a Healthy Cycle", 
      message: "Stay Hydrated: Drink plenty of water to reduce bloating\nBalanced Diet: Consume iron-rich foods (spinach, lentils) to replenish blood loss\nExercise Regularly: Light activities like yoga and walking can help manage cramps\nPain Relief: Use heat therapy (heating pads) and magnesium-rich foods to ease discomfort",
      unread: true 
    },
    { 
      id: 3, 
      title: "What Causes Irregular Periods?", 
      message: "Hormonal Imbalances: Due to stress, poor diet, thyroid disorders\nExcessive Exercise: Or sudden weight changes\nUnderlying Conditions: Like PCOS, PCOD, or thyroid issues", 
      unread: false 
    },
    { 
      id: 4, 
      title: "How to Manage Irregular Periods", 
      message: "Track Your Cycle: Use a period tracking app to monitor patterns\nReduce Stress: Practice meditation, deep breathing, and mindfulness\nBalanced Diet: Avoid excessive sugar and processed foods\nConsult a Doctor: Seek medical advice if irregularities persist", 
      unread: true 
    },
    { 
      id: 5, 
      title: "Common Symptoms", 
      message: "Irregular periods\nWeight gain & difficulty losing weight\nAcne & excessive hair growth (hirsutism)\nFertility issues", 
      unread: false 
    },
    { 
      id: 6, 
      title: "What is PCOD?", 
      message: "PCOD (Polycystic Ovarian Disease)\nA condition where the ovaries produce immature eggs, leading to cyst formation and hormonal imbalances", 
      unread: true 
    },
    { 
      id: 7, 
      title: "How to Manage PCOD?", 
      message: "Diet: Consume a low-carb, high-fiber diet to regulate hormones\nExercise: Engage in cardio & strength training\nManage Stress: Yoga & deep breathing exercises help balance hormones\nMedical Advice: In some cases, doctors may recommend medications to regulate periods", 
      unread: false 
    },
    { 
      id: 8, 
      title: "PCOS (Polycystic Ovary Syndrome)", 
      message: "What is PCOS?\nA more severe form of PCOD, involving high androgen levels, insulin resistance, and chronic ovulation issues", 
      unread: true 
    },
    { 
      id: 9, 
      title: "Symptoms of PCOS", 
      message: "Severe irregular periods\nHair thinning or excessive hair growth\nWeight gain & difficulty managing weight\nInsulin resistance & increased risk of diabetes\nDifficulty conceiving", 
      unread: false 
    },
    { 
      id: 10, 
      title: "How to Manage PCOS?", 
      message: "Lifestyle Changes: A combination of a low-glycemic diet, strength training, and cardio\nMedication: Doctors may prescribe hormonal treatments or insulin-regulating drugs\nWeight Management: Even a 5-10% weight loss can improve symptoms significantly\nRegular Health Checkups: Monitor blood sugar and hormone levels regularly", 
      unread: false 
    },
    { 
      id: 11, 
      title: "Health Tip", 
      message: "Taking care of menstrual health involves:\n- Tracking cycles\n- Maintaining a balanced diet\n- Exercising regularly\n- Reducing stress\n\nIf you experience persistent irregularities, it's essential to seek medical advice. A healthy lifestyle plays a crucial role in managing menstrual disorders like PCOD and PCOS effectively.", 
      unread: false 
    },
  ]);

  const hasUnread = notifications.some(n => n.unread);

  const handleCardClick = (notification) => {
    setExpandedNotification(expandedNotification === notification.id ? null : notification.id);
    if (notification.unread) {
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, unread: false } : n
      ));
    }
  };

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
          <NotificationHeader>
            <LogoIcon>P</LogoIcon>
            <h2>Periods & Mood</h2>
          </NotificationHeader>
          
          <NotificationList>
            {notifications.map(notification => (
              <NotificationCard 
                key={notification.id} 
                onClick={() => handleCardClick(notification)}
                layout
                transition={{ duration: 0.3 }}
              >
                <NotificationTitle>
                  {notification.title}
                  {notification.unread && <UnreadDot />}
                </NotificationTitle>
                
                {expandedNotification === notification.id ? (
                  <NotificationMessage>
                    {formatMessage(notification.message)}
                  </NotificationMessage>
                ) : (
                  <NotificationPreview>
                    {notification.message.split('\n')[0].substring(0, 50)}...
                  </NotificationPreview>
                )}
              </NotificationCard>
            ))}
          </NotificationList>
        </ContentArea>

        <NavigationBar>
          <NavIconWrapper onClick={() => navigate('/home')}>
            <NavIcon src={process.env.PUBLIC_URL + '/home.png'} alt="Home" />
            {location.pathname === '/home' && <ActiveCircle />}
          </NavIconWrapper>
          
          <NavIconWrapper onClick={() => navigate('/notifications')}>
            <NavIcon src={process.env.PUBLIC_URL + '/bell.png'} alt="Notifications" />
            {location.pathname === '/notifications' && <ActiveCircle />}
            {hasUnread && <UnreadIndicator />}
          </NavIconWrapper>
          
          <NavIconWrapper>
            <NavIcon 
              src={process.env.PUBLIC_URL + '/women.png'} 
              alt="Women" 
              width="5vw" 
              height="8vw" 
            />
          </NavIconWrapper>
          
          <NavIconWrapper onClick={() => navigate('/profile')}>
            <NavIcon src={process.env.PUBLIC_URL + '/profile.png'} alt="Profile" />
            {location.pathname === '/profile' && <ActiveCircle />}
          </NavIconWrapper>
          
          <NavIconWrapper onClick={() => navigate('/settings')}>
            <NavIcon src={process.env.PUBLIC_URL + '/settings.png'} alt="Settings" />
            {location.pathname === '/settings' && <ActiveCircle />}
          </NavIconWrapper>
        </NavigationBar>
      </MainContainer>
    </MobileViewport>
  );
};

export default Notifications;