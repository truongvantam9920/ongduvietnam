import React from 'react';

interface ZaloIconProps {
  className?: string;
}

export const ZaloIcon: React.FC<ZaloIconProps> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <rect width="48" height="48" rx="12" fill="#0068FF" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="15"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-0.5px"
      >
        Zalo
      </text>
    </svg>
  );
};

