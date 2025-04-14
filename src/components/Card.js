import React from 'react';

const Card = ({ children, className = "" }) => {
  return (
    <div className={`card bg-base-100 border-2 border-black rounded-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${className}`}>
      {children}
    </div>
  );
};

export default Card;
