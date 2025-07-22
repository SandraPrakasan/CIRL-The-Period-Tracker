import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const NavigationBar = styled.div`
display: flex;
justify-content: space-around;
padding: 10px 0;
width: 100%;
position: fixed;
bottom: 0;
left:0;
z-index: 100;
box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
background-color: #f5ebfb;
`;

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

// Styled Components
const Container = styled.div`
  padding: 25px;
  background-color: #f5ebfb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y:auto;
  position: relative;
  height: 100vh;
  padding-bottom: 80px;
`;

const MoodsContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding-bottom: 20px; // Add space at bottom
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 15px;
  font-weight: 700;
  text-align: center;
  color: ${props => props.color || '#6a3b6a'};
`;

const Emoji = styled.div`
  font-size: 80px;
  margin: 20px 0;
  display:flex;
  justify-content: center;
  animation: ${props => {
    if (props.mood === 'happy') return 'bounce 2s infinite';
    if (props.mood === 'angry') return 'pulse 1.5s infinite';
    if (props.mood === 'neutral') return 'float 3s ease-in-out infinite';
    if (props.mood === 'sad') return 'bounce 2s infinite'
    return 'none';
  }};
`;

const ContentBox = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 25px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 30px;
  border-top: 5px solid ${props => props.color || '#6a3b6a'};
  position:relative;
`;

const ContentTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  text-align: center;
  color: ${props => props.color || '#6a3b6a'};
`;

const TipList = styled.ul`
  text-align: left;
  padding-left: 20px;
  margin: 0;
`;

const TipItem = styled.li`
  color: #5a5a5a;
  font-size: 16px;
  margin-bottom: 12px;
  line-height: 1.5;
  position: relative;
  padding-left: 25px;
list-style-type: none;

  &:before {
    content: "•";
    font-size: 20px;
    position: absolute;
    left: 0;
    top: -2px;
    color: ${props => props.color || '#6a3b6a'};
  }
`;

const BackButton = styled.button`
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  background-color: #8c588c;
position: sticky;
  bottom: 105px;
  margin-top: auto; /* Pushes it to bottom */
  z-index: 10;

  &:hover {
    transform: translateY(-2px);
    background-color: #6a3b6a;
  }
`;

// Mood content data
const moodData = [
  {
    id: 'happy',
    title: 'Happy Mood',
    emoji: '😊',
    color: '#ab1c5a',
    subtitle: 'Keep the Good Vibes Going:',
    tips: [
      <><strong>Share Your Joy:</strong> Tell someone about what's making you happy</>,
      <><strong>Practice Gratitude:</strong> List things you're thankful for</>,
      <><strong>Spread Kindness:</strong> Do something nice for someone else</>,
      <><strong>Capture the Moment:</strong> Take photos or write about this feeling</>,
      <><strong>Try Something Creative:</strong> Express your happiness through art</>
    ]
  },
  {
    id: 'sad',
    title: 'Feeling Sad?',
    emoji: '😔',
    color: '#6a3b6a',
    subtitle: "Here's what might help:",
    tips: [
      <><strong>Listen to Music:</strong> Play your favorite songs or soothing playlists</>,
      <><strong>Dance It Out:</strong> Put on upbeat music and have a dance party</>,
      <><strong>Journaling:</strong> Write down your feelings to express and process them</>,
      <><strong>Cuddle:</strong> Spend time with a pet or hug someone you trust</>,
      <><strong>Connect with Loved Ones:</strong> Call a friend or family member who uplifts you</>
    ]
  },
  {
    id: 'angry',
    title: 'Feeling Angry?',
    emoji: '😠',
    color: '#c62828',
    subtitle: 'Healthy Ways to Release Anger:',
    tips: [
      <><strong>Physical Activity:</strong> Go for a walk, do yoga, or punch a pillow</>,
      <><strong>Deep Breathing:</strong> Practice a few minutes of mindful breathing</>,
      <><strong>Scribble or Doodle:</strong> Let your hand express your emotions</>,
      <><strong>Change Your Surroundings:</strong> Step outside or switch rooms</>,
      <><strong>Distract Your Mind:</strong> Solve a challenging puzzle</>
    ]
  },
  {
    id: 'neutral',
    title: 'Feeling Bored?',
    emoji: '😐',
    color: '#5d4037',
    subtitle: 'Ideas to Spark Your Interest:',
    tips: [
      <><strong>Learn Something New:</strong> Try a quick tutorial</>,
      <><strong>Write a Short Story:</strong> Get creative</>,
      <><strong>Explore Your Hobbies:</strong> Cook, read, garden</>,
      <><strong>Redecorate a Corner:</strong> Personalize your space</>,
      <><strong>Play a Game:</strong> Engage in puzzles or video games</>
    ]
  }
];

// Global styles for animations
const GlobalStyle = styled.div`
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

const Moods = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <GlobalStyle />
        <Title>All Mood Suggestions</Title>
    <MoodsContent>
        {moodData.map((mood) => (
          <ContentBox key={mood.id} color={mood.color}>
            <Title color={mood.color}>{mood.title}</Title>
            <Emoji mood={mood.id}>{mood.emoji}</Emoji>
            <ContentTitle color={mood.color}>{mood.subtitle}</ContentTitle>
            <TipList>
              {mood.tips.map((tip, index) => (
                <TipItem key={index} color={mood.color}>{tip}</TipItem>
              ))}
            </TipList>
          </ContentBox>
        ))}
</MoodsContent>
        <BackButton onClick={() => navigate('/home')}>
          Back to Home
        </BackButton>

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

      </Container>
    </motion.div>
  );
};

export default Moods;