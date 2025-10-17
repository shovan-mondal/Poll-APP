// Simple API client for polling service
// Using relative path - Vite proxy will forward /api/* to backend
const API_URL = '/api';

export const api = {
  async createPoll(options: any) {
    const response = await fetch(`${API_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ options }),
    });
    if (!response.ok) throw new Error('Failed to create poll');
    return response.json();
  },

  async getPoll(pollId: string) {
    const response = await fetch(`${API_URL}/polls/${pollId}`);
    if (!response.ok) return null;
    return response.json();
  },

  async addVote(pollId: string, optionId: string) {
    const response = await fetch(`${API_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId }),
    });
    if (!response.ok) throw new Error('Failed to add vote');
    return response.json();
  },

  async endPoll(pollId: string) {
    const response = await fetch(`${API_URL}/polls/${pollId}/end`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to end poll');
    return response.json();
  },

  async resetPoll(pollId: string) {
    const response = await fetch(`${API_URL}/polls/${pollId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to reset poll');
    return response.json();
  },

  // Simple polling mechanism for real-time updates (replace with WebSocket for production)
  subscribeToChanges(pollId: string, callback: (poll: any) => void) {
    const interval = setInterval(async () => {
      try {
        const poll = await this.getPoll(pollId);
        callback(poll);
      } catch (error) {
        console.error('Error fetching poll updates:', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  },
};
