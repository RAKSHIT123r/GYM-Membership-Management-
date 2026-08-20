import React from 'react';

const Avatar = ({ name, className = '' }) => {
  const initial = name && name.trim().length ? name.trim().charAt(0).toUpperCase() : '?';
  return (
    <div
      className={`flex items-center justify-center bg-brand-500 text-black font-extrabold ${className}`}
      aria-hidden
    >
      <span className="select-none">{initial}</span>
    </div>
  );
};

export default Avatar;
