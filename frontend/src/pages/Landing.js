import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // In a real app, this would handle login logic
    navigate("/login"); // Redirect to home after login (adjust as needed)
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffd4fc", // Light pink background
        position: "relative",
      }}
    >
      <h1
        style={{
          color: "#000000",
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
          fontFamily: "'Delm Medium', sans-serif",
        }}
      >
        Hey There, Beautiful!
      </h1>
      <p
        style={{
          color: "#000000",
          fontSize: "18px",
          fontWeight: "lighter",
          marginBottom: "30px",
          textAlign: "center",
          fontFamily: "'Delm Medium', sans-serif",
        }}
      >
        Welcome to Period's Tracking App
      </p>

      <div style={{ marginBottom: "40px" }}>
        <img
          src={process.env.PUBLIC_URL + "/landing.png"} // Image path from public directory
          alt="Welcome Illustration"
          style={{
            width: "250px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      <button
        onClick={handleLogin}
        style={{
          background: "#ffffff",
          color: "#000000",
          borderRadius: "50px",
          padding: "12px 30px",
          border: "2px solid #000000",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "15px",
          width: "60%",
          fontSize: "16px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        LOG IN
      </button>

      <p
        style={{
          color: "#000000",
          fontSize: "14px",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        Don't have an account?
      </p>

      <button
        onClick={handleSignUpRedirect}
        style={{
          background: "#ffffff",
          color: "#000000",
          borderRadius: "50px",
          padding: "12px 30px",
          border: "2px solid #000000",
          fontWeight: "bold",
          cursor: "pointer",
          width: "60%",
          fontSize: "16px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        SIGN UP
      </button>
    </motion.div>
  );
};

export default Landing;
