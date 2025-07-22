// pages/Profile.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { db , auth} from './firebase'; // Import Firestore instance
import { doc, getDoc,setDoc } from 'firebase/firestore';

// Define smooth animation variants
const pageVariants = {
  initial: { x: '100vw', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100vw', opacity: 0 },
};

// Smooth 60 FPS transition
const pageTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: 0.6,
};

const MobileViewport = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;
const MainContainer = styled(motion.div)`
  height: 94vh;
  display: flex;
  flex-direction: column;
  background-color: #f5ebfb;
  position: relative;
  padding: 2vh 2vw;
  justify-content: space-between;
`;
const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProfileHeader = styled.h2`
  color: #000000;
  font-size: 5vw;
  font-weight: bold;
  margin: 2vh 0;
  text-align: center;
  font-family: 'Delm Medium', sans-serif;
`;
const PhotoFrame = styled.div`
  width: 30vw;
  height: 30vw;
  border-radius: 50%;
  background-color: #fff;
  border: 0.5vh solid #8c588c;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2vh;
  position: relative;
`;
const ProfilePhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ProfileBox = styled.div`
  background-color: #fff;
  border-radius: 3vw;
  padding: 3vh 4vw;
  width: 80vw;
  margin: 2vh 0;
  box-shadow: 0 0.5vh 1vh rgba(0,0,0,0.1);
  position: relative;
`;
const ProfileItem = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1vh 0;
  border-bottom: 0.2vh solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;
const ItemLabel = styled.span`
  color: #8c588c;
  font-size: 4vw;
  font-weight: bold;
  font-family: 'Delm Medium', sans-serif;
`;
const ItemValue = styled.span`
  color: #333;
  font-size: 4vw;
  font-family: 'Delm Medium', sans-serif;
`;
const EditInput = styled.input`
  color: #333;
  font-size: 4vw;
  font-family: 'Delm Medium', sans-serif;
  border: 0.2vh solid #8c588c;
  border-radius: 1vw;
  padding: 0.5vh 1vw;
  width: 50%;
`;
const EditIcon = styled.img`
  width: 4vw;
  height: 4vw;
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: -5vw;
  transform: translateY(-50%);
`;
const PhotoEditIcon = styled.img`
  width: 5vw;
  height: 5vw;
  cursor: grab;
  position: absolute;
  top: 4%; /* Moved outside the top */
  right: 33%; /* Moved outside the right */
`;
const MainEditIcon = styled.img`
  width: 5vw;
  height: 5vw;
  cursor: grab;
  position: absolute;
  top: 2vh;
  right: 2vw;
`;
const NavigationBar = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1vh 0;
  width: 100%;
  position: sticky;
  bottom: 0;
  z-index: 10;
`;
const NavIconWrapper = styled.div`
  position: relative;
  padding: 1vh;
  &:hover .nav-icon {
    filter: brightness(1.2);
  }
`;
const NavIcon = styled.img`
  width: ${props => props.width || '6vw'};
  height: ${props => props.height || '6vw'};
  cursor: pointer;
  transition: all 0.3s ease;
`;
const ActiveCircle = styled.div`
  position: absolute;
  top: 69%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10vw;
  height: 1vw;
  background-color: #6a3b6a;
  z-index: -1;
`;

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(() => {
    // Load from localStorage if available
    const savedData = localStorage.getItem('profileData');
    return savedData ? JSON.parse(savedData) : {
      photo: process.env.PUBLIC_URL + '/happy.png',
      name: "Advika",
      age: "25",
      bloodGroup: "O+",
      height: "165 cm",
      weight: "55 kg",
    };
  });

  useEffect(() => {
      const fetchProfileData = async () => {
        try {
            const user = auth.currentUser;
          const userDocRef = doc(db, 'users', user.email); // Replace with actual user ID
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };

      fetchProfileData();
    }, []);


  const [editingField, setEditingField] = useState(null);

  // Save to localStorage when profileData changes
  useEffect(() => {
    if (isEditing) {
      localStorage.setItem('profileData', JSON.stringify(profileData));
    }
  }, [profileData, isEditing]);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save to JSON file (simulated with localStorage here)
      localStorage.setItem('profileData', JSON.stringify(profileData));
      const user = auth.currentUser;
                const userDocRef = doc(db, 'users', user.email); // Replace with actual user ID
                //const docSnap = await getDoc(userDocRef);
       await setDoc(userDocRef, {
              height: profileData.height,
              weight: profileData.weight
            }, { merge: true });

    }
    setIsEditing(!isEditing);
    setEditingField(null); // Reset editing field when toggling
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemEdit = (key) => {
    setEditingField(key);
  };

  const handleInputChange = (key, value) => {
    setProfileData({ ...profileData, [key]: value });
  };

  const handleInputBlurOrEnter = (key, event) => {
    if (event.type === 'blur' || (event.type === 'keypress' && event.key === 'Enter')) {
      setEditingField(null); // Exit editing mode
    }
  };

  return (
    <MobileViewport>
      <MainContainer
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <ContentArea>
        <PhotoEditIcon
                  src={process.env.PUBLIC_URL + '/pen.png'}
                  alt="Edit Photo"
                  onClick={() => document.getElementById('photoInput').click()}
                />
          <PhotoFrame>

            <ProfilePhoto src={profileData.photo || process.env.PUBLIC_URL + '/happy.png'} alt="Profile" />
            {isEditing && (
              <>

                <input
                  type="file"
                  id="photoInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </>
            )}
          </PhotoFrame>
          <ProfileHeader>Profile</ProfileHeader>
          <MainEditIcon
            src={isEditing ? process.env.PUBLIC_URL + '/save.png' : process.env.PUBLIC_URL + '/pen.png'}
            alt={isEditing ? "Save" : "Edit"}
            onClick={handleEditToggle}
          />
          <ProfileBox>
            <ProfileItem>
              <ItemLabel>Name:</ItemLabel>
              {editingField === 'name' ? (
                <EditInput
                  value={profileData.nickname}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={(e) => handleInputBlurOrEnter('name', e)}
                  onKeyPress={(e) => handleInputBlurOrEnter('name', e)}
                  autoFocus
                />
              ) : (
                <ItemValue>{profileData.nickname}</ItemValue>
              )}
              {isEditing && editingField !== 'name' && (
                <EditIcon
                  src={process.env.PUBLIC_URL + '/pen.png'}
                  alt="Edit Name"
                  onClick={() => handleItemEdit('name')}
                />
              )}
            </ProfileItem>
            <ProfileItem>
              <ItemLabel>Age:</ItemLabel>
              {editingField === 'age' ? (
                <EditInput
                  value={profileData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  onBlur={(e) => handleInputBlurOrEnter('age', e)}
                  onKeyPress={(e) => handleInputBlurOrEnter('age', e)}
                  autoFocus
                />
              ) : (
                <ItemValue>{profileData.age}</ItemValue>
              )}
              {isEditing && editingField !== 'age' && (
                <EditIcon
                  src={process.env.PUBLIC_URL + '/pen.png'}
                  alt="Edit Age"
                  onClick={() => handleItemEdit('age')}
                />
              )}
            </ProfileItem>
            <ProfileItem>
              <ItemLabel>Blood Group:</ItemLabel>
              {editingField === 'bloodGroup' ? (
                <EditInput
                  value={profileData.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  onBlur={(e) => handleInputBlurOrEnter('bloodGroup', e)}
                  onKeyPress={(e) => handleInputBlurOrEnter('bloodGroup', e)}
                  autoFocus
                />
              ) : (
                <ItemValue>{profileData.bloodGroup}</ItemValue>
              )}
              {isEditing && editingField !== 'bloodGroup' && (
                <EditIcon
                  src={process.env.PUBLIC_URL + '/pen.png'}
                  alt="Edit Blood Group"
                  onClick={() => handleItemEdit('bloodGroup')}
                />
              )}
            </ProfileItem>
            <ProfileItem>
              <ItemLabel>Height:</ItemLabel>
              {editingField === 'height' ? (
                <EditInput
                  value={profileData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  onBlur={(e) => handleInputBlurOrEnter('height', e)}
                  onKeyPress={(e) => handleInputBlurOrEnter('height', e)}
                  autoFocus
                />
              ) : (
                <ItemValue>{profileData.height}</ItemValue>
              )}
              {isEditing && editingField !== 'height' && (
                <EditIcon
                  src={process.env.PUBLIC_URL + '/pen.png'}
                  alt="Edit Height"
                  onClick={() => handleItemEdit('height')}
                />
              )}
            </ProfileItem>
            <ProfileItem>
              <ItemLabel>Weight:</ItemLabel>
              {editingField === 'weight' ? (
                <EditInput
                  value={profileData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  onBlur={(e) => handleInputBlurOrEnter('weight', e)}
                  onKeyPress={(e) => handleInputBlurOrEnter('weight', e)}
                  autoFocus
                />
              ) : (
                <ItemValue>{profileData.weight}</ItemValue>
              )}
              {isEditing && editingField !== 'weight' && (
                <EditIcon
                  src={process.env.PUBLIC_URL + '/pen.png'}
                  alt="Edit Weight"
                  onClick={() => handleItemEdit('weight')}
                />
              )}
            </ProfileItem>
          </ProfileBox>
        </ContentArea>
        <NavigationBar>
          <NavIconWrapper onClick={() => navigate('/home')}>
            {location.pathname === '/home' && <ActiveCircle />}
            <NavIcon className="nav-icon" src={process.env.PUBLIC_URL + '/home.png'} alt="Home" />
          </NavIconWrapper>
          <NavIconWrapper onClick={() => navigate('/notifications')}>
            {location.pathname === '/notifications' && <ActiveCircle />}
            <NavIcon className="nav-icon" src={process.env.PUBLIC_URL + '/bell.png'} alt="Notifications" />
          </NavIconWrapper>
          <NavIconWrapper onClick={() => navigate('/women')}>
            {location.pathname === '/women' && <ActiveCircle />}
            <NavIcon className="nav-icon" src={process.env.PUBLIC_URL + '/women.png'} alt="Women" width="4vw" height="8vw" />
          </NavIconWrapper>
          <NavIconWrapper onClick={() => navigate('/profile')}>
            {location.pathname === '/profile' && <ActiveCircle />}
            <NavIcon className="nav-icon" src={process.env.PUBLIC_URL + '/profile.png'} alt="Profile" />
          </NavIconWrapper>
          <NavIconWrapper onClick={() => navigate('/settings')}>
            {location.pathname === '/settings' && <ActiveCircle />}
            <NavIcon className="nav-icon" src={process.env.PUBLIC_URL + '/settings.png'} alt="Settings" />
          </NavIconWrapper>
        </NavigationBar>
      </MainContainer>
    </MobileViewport>
  );
};

export default EditProfile;