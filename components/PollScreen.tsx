import React from 'react';
import { Poll } from '../types';

interface PollScreenProps {
  poll: Poll;
  onVote: (optionId: string) => void;
  voted: boolean;
  goHome: () => void;
}

const PollScreen: React.FC<PollScreenProps> = ({ poll, onVote, voted, goHome }) => {

  const handleVote = (optionId: string) => {
    if (voted || poll.status === 'ENDED') return;
    onVote(optionId);
  };

  if (poll.status === 'ENDED') {
    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center h-screen text-center animate-reveal">
            <h2 className="text-2xl font-bold text-gray-300 mb-4">The poll has ended!</h2>
            <p className="text-xl text-gray-400 mb-6">The correct answer was:</p>
            <div className="bg-green-500 text-white font-bold rounded-lg p-6 shadow-lg transform transition hover:scale-110">
                <h3 className="text-5xl">Shovan Mondal</h3>
                <p className="mt-2 text-sm">(Did you find the secret?)</p>
            </div>
             <button onClick={goHome} className="mt-12 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
                Back to Home
            </button>
        </div>
    );
  }

  if (voted) {
    return (
         <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center h-screen text-center">
            <h2 className="text-4xl font-bold text-cyan-400 mb-4 animate-reveal">Thank you for voting!</h2>
            <p className="text-lg text-gray-300">Please wait for the admin to end the poll.</p>
            <div className="mt-8 animate-pulse-strong">
                <svg className="w-16 h-16 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
        </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center min-h-screen p-4">
      <div className="w-full text-center my-6">
        <h1 className="text-3xl font-bold text-cyan-400">Cast Your Vote</h1>
        <p 
          className="text-xs text-gray-500 mt-2 select-none cursor-pointer"
          onClick={() => handleVote('none')}
        >
          Shovan Mondal created a poll.
        </p>
      </div>

      <div className="w-full space-y-4">
        {poll.options.map(option => (
          <div
            key={option.id}
            onClick={() => handleVote(option.id)}
            className="bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-cyan-500 active:scale-95 transition-transform duration-150 cursor-pointer"
          >
            <img src={option.image} alt={option.caption} className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="text-center text-lg font-semibold text-white">{option.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollScreen;
