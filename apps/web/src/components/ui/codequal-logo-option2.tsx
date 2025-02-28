import React from 'react';

interface CodeQualLogoProps {
  className?: string;
}

export const CodeQualLogoOption2: React.FC<CodeQualLogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CodeQual Logo"
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      
      {/* Shield shape */}
      <path
        d="M50 10 L90 30 L90 60 Q90 80 50 90 Q10 80 10 60 L10 30 Z"
        fill="url(#logoGradient)"
        stroke="#1e3a8a"
        strokeWidth="2"
      />
      
      {/* Top and bottom stripes for more shield-like appearance */}
      <path
        d="M50 10 L90 30 L90 35 L10 35 L10 30 Z"
        fill="#1e3a8a"
        opacity="0.8"
      />
      
      {/* Simplified code brackets - angular style for better visibility */}
      <path
        d="M30 40 L40 30 M30 40 L40 50"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70 40 L60 30 M70 40 L60 50"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Checkmark */}
      <path
        d="M68 60 L48 80 L32 65"
        stroke="#00c853"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CodeQualLogoOption2;
