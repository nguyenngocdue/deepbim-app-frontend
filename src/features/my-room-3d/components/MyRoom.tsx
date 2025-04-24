import { Leva, useControls } from "leva"
import ExperienceCanvas from "./ExperienceCanvas"

interface MyRoomProps {
  showFakeLights: boolean;
}

const MyRoom: React.FC<MyRoomProps> = ({showFakeLights = true}) => {
  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Leva collapsed={false} />
        <ExperienceCanvas showFakeLights={showFakeLights} />
      </div>
    </>
  )
}

export default MyRoom