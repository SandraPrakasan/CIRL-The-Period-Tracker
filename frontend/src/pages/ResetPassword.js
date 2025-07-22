import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Styled components
const Container = styled(motion.div)`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px;
`;

const Notification = styled(motion.div)`
  position: absolute;
  top: 15px;
  width: 90%;
  max-width: 400px;
  padding: 12px;
  border-radius: 50px;
  background-color: ${props => props.isSuccess ? '#05c880' : '#ff4d4d'};
  color: white;
  text-align: center;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  left: 50%;
  transform: translateX(-50%);
`;

const PageTitle = styled.h2`
  color: #8c588c;
  margin-bottom: 24px;
  text-align: center;
  font-family: 'Delm Medium', sans-serif;
  font-size: 28px;
  font-weight: bolder;
`;

const ProfileImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  background: #8c588c;
  border-radius: 50%;
`;

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  flex: 1;
`;

const InputLabel = styled.p`
  color: #8c588c;
  text-align: left;
  font-weight: bold;
  margin-bottom: 12px;
  margin-left: 5px;
  font-size: 16px;
`;

const Input = styled.input`
  border-radius: 50px;
  font-weight: bold;
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 2px solid #8c588c;
  background: #f5ebf6;
  font-size: 16px;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(140, 88, 140, 0.3);
  }
`;

const Divider = styled.hr`
  width: 100%;
  margin: 24px 0px;
  border: 0;
  border-top: 1px solid #e0e0e0;
`;

const Button = styled.button`
  background: #8c588c;
  color: white;
  border-radius: 50px;
  padding: 15px;
  border: none;
  margin-top: 20px;
  font-weight: bold;
  cursor: pointer;
  width: 80%;
  max-width: 300px;
  margin: 0 auto;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #774777;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    isSuccess: false
  });

  const showNotification = (message, isSuccess) => {
    setNotification({ show: true, message, isSuccess });
    setTimeout(() => {
      setNotification({ show: false, message: '', isSuccess: false });
    }, 3000);
  };

  const handleResetPassword = () => {
    if (!password || !confirmPassword) {
      showNotification('Please fill in all fields', false);
      return;
    }
    if (password !== confirmPassword) {
      showNotification('Passwords do not match', false);
      return;
    }
    // In a real app, here you would call an API to reset the password
    showNotification('Password reset successful ✓', true);
    // Optionally redirect to another page after success
    // useNavigate() could be used here if needed
  };

  return (
    <Container 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {notification.show && (
        <Notification 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          isSuccess={notification.isSuccess}
        >
          {notification.message}
        </Notification>
      )}

      <PageTitle>Reset Password</PageTitle>

      <ProfileImageContainer>
        <ProfileImage 
          src="/happy.png"
          alt="Woman"
        />
      </ProfileImageContainer>

      <FormContainer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <InputLabel>Enter New Password</InputLabel>
        <Input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <InputLabel>Confirm New Password</InputLabel>
        <Input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Divider />
        
        <Button onClick={handleResetPassword}>
          Reset Password
        </Button>
      </FormContainer>
    </Container>
  );
};

export default ResetPassword;