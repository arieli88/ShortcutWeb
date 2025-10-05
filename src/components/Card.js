// src/components/Card.js
import React from 'react';

const Card = ({ title, images, notes, onOpenPopup }) => {
  return (
    <div className="card border rounded-lg p-4 shadow bg-white dark:bg-gray-800 transition-all">
      <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">{title || 'ללא כותרת'}</h3>
      {images && images.length > 0 && (
        <div className="image-carousel relative overflow-hidden rounded mb-2">
          {images.map((url, index) => (
            <img key={index} src={url} alt={`תמונה ${index + 1}`} className={`w-full h-48 object-cover rounded ${index === 0 ? 'active' : ''}`} />
          ))}
        </div>
      )}
      {notes && (
        <div className="notes-text mt-2">
          <pre className="whitespace-pre-wrap">{notes.length > 200 ? `${notes.substring(0, 200)}...` : notes}</pre>
          {notes.length > 200 && (
            <button className="ml-2 text-blue-600 text-sm underline hover:text-blue-800" onClick={onOpenPopup}>
              הצג עוד
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;