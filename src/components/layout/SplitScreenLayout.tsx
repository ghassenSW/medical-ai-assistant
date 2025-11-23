import React from 'react';

interface SplitScreenLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({
  leftPanel,
  rightPanel,
}) => {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Panel - Chat */}
      <div className="w-2/5 border-r border-gray-200 flex flex-col">
        {leftPanel}
      </div>
      {/* Right Panel - Map */}
      <div className="w-3/5 relative">
        {rightPanel}
      </div>
    </div>
  );
};
