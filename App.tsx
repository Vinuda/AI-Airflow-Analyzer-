import React, { useState, useCallback } from 'react';
import { WindowData, AirflowAnalysis, Point } from './types';
import Room from './components/Room';
import Controls from './components/Controls';
import AnalysisPanel from './components/AnalysisPanel';
import { analyzeAirflow } from './services/geminiService';

const DEFAULT_ROOM_POINTS: Point[] = [
  { x: 10, y: 10 },
  { x: 90, y: 10 },
  { x: 90, y: 90 },
  { x: 10, y: 90 },
];

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [analysis, setAnalysis] = useState<AirflowAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [roomPoints, setRoomPoints] = useState<Point[]>(DEFAULT_ROOM_POINTS);
  const [isEditingRoom, setIsEditingRoom] = useState<boolean>(false);

  const addWindow = useCallback((wallIndex: number, position: number) => {
    const newWindow: WindowData = {
      id: Date.now(),
      wallIndex,
      position,
      isOpen: false,
    };
    setWindows(prev => [...prev, newWindow]);
  }, []);

  const toggleWindowState = useCallback((id: number) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isOpen: !w.isOpen } : w))
    );
  }, []);

  const removeWindow = useCallback((id: number) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);
  
  const resetRoom = useCallback(() => {
    setIsEditingRoom(false);
    setRoomPoints(DEFAULT_ROOM_POINTS);
    setWindows([]);
    setAnalysis(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (isEditingRoom) setIsEditingRoom(false);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeAirflow(windows, roomPoints);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setError('Failed to analyze airflow. Please check the console for more details.');
    } finally {
      setIsLoading(false);
    }
  }, [windows, roomPoints, isEditingRoom]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-300 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 sm:w-12 sm:h-12 inline-block -mt-2 mr-2">
                <path d="M12 2.5c-5.25 0-9.5 4.25-9.5 9.5s4.25 9.5 9.5 9.5a1 1 0 000-2c-4.14 0-7.5-3.36-7.5-7.5S7.86 4.5 12 4.5a1 1 0 000-2z"></path>
                <path d="M21.5 12a1 1 0 00-1-1h-16a1 1 0 000 2h16a1 1 0 001-1zM6.5 7a1 1 0 00-1-1h-3a1 1 0 100 2h3a1 1 0 001-1zM10.5 17a1 1 0 00-1-1h-7a1 1 0 100 2h7a1 1 0 001-1z"></path>
            </svg>
             Airflow Optimizer
          </h1>
          <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
            Design your room's shape, place windows, and let our AI analyze the best configuration for optimal airflow.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Controls
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              isEditing={isEditingRoom}
              onToggleEditing={() => setIsEditingRoom(prev => !prev)}
              onReset={resetRoom}
            />
            <Room
              windows={windows}
              onToggleWindow={toggleWindowState}
              onRemoveWindow={removeWindow}
              analysis={analysis}
              roomPoints={roomPoints}
              setRoomPoints={setRoomPoints}
              isEditing={isEditingRoom}
              onAddWindow={addWindow}
            />
          </div>
          <div className="lg:col-span-1">
            <AnalysisPanel analysis={analysis} isLoading={isLoading} error={error} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;