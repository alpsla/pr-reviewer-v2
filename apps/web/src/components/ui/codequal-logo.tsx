import React from 'react';

interface CodeQualLogoProps {
  className?: string;
}

export const CodeQualLogo: React.FC<CodeQualLogoProps> = ({ className }) => {
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
      
      {/* Top stripe for more shield-like appearance */}
      <path
        d="M50 10 L90 30 L90 35 L10 35 L10 30 Z"
        fill="#1e3a8a"
        opacity="0.7"
      />
      
      {/* Code brackets - bold and clearly visible */}
      <path
        d="M37 28 L32 35 L32 45 L37 52"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M63 28 L68 35 L68 45 L63 52"
        fill="none"
        stroke="#ffffff"
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

export default CodeQualLogo;
