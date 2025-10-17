import { Poll, PollOption } from '../types';
import { api } from './api';

type Listener = (poll: Poll | null) => void;

export const pollService = {
  createPoll: async (options: Omit<PollOption, 'id'>[]): Promise<Poll> => {
    return await api.createPoll(options);
  },

  addVote: async (pollId: string, optionId: string): Promise<void> => {
    await api.addVote(pollId, optionId);
  },

  endPoll: async (pollId: string): Promise<void> => {
    await api.endPoll(pollId);
  },

  getPoll: async (id: string): Promise<Poll | null> => {
    return await api.getPoll(id.toUpperCase());
  },

  resetPoll: async (pollId: string): Promise<void> => {
    await api.resetPoll(pollId);
  },

  subscribe: (pollId: string, listener: Listener): (() => void) => {
    return api.subscribeToChanges(pollId, listener);
  },
};
