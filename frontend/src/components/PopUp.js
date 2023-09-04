import React from 'react';

function Popup({ show, close, children }) {
  if (!show) {
    return null;
  }

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30'
      onClick={close}
    >
      <div
        className='inline-flex flex-col bg-white p-8 rounded-lg text-amber-700 max-w-sm'
        onClick={stopPropagation}
      >
        {children}
      </div>
    </div>
  );
}

export default Popup;
