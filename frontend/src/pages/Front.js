import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CirlImageAnimation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Total time calculation:
    // - 2s wait before animation starts
    // - 2s for fadeFromBottom animation
    // - 1s for fadeOut animation
    const totalAnimationTime = (7) * 1000; // 5s in milliseconds

    const timer = setTimeout(() => {
      // Redirect to the next route after all animations complete
      navigate('/landing');
    }, totalAnimationTime);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  // Handle image load errors for debugging
  const handleImageError = (e, letter) => {
    console.error(`Failed to load image: ${letter}`);
    e.target.style.display = 'none'; // Hide broken image
    e.target.nextSibling.style.display = 'block'; // Show fallback text
  };

  return (
    <div className="mobile-viewport">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '0.3vw',
        }}
      >
        {/* Woman Image with Background Square and Animations */}
        <div
          style={{
            position: 'relative',
            width: '40vw',
            height: '42vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeFromBottom 2s ease-out 2s forwards, fadeOut 1s ease-out 4s forwards', // 2s delay, then fade out after 4s
            opacity: 0,
            overflow: 'hidden',
            backgroundColor: '#ffd4fc', // Fallback background
          }}
        >
          <img
            src={process.env.PUBLIC_URL + '/women.png'} // Use PUBLIC_URL for correct path
            alt="Woman Silhouette"
            style={{
              width: '32vw',
              height: '42vh',
              filter: 'brightness(70%) contrast(120%)',
            }}
            onError={(e) => handleImageError(e, 'women.png')}
          />
          {/* Fallback content if image fails to load */}
          <span
            style={{
              display: 'none',
              color: 'red',
              fontSize: '3vw',
              textAlign: 'center',
            }}
          >
            Failed to load woman image
          </span>
        </div>

        {/* Letters Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            animation: 'fadeOut 1s ease-out 4s forwards', // Fade out after 4s
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0.5vw',
              alignItems: 'flex-end',
            }}
          >
            {['c', 'i', 'r', 'l'].map((letter, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  height: letter === 'l' ? '10vh' : '10vh',
                  overflow: 'hidden',
                  animation: 'fadeFromBottom 2s ease-out 2s forwards', // 2s delay, same as woman image
                  opacity: 0,
                  backgroundColor: '#ffd4fc', // Fallback background
                }}
              >
                <img
                  src={process.env.PUBLIC_URL + `/${letter}.png`} // Use PUBLIC_URL for correct path
                  alt={letter}
                  style={{
                    width: letter === 'i' || letter === 'r' ? '4.5vw' : '7vw',
                    height: letter === 'i' || letter === 'r' ? '4.5vw' : '7vw',
                    transform: letter === 'l' ? 'rotate(-10deg)' : 'none',
                    transformOrigin: letter === 'l' ? 'bottom center' : 'center',
                    filter: 'brightness(70%) contrast(120%)',
                    position: letter === 'l' ? 'relative' : 'static',
                    top: letter === 'l' ? '-0.7vw' : '0',
                  }}
                  onError={(e) => handleImageError(e, `${letter}.png`)}
                />
                {/* Fallback content if image fails to load */}
                <span
                  style={{
                    display: 'none',
                    color: 'red',
                    fontSize: '3vw',
                    textAlign: 'center',
                  }}
                >
                  Failed to load {letter}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Keyframes for Animations */}
      <style>
        {`
          @keyframes fadeFromBottom {
            0% {
              opacity: 0;
              clip-path: inset(100% 0 0 0);
            }
            100% {
              opacity: 1;
              clip-path: inset(0 0 0 0);
            }
          }

          @keyframes fadeOut {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }

          .mobile-viewport {
            width: 100vw !important; /* Override global CSS with higher specificity */
            height: 100vh !important; /* Override global CSS */
            margin: 0 auto !important;
            border-radius: 5vw !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            align-items: center !important;
            font-family: Arial, sans-serif !important;
            color: #333333 !important;
            position: relative !important;
            background-color: #ffd4fc !important; /* Ensure pink background applies */
          }
        `}
      </style>
    </div>
  );
};

export default CirlImageAnimation;