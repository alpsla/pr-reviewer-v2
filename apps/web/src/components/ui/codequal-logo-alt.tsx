import React from 'react';

interface CodeQualLogoProps {
  className?: string;
}

export const CodeQualLogoAlt: React.FC<CodeQualLogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CodeQual Logo"
    >
      {/* Shield outline only */}
      <path
        d="M50 10 L90 30 L90 60 Q90 80 50 90 Q10 80 10 60 L10 30 Z"
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="3"
      />
      
      {/* Code brackets - black and clearly visible */}
      <path
        d="M37 28 L32 35 L32 45 L37 52"
        fill="none"
        stroke="#000000"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M63 28 L68 35 L68 45 L63 52"
        fill="none"
        stroke="#000000"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Checkmark */}
      <path
        d="M68 55 L48 75 L32 60"
        stroke="#00c853"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CodeQualLogoAlt;
