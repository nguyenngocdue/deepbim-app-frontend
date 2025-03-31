import { SunIcon } from "lucide-react";
import LogoSection from "@/components/layout/LogoSection";

interface HeaderProps {
  onToggleTheme: () => void;
  className?: string;
}

export const Header = ({ onToggleTheme, className }: HeaderProps) => {
  return (
    <header
      className={`fixed w-[calc(100%-1.5rem)] flex h-16 items-center gap-4 z-50 backdrop-blur-md rounded-[21px] m-3 p-3 shadow-md transition-colors ${className}`}
    >
      {/* Logo */}
      <nav className="flex gap-6">
        <LogoSection />
      </nav>

      {/* Right-side elements */}
      <div className="flex grow items-end justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* Get in touch button */}
        <button
          className="items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground hover:bg-primary/90 px-4 py-2 bg-primary text-md h-10 hidden sm:block"
        >
          <a href="https://creoox.com/contact/" target="_blank">
            <span>Get in touch</span>
          </a>
        </button>

        {/* Theme toggle button */}
        <button
          onClick={onToggleTheme}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 hover:transition duration-300 ease-in-out bg-transparent text-toolbar-icon hover:bg-secondary hover:text-secondary-foreground"
        >
          <SunIcon className="size-6" />
        </button>
      </div>
    </header>
  );
};