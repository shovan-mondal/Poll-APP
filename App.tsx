
import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen';
import AdminView from './components/AdminView';
import ParticipantView from './components/ParticipantView';

type View = 'landing' | 'admin' | 'participant';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [pollId, setPollId] = useState<string | null>(null);

  const handleCreatePoll = () => {
    setView('admin');
  };

  const handleJoinPoll = (id: string) => {
    setPollId(id);
    setView('participant');
  };

  const goHome = () => {
    setView('landing');
    setPollId(null);
  };

  const renderView = () => {
    switch (view) {
      case 'admin':
        return <AdminView goHome={goHome} />;
      case 'participant':
        return <ParticipantView pollId={pollId!} goHome={goHome} />;
      case 'landing':
      default:
        return <LandingScreen onCreate={handleCreatePoll} onJoin={handleJoinPoll} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 font-sans">
      {renderView()}
    </div>
  );
};

export default App;
