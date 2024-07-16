import React, { useEffect } from 'react';
import fanfare from '../assets/fanfare.mp3';
import loadingImage from '../assets/loading_screen.jpg';

const LoadingScreen = () => {
  useEffect(() => {
    const audio = new Audio(fanfare);
    audio.play().catch((error) => {
      console.error("Audio playback failed", error);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="text-center">
        <img src={loadingImage} alt="Loading" className="w-64 h-64 mx-auto mb-4"/>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
