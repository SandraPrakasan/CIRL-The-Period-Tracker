import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import Select from "react-select";

const SignupScreen = () => {
  const [nickname, setNickname] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [medicalConcern, setMedicalConcern] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();
 const auth = getAuth();

const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Adjust age if birthday hasn't occurred yet this year
    }
    return age;
  };

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        navigate("/login"); // Redirect if not logged in
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleSignup = async () => {
   if (!nickname || !dob) {
        alert("Please fill in all required fields.");
        return;
      }

      if (!userEmail) {
        alert("User not authenticated.");
        return;
      }

      try {
        const calculatedAge = calculateAge(dob);
        const userRef = doc(db, "users", userEmail); // Firestore document reference

        await setDoc(userRef, {
          nickname,
          dob,
          bloodGroup : bloodGroup.value || bloodGroup,
          medicalConcern,
          age: calculatedAge,
        }, { merge: true }); // `merge: true` ensures we don't overwrite existing data

    console.log("User data saved successfully!", { nickname, dob, bloodGroup, medicalConcern });
    navigate("/period-dates");
  }catch (error) {
         console.error("Error saving user data:", error);
         alert("Failed to save user details.");
       }
     };

  return (
    <Wrapper>
        <Title>Enter Your Nick Name <Asterisk>*</Asterisk></Title>
        <Input
          placeholder="Josephine"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <Title>Date of Birth <Asterisk>*</Asterisk></Title>
        <Input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <Title>Blood Group</Title>
         <Select
                options={bloodGroupOptions}
                onChange={(selectedOption) => setBloodGroup(selectedOption)}
                placeholder="Select blood group"
                styles={{
                  container: (base) => ({
                    ...base,
                    width: "100%",
                    marginBottom: "10px",
                  }),
                  control: (base) => ({
                    ...base,
                    borderRadius: "28px",
                    minHeight: "45px",
                    border: "1px solid #ccc",
                    })
                    }}
                 />
        <Title>Medical Concern</Title>
        <Select
          options={options}
          onChange={(selectedOption) => setMedicalConcern(selectedOption.value)}
          placeholder="Select an option"
          styles={{ container: (base) => ({ ...base, width: "100%" }) }}
        />
        <Button onClick={handleSignup}>LET’S GET STARTED</Button>
    </Wrapper>
  );
};

const bloodGroupOptions = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const options = [
  { value: "PCOD", label: "PCOD" },
  { value: "PCOS", label: "PCOS" },
];

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
  min-height: 100vh;
  background-color: #F3EBF3;
  padding:15px;
  padding-top:0px;

`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #8C3979;
  margin-top: 15px;
  align-self: flex-start;
`;

const Asterisk = styled.span`
  color: red;
`;

const Input = styled.input`
  width: 95%;
  height: 25px;
  background-color: #FFFFFF;
  border-radius: 28px;
  padding: 10px;
  font-size: 16px;
  color: #000;
  margin-top: 5px;
  border: 1px solid #ccc;
  outline: none;
   margin-bottom: 10px;
`;

const Button = styled.button`
  width: 100%;
  height: 50px;
  background-color: #8C3979;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 700;
  border: none;
  cursor: pointer;
`;

export default SignupScreen;
