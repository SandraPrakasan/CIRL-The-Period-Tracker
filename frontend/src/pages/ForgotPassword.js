import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        isSuccess: false
    });
    
    const otpInputRef1 = useRef(null);
    const otpInputRef2 = useRef(null);
    const otpInputRef3 = useRef(null);
    const otpInputRef4 = useRef(null);
    const otpInputRef5 = useRef(null);
    const otpInputRef6 = useRef(null);
    const otpInputRefs = [
        otpInputRef1,
        otpInputRef2,
        otpInputRef3,
        otpInputRef4,
        otpInputRef5,
        otpInputRef6
    ];
    
    const dummyPin = '123456';

    const handleOtpChange = (index, value) => {
        if (value && !/^\d+$/.test(value)) return;
        
        const newOtpValues = [...otpValues];
        
        if (value.length > 1) {
            const digits = value.replace(/\D/g, '').slice(0, 6);
            for (let i = 0; i < 6; i++) {
                newOtpValues[i] = digits[i] || '';
            }
            setOtpValues(newOtpValues);
            if (digits.length < 6 && digits.length > 0) {
                otpInputRefs[digits.length].current.focus();
            } else if (digits.length === 6) {
                otpInputRefs[5].current.blur();
            }
            return;
        }
        
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);
        if (value && index < 5) {
            otpInputRefs[index + 1].current.focus();
        }
    };
    
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (index > 0 && otpValues[index] === '') {
                const newOtpValues = [...otpValues];
                newOtpValues[index - 1] = '';
                setOtpValues(newOtpValues);
                otpInputRefs[index - 1].current.focus();
            } else if (otpValues[index] !== '') {
                const newOtpValues = [...otpValues];
                newOtpValues[index] = '';
                setOtpValues(newOtpValues);
            }
        }
    };
    
    const otpCode = otpValues.join('');
    
    const showNotification = (message, isSuccess) => {
        setNotification({ show: true, message, isSuccess });
        setTimeout(() => {
            setNotification({ show: false, message: '', isSuccess: false });
        }, 3000);
    };
    
    const verifyOtp = () => {
        if (otpCode === dummyPin) {
            showNotification('Successful ✓', true);
        } else {
            showNotification('Enter valid code', false);
        }
    };
    
    const handleSendOtp = () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            showNotification('Please enter a valid phone number', false);
            return;
        }
        
        // In a real app, here you would call an API to send OTP
        showNotification('OTP sent successfully', true);
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            exit={{ opacity: 0}}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
        >
            {notification.show && (
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                        marginLeft:'20%',
                        position: 'absolute',
                        borderRadius: '50px',
                        top: '15px',
                        width: '50%',
                        left: 0,
                        right: 0,
                        padding: '10px',
                        backgroundColor: notification.isSuccess ? '#05c880' : 'red',
                        color: notification.isSuccess ? 'white' : 'white',
                        textAlign: 'center',
                        zIndex: 10,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                >
                    {notification.message}
                </motion.div>
            )}
            
            <h2 style={{ color: '#8c588c', marginBottom: '30px', textAlign: 'center', fontFamily: "'Delm Medium', sans-serif", fontSize:'30px', fontWeight:'bolder' }}>
                Forgot Password
            </h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <img 
                    src={process.env.PUBLIC_URL + '/sad.png'} 
                    alt="Sad emoji" 
                    style={{ 
                        width: '180px', 
                        height: '180px',
                        objectFit: 'contain',
                        background:'#8c588c',
                        borderRadius:'50%',
                    }}
                />
            </div>
            
            <motion.div 
                style={{ display: 'flex', flexDirection: 'column', padding: '0 20px', flex: 1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                <p style={{ 
                    color: '#8c588c', 
                    textAlign: 'left', 
                    fontWeight: 'bold', 
                    marginBottom: '15px',
                    marginLeft: '5px',
                    fontSize: '16px' 
                }}>
                    Enter your phone number
                </p>
        
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        className="rounded-input" 
                        style={{ 
                            borderRadius: '50px', 
                            fontWeight: 'bold', 
                            width: '85%',
                            paddingRight: '40px' 
                        }} 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <button 
                        onClick={handleSendOtp}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: '#8c588c',
                            color: 'white',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        →
                    </button>
                </div>
                
                <hr style={{ width: '100%', margin: '28px 0px', color:'#8c588c' }} />
                
                <div
                    className="otp-container"
                    style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '8px',
                        marginTop: '1px',
                        justifyContent: 'center'
                    }}
                >
                    {otpValues.map((value, index) => (
                        <input
                            key={index}
                            ref={otpInputRefs[index]}
                            type="text"
                            maxLength="1"
                            value={value}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={(e) => {
                                e.preventDefault();
                                const pastedData = e.clipboardData.getData('text');
                                handleOtpChange(index, pastedData);
                            }}
                            className="otp-input"
                            style={{
                                width: '40px',
                                height: '40px',
                                textAlign: 'center',
                                borderRadius: '50%',
                                fontWeight: 'bold',
                                border: '2px solid #8c588c',
                                background: '#f5ebf6',
                                padding: '0',
                                fontSize: '16px'
                            }}
                        />
                    ))}
                </div>
                
                <button
                    onClick={verifyOtp}
                    style={{
                        background: '#8c588c',
                        color: 'white',
                        borderRadius: '50px',
                        padding: '10px',
                        border: 'none',
                        marginTop: '20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '60%',
                        marginLeft: '20%'
                    }}
                >
                    Verify OTP
                </button>
            </motion.div>
        </motion.div>
    );
};

export default ForgotPassword;