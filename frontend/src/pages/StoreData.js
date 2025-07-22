/*import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Timestamp } from "firebase/firestore";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const handleSubmit = async () => {
  if (!startDate || !endDate || !cycleLength) {
    alert("All fields are required!");
    return;
  }

  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to track your period.");
      return;
    }

    const db = getFirestore();
    const userId = user.email; // Using email as document ID

    await setDoc(doc(db, "period_cycles", userId), {
      userId: userId,
      startDate: Timestamp.fromDate(new Date(startDate)), // Firestore Timestamp
      endDate: Timestamp.fromDate(new Date(endDate)), // Firestore Timestamp
      cycleLength: parseInt(cycleLength, 10),
    });

    alert("Period data saved successfully!");
    navigate("/home");
  } catch (error) {
    console.error("Error saving period data:", error);
    alert("Failed to save data. Try again later.");
  }
};
