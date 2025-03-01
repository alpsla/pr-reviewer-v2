import React from 'react';

interface CodeQualLogoProps {
  className?: string;
}

export const CodeQualLogoFinal: React.FC<CodeQualLogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CodeQual Logo"
    >
      {/* Shield outline with light fill */}
      <path
        d="M50 10 L90 30 L90 60 Q90 80 50 90 Q10 80 10 60 L10 30 Z"
        fill="#f8fafc"
        stroke="#1e3a8a"
        strokeWidth="2"
      />
      
      {/* Light blue-gray top section */}
      <path
        d="M50 10 L90 30 L90 50 L10 50 L10 30 Z"
        fill="#e2e8f0"
        opacity="0.7"
      />
      
      {/* Divider line */}
      <line
        x1="10"
        y1="50"
        x2="90"
        y2="50"
        stroke="#64748b"
        strokeWidth="1"
      />
      
      {/* Code brackets - perfectly centered in top section */}
      <path
        d="M42 26 L38 31 L38 38 L42 42"
        fill="none"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58 26 L62 31 L62 38 L58 42"
        fill="none"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Checkmark - smaller for better balance */}
      <path
        d="M65 60 L50 73 L35 65"
        stroke="#00c853"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CodeQualLogoFinal;
