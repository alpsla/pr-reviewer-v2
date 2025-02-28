import React from 'react';

interface CodeQualLogoProps {
  className?: string;
}

export const CodeQualLogoEnhanced: React.FC<CodeQualLogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CodeQual Logo"
    >
      {/* Shield outline */}
      <path
        d="M50 10 L90 30 L90 60 Q90 80 50 90 Q10 80 10 60 L10 30 Z"
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="2.5"
      />
      
      {/* Light gray top section */}
      <path
        d="M50 10 L90 30 L90 50 L10 50 L10 30 Z"
        fill="#f1f5f9"
        opacity="0.5"
      />
      
      {/* Divider line */}
      <line
        x1="10"
        y1="50"
        x2="90"
        y2="50"
        stroke="#718096"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      
      {/* Code brackets - more balanced with shield */}
      <path
        d="M40 30 L36 36 L36 44 L40 48"
        fill="none"
        stroke="#333333"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 30 L64 36 L64 44 L60 48"
        fill="none"
        stroke="#333333"
        strokeWidth="2.5"
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

export default CodeQualLogoEnhanced;
