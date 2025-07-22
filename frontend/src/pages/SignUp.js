import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Styled Components
const Container = styled(motion.div)`
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

const NotificationBar = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => (props.isSuccess ? "#4CAF50" : "#FF5252")};
  color: white;
  padding: 12px 20px;
  border-radius: 20px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s;
  width: 40%;
  max-width: 350px;
  text-align: center;
`;

const BackLink = styled(Link)`
  margin-top: 5vh;
  display: block;
  margin-bottom: 15px;
  color: #8c588c;
  font-weight: bold;
  text-decoration: none;
  padding: 5px 0;
  font-size: 16px;
  align-self: flex-start;

  &:hover {
    opacity: 0.8;
  }
`;

const Title = styled.h2`
  height: auto;
  margin-bottom: 8%;
  margin-left: 5%;
  color: #8c588c;
  text-align: left;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 100%;
`;

const Input = styled.input`
  border-radius: 50px;
  font-weight: bold;
  padding: 12px 15px;
  margin: 0 auto;
  width: 80%;
  border: none;
  background: white;
  font-size: 16px;
  color: #8c588c;

  &::placeholder {
    color: #8c588c;
    opacity: 0.5;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(140, 88, 140, 0.3);
  }
`;

const SignUpButton = styled.button`
  border-radius: 50px;
  font-weight: bold;
  font-size: 19px;
  width: 60%;
  margin: 20px auto 0;
  text-align: center;
  display: block;
  padding: 12px 0;
  background: #8c588c;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background: #774777;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isSuccess: false,
  });

  const navigate = useNavigate();
  const auth = getAuth();

  const showNotification = (message, isSuccess) => {
    setNotification({ show: true, message, isSuccess });
    setTimeout(() => {
      setNotification({ show: false, message: "", isSuccess: false });
    }, 3000);
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      showNotification("All fields are required!", false);
      return;
    }
    if (password !== confirmPassword) {
      showNotification("Passwords do not match!", false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       const user = userCredential.user;
        await setDoc(doc(db, "users", user.email), {
             email: user.email,
           });
      showNotification("Signup successful ✓", true);
      setTimeout(() => {
        navigate("/signup2");
      }, 1500);
    } catch (error) {
      showNotification(error.message, false);
      console.error("Signup error:", error.message);
    }
  };

  return (
    <Container
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: -400 }}
      transition={{ duration: 0.8, ease: "easeInOut", stiffness: 300 }}
    >
      {notification.show && (
        <NotificationBar isSuccess={notification.isSuccess}>
          {notification.message}
        </NotificationBar>
      )}

      <motion.div whileTap={{ scale: 0.97 }}>
        <BackLink to="/login">⇐ Back to login</BackLink>
      </motion.div>

      <Title>SIGN UP</Title>

      <InputContainer>
        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </InputContainer>

      <InputContainer>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </InputContainer>

      <InputContainer>
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </InputContainer>

      <SignUpButton onClick={handleSignup}>Sign Up</SignUpButton>
    </Container>
  );
};

export default SignUp;
