import React from 'react';

interface LogoWordProps {
  isHiddenText?: boolean; // Ẩn/hiện chữ "DeepBIM"
  path?: string;          // Đường dẫn logo
  size?: 'sm' | 'md' | 'lg'; // Kích thước: nhỏ, trung bình, lớn
}

export const LogoWord = ({ isHiddenText = false, path = "/images/logo.png", size = 'md' }: LogoWordProps) => {
  // Map size thành kích thước Tailwind
  const sizeClasses = {
    sm: 'h-8 w-8 text-lg',
    md: 'h-12 w-12 text-xl',
    lg: 'h-16 w-16 text-2xl',
  };

  const selectedSize = sizeClasses[size] || sizeClasses['md'];

  const [imgSize, textSize] = selectedSize.split(' ');

  return (
    <a href="/">
      <div className="flex items-center space-x-2">
        <img src={path} className={`${imgSize} ${imgSize}`} alt="Logo" />
        {!isHiddenText && (
          <h1 className={`font-bold text-green-600 ${textSize}`}>
            <span className="px-2">DeepBIM</span>
          </h1>
        )}
      </div>
    </a>
  );
};
