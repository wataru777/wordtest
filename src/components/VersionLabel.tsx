"use client";

import { useState } from 'react';

interface VersionLabelProps {
  isDebugMode?: boolean;
}

export default function VersionLabel({ isDebugMode }: VersionLabelProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // next.configから取得（ビルド時に埋め込まれる）
  const version = process.env.APP_VERSION || '0.1.0';
  const buildDate = process.env.BUILD_DATE || new Date().toISOString().split('T')[0];
  
  const handleClick = () => {
    if (isDebugMode) {
      setShowDetails(!showDetails);
    }
  };

  return (
    <>
      <div 
        className={`fixed top-3 left-4 text-xs font-mono transition-all duration-300 z-10 ${
          isDebugMode 
            ? 'text-gray-500 hover:text-gray-700 cursor-pointer select-none' 
            : 'text-gray-300 pointer-events-none opacity-60'
        } ${showDetails ? 'bg-white/90 backdrop-blur-sm rounded px-2 py-1 shadow-sm' : ''}`}
        onClick={handleClick}
        title={isDebugMode ? 'クリックして詳細を表示' : undefined}
      >
        v{version}
        {showDetails && isDebugMode && (
          <div className="mt-1 text-xs text-gray-600 whitespace-nowrap">
            <div>Build: {buildDate}</div>
            <div>Mode: {process.env.NODE_ENV || 'development'}</div>
            <div>Next.js: {process.env.NEXT_PUBLIC_APP_VERSION || '15.x'}</div>
          </div>
        )}
      </div>
    </>
  );
}