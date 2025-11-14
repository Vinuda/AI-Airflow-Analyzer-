import React, { useState, useRef, useMemo } from 'react';
import { WindowData, AirflowAnalysis, Point } from '../types';
import WindowIcon from './WindowIcon';
import FlowPath from './FlowPath';

interface RoomProps {
  windows: WindowData[];
  onToggleWindow: (id: number) => void;
  onRemoveWindow: (id: number) => void;
  analysis: AirflowAnalysis | null;
  roomPoints: Point[];
  setRoomPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  isEditing: boolean;
  onAddWindow: (wallIndex: number, position: number) => void;
}

// Geometry helper functions
const getSVGCoordinates = (e: React.MouseEvent<SVGSVGElement>, svg: SVGSVGElement): Point => {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const screenCTM = svg.getScreenCTM();
  if (screenCTM) {
    return pt.matrixTransform(screenCTM.inverse());
  }
  return { x: 0, y: 0 };
};

// FIX: Return a consistent object shape to resolve type errors.
// The function was returning a number in one branch and an object in another,
// causing a type conflict where the function was called.
const distanceToSegment = (p: Point, v: Point, w: Point) => {
    const l2 = (v.x - w.x)**2 + (v.y - w.y)**2;
    if (l2 === 0) {
      return {
          distance: Math.sqrt((p.x - v.x)**2 + (p.y - v.y)**2),
          position: 0,
      };
    }
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projection = { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
    return {
        distance: Math.sqrt((p.x - projection.x)**2 + (p.y - projection.y)**2),
        position: t,
    };
};

const Room: React.FC<RoomProps> = ({ windows, onToggleWindow, onRemoveWindow, analysis, roomPoints, setRoomPoints, isEditing, onAddWindow }) => {
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseDownOnPoint = (e: React.MouseEvent, index: number) => {
    if (!isEditing) return;
    e.stopPropagation();
    setDraggedPointIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggedPointIndex === null || !isEditing || !svgRef.current) return;
    const coords = getSVGCoordinates(e, svgRef.current);
    
    const clampedX = Math.max(0, Math.min(100, coords.x));
    const clampedY = Math.max(0, Math.min(100, coords.y));
    
    const newPoints = [...roomPoints];
    newPoints[draggedPointIndex] = { x: clampedX, y: clampedY };
    setRoomPoints(newPoints);
  };
  
  const handleMouseUp = () => setDraggedPointIndex(null);

  const handleSVGClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isEditing || !svgRef.current) return;
    const clickPoint = getSVGCoordinates(e, svgRef.current);
    
    let closestWall = { index: -1, distance: Infinity, position: 0 };

    roomPoints.forEach((p1, i) => {
        const p2 = roomPoints[(i + 1) % roomPoints.length];
        const segmentInfo = distanceToSegment(clickPoint, p1, p2);
        if (segmentInfo.distance < closestWall.distance) {
            closestWall = { index: i, distance: segmentInfo.distance, position: segmentInfo.position };
        }
    });

    if (closestWall.index !== -1 && closestWall.distance < 5) { // Click tolerance
        onAddWindow(closestWall.index, closestWall.position);
    }
  };

  const pointsString = roomPoints.map(p => `${p.x},${p.y}`).join(' ');

  const roomCenter = useMemo(() => {
    if (roomPoints.length === 0) return { x: 50, y: 50 };
    const minX = Math.min(...roomPoints.map(p => p.x));
    const maxX = Math.max(...roomPoints.map(p => p.x));
    const minY = Math.min(...roomPoints.map(p => p.y));
    const maxY = Math.max(...roomPoints.map(p => p.y));
    return {
      x: minX + (maxX - minX) / 2,
      y: minY + (maxY - minY) / 2,
    };
  }, [roomPoints]);


  return (
    <div className="relative aspect-video w-full max-w-4xl mx-auto bg-black rounded-lg shadow-2xl overflow-hidden border border-gray-800">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleSVGClick}
      >
        <polygon points={pointsString} className="fill-[#111] stroke-gray-700" strokeWidth="0.5" />

        {/* Airflow Visualization */}
        {analysis && analysis.flowPaths && (
          <g>
            {analysis.flowPaths.map((path, index) => (
              <FlowPath key={index} from={path.from} to={path.to} strength={path.strength} />
            ))}
          </g>
        )}

        {/* Windows */}
        {windows.map(window => {
          const p1 = roomPoints[window.wallIndex];
          const p2 = roomPoints[(window.wallIndex + 1) % roomPoints.length];
          if (!p1 || !p2) return null;
          const pos = {
            x: p1.x + (p2.x - p1.x) * window.position,
            y: p1.y + (p2.y - p1.y) * window.position
          };
          return (
            <WindowIcon
              key={window.id}
              position={pos}
              isOpen={window.isOpen}
              onClick={(e) => { e.stopPropagation(); onToggleWindow(window.id); }}
              onRemove={(e) => { e.stopPropagation(); onRemoveWindow(window.id); }}
            />
          );
        })}

        {/* Editing Handles */}
        {isEditing && roomPoints.map((p, i) => (
          <circle 
            key={i} 
            cx={p.x} 
            cy={p.y} 
            r="2" 
            className="fill-white stroke-black cursor-move" 
            strokeWidth="0.5"
            onMouseDown={(e) => handleMouseDownOnPoint(e, i)}
          />
        ))}

        {/* Instruction Text */}
        {!isEditing && windows.length === 0 && (
           <g className="pointer-events-none select-none" opacity="0.6">
                <text x={roomCenter.x} y={roomCenter.y} textAnchor="middle" dominantBaseline="middle" className="fill-gray-400 font-semibold" style={{ fontSize: '2.8px' }}>
                    Click on a wall to add a window
                </text>
            </g>
        )}
         {isEditing && (
             <text x="50" y="50" textAnchor="middle" className="fill-gray-500 font-bold text-[5px] select-none pointer-events-none">
                Drag the circles to change the room shape
             </text>
        )}
      </svg>
    </div>
  );
};

export default Room;