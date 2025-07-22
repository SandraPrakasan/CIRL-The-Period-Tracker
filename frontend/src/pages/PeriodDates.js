import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import { getFirestore , collection} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import calculateNextPeriodDate from "./calculateNextPeriod.js"

const NotificationContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ type }) => (type === "success" ? "#4CAF50" : "#F44336")};
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  font-weight: bold;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0.95;
  transition: opacity 0.5s ease-in-out;
`;

const NotificationBar = ({ message, type }) => {
  if (!message) return null;
  return <NotificationContainer type={type}>{message}</NotificationContainer>;
};

const BackLink = styled(Link)`
  margin-top: 5vh;
  display: block;
  margin-bottom: 15px;
  color: #8c588c;
  //font-weight: bold;
  text-decoration: none;
  padding: 5px 0;
  font-size: 16px;
  align-self: flex-start;

  &:hover {
    opacity: 0.8;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom:8vw;
`;

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 5vw;
  width: 90%;
  max-width: 100vh;
  box-sizing: border-box;
  background-color: #f5ebf6;
  border-radius: 15vw;
  margin: 20vh auto;
  height: auto;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  font-size: 16px;
  color: #8c588c;
  font-weight: bold;
  margin-bottom: 5px;
  align-self: flex-start;
`;
const Input = styled.input`
  border-radius: 50px;
  font-weight: bold;
  padding: 12px 15px;
  width: 100%;
  max-width: 300px;
  border: none;
  background: white;
  font-size: 16px;
  color: #8c588c;
  margin-bottom: 15px;
  display: block;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(140, 88, 140, 0.3);
  }
`;

const SubmitButton = styled.button`
  border-radius: 50px;
  font-weight: bold;
  font-size: 19px;
  width: 60%;
  padding: 12px 0;
  background: #8c588c;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #774777;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const PeriodTracker = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cycleLength, setCycleLength] = useState("");
  const navigate = useNavigate();
  
  const [notification, setNotification] = useState({ message: "", type: "" });
  const db = getFirestore();

const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

const handleSubmit = async (e) => {
  e.preventDefault(); // Prevents form reload

  if (!startDate || !endDate || !cycleLength) {
    alert("All fields are required!");
    return;
  }

  if (parseInt(cycleLength, 10) <= 0) {
    alert("Cycle length must be a positive number!");
    return;
  }

  try {
     const auth = getAuth();
     const user = auth.currentUser;
     if (!user) {
       alert("User not authenticated!");
       return;
     }

     const userEmail = user.email; // Get current user's email
     const userRef = doc(db, "users", userEmail); // Reference to the user document

     // Check if user document exists; if not, create it with default fields
     const userSnap = await getDoc(userRef);
     if (!userSnap.exists()) {
       await setDoc(userRef, {
         name: user.displayName || "",
         email: user.email,
         dob: null,
         bloodGroup: "",
       });
     }

     // Reference to the periodData subcollection
     const periodDataRef = doc(
       collection(db, "users", userEmail, "periodData"),
       startDate.replace(/-/g, "") // Use startDate (YYYYMMDD) as the document ID
     );

     await setDoc(periodDataRef, {
       startDate: new Date(startDate),
       endDate: new Date(endDate),
       cycleLength: parseInt(cycleLength, 10),
     });

     await setDoc(userRef, {
      cyclesCount: increment(1)
    }, { merge: true });

 await calculateNextPeriodDate();

     showNotification("Period data saved successfully!", "success");
    navigate("/mood-details");
  } catch (error) {
    console.error("Error saving period data:", error);
    showNotification("Failed to save data. Try again later.","error");
  }
};

  return (
  <>
  <NotificationBar message={notification.message} type={notification.type} />
    <Container
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: -400 }}
      transition={{ duration: 0.8, ease: "easeInOut", stiffness: 300 }}
    >
    <LinkContainer>
        <BackLink to="/login">⇐ Back to login</BackLink>
        <BackLink to="/home">Go to Home ⇒</BackLink>
      </LinkContainer>

      <StyledForm onSubmit={handleSubmit}>
        <Label>Period Start Date</Label>
        <Input
          type="date"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <Label>Period End Date</Label>
        <Input
          type="date"
          required
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Label>Cycle Length (in days)</Label>
        <Input
          type="number"
          required
          min="1"
          value={cycleLength}
          onChange={(e) => setCycleLength(e.target.value)}
        />

        <SubmitButton type="submit">Save Data</SubmitButton>
      </StyledForm>
    </Container>
    </>
  );
};

export default PeriodTracker;
