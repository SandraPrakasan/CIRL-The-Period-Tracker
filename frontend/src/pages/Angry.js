import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Styled Components
const Container = styled.div`
  padding: 25px;
  background-color: #f5ebfb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: #c62828;  // Red tone for angry mood
  font-size: 32px;
  margin-bottom: 15px;
  font-weight: 700;
  text-align: center;
`;

const Emoji = styled.div`
  font-size: 80px;
  margin: 20px 0;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const ContentBox = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 25px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const ContentTitle = styled.h2`
  color: #c62828;
  font-size: 20px;
  margin-bottom: 15px;
  text-align: center;
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
`;

const BackButton = styled.button`
  background-color: #c62828;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(198, 40, 40, 0.3);

  &:hover {
    background-color: #8e0000;
    transform: translateY(-2px);
  }
`;

const Angry = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <Title>Feeling Angry?</Title>
        <Emoji>😠</Emoji>
        
        <ContentBox>
          <ContentTitle>Healthy Ways to Release Anger:</ContentTitle>
          <TipList>
            <TipItem><strong>Physical Activity:</strong> Go for a walk, do yoga, or punch a pillow (constructive release)</TipItem>
            <TipItem><strong>Strength Training:</strong> Lift weights or try push-ups to release tension</TipItem>
            <TipItem><strong>Deep Breathing:</strong> Practice a few minutes of mindful breathing</TipItem>
            <TipItem><strong>Scribble or Doodle:</strong> Let your hand express your emotions on paper</TipItem>
            <TipItem><strong>Engage in Art:</strong> Sketch, paint, or create to channel emotions</TipItem>
            <TipItem><strong>Relaxing Bath:</strong> Take a warm bath with soothing aromatherapy</TipItem>
            <TipItem><strong>Change Your Surroundings:</strong> Step outside or switch rooms to reset</TipItem>
            <TipItem><strong>Distract Your Mind:</strong> Solve a challenging puzzle or brain teaser</TipItem>
          </TipList>
        </ContentBox>

        <BackButton onClick={() => navigate('/home')}>Back to Home</BackButton>
      </Container>
    </motion.div>
  );
};

export default Angry;