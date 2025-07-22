import styled from 'styled-components';
import { motion } from 'framer-motion';

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

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8c588c;
  color: #fff;
  border: none;
  border-radius: 1vw;
  padding: 1vh 2vw;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #6a3b6a;
  }
`;
const ButtonIcon = styled.img`
  width: 3vw;
  height: 3vw;
  margin-right: 1vw;
`;
const ButtonText = styled.span`
  font-size: 4vw;
  font-weight: bold;
  font-family: 'Delm Medium', sans-serif;
`;

const CalendarItem = styled.div`
  width: 80vw;
  height: 10vw;
  background-color: #fff;
  border-radius: 1vw;
  padding: 1vh 2vw;
`;
const CalendarItemTitle = styled.h3`
  font-size: 4vw;
  font-weight: bold;
  font-family: 'Delm Medium', sans-serif;
`;  
const CalendarItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CalendarItemDate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CalendarItemDateText = styled.span`
  font-size: 4vw;
  font-weight: bold;
  font-family: 'Delm Medium', sans-serif;
`;

export {
    pageVariants,
    pageTransition,
    MobileViewport,
    MainContainer,
    ContentArea,
    ProfileHeader,
    PhotoFrame,
    ProfilePhoto,
    ProfileBox,
    ProfileItem,
    ItemLabel,
    ItemValue,
    EditInput,
    EditIcon,
    PhotoEditIcon,
    MainEditIcon,
    NavigationBar,
    NavIconWrapper,
    NavIcon,
    ActiveCircle,
    StyledButton,
    ButtonIcon,
    ButtonText,
    CalendarItem,
    CalendarItemTitle,
    CalendarItemContent,
    CalendarItemDate,
    CalendarItemDateText
};