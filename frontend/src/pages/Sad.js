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
  color: #6a3b6a;
  font-size: 32px;
  margin-bottom: 15px;
  font-weight: 700;
  text-align: center;
`;

const Emoji = styled.div`
  font-size: 80px;
  margin: 20px 0;
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
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
  color: #ab1c5a;
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
  background-color: #8c588c;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(140, 88, 140, 0.3);

  &:hover {
    background-color: #6a3b6a;
    transform: translateY(-2px);
  }
`;

const Sad = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <Title>Feeling Sad?</Title>
        <Emoji>😔</Emoji>
        
        <ContentBox>
          <ContentTitle>Here's what might help:</ContentTitle>
          <TipList>
            <TipItem><strong>Listen to Music:</strong> Play your favorite songs or soothing playlists</TipItem>
            <TipItem><strong>Dance It Out:</strong> Put on upbeat music and have a dance party</TipItem>
            <TipItem><strong>Journaling:</strong> Write down your feelings to express and process them</TipItem>
            <TipItem><strong>Cuddle:</strong> Spend time with a pet or hug someone you trust</TipItem>
            <TipItem><strong>Connect with Loved Ones:</strong> Call a friend or family member who uplifts you</TipItem>
            <TipItem><strong>Explore Nature:</strong> Go for a walk in a park or observe the beauty of nature</TipItem>
            <TipItem><strong>Watch Something Uplifting:</strong> Enjoy a comedy or heartwarming movie</TipItem>
            <TipItem><strong>Try Affirmations:</strong> Speak positive words to yourself or use an affirmation app</TipItem>
          </TipList>
        </ContentBox>

        <BackButton onClick={() => navigate('/home')}>Back to Home</BackButton>
      </Container>
    </motion.div>
  );
};

export default Sad;