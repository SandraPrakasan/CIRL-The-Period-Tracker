import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Styled Components
const SettingsContainer = styled(motion.div)`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5ebfb;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #8c588c;
`;

const Title = styled.h1`
  color: #8c588c;
  font-size: 24px;
  margin: 0;
`;

const SettingsGroup = styled.div`
  background: white;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  font-size: 16px;
  color: #333;
`;

const SettingDescription = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  &:checked + ${ToggleSlider} {
    background-color: #8c588c;
  }
  &:checked + ${ToggleSlider}:before {
    transform: translateX(26px);
  }
`;

const SelectDropdown = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: white;
  color: #333;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 30px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background-color: #ff5252;
  }
`;

const SettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    periodReminders: true,
    moodTracking: true,
    language: 'en',
    syncData: true
  });

  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleSelectChange = (e) => {
    setSettings({
      ...settings,
      language: e.target.value
    });
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('User logged out');
    navigate('/login');
  };

  return (
    <SettingsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <BackButton onClick={() => navigate('/home')}>←</BackButton>
        <Title>Settings</Title>
      </Header>

      <SettingsGroup>
        <SettingItem>
          <div>
            <SettingLabel>Notifications</SettingLabel>
            <SettingDescription>Enable app notifications</SettingDescription>
          </div>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.notifications}
              onChange={() => handleToggle('notifications')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>

        <SettingItem>
          <div>
            <SettingLabel>Dark Mode</SettingLabel>
            <SettingDescription>Switch to dark theme</SettingDescription>
          </div>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => handleToggle('darkMode')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>
      </SettingsGroup>

      <SettingsGroup>
        <SettingItem>
          <div>
            <SettingLabel>Period Reminders</SettingLabel>
            <SettingDescription>Get reminders about your cycle</SettingDescription>
          </div>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.periodReminders}
              onChange={() => handleToggle('periodReminders')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>

        <SettingItem>
          <div>
            <SettingLabel>Mood Tracking</SettingLabel>
            <SettingDescription>Enable daily mood tracking</SettingDescription>
          </div>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.moodTracking}
              onChange={() => handleToggle('moodTracking')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>
      </SettingsGroup>

      <SettingsGroup>
        <SettingItem>
          <div>
            <SettingLabel>Language</SettingLabel>
            <SettingDescription>App language preference</SettingDescription>
          </div>
          <SelectDropdown
            value={settings.language}
            onChange={handleSelectChange}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="hi">हिन्दी</option>
          </SelectDropdown>
        </SettingItem>

        <SettingItem>
          <div>
            <SettingLabel>Cloud Sync</SettingLabel>
            <SettingDescription>Sync data across devices</SettingDescription>
          </div>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={settings.syncData}
              onChange={() => handleToggle('syncData')}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </SettingItem>
      </SettingsGroup>

      <SettingsGroup>
        <SettingItem onClick={() => navigate('/privacy')}>
          <SettingLabel>Privacy Policy</SettingLabel>
        </SettingItem>
        <SettingItem onClick={() => navigate('/help')}>
          <SettingLabel>Help & Support</SettingLabel>
        </SettingItem>
        <SettingItem onClick={() => navigate('/about')}>
          <SettingLabel>About App</SettingLabel>
        </SettingItem>
      </SettingsGroup>

      <LogoutButton onClick={handleLogout}>
        Log Out
      </LogoutButton>
    </SettingsContainer>
  );
};

export default SettingsPage;