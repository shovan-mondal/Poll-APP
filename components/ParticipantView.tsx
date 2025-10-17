import React, { useState, useEffect } from 'react';
import { Poll } from '../types';
import { pollService } from '../services/pollService';
import PollScreen from './PollScreen';

interface ParticipantViewProps {
  pollId: string;
  goHome: () => void;
}

const ParticipantView: React.FC<ParticipantViewProps> = ({ pollId, goHome }) => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void;

    const setupPoll = async () => {
      try {
        const initialPoll = await pollService.getPoll(pollId);
        if (!initialPoll) {
          setError(`Poll with ID "${pollId}" was not found.`);
          setLoading(false);
          return;
        }
        setPoll(initialPoll);

        unsubscribe = pollService.subscribe(pollId, (updatedPoll) => {
          if (updatedPoll) {
            setPoll(updatedPoll);
          } else {
            setPoll(null); // Poll was deleted
          }
        });
      } catch (err) {
        console.error("Error setting up poll:", err);
        setError("Could not connect to the poll service.");
      } finally {
        setLoading(false);
      }
    };

    setupPoll();

    return () => {
      unsubscribe?.();
    };
  }, [pollId]);

  const handleVote = (optionId: string) => {
    pollService.addVote(pollId, optionId);
    setVoted(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
        <p className="mt-4 text-lg">Joining poll...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl text-red-500 mb-4">Error</h2>
        <p className="mb-6">{error}</p>
        <button onClick={goHome} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg">Go Home</button>
      </div>
    );
  }
  
  if (!poll) {
     return (
       <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl text-yellow-500 mb-4">Poll not found or has ended</h2>
        <p className="mb-6">The poll may have been reset by the admin.</p>
        <button onClick={goHome} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg">Go Home</button>
      </div>
     );
  }


  return (
    <PollScreen 
      poll={poll} 
      onVote={handleVote} 
      voted={voted}
      goHome={goHome}
    />
  );
};

export default ParticipantView;