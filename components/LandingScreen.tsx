import React, { useState } from 'react';
import { pollService } from '../services/pollService';

interface LandingScreenProps {
  onCreate: () => void;
  onJoin: (id: string) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onCreate, onJoin }) => {
  const [pollIdInput, setPollIdInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    if (!pollIdInput.trim()) {
      setError('Please enter a Poll ID.');
      return;
    }
    setIsLoading(true);
    setError('');
    const pollId = pollIdInput.trim().toUpperCase();
    const existingPoll = await pollService.getPoll(pollId);
    
    if (existingPoll) {
      onJoin(existingPoll.id);
    } else {
      setError('Poll not found. Please check the ID.');
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold mb-4 text-cyan-400">Live Poll Fun</h1>
      <p className="text-lg text-gray-300 mb-12">Create or join a poll in seconds.</p>
      
      <div className="w-full space-y-4">
        <button 
          onClick={onCreate}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105"
        >
          Create a Poll
        </button>
        
        <div className="relative flex items-center justify-center text-gray-400">
          <span className="flex-shrink px-4">OR</span>
        </div>

        <div className="space-y-2">
           <input 
            type="text"
            value={pollIdInput}
            onChange={(e) => {
              setPollIdInput(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter Poll ID to Join"
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-center text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
           <button 
            onClick={handleJoin}
            disabled={isLoading}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 disabled:bg-gray-800 disabled:cursor-not-allowed"
           >
            {isLoading ? 'Joining...' : 'Join Poll'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
