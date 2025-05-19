import { Button } from '@/components/ui/button';
import React from 'react';

// Nút chọn ngôn ngữ riêng biệt
interface LanguageButtonProps {
  language: string;
  onClick: () => void;
  className?: string;
}
const LanguageButton: React.FC<LanguageButtonProps> = ({ language, onClick, className }) => (
  <Button
    variant='ghost' size='icon'
    onClick={onClick}
    className={`scale-95 rounded-full text-sm transition icon-text-color ${className}`}
  >
    {language.toUpperCase()}
  </Button>
);

export default  LanguageButton;
