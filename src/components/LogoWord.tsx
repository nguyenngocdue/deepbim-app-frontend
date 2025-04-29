import { Link } from "@tanstack/react-router";

interface LogoWordProps {
  isHiddenText?: boolean;
  path?: string;
  size?: 'sm' | 'md' | 'lg' | 'lg-wrap'; // thêm lg-wrap
}

export const LogoWord = ({ isHiddenText = false, path = "/images/logo.png", size = 'md' }: LogoWordProps) => {
  const sizeClasses = {
    sm: { img: 'h-8', text: 'text-lg', textClass: 'text-green-600 font-heading', layout: 'inline-flex items-center gap-x-1' },
    md: { img: 'h-12', text: 'text-xl', textClass: 'text-green-600 font-heading', layout: 'inline-flex items-center gap-x-1' },
    lg: { img: 'h-24', text: 'text-3xl', textClass: 'text-emerald-500 font-heading tracking-wide ml-[-18px]', layout: 'inline-flex items-center gap-x-1' },
    'lg-wrap': { img: 'h-24', text: 'text-3xl', textClass: 'text-emerald-500 font-heading tracking-wide', layout: 'flex flex-col items-center' },
  };

  const selectedSize = sizeClasses[size] || sizeClasses['md'];

  return (
    <Link to="/app" className={selectedSize.layout}>
      {/* Logo */}
      <img
        src={path}
        className={`${selectedSize.img} w-auto object-contain`}
        alt="Logo"
      />

      {/* Text */}
      {!isHiddenText && (
        <h1 className={`${selectedSize.text} ${selectedSize.textClass}`}>
          DeepBIM
        </h1>
      )}
    </Link>
  );
};
