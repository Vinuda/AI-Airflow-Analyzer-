import React from 'react';

interface FlowPathProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  strength: 'low' | 'medium' | 'high';
}

interface StrengthStyle {
  stroke: string;
  strokeWidth: number;
  particleColor: string;
  duration: string;
}

const FlowPath: React.FC<FlowPathProps> = ({ from, to, strength }) => {
  const strengthStyles: Record<'low' | 'medium' | 'high', StrengthStyle> = {
    low: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 1, particleColor: 'rgba(255, 255, 255, 0.4)', duration: '6s' },
    medium: { stroke: 'rgba(255, 255, 255, 0.4)', strokeWidth: 1.5, particleColor: 'rgba(255, 255, 255, 0.7)', duration: '4s' },
    high: { stroke: 'rgba(255, 255, 255, 0.6)', strokeWidth: 2, particleColor: 'rgba(255, 255, 255, 1)', duration: '2.5s' },
  };

  const style = strengthStyles[strength] || strengthStyles.medium;
  const pathId = `path-${from.x}-${from.y}-${to.x}-${to.y}-${Math.random()}`;
  const pathData = `M${from.x},${from.y} L${to.x},${to.y}`;

  return (
    <g>
      <path
        d={pathData}
        id={pathId}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth / 10} // scale for viewBox
        fill="none"
        strokeLinecap="round"
      />
      <circle r="0.8" fill={style.particleColor}>
        <animateMotion
          dur={style.duration}
          repeatCount="indefinite"
          rotate="auto"
        >
          <mpath xlinkHref={`#${pathId}`} />
        </animateMotion>
      </circle>
    </g>
  );
};

export default FlowPath;