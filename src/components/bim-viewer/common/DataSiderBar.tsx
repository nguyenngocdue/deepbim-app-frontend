// DataSiderBar.tsx
import React, { ReactNode } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { Panel } from 'react-resizable-panels';

interface DataSiderBarProps {
  isCollapsed: boolean;
  onCollapse: () => void;
  isModelReady: boolean;
  children: ReactNode;
}

const DataSiderBar: React.FC<DataSiderBarProps> = ({
  isCollapsed,
  onCollapse,
  isModelReady,
  children,
}) => {
  return (
    <Panel
      defaultSize={20}
      minSize={10}
      maxSize={40}
      collapsed={isCollapsed.toString()}
      collapsible
      hidden={isCollapsed}
    >
      <div
        className={`
          h-full overflow-auto bg-zinc-900 border-r border-zinc-800 relative
          ${isCollapsed ? 'hidden' : 'block'}
        `}
      >
        <button
          onClick={onCollapse}
          className="absolute top-2 left-2 z-50 p-1 bg-zinc-700 hover:bg-zinc-600 rounded"
          title="Collapse right"
        >
          <FiChevronLeft className="text-white" />
        </button>

        {isModelReady && children}
      </div>
    </Panel>
  );
};

export default DataSiderBar;
