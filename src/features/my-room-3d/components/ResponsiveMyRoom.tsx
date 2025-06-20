import { useEffect, useState } from "react";
import MyRoom from "./MyRoom";

export default function ResponsiveMyRoom() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint (Tailwind)
    };
    checkScreen();

    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!isLargeScreen) return null;

  return (
    <div className='w-full h-hull'>
      <MyRoom showFakeLights={true} />
    </div>
  );
}
