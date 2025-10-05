// src/components/ImageCarousel.js
import React, { useEffect, useState } from 'react';

const ImageCarousel = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [imageUrls.length]);

  return (
    <div className="relative overflow-hidden rounded mb-2 h-48">
      {imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Image ${index + 1}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
};

export default ImageCarousel;