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
  color: #5d4037;  // Earthy brown tone for neutral mood
  font-size: 32px;
  margin-bottom: 15px;
  font-weight: 700;
  text-align: center;
`;

const Emoji = styled.div`
  font-size: 80px;
  margin: 20px 0;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
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
  color: #5d4037;
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
  position: relative;
  padding-left: 25px;

  &:before {
    content: "•";
    color: #8d6e63;
    font-size: 20px;
    position: absolute;
    left: 0;
    top: -2px;
  }
`;

const BackButton = styled.button`
  background-color: #8d6e63;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(141, 110, 99, 0.3);

  &:hover {
    background-color: #6d4c41;
    transform: translateY(-2px);
  }
`;

const Neutral = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <Title>Feeling Bored?</Title>
        <Emoji>😐</Emoji>
        
        <ContentBox>
          <ContentTitle>Ideas to Spark Your Interest:</ContentTitle>
          <TipList>
            <TipItem><strong>Learn Something New:</strong> Try a quick tutorial or explore an interesting topic</TipItem>
            <TipItem><strong>Write a Short Story:</strong> Get creative and invent a new story</TipItem>
            <TipItem><strong>Explore Your Hobbies:</strong> Cook, read, garden, or any activity that sparks joy</TipItem>
            <TipItem><strong>Redecorate a Corner:</strong> Organize or personalize your space</TipItem>
            <TipItem><strong>Play a Game:</strong> Engage in puzzles, video games, or anything fun</TipItem>
            <TipItem><strong>Attend a Virtual Event:</strong> Join a workshop, concert, or webinar online</TipItem>
            <TipItem><strong>Plan Something Exciting:</strong> Create a bucket list or plan an outing</TipItem>
            <TipItem><strong>Try a Recipe:</strong> Cook or bake something you've never tried before</TipItem>
          </TipList>
        </ContentBox>

        <BackButton onClick={() => navigate('/home')}>Back to Home</BackButton>
      </Container>
    </motion.div>
  );
};

export default Neutral;