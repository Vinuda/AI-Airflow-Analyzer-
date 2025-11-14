import React from 'react';
import { Point } from '../types';

interface WindowIconProps {
  position: Point;
  isOpen: boolean;
  onClick: (e: React.MouseEvent) => void;
  onRemove: (e: React.MouseEvent) => void;
}

const WindowIcon: React.FC<WindowIconProps> = ({ position, isOpen, onClick, onRemove }) => {
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRemove(e);
  };

  const size = 4; // Size in SVG coordinate space
  const paneSize = (size / 2) - 0.2;

  return (
    <g
      transform={`translate(${position.x}, ${position.y})`}
      onClick={onClick}
      onContextMenu={handleRightClick}
      className="cursor-pointer group"
    >
        <title>Left-click to open/close, Right-click to remove</title>
        
        {/* Glow effect for open window */}
        {isOpen && (
            <rect
                x={-size / 2} y={-size / 2} width={size} height={size}
                rx="0.5"
                className="fill-white/30"
                style={{ filter: `blur(1.5px)` }}
            />
        )}

        {/* Main frame */}
        <rect
            x={-size / 2} y={-size / 2} width={size} height={size}
            rx="0.5"
            className={`transition-colors duration-300 stroke-black group-hover:stroke-white ${isOpen ? 'fill-white' : 'fill-gray-700'}`}
            strokeWidth="0.3"
        />

        {/* Panes */}
        <rect x={-size / 2 + 0.2} y={-size / 2 + 0.2} width={paneSize} height={paneSize} rx="0.2" className={`transition-opacity duration-300 ${isOpen ? 'fill-slate-300/30' : 'fill-gray-600/50'}`} />
        <rect x={0.2} y={-size / 2 + 0.2} width={paneSize} height={paneSize} rx="0.2" className={`transition-opacity duration-300 ${isOpen ? 'fill-slate-300/30' : 'fill-gray-600/50'}`} />
        <rect x={-size / 2 + 0.2} y={0.2} width={paneSize} height={paneSize} rx="0.2" className={`transition-opacity duration-300 ${isOpen ? 'fill-slate-300/30' : 'fill-gray-600/50'}`} />
        <rect x={0.2} y={0.2} width={paneSize} height={paneSize} rx="0.2" className={`transition-opacity duration-300 ${isOpen ? 'fill-slate-300/30' : 'fill-gray-600/50'}`} />
    </g>
  );
};

export default WindowIcon;