import React, { useState, useCallback, useEffect } from 'react';
import { Poll, PollOption } from '../types';
import { pollService } from '../services/pollService';
import ImageUploader from './ImageUploader';

interface AdminViewProps {
  goHome: () => void;
}

type OptionState = { caption: string; image: string | null };

const AdminView: React.FC<AdminViewProps> = ({ goHome }) => {
  const [options, setOptions] = useState<OptionState[]>([
    { caption: '', image: null },
    { caption: '', image: null },
  ]);
  const [pollId, setPollId] = useState<string | null>(null);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    if (!pollId) {
        setCurrentPoll(null); // Clear data if pollId becomes null
        return;
    }

    const handlePollUpdate = (updatedPoll: Poll | null) => {
      if (updatedPoll && updatedPoll.id === pollId) {
        setCurrentPoll(updatedPoll);
      } else if (!updatedPoll) {
        setCurrentPoll(null);
      }
    };
    
    // Handle async getPoll
    pollService.getPoll(pollId).then(poll => {
      setCurrentPoll(poll);
    }).catch(err => {
      console.error('Error fetching poll:', err);
      setCurrentPoll(null);
    });
    
    const unsubscribe = pollService.subscribe(pollId, handlePollUpdate);

    return unsubscribe;
  }, [pollId]);


  const handleOptionChange = useCallback((index: number, newOption: OptionState) => {
    setOptions(prev => {
      const newOptions = [...prev];
      newOptions[index] = newOption;
      return newOptions;
    });
  }, []);

  const handleCreatePoll = async () => {
    setError('');
    const allOptionsValid = options.every(opt => opt.caption.trim() && opt.image);
    if (!allOptionsValid) {
      setError('Both options must have an image and a caption.');
      return;
    }

    const pollOptions: Omit<PollOption, 'id'>[] = options.map(opt => ({
      caption: opt.caption,
      image: opt.image!,
    }));

    try {
      const newPoll = await pollService.createPoll(pollOptions);
      setPollId(newPoll.id);
    } catch (err) {
      console.error('Error creating poll:', err);
      setError('Failed to create poll. Please try again.');
    }
  };

  const handleEndPoll = async () => {
    if (!pollId) return;
    try {
      await pollService.endPoll(pollId);
    } catch (err) {
      console.error('Error ending poll:', err);
    }
  };
  
  const handleNewPoll = async () => {
      if (pollId) {
        try {
          await pollService.resetPoll(pollId);
        } catch (err) {
          console.error('Error resetting poll:', err);
        }
      }
      setPollId(null);
      setOptions([
          { caption: '', image: null },
          { caption: '', image: null },
      ]);
  }

  if (pollId) {
    const totalVotes = currentPoll ? (Object.values(currentPoll.votes) as number[]).reduce((sum, count) => sum + count, 0) : 0;
    
    return (
      <div className="w-full max-w-md mx-auto flex flex-col h-screen p-4">
        <div className="w-full text-center py-4">
           <h2 className="text-3xl font-bold text-cyan-400 mb-2">
            {currentPoll?.status === 'ENDED' ? 'Final Results' : 'Poll is Live!'}
           </h2>
          <p className="text-gray-300 mb-2">Share this ID with participants:</p>
          <div className="bg-gray-800 border-2 border-dashed border-cyan-500 rounded-lg p-2 inline-block mb-4">
            <p className="text-2xl font-mono tracking-widest text-white">{pollId}</p>
          </div>
          <p className="text-xl font-bold">Total Votes: {totalVotes}</p>
        </div>

        <div className="w-full flex-grow overflow-y-auto space-y-3 pb-24">
            {currentPoll?.options.map(option => {
                const votes = currentPoll.votes[option.id] || 0;
                const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100) : 0;
                return (
                    <div key={option.id} className="bg-gray-800 rounded-lg p-3 border-2 border-gray-700">
                        <div className="flex items-center space-x-4">
                            <img src={option.image} alt={option.caption} className="w-16 h-16 object-cover rounded-md"/>
                            <div className="flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-white">{option.caption}</p>
                                    <p className="font-bold text-cyan-400">{votes} votes</p>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" style={{width: `${percentage}%`}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {(() => {
                const votes = currentPoll?.votes['none'] || 0;
                const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100) : 0;
                const isWinner = currentPoll?.status === 'ENDED';
                return (
                    <div className={`bg-gray-800 rounded-lg p-3 border-2 transition-all ${isWinner ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-700'}`}>
                         <div className="flex items-center space-x-4">
                             <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
                                <p className="text-2xl font-bold text-gray-400">?</p>
                             </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <p className={`font-semibold ${isWinner ? 'text-green-400' : 'text-white'}`}>Shovan Mondal</p>
                                    <p className={`font-bold ${isWinner ? 'text-green-400' : 'text-cyan-400'}`}>{votes} votes</p>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className={`${isWinner ? 'bg-green-500' : 'bg-cyan-500'} h-2.5 rounded-full transition-all duration-500`} style={{width: `${percentage}%`}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 w-full max-w-md mx-auto">
            {currentPoll?.status === 'ACTIVE' && (
                 <button
                    onClick={handleEndPoll}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-lg mb-2 transition-transform transform hover:scale-105"
                 >
                    End Poll & Reveal Answer
                 </button>
            )}
            <button
                onClick={handleNewPoll}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
                Create New Poll
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center p-4">
       <button onClick={goHome} className="absolute top-4 left-4 text-cyan-400 hover:text-cyan-300">&larr; Home</button>
      <h2 className="text-3xl font-bold text-cyan-400 my-6">Create a New Poll</h2>
      <div className="w-full space-y-6">
        {options.map((opt, index) => (
          <ImageUploader
            key={index}
            index={index}
            option={opt}
            onChange={handleOptionChange}
          />
        ))}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <button
        onClick={handleCreatePoll}
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg text-lg mt-8 transition-transform transform hover:scale-105"
      >
        Start Poll
      </button>
    </div>
  );
};

export default AdminView;
