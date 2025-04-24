import { Leva } from "leva"
import ExperienceCanvas from "./ExperienceCanvas"
import { useEffect, useMemo, useState } from "react"
import { PiGameControllerFill } from "react-icons/pi";

interface MyRoomProps {
  showFakeLights: boolean
}

const MyRoom: React.FC<MyRoomProps> = ({ showFakeLights = true }) => {
  const [showLeva, setShowLeva] = useState(false)
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })

  // 👁️ Cập nhật kích thước màn hình khi resize
  useEffect(() => {
    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // 🎯 Vị trí Leva panel
  const levaPosition = useMemo(() => ({
    x: -screenSize.width + 340,
    y: screenSize.height - 760,
  
  }), [screenSize])

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 w-screen h-screen">
      <button
        onClick={() => setShowLeva(prev => !prev)}
        className="fixed top-24 left-8 z-50  px-3 py-2 rounded shadow"
        title="Model Controls"
      >
        <PiGameControllerFill /> 
      </button>

      {/* ✅ Leva chỉ hiện khi showLeva = true */}
      {showLeva && (
        <Leva
          collapsed={true}
          flat={true}
          hideCopyButton
          titleBar={{
            drag: true,
            position: levaPosition,
            filter: true,
            title: "🎛️ Model Controls",
          }}
        />
      )}

      <ExperienceCanvas showFakeLights={showLeva} />
    </div>
  )
}

export default MyRoom
