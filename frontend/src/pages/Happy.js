import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Define styled components at the top level of the file
const Container = styled.div`
  padding: 20px;
  text-align: center;
  background-color: #f5ebfb;
  height: 100vh;
`;

const Title = styled.h1`
  color: #ab1c5a;
  font-size: 28px;
  margin-bottom: 20px;
`;

const Emoji = styled.div`
  font-size: 60px;
  margin: 20px 0;
`;

const Content = styled.p`
  color: #333;
  font-size: 16px;
  margin-bottom: 30px;
  padding: 0 20px;
`;

const BackButton = styled.button`
  background-color: #8c588c;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
`;

const Happy = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <Title>Happy Mood</Title>
        <Emoji>😊</Emoji>
        <Content>
          You're feeling happy today! That's wonderful. Happiness can boost your energy 
          and overall well-being. Consider journaling about what's making you happy 
          to remember these moments.
        </Content>
        <BackButton onClick={() => navigate('/home')}>Back to Home</BackButton>
      </Container>
    </motion.div>
  );
};

export default Happy;