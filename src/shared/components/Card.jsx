import React from 'react';

export default function Card({ children, className = '', hover = false, onClick = null }) {
  const hoverStyles = hover
    ? 'hover:shadow-md hover:border-krishi-300 transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}
