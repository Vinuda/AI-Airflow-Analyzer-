export interface WindowData {
  id: number;
  wallIndex: number; // The index of the first vertex of the wall segment.
  position: number;  // A value from 0 to 1 representing the position along the wall segment.
  isOpen: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface FlowPath {
  from: Point;
  to: Point;
  strength: 'low' | 'medium' | 'high';
}

export interface AirflowAnalysis {
  description: string;
  optimizations: string[];
  flowPaths: FlowPath[];
}