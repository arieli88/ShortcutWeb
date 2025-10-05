// src/components/Popup.js
import React from 'react';

const Popup = ({ content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg w-11/12 max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 font-bold"
        >
          ✖
        </button>
        <div className="mt-4">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Popup;