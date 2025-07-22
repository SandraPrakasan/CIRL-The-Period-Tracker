import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import styled from "styled-components";
import {auth} from "./firebase"

// Styled components
const AuthContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 5vw;
  width: 100%;
  max-width: 100vh;
  box-sizing: border-box;
  background-color: #f5ebf6;
  border-radius: 19vw;
  margin: 10vh auto 0;
  height: 90vh;
  margin-top: 15vh;
`;

const Title = styled.h2`
  margin-bottom: 5vh;
  text-align: center;
  color: #8c588c;
  font-size: 7vw;
  font-weight: bold;
`;

const StyledInput = styled.input`
  border-radius: 50px;
  padding: 4vw;
  margin-bottom: 3vw;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ddd;
  font-size: 4vw;
  font-weight: bold;
  &::placeholder {
    color: rgba(0, 0, 0, 0.19);
  }
  &:focus {
    outline: none;
    border-color: #8c588c;
  }
`;

const RequiredAsterisk = styled.span`
  color: #ff0000;
  margin-right: 1vw;
  align-self: flex-end;
  font-size: 4vw;
`;

const ForgotPasswordLink = styled(Link)`
  text-align: right;
  color: #8c588c;
  font-weight: bold;
  font-size: 3.5vw;
  padding-bottom: 2vw;
  display: block;
  text-decoration: none;
`;

const LoginButton = styled.button`
  border-radius: 50px;
  font-weight: bold;
  font-size: 4.5vw;
  width: 70%;
  margin: 0 15%;
  text-align: center;
  padding: 3vw 0;
  background-color: #8c588c;
  color: white;
  border: none;
  cursor: pointer;
  &:active {
    transform: scale(0.98);
  }
`;

const Divider = styled.hr`
  width: 100%;
  margin: 5vw 0;
  border: 0;
  height: 1px;
  background-color: #ddd;
  margin-bottom: 15vw;
  margin-top: 10vw;
`;

const SignupText = styled.p`
  color: #8c588c;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2vw;
  font-size: 3.5vw;
`;

const SignupButton = styled(Link)`
  border-radius: 50px;
  font-weight: bold;
  font-size: 4.5vw;
  width: 60%;
  margin: 0 auto;
  text-align: center;
  display: block;
  text-decoration: none;
  padding: 3vw 0;
  background-color: #8c588c;
  color: white;
  border: none;
`;

const Notification = styled.div`
  position: fixed;
  top: 5vh;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => (props.isSuccess ? "#4CAF50" : "#FF5252")};
  color: white;
  padding: 2vw 4vw;
  border-radius: 5vw;
  z-index: 1000;
  box-shadow: 0 1vw 2vw rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vh;
  height: 100vh;
  background-color: #ffd4fc;
  z-index: -1;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isSuccess: false,
  });
  const navigate = useNavigate();

  const showNotification = (message, isSuccess) => {
    setNotification({ show: true, message, isSuccess });
    setTimeout(() => {
      setNotification({ show: false, message: "", isSuccess: false });
    }, 3000);
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification("Login successful ✓", true);
      setTimeout(() => {
        navigate("/period-dates");
      }, 1500);
    } catch (error) {
      showNotification("Invalid email or password", false);
      console.error("Login error:", error.message);
    }
  };

  return (
    <>
      <Background />
      <AuthContainer>
        {notification.show && (
          <Notification isSuccess={notification.isSuccess}>
            {notification.message}
          </Notification>
        )}
        <Title>LOG IN</Title>
        <StyledInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <RequiredAsterisk>*</RequiredAsterisk>
        <StyledInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <RequiredAsterisk>*</RequiredAsterisk>
        <ForgotPasswordLink to="/forgot-password">Forgot Password</ForgotPasswordLink>
        <LoginButton onClick={handleLogin}>LOG IN</LoginButton>
        <Divider />
        <SignupText>Don't have an Account?</SignupText>
        <SignupButton to="/signup">SIGN UP</SignupButton>
      </AuthContainer>
    </>
  );
};

export default Login;