import React, { useRef, useState } from "react";
import GeometrySceneViewCube from "./geometry-scene-viewcube";
import HeaderViewer from "../layout/header-viewer";

const MainView: React.FC = () => {


  return (
    <div>
      <div className="relative">
        <GeometrySceneViewCube />
        <div className="absolute top-[10px] right-0 left-0">
          <HeaderViewer />
        </div>
      </div>
    </div>

  );
};

export default MainView;
