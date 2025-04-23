import { Leva } from "leva"
import ExperienceCanvas from "./ExperienceCanvas"



const MyRoom = () => {
  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Leva collapsed={false} />
        <ExperienceCanvas />
      </div>

    </>
  )
}

export default MyRoom
